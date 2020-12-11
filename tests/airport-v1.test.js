const axios = require('axios')

const createServer = require('./helpers/server.js')

const server = createServer()

const scenariosAirport = {
  success: require('./helpers/scenarios/airport/success.json'),
  nonexistent: require('./helpers/scenarios/airport/nonexistent.json'),
  invalid: require('./helpers/scenarios/airport/invalid.json'),
  specialChars: require('./helpers/scenarios/airport/invalidOnlyLetters.json')
}

const requestUrl = `${server.getUrl()}/api/airport/v1`

beforeAll(async () => {
  await server.start()
})

afterAll(async () => {
  await server.stop()
})

describe('api/airport/v1 (E2E)', () => {
  test('Utilizando um IATA válido: CWB', async () => {
    const response = await axios.get(`${requestUrl}/cwb`)
    expect(response.data).toEqual(scenariosAirport.success)
  })

  test('Utilizando um IATA inexistente: AAA', async () => {
    try {
      await axios.get(`${requestUrl}/aaa`)
    } catch (error) {
      const { response } = error

      expect(response.data).toMatchObject(scenariosAirport.nonexistent)
    }
  })

  test('Utilizando um IATA inválido: CWBB', async () => {

    try {
      await axios.get(`${requestUrl}/CWBB`)
    } catch (error) {
      const { response } = error

      expect(response.data).toMatchObject(scenariosAirport.invalid)
    }
  })

  test('Utilizando um IATA inválido: CW', async () => {

    try {
      await axios.get(`${requestUrl}/CW`)
    } catch (error) {
      const { response } = error

      expect(response.data).toMatchObject(scenariosAirport.invalid)
    }
  })

  test('Utilizando um IATA inválido: C_B', async () => {

    try {
      await axios.get(`${requestUrl}/C_B`)
    } catch (error) {
      const { response } = error

      expect(response.data).toMatchObject(scenariosAirport.specialChars)
    }
  })

  test('Utilizando um IATA inválido: 777', async () => {

    try {
      await axios.get(`${requestUrl}/777`)
    } catch (error) {
      const { response } = error

      expect(response.data).toMatchObject(scenariosAirport.specialChars)
    }
  })
})
