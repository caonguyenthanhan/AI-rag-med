import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const registryPath = path.join(process.cwd(), 'data', 'server-registry.json')
const defaultGpuUrl = process.env.DEFAULT_GPU_URL || ''

export async function GET() {
  try {
    if (!fs.existsSync(registryPath)) return NextResponse.json({ url: defaultGpuUrl, item: null })
    const reg = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
    const servers = Array.isArray(reg?.servers) ? reg.servers : []
    const active = servers.filter((s: any) => s.status === 'active')
    const latest = (active.length ? active : servers).sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
    const url = latest ? latest.url : defaultGpuUrl
    return NextResponse.json({ url, item: latest || null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'read_error' }, { status: 500 })
  }
}
