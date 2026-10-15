import https from 'https';
import tls from 'tls';
import axios from 'axios';

/*
 * O servidor servicodados.ibge.gov.br envia apenas o certificado folha
 * (*.ibge.gov.br), sem o intermediário que o emitiu. Navegadores completam a
 * cadeia sozinhos (via AIA), mas o Node não, e a requisição falha com
 * "unable to verify the first certificate" (UNABLE_TO_VERIFY_LEAF_SIGNATURE).
 *
 * Por isso adicionamos o intermediário às CAs confiáveis, somente nas chamadas
 * ao IBGE. A verificação TLS continua ativa: o intermediário só é aceito porque
 * foi assinado pela raiz "Sectigo Public Server Authentication Root R46", que
 * já faz parte das CAs padrão do Node.
 *
 * Certificado: Sectigo Public Server Authentication CA DV R36
 * Válido até: 2036-03-21
 * SHA-256: 8C:54:C3:34:B6:6B:A4:E4:26:77:2A:F4:A3:F9:13:6C:19:A1:AE:C7:29:FD:B2:8C:53:5C:07:A5:A4:EF:22:E0
 * Fonte: http://crt.sectigo.com/SectigoPublicServerAuthenticationCADVR36.crt
 *
 * Ref.: https://github.com/BrasilAPI/BrasilAPI/issues/924
 */
export const SECTIGO_DV_R36_INTERMEDIATE = `-----BEGIN CERTIFICATE-----
MIIGTDCCBDSgAwIBAgIQOXpmzCdWNi4NqofKbqvjsTANBgkqhkiG9w0BAQwFADBfMQswCQYDVQQG
EwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQDEy1TZWN0aWdvIFB1YmxpYyBT
ZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYwHhcNMjEwMzIyMDAwMDAwWhcNMzYwMzIxMjM1
OTU5WjBgMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5T
ZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgRFYgUjM2MIIBojANBgkqhkiG
9w0BAQEFAAOCAY8AMIIBigKCAYEAljZf2HIz7+SPUPQCQObZYcrxLTHYdf1ZtMRe7YeqRPSwygz1
6qJ9cAWtWNTcuICc++p8Dct7zNGxCpqmEtqifO7NvuB5dEVexXn9RFFH12Hm+NtPRQgXIFjx6MSJ
cNWuVO3XGE57L1mHlcQYj+g4hny90aFh2SCZCDEVkAjaEMMfYPKuCjHuuF+bzHFb/9gV8P9+ekcH
ENF2nR1efGWSKwnfG5RawlkaQDpRtZTmM64TIsv/r7cyFO4nSjs1jLdXYdz5q3a4L0NoabZfbdxV
b+CUEHfB0bpulZQtH1Rv38e/lIdP7OTTIlZh6OYL6NhxP8So0/sht/4J9mqIGxRFc0/pC8suja+w
cIUna0HBpXKfXTKpzgis+zmXDL06ASJf5E4A2/m+Hp6b84sfPAwQ766rI65mh50S0Di9E3Pn2Wca
Jc+PILsBmYpgtmgWTR9eV9otfKRUBfzHUHcVgarub/XluEpRlTtZudU5xbFNxx/DgMrXLUAPaI60
fZ6wA+PTAgMBAAGjggGBMIIBfTAfBgNVHSMEGDAWgBRWc1hklfmSGrASKgRieaFAFYghSTAdBgNV
HQ4EFgQUaMASFhgOr872h6YyV6NGUV3LBycwDgYDVR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYB
Af8CAQAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBsGA1UdIAQUMBIwBgYEVR0gADAI
BgZngQwBAgEwVAYDVR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5zZWN0aWdvLmNvbS9TZWN0aWdv
UHVibGljU2VydmVyQXV0aGVudGljYXRpb25Sb290UjQ2LmNybDCBhAYIKwYBBQUHAQEEeDB2ME8G
CCsGAQUFBzAChkNodHRwOi8vY3J0LnNlY3RpZ28uY29tL1NlY3RpZ29QdWJsaWNTZXJ2ZXJBdXRo
ZW50aWNhdGlvblJvb3RSNDYucDdjMCMGCCsGAQUFBzABhhdodHRwOi8vb2NzcC5zZWN0aWdvLmNv
bTANBgkqhkiG9w0BAQwFAAOCAgEAYtOC9Fy+TqECFw40IospI92kLGgoSZGPOSQXMBqmsGWZUQ7r
ux7cj1du6d9rD6C8ze1B2eQjkrGkIL/OF1s7vSmgYVafsRoZd/IHUrkoQvX8FZwUsmPu7amgBfaY
3g+dq1x0jNGKb6I6Bzdl6LgMD9qxp+3i7GQOnd9J8LFSietY6Z4jUBzVoOoz8iAU84OFh2HhAuiP
w1ai0VnY38RTI+8kepGWVfGxfBWzwH9uIjeooIeaosVFvE8cmYUB4TSH5dUyD0jHct2+8ceKEtIo
FU/FfHq/mDaVnvcDCZXtIgitdMFQdMZaVehmObyhRdDD4NQCs0gaI9AAgFj4L9QtkARzhQLNyRf8
7Kln+YU0lgCGr9HLg3rGO8q+Y4ppLsOdunQZ6ZxPNGIfOApbPVf5hCe58EZwiWdHIMn9lPP6+F40
4y8NNugbQixBber+x536WrZhFZLjEkhp7fFXf9r32rNPfb74X/U90Bdy4lzp3+X1ukh1BuMxA/EE
hDoTOS3l7ABvc7BYSQubQ2490OcdkIzUh3ZwDrakMVrbaTxUM2p24N6dB+ns2zptWCva6jzWr8IW
KIMxzxLPv5Kt3ePKcUdvkBU/smqujSczTzzSjIoR5QqQA6lN1ZRSnuHIWCvhJEltkYnTAH41QJ6S
AWO66GrrUESwN/cgZzL4JLEqz1Y=
-----END CERTIFICATE-----`;

// Passar `ca` substitui as CAs padrão do Node, então mantemos as raízes
// originais e apenas acrescentamos o intermediário.
export const ibgeHttpsAgent = new https.Agent({
  ca: [...tls.rootCertificates, SECTIGO_DV_R36_INTERMEDIATE],
});

const ibgeHttpClient = axios.create({ httpsAgent: ibgeHttpsAgent });

export default ibgeHttpClient;
