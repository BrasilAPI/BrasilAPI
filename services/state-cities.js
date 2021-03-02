import wiki from 'wikijs';



export const getStateCities = async (state, uf) => {

  if(state === '' || uf === '') {
    throw new Error('InsuficientDataException');
  }

  const formatName = (name) => {
    return name.replace(`BR-${uf}-`, '').replace(/\W-/g, '');
  }

  const formatIbgeCode = (code) => {
    return code.replace(/\W/g, '').replace('formatnum', '');
  }
  
  let apiUrl = 'https://pt.wikipedia.org/w/api.php';
  let pageName = await wiki(apiUrl).search('Lista de municípios ' + state);

  pageName = pageName.results[0];
  
  let stateInfo = await wiki({
    apiUrl: 'https://pt.wikipedia.org/w/api.php'
  }).page(pageName);
  
  stateInfo.cities = await stateInfo.tables();
  
  let cities = [];

  stateInfo.cities[0].forEach(city => {
    let arrKeys = Object.keys(city);
    if(typeof city[arrKeys[1]] !== 'undefined') {
      cities.push({
        nome: formatName(city[arrKeys[1]]),
        codigo_ibge: formatIbgeCode(city[arrKeys[2]]),
      });
    }
  })


  return cities;

}