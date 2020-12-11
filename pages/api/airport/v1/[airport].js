import airports from 'aeroportos-promise'
import microCors from 'micro-cors'

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate'
const cors = microCors()

// retorna aeroporto por código IATA
// exemplo da rota: /api/airport/v1/cwb

async function AirportByIata(request, response) {
  const requestedAirport = request.query.airport

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE)

  try {
    const airportResult = await airports(requestedAirport)
    response.status(200)
    response.json(airportResult.data)

  } catch (error) {
    if (error.name === 'aeroportosPromiseError') {
      switch (error.type) {
        case 'validation_error':
          response.status(400)
          break
        case 'service_error':
          response.status(404)
          break
        default:
          break
      }
    } else {
      response.status(500)
    }

    response.json(error)

  }
}

export default cors(AirportByIata)
