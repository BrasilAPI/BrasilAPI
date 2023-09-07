import { isIP, isInSubnet } from 'is-in-subnet';

const isServerlessRuntime = !!process.env.NEXT_PUBLIC_VERCEL_ENV;

// https://github.com/filipedeschamps/tabnews.com.br/blob/53482fa8d15c273e9dcda80242eaba4d9f37c9a9/models/ip.js#L4
export function extractIPFromRequest(request) {
  if (isRequestFromCloudflare(request)) {
    // Vercel via Cloudflare
    return request instanceof Request
      ? request.headers.get('cf-connecting-ip') // edge runtime
      : request.headers['cf-connecting-ip']; // node runtime
  }
  let realIp;

  if (request instanceof Request) {
    // edge runtime
    realIp = isServerlessRuntime
      ? getLastValueFromHeader(request.headers.get('x-vercel-proxied-for')) // Vercel
      : getLastValueFromHeader(request.headers.get('x-forwarded-for')); // remote development
  } else {
    // node runtime
    realIp = isServerlessRuntime
      ? getLastValueFromHeader(request.headers['x-vercel-proxied-for']) // Vercel
      : getLastValueFromHeader(request.headers['x-forwarded-for']); // remote development
  }

  if (!realIp) {
    // local development
    if (request.socket) {
      realIp = request.socket.remoteAddress || '127.0.0.1';
    } else {
      realIp = '127.0.0.1';
    }

    // Localhost loopback in IPv6
    if (realIp === '::1') {
      realIp = '127.0.0.1';
    }

    // IPv4-mapped IPv6 addresses
    if (realIp.substr(0, 7) === '::ffff:') {
      realIp = realIp.substr(7);
    }
  }

  return realIp;
}
const cloudflareIPs = [
  '172.64.0.0/13',
  '162.158.0.0/15',
  '108.162.192.0/18',
  '198.41.128.0/17',
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '131.0.72.0/22',
  '2400:cb00::/32',
  '2606:4700::/32',
  '2803:f800::/32',
  '2405:b500::/32',
  '2405:8100::/32',
  '2a06:98c0::/29',
  '2c0f:f248::/32',
];

export function isRequestFromCloudflare(request) {
  const proxyIp =
    request instanceof Request
      ? getLastValueFromHeader(request.headers.get('x-vercel-proxied-for')) // edge runtime
      : getLastValueFromHeader(request.headers['x-vercel-proxied-for']); // node runtime

  return !!isIP(proxyIp) && isInSubnet(proxyIp, cloudflareIPs);
}

function getLastValueFromHeader(header) {
  if (header) {
    return header.split(', ').at(-1);
  }

  return null;
}
