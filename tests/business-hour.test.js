import { isBusinessHour } from '@/pages/api/business-hour/v1'

describe('Date Helper', () => {
  describe('isBusinessHour', () => {
    describe('when is weekend', () => {
      const date = new Date(2022, 4, 21, 13) // Sábado, 13h

      it('should return false', async () => {
        expect(await isBusinessHour(date)).toBe(false)
      })
    })

    describe('when is holiday', () => {
      const date = new Date(2022, 3, 21, 13) // Dia útil, Tiradentes, 13h

      it('should return false', async () => {
        expect(await isBusinessHour(date)).toBe(false)
      })
    })

    describe('when is not business hour', () => {
      const date = new Date(2022, 4, 20, 22) // Dia útil, 22h

      it('should return false', async () => {
        expect(await isBusinessHour(date)).toBe(false)
      })
    })

    describe('when is business hour', () => {
      const date = new Date(2022, 4, 20, 13) // Dia útil, 13h

      it('should return true', async () => {
        expect(await isBusinessHour(date)).toBe(true)
      })
    })
  })
})
