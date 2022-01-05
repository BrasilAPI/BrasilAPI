import legalNatureList from './legalNatureList.json';

const fetchLegalNatureList = () => {
  return legalNatureList;
};

export const getLegalNatureList = () => {
  const response = fetchLegalNatureList();
  return response;
};
