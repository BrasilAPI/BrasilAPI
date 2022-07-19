import cnaeCodeList from './cnaeCodeList.json';

const fetchCnaeCodeList = () => {
  return cnaeCodeList;
};

export const getCnaeCodeList = () => {
  const response = fetchCnaeCodeList();
  return response;
};
