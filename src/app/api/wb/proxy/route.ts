import { NextRequest, NextResponse } from 'next/server';
const WB_ENDPOINTS: Record<string, string> = {
  waysheets: 'https://drive.wb.ru/client-gateway/api/waysheets/v1/waysheets',
  shipments: 'https://logistics.wb.ru/shipments-service/api/v1/shipments',
  transportRequests: 'https://logistics.wb.ru/transport-requests-service/api/v1/transport-requests',
  lastMile: 'https://logistics.wb.ru/reports-service/api/v1/last-mile',
  balances: 'https://drive.wb.ru/client-gateway/api/finance/balance/v2/balances',
  operations: 'https://drive.wb.ru/client-gateway/api/finance/credeber/v1/operations/history',
  drivers: 'https://logistics.wb.ru/waysheets-netcore-service/api/v1/external-driver/get-all/true',
  vehicles: 'https://logistics.wb.ru/vehicles-service/api/v2/vehicles',
  vehicleTypes: 'https://logistics.wb.ru/vehicles-service/api/v2/types',
  driverOffers: 'https://logistics.wb.ru/drivers-service/api/v1/driver-offers/supplier',
  planning: 'https://logistics.wb.ru/transport-planning-service/api/v1/planning/mgt',
  courierShipments: 'https://drive.wb.ru/client-gateway/courier/api/v1/admin/shipments/in-progress/list',
};
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, method = 'GET', token, params, data } = body;
    const targetUrl = WB_ENDPOINTS[endpoint];
    if (!targetUrl) {
      return NextResponse.json({ error: 'Unknown endpoint: ' + endpoint }, { status: 400 });
    }
    let url = targetUrl;
    if (params && method === 'GET') {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) searchParams.append(key, String(value));
      });
      url += '?' + searchParams.toString();
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Cookie'] = token;
    }
    const fetchOptions: RequestInit = {
      method: method,
      headers: headers,
    };
    if (data && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    let responseData;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    return NextResponse.json({
      status: response.status,
      data: responseData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
