const { VERCEL_URL } = process.env;

export const logger = (obj) => console.log(JSON.stringify(obj));
export const baseURL = VERCEL_URL
  ? `https://${VERCEL_URL}`
  : 'http://localhost:3000';
