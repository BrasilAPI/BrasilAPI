import axios from 'axios';

export const getSolarIncidence = async (location) => {
  try {
    const response = await axios.get(`https://api.exemplo.com/solar?location=${location}`);
    return response.data;
  } catch (error) {
    return { error: 'Could not fetch data' };
  }
};
