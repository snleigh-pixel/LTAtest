/**
 * Serverless function for pulling live bus arrival data from Singapore LTA DataMall v3 API.
 * Endpoint: GET /api/busarrivals?BusStopCode=83139
 *
 * Headers forwarded to LTA:
 * - AccountKey: process.env.LTA_ACCOUNT_KEY
 * - accept: application/json
 */

export interface LTANextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: 'SEA' | 'SDA' | 'LSD' | string;
  Feature: 'WAB' | string;
  Type: 'SD' | 'DD' | 'BD' | string;
}

export interface LTAService {
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS' | string;
  NextBus: LTANextBus;
  NextBus2?: LTANextBus;
  NextBus3?: LTANextBus;
}

export interface LTABusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LTAService[];
}

export default async function handler(req: any, res?: any) {
  // Extract query parameters across Express or Web Request objects
  let busStopCode = '83139';
  let serviceNo: string | undefined = undefined;

  if (req?.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || busStopCode;
    serviceNo = req.query.ServiceNo || req.query.serviceNo;
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      busStopCode = url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || busStopCode;
      serviceNo = url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || undefined;
    } catch {
      // ignore
    }
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_DATAMALL_KEY || process.env.ACCOUNT_KEY;

  // Check if AccountKey is configured
  if (!accountKey || accountKey.trim() === '' || accountKey === 'YOUR_LTA_ACCOUNT_KEY') {
    const errorPayload = {
      error: 'Missing LTA AccountKey',
      message:
        'LTA_ACCOUNT_KEY environment variable is not configured. Please add your Singapore LTA DataMall AccountKey to your environment variables or .env file.',
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      requestedStopCode: busStopCode,
      isConfigured: false,
    };

    if (res && typeof res.status === 'function') {
      return res.status(401).json(errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Construct official LTA DataMall v3 BusArrival URL
  let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(
    busStopCode
  )}`;

  if (serviceNo) {
    targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  try {
    const ltaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey.trim(),
        accept: 'application/json',
      },
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      const failurePayload = {
        error: `LTA DataMall API responded with status ${ltaResponse.status}`,
        details: errorText,
        busStopCode,
      };

      if (res && typeof res.status === 'function') {
        return res.status(ltaResponse.status).json(failurePayload);
      }
      return new Response(JSON.stringify(failurePayload), {
        status: ltaResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data: LTABusArrivalResponse = await ltaResponse.json();

    if (res && typeof res.status === 'function') {
      return res.status(200).json(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, max-age=10',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    const catchPayload = {
      error: 'Failed to connect to LTA DataMall',
      message: error?.message || 'Network error connecting to datamall2.mytransport.sg',
      busStopCode,
    };

    if (res && typeof res.status === 'function') {
      return res.status(502).json(catchPayload);
    }
    return new Response(JSON.stringify(catchPayload), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
