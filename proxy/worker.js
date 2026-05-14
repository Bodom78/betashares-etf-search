/**
 * Cloudflare Worker — CORS proxy for the BetaShares search API.
 *
 * Deploy:
 *   1. Install Wrangler: npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler deploy proxy/worker.js --name betashares-search-proxy --compatibility-date 2024-01-01
 *
 * Then set the deployed worker URL as the api-url attribute:
 *   <betashares-etf-search api-url="https://betashares-search-proxy.<your-subdomain>.workers.dev"></betashares-etf-search>
 */

const UPSTREAM = 'https://search.betashares.services/search'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
    }

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request.body,
    })

    const body = await upstream.text()

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    })
  },
}
