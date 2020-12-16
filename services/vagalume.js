import axios from 'axios';

export const getArtistData = async (name) => {
  // endpoint utilizado para buscar por artistas na API do vagalume
  const url = `https://www.vagalume.com.br/${name}/index.js`;

  try {
    // Tentamos pegar informações sobre o artista na APÌ e se conseguirmos,
    // filtramos e retornamos.
    const rawArtistData = (await axios.get(url)).data.artist;
    return filterArtistData(rawArtistData);
  } catch (err) {
    // Se o artista não foi encontrado, retornamos esse JSON de erro
    switch (err.response.status) {
      case 404:
        return {
          message: 'Artista não encontrado',
          type: 'ARTIST_NOT_FOUND',
        };
    }
  }
};

// A API do vagalume nos retorna muita coisa como IDs/urls para páginas internas,
// aqui filtramos isso e retornamos todas informações úteis para nós.
function filterArtistData(artistData) {
  return {
    nome: artistData.desc,
    imagem: 'https://www.vagalume.com.br' + artistData.pic_medium,
    generoMusical: artistData.genre.map((g) => g.name),
    // Filter usado pois alguns artistas relacionados são retornados com o seu name
    // `null` pela API.
    relacionado: artistData.related
      .map((related) => related.name)
      .filter(Boolean),
    topMusicas: artistData.toplyrics.item.map((music) => music.desc),
    musicas: artistData.lyrics.item.map((music) => music.desc),
    // Selecionando e retornando todos os álbuns disponíveis como um objeto
    albuns: artistData.albums.item.map(createAlbum),
  };
}

function createAlbum(albumObject) {
  return {
    nome: albumObject.desc,
    ano: albumObject.year,
  };
}
