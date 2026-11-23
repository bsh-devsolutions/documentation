// Rebuilds the docs (next build + pagefind) and restarts `next start` whenever a source file changes.
// Usage: npm run watch   (PORT env var overrides the default port)
import { spawn } from 'node:child_process'
import { existsSync, statSync, watch } from 'node:fs'
import path from 'node:path'

const PORT = process.env.PORT || '7201'
const WATCHED = ['app', 'components', 'constants', 'icons', 'tech-icons', 'public', 'mdx-components.js', 'next.config.mjs']
const IGNORED = [/(^|\/)_pagefind(\/|$)/, /(^|\/)\.DS_Store$/, /~$/, /\.swp$/]
const DEBOUNCE_MS = 300

let server = null
let building = false
let pending = false
let timer = null

const log = (msg) => console.log(`\x1b[36m[watch]\x1b[0m ${msg}`)

function run(cmd, args) {
  // detached: own process group, so killing it also stops the children npm spawns
  const child = spawn(cmd, args, { stdio: 'inherit', detached: true })
  child.done = new Promise((resolve) => child.on('exit', (code) => resolve(code)))
  return child
}

async function stopServer() {
  if (!server) return
  const child = server
  server = null
  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {}
  await child.done
}

async function rebuild() {
  if (building) {
    pending = true
    return
  }
  building = true
  do {
    pending = false
    await stopServer()
    log('building...')
    const code = await run('npm', ['run', 'build']).done
    if (code !== 0) {
      log(`build failed (exit ${code}), waiting for changes`)
      continue
    }
    if (pending) continue
    log(`starting server on http://localhost:${PORT}`)
    server = run('npx', ['next', 'start', '--port', PORT])
  } while (pending)
  building = false
}

function onChange(file) {
  if (!file || IGNORED.some((re) => re.test(file))) return
  log(`changed: ${file}`)
  clearTimeout(timer)
  timer = setTimeout(rebuild, DEBOUNCE_MS)
}

for (const target of WATCHED) {
  if (!existsSync(target)) continue
  watch(target, { recursive: true }, (_event, file) =>
    onChange(file && statSync(target).isDirectory() ? path.join(target, file.toString()) : target)
  )
}

async function shutdown() {
  clearTimeout(timer)
  await stopServer()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

log(`watching ${WATCHED.join(', ')}`)
rebuild()
