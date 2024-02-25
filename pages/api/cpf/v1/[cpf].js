import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import BadRequestError from '@/errors/BadRequestError';

import { cpfIsValid, getCpfRegionAndUfs, formatCpf } from '@/services/cpf/cpf';

async function regionOfCpf(request, response, next) {
  try {
    const requestedCpf = request.query.cpf.replace(/[-.]/g, '');
    const formatedCpf = formatCpf(requestedCpf);

    if (!/^[0-9]+$/.test(requestedCpf)) {
      throw new BadRequestError({
        message: `CPF ${formatedCpf} inválido.`,
        type: 'BadRequestError',
        name: 'bad_request',
      });
    }

    if (requestedCpf.length !== 11) {
      throw new BadRequestError({
        message: `CPF ${formatedCpf} inválido.`,
        type: 'bad_request',
        name: 'BadRequestError',
      });
    }

    if (!cpfIsValid(requestedCpf)) {
      response.status(200);
      return response.json({
        isValid: false,
      });
    }

    const cpfRegionAndUfs = getCpfRegionAndUfs(requestedCpf);

    response.status(200);
    return response.json({
      cpf: formatedCpf,
      isValid: true,
      rf: cpfRegionAndUfs.regionNumber,
      ufs: cpfRegionAndUfs.ufs,
    });
  } catch (error) {
    if (error instanceof BaseError) {
      console.log(error);
      return next(error);
    }

    console.log(error);
    throw new InternalError({
      message: 'Todos os serviços de CPF retornaram erro.',
      type: 'service_error',
    });
  }
}

export default app().get(regionOfCpf);
