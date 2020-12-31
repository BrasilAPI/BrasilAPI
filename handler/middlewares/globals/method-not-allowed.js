// eslint-disable-next-line no-unused-vars
export default function methodNotAllowed(request, response, next) {
  return response.status(405).send('Method Not Allowed');
}
