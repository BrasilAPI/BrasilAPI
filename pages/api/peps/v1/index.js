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

  //  Filter the data based on the keys found
  jsonData.filter((item) => {
    return keys.forEach((key) => {
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
          //  Remove duplicated data
          if (result.includes(item)) return false;
          // Add the data to the result
          return result.push(item);
        }
        return false;
      });
    });
  });

  response.status(200);
  return response.json({
    data: result,
    'Data de atualização dos dados': 'Julho de 2023',
  });
};

export default app().get(action);
