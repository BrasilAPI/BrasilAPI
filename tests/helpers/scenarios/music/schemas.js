// Módulo com os schemas que devem ser retornados pela API para teste

const artistSchema = [
  'name',
  'image',
  'genre',
  'related',
  'topMusics',
  'musics',
  'albums',
];

const musicSchema = ['name', 'lang', 'lyrics', 'translations', 'badwords'];

module.exports = {
  musicSchema: musicSchema,
  artistSchema: artistSchema,
};
