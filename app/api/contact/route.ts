import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function text(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const payload = {
      name: text(body.name, 120),
      business: text(body.business, 160),
      country: text(body.country, 100),
      contact: text(body.contact, 200),
      service: text(body.service, 160),
      message: text(body.message, 4000),
      company_website: text(body.company_website, 240),
    }

    if (payload.company_website) return NextResponse.json({ ok: true })
    if (payload.name.length < 2 || payload.contact.length < 3 || payload.message.length < 5) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      console.error('NEXORA contact API: missing Supabase public environment variables')
      return NextResponse.json({ ok: false, error: 'Service unavailable' }, { status: 503 })
    }

    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')?.trim()
      || 'unknown'

    const response = await fetch(`${supabaseUrl}/functions/v1/public-lead-intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        'x-forwarded-for': forwarded,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({ ok: false, error: 'Invalid upstream response' }))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('NEXORA contact API', error)
    return NextResponse.json({ ok: false, error: 'Unable to save request' }, { status: 500 })
  }
}
