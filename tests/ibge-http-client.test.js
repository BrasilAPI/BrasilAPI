import { X509Certificate } from 'crypto';
import tls from 'tls';
import { describe, expect, it } from 'vitest';

import ibgeHttpClient, {
  ibgeHttpsAgent,
  SECTIGO_DV_R36_INTERMEDIATE,
} from '@/services/ibge/httpClient';

const intermediate = new X509Certificate(SECTIGO_DV_R36_INTERMEDIATE);

const findIssuerInNodeRootStore = (certificate) =>
  tls.rootCertificates
    .map((pem) => new X509Certificate(pem))
    .find((root) => certificate.checkIssued(root));

describe('ibgeHttpClient', () => {
  it('usa o certificado intermediário esperado (Sectigo DV R36)', () => {
    expect(intermediate.subject).toContain(
      'CN=Sectigo Public Server Authentication CA DV R36'
    );
    expect(intermediate.fingerprint256).toBe(
      '8C:54:C3:34:B6:6B:A4:E4:26:77:2A:F4:A3:F9:13:6C:19:A1:AE:C7:29:FD:B2:8C:53:5C:07:A5:A4:EF:22:E0'
    );
    expect(intermediate.ca).toBe(true);
  });

  it('o intermediário ainda está dentro da validade', () => {
    const now = Date.now();

    expect(new Date(intermediate.validFrom).getTime()).toBeLessThan(now);
    expect(new Date(intermediate.validTo).getTime()).toBeGreaterThan(now);
  });

  it('o intermediário é assinado por uma raiz confiável do Node', () => {
    const root = findIssuerInNodeRootStore(intermediate);

    expect(root).toBeDefined();
    expect(root.subject).toContain(
      'CN=Sectigo Public Server Authentication Root R46'
    );
    expect(intermediate.verify(root.publicKey)).toBe(true);
  });

  it('mantém as CAs padrão do Node e acrescenta só o intermediário', () => {
    const { ca } = ibgeHttpsAgent.options;

    expect(ca).toHaveLength(tls.rootCertificates.length + 1);
    expect(ca).toEqual(expect.arrayContaining(tls.rootCertificates));
    expect(ca).toContain(SECTIGO_DV_R36_INTERMEDIATE);
  });

  it('não desativa a verificação de certificado', () => {
    expect(ibgeHttpsAgent.options.rejectUnauthorized).not.toBe(false);
    expect(ibgeHttpClient.defaults.httpsAgent).toBe(ibgeHttpsAgent);
  });
});
