
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Test API works', timestamp: new Date().toISOString() })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Test POST API works', timestamp: new Date().toISOString() })
}
