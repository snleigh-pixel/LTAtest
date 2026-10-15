export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  isLtaKeyConfigured: boolean;
  environment: string;
}

/**
 * Serverless health check handler
 * Accessible via GET /api/health
 */
export default async function handler(req: any, res?: any) {
  const isKeyConfigured = Boolean(
    process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '' && process.env.LTA_ACCOUNT_KEY !== 'YOUR_LTA_ACCOUNT_KEY'
  );

  const payload: HealthResponse = {
    status: 'ok',
    service: 'SG BusRadar LTA DataMall Gateway',
    timestamp: new Date().toISOString(),
    isLtaKeyConfigured: isKeyConfigured,
    environment: process.env.NODE_ENV || 'development',
  };

  // Support Express / Node.js HTTP response
  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }

  // Support Web Standard Response (Vercel Edge / Cloudflare Workers / Next.js)
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
