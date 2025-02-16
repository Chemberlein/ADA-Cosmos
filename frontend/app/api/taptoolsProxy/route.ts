import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, ApiAuthKey',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint not specified' },
      { status: 400 }
    );
  }

  const API_BASE_URL = process.env.TAPTOOLS_BASE_URL;
  const API_KEY = process.env.TAPTOOLS_API_KEY;

  // Remove any trailing slashes from the base URL
  const baseUrl = API_BASE_URL?.replace(/\/+$/, '');
  const targetUrl = new URL(`${baseUrl}/${endpoint}`);

  // Append all query parameters except 'endpoint'
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') {
      targetUrl.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY || '',
      },
    });

    if (!response.ok) {
      console.error(
        `Fetch error: ${response.status} for URL ${targetUrl.toString()}`
      );
      return NextResponse.json(
        { error: `Request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    console.error('Fetch exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
