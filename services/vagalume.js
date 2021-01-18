import axios from 'axios';

const artistNotFound = {
  message: 'Artista não encontrado',
  type: 'ARTIST_NOT_FOUND',
};

const musicNotFound = {
  message: 'Música não encontrada',
  type: 'MUSIC_NOT_FOUND',
};

export async function getArtistData(name) {
  // endpoint utilizado para buscar por artistas na API do vagalume
  const url = `https://www.vagalume.com.br/${name}/index.js`;

  try {
    // Tentamos pegar informações sobre o artista na APÌ e se conseguirmos,
    // filtramos e retornamos.
    const rawArtistData = (await axios.get(url)).data.artist;
    return filterArtistData(rawArtistData);
  } catch (err) {
    const { response } = err;
    // Se o artista não foi encontrado, retornamos esse JSON de erro
    switch (response.status) {
      case 404:
        return artistNotFound;
    }
  }
}

// Função principal de filtragem dos dados da API vagalume.
function filterArtistData(artistData) {
  return {
    name: artistData.desc,
    image: `https://www.vagalume.com.br${artistData.pic_medium}`,
    genre: artistData.genre.map((g) => g.name),
    // Filter usado pois alguns artistas relacionados são retornados com o seu name
    // `null` pela API.
    related: artistData.related.map(createRelatedArtist).filter((r) => r.name),
    topMusics: artistData.toplyrics.item.map(createArtistMusic),
    musics: artistData.lyrics.item.map(createArtistMusic),
    // Selecionando e retornando todos os álbuns disponíveis como um objeto.
    albums: artistData.albums.item.map(createAlbum),
  };
}

// Funções helper para a filtragem
function createArtistMusic(musicObject) {
  return {
    name: musicObject.desc,
    apiUrl: `/music/artist/v1${musicObject.url.match(/(.*).html/)[1]}`,
  };
}

function createAlbum(albumObject) {
  return {
    name: albumObject.desc,
    year: albumObject.year,
  };
}

function createRelatedArtist(relatedArtistObject) {
  return {
    name: relatedArtistObject.name,
    apiUrl: `/music/artist/v1${relatedArtistObject.url.match(/(.*)\//)[1]}`,
  };
}

export async function getMusicData(artist, music) {
  // Endpoint de search da API, onde passamos os parâmetros via query params.
  const url = 'https://api.vagalume.com.br/search.php';
  const { data } = await axios.get(url, {
    params: {
      art: artist,
      mus: music,
    },
  });

  // Precisamos colocar o 404 na rota, pois a API retorna 200 mesmo
  // Se os dados não foram encontrados.
  if (data.type === 'song_notfound') return musicNotFound;
  if (data.type === 'notfound') return artistNotFound;

  return filterMusicData(data, data.mus[0]);
}

// Helper para mapear o código dos idiomas da API.
const languages = {
  1: 'Português Brasileiro',
  2: 'Inglês',
  3: 'Espanhol',
  4: 'Francês',
  5: 'Alemão',
  6: 'Italiano',
  7: 'Holândes',
  8: 'Japonês',
  9: 'Português Portugal',
  999999: 'Outro',
};

function filterMusicData(musicData, musicObject) {
  const { name, lang, text, translate = [] } = musicObject;

  return {
    name: name,
    lang: languages[lang],
    lyrics: text,
    translations: translate.map(createTranslation),
    badwords: musicData.badwords,
  };
}

function createTranslation(translationObject) {
  return {
    lang: languages[translationObject.lang],
    lyrics: translationObject.text,
  };
}
