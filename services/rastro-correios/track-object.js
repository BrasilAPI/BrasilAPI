import axios from 'axios';

const DEFAULT_TIMEOUT = 8 * 1000;
const IMPORTER_PORTAL_URL = 'https://portalimportador.correios.com.br';

export class TrackingError extends Error {
  constructor({ message, type, errors } = {}) {
    super();

    this.name = 'TrackingError';
    this.message = message;
    this.type = type;
    this.errors = errors;
  }
}

function trackMapper(input) {
  const getStatus = (description) => {
    switch (description) {
      case 'Objeto postado':
        return 'posted';

      case 'Informações enviadas para análise da autoridade aduaneira/órgãos anuentes':
        return 'sent_to_analysis';

      case 'Análise concluída - importação autorizada':
        return 'analysis_completed';

      case 'Importação autorizada  pela autoridade competente - aguardando pagamento':
        return 'awaiting_payment';

      case 'Pagamento confirmado':
        return 'payment_confirmed';

      case 'Objeto saiu para entrega ao destinatário':
        return 'delivery_route';

      case 'Objeto entregue ao destinatário':
        return 'delivered';

      default:
        return 'in_transit';
    }
  };

  const getMessage = (description) => {
    switch (description) {
      case 'Informações enviadas para análise da autoridade aduaneira/órgãos anuentes':
        return `Acompanhe pelo Minhas Importações: ${IMPORTER_PORTAL_URL}`;

      case 'Análise concluída - importação autorizada':
        return `A autorização poderá ser revista pela autoridade aduaneira ou pelos órgãos anuentes. Acompanhe pelo Minhas Importações: ${IMPORTER_PORTAL_URL}`;

      case 'Importação autorizada  pela autoridade competente - aguardando pagamento':
        return `Acesse o Minhas Importações ${IMPORTER_PORTAL_URL} para realizar o pagamento ou contestar a tributação`;

      case 'Pagamento confirmado':
        return 'Aguardando envio para o cliente';

      case 'Saída do Centro Internacional':
        return 'Objeto sem pendências de pagamentos e outras obrigações';

      case 'Objeto saiu para entrega ao destinatário':
        return 'É preciso ter alguém no endereço para receber o carteiro';

      default:
        return undefined;
    }
  };

  const { date, description, local, destination } = input;
  const { localName, city, state } = local;

  const track = {};

  const newDate = new Date(date);

  track.description = description;
  track.status = getStatus(description);
  track.message = getMessage(description);
  track.origin = `${localName}`;

  if (city && state) {
    track.origin = `${localName} ${city}, ${state}`;
  }

  if (destination) {
    track.destination = `${destination.localName} ${destination.city}, ${destination.state}`;
  }

  track.date = newDate.toLocaleDateString('pt-BR');
  track.time = newDate.toLocaleTimeString('pt-BR');

  return track;
}

async function fetchTrackingCode(trackingCode) {
  try {
    const response = await axios.get(
      `https://api.rastreiocorreios.com/v1/correios/tracking?trackingCode=${trackingCode}`,
      { timeout: DEFAULT_TIMEOUT }
    );

    return response.data;
  } catch (error) {
    throw new TrackingError({
      message: 'Erro ao buscar código de rastreamento',
      type: 'network_error',
      errors: [{ message: error.message, service: 'axios_request' }],
    });
  }
}

function isValidTrackingCode(code) {
  if (!code || typeof code !== 'string') return false;

  const normalized = code.toUpperCase();
  const regex = /^[A-Z]{2}\d{9}[A-Z]{2}$/;

  return regex.test(normalized);
}

export const trackObject = async (trackingCode) => {
  if (!isValidTrackingCode(trackingCode)) {
    throw new TrackingError({
      message: 'Código de rastreamento inválido',
      type: 'validation_error',
      errors: [
        {
          message: 'O código de rastreamento informado é inválido',
          service: 'tracking_validation',
        },
      ],
    });
  }

  const trackingCodeNormalized = trackingCode.toUpperCase();
  const body = await fetchTrackingCode(trackingCodeNormalized);

  if (!body.length) {
    throw new TrackingError({
      message: 'Código de rastreamento não encontrado',
      type: 'not_found_error',
      errors: [
        {
          message: 'O código de rastreamento informado não foi encontrado',
          note: 'Caso o envio tenha sido recente, os dados de rastreio podem ainda não estar disponíveis. Verifique se o código está correto e tente novamente em alguns instantes.',
          service: 'tracking_not_found',
        },
      ],
    });
  }

  return {
    codigo_rastreamento: trackingCodeNormalized,
    tipo_envio: body[0].category,
    historico: body[0].checkpoints
      .slice()
      .reverse()
      .map((checkpoint) => trackMapper(checkpoint)),
  };
};
