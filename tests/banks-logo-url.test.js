import { describe, expect, it } from 'vitest';
import { getBanksData } from '@/services/banco-central';

describe('banks logo_url (feature #834)', () => {
  it('adiciona logo_url para ISPB com logo mapeado', async () => {
    const banks = await getBanksData();
    const bb = banks.find((b) => b.ispb === '00000000');
    expect(bb).toBeDefined();
    expect(bb.logo_url).toMatch(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/logos-bancos-br@0\/logos\/svg\/.+\.svg$/
    );
  });

  it('logo_url é null para ISPB sem logo', async () => {
    const banks = await getBanksData();
    const nullLogos = banks.filter((b) => b.logo_url === null);
    expect(nullLogos.length).toBeGreaterThan(0);
  });

  it('mantém os campos existentes (compatibilidade retroativa)', async () => {
    const banks = await getBanksData();
    const bb = banks.find((b) => b.ispb === '00000000');
    expect(bb).toHaveProperty('ispb');
    expect(bb).toHaveProperty('name');
    expect(bb).toHaveProperty('code');
    expect(bb).toHaveProperty('fullName');
    expect(bb).toHaveProperty('logo_url');
  });
});
