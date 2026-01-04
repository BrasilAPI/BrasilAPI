import rateLimit from 'express-rate-limit';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// Configuração de rate limiting
// Em produção: 100 requisições por minuto por IP
// Em desenvolvimento: 300 requisições por minuto
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: isProduction ? 100 : 300, // Limite de requisições
  standardHeaders: true, // Retorna info do rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  message: {
    message: 'Muitas requisições deste IP. Por favor, tente novamente em alguns instantes.',
    type: 'rate_limit_exceeded',
    name: 'RateLimitError',
  },
  // Função para extrair o IP real, considerando proxies (Cloudflare, Vercel)
  keyGenerator: (request) => {
    // Para Next.js/Vercel
    const forwarded = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    const cfIp = request.headers['cf-connecting-ip'];
    
    return (
      cfIp || // Cloudflare
      realIp || // Nginx
      (forwarded ? forwarded.split(',')[0].trim() : null) || // Proxy padrão
      request.socket?.remoteAddress || // Socket direto
      'unknown'
    );
  },
  // Ignorar rate limit para requisições de healthcheck
  skip: (request) => {
    return request.url === '/api/status';
  },
});

export default limiter;
