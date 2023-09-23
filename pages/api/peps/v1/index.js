import app from '@/app';
import jsonData from '@/services/peps/202307_PEP.json';

const action = (request, response) => {
  const keys = [];
  const result = [];

  //  Find keys that match the search params to filter the data
  Object.keys(jsonData[0]).filter((key) => {
    const searchParams = Object.keys(request.query);
    return searchParams.forEach((param) => {
      if (key.toLowerCase() === param.toLowerCase()) {
        return keys.push(key);
      }
      return false;
    });
  });

  if (keys.length === 0) {
    return response.status(400).json({
      message: 'Nenhuma chave de pesquisa digitada',
      type: 'key_not_found',
      name: 'KEY_NOT_FOUND',
    });
  }

  //  Filter the data based on the keys found
  jsonData.filter((item) => {
    //  The data has to match all the search params
    const matches = [];

    keys.forEach((key) => {
      // Find the search params in the data
      const searchParams = Object.keys(request.query);
      searchParams.forEach((param) => {
        if (
          // Remove special characters and spaces to compare the data
          item[key]
            .toLowerCase()
            .replaceAll('*', '')
            .replaceAll('.', '')
            .replaceAll('-', '')
            .replaceAll('/', '')
            .trim()
            .includes(
              request.query[param]
                .toLowerCase()
                .replaceAll('*', '')
                .replaceAll('.', '')
                .replaceAll('-', '')
                .replaceAll('/', '')
                .trim()
            )
        ) {
          matches.push(key);
        }
      });
    });

    // Check if all the keys are present in the data
    if (keys.every((key) => matches.includes(key))) {
      //  Remove duplicated data
      if (result.includes(item)) return false;
      // Add the data to the result
      return result.push(item);
    }
    return false;
  });

  if (result.length === 0) {
    return response.status(404).json({
      message: 'Nenhum resultado encontrado',
      type: 'not_found',
      name: 'PEP_NOT_EXISTS',
    });
  }

  response.status(200);
  return response.json({
    data: result,
    updated_at: '1688180400',
  });
};

export default app().get(action);
