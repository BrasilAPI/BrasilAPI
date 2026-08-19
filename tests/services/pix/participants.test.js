import { describe, expect, test } from 'vitest';

import { getPixParticipants } from '@/services/pix/participants';

describe('getPixParticipants', () => {
  test('retorna a lista do snapshot com o contrato da rota', () => {
    const participants = getPixParticipants();

    expect(Array.isArray(participants)).toBe(true);
    expect(participants.length).toBeGreaterThan(700);
  });

  test('todos os participantes seguem o formato de resposta', () => {
    const participants = getPixParticipants();

    participants.forEach((participant) => {
      expect(participant.ispb).toMatch(/^\d{8}$/);
      expect(participant.nome).toEqual(expect.any(String));
      expect(participant.nome.length).toBeGreaterThan(0);
      expect(participant.nome_reduzido).toEqual(expect.any(String));
      expect([expect.any(String), null]).toContainEqual(
        participant.modalidade_participacao
      );
      expect([expect.any(String), null]).toContainEqual(
        participant.tipo_participacao
      );
      expect(participant.inicio_operacao).toBeNull();
    });
  });

  test('não possui ISPBs duplicados', () => {
    const participants = getPixParticipants();
    const uniqueIspbs = new Set(participants.map((p) => p.ispb));

    expect(uniqueIspbs.size).toBe(participants.length);
  });
});
