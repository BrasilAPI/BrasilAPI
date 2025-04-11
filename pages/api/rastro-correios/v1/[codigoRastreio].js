import app from '@/app';
import BaseError from '@/errors/BaseError';
import {
  TrackingError,
  trackObject,
} from '@/services/rastro-correios/track-object';

async function rastro(request, response) {
  try {
    const trackingCode = request.query.codigoRastreio;

    const tracking = await trackObject(trackingCode);

    response.status(200).json(tracking);
  } catch (error) {
    if (error instanceof TrackingError) {
      switch (error.type) {
        case 'validation_error':
          response.status(400);
          break;
        case 'not_found_error':
          response.status(404);
          break;
        case 'network_error':
          response.status(503);
          break;
        default:
          break;
      }

      response.json(error);
      return;
    }

    if (error instanceof BaseError) {
      throw error;
    }

    response.status(500);
    response.json(error);
  }
}

export default app().get(rastro);
