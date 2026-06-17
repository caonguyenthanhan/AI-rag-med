import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const modePath = path.join(dataDir, 'runtime-mode.json')
const eventsPath = path.join(dataDir, 'runtime-events.jsonl')

// In-memory fallback khi Vercel serverless filesystem là read-only
let _memoryMode: Record<string, any> = { target: 'cpu', updated_at: new Date().toISOString() }

function tryReadFile(): Record<string, any> | null {
  try {
    const raw = fs.readFileSync(modePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function tryWriteFile(payload: Record<string, any>): boolean {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    fs.writeFileSync(modePath, JSON.stringify(payload, null, 2))
    return true
  } catch {
    return false
  }
}

function tryAppendEvent(event: Record<string, any>): void {
  try {
    fs.appendFileSync(eventsPath, JSON.stringify(event) + '\n')
  } catch {
    // read-only fs trên Vercel — bỏ qua silently
  }
}

export async function GET() {
  // Ưu tiên đọc file, fallback về memory
  const data = tryReadFile() ?? _memoryMode
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const target = body?.target === 'gpu' ? 'gpu' : 'cpu'
    const gpu_url = target === 'gpu' && typeof body?.gpu_url === 'string' ? body.gpu_url : undefined
    const now = new Date().toISOString()
    const payload: any = { target, updated_at: now }
    if (gpu_url) payload.gpu_url = gpu_url

    // Cập nhật memory trước — đảm bảo không crash dù fs read-only
    _memoryMode = payload

    // Thử ghi file nếu fs cho phép (local dev), bỏ qua nếu không (Vercel)
    tryWriteFile(payload)
    tryAppendEvent({ type: 'mode_change', target, gpu_url, ts: now })

    // Đồng bộ sang backend local nếu có
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
      await fetch(`${backendUrl}/v1/runtime/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {})
    } catch {}

    return NextResponse.json({ ok: true, mode: payload })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'write_error' }, { status: 500 })
  }
}
