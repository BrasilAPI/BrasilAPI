import axios from 'axios';
import { describe, expect, it, beforeEach } from 'vitest';

export const testCorsForRoute = (route) => {
  describe(`CORS Middleware for ${route}`, () => {
    let url = '';

    beforeEach(() => {
      url = `${global.SERVER_URL}${route}`;
    });

    it('deve permitir solicitações da origem permitida', async () => {
      const response = await axios.get(url, {
        headers: { Origin: 'http://exemplo.com' },
      });
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('deve lidar corretamente com pre-flight CORS request', async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toContain(
        'GET,HEAD,PUT,PATCH,POST,DELETE'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Authorization'
      );
      expect(response.status).toBe(204);
    });

    it('deve permitir métodos específicos', async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Method': 'GET',
        },
      });
      expect(response.headers['access-control-allow-methods']).toContain('GET');
    });

    it('deve permitir cabeçalhos específicos', async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });
      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
    });
  });
};
