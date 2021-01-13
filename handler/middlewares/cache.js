/*!
 * max-age especifica quanto tempo o browser deve manter o valor em cache, em segundos.
 * s-maxage é uma header lida pelo servidor proxy (neste caso, Vercel).
 * stale-while-revalidate indica que o conteúdo da cache pode ser servido como "stale" e revalidado no background
 *
 * Sobre os valores utilizados:
 *
 * 1. O cache da Now é muito rápido e permite respostas em cerca de 10ms. O valor de
 * um dia (86400 segundos) é suficiente para garantir performance e também que as
 * respostas estejam relativamente sincronizadas.
 *
 * 2. O cache da Now é invalidado toda vez que um novo deploy é feito, garantindo que
 * todas as novas requisições sejam servidas pela implementação mais recente da API.
 *
 * 3. Não há browser caching pois este tipo de API normalmente é utilizada uma vez só
 * por um usuário. Se fizessemos caching, os valores ficariam lá guardados no browser
 * sem necessidade, só ocupando espaço em disco. A história seria diferente se a API
 * servisse fotos dos usuários, por exemplo. Além disso teríamos problemas com
 * stale/out-of-date cache caso alterássemos a implementação da API.
 */

export function cache(maxAgeSeconds = 86400) {
  return () => ({
    headers: {
      'Cache-Control': `max-age=0, s-maxage=${maxAgeSeconds}, stale-while-revalidate, public`,
    },
  });
}
