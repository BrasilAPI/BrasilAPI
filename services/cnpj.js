import axios from 'axios';
import ServiceUnavailableError from '@/errors/ServiceUnavailableError';

const PROVIDER_TIMEOUT_MS = 5000;

export const getCnpjData = async (cnpj) => {
  const controller = new AbortController();
  // Bound the whole request, including connection establishment.
  const deadline = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    return await axios.get(`https://minhareceita.org/${cnpj}`, {
      timeout: PROVIDER_TIMEOUT_MS,
      signal: controller.signal,
    });
  } catch (error) {
    const status = error.response?.status;
    if (
      axios.isAxiosError(error) &&
      ((status >= 500 && status <= 599) ||
        (!error.response && (error.request || controller.signal.aborted)))
    ) {
      throw new ServiceUnavailableError({
        message: 'Serviço de consulta de CNPJ temporariamente indisponível.',
      });
    }
    throw error;
  } finally {
    clearTimeout(deadline);
  }
};
