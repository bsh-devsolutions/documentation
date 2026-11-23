// Writes `lastUpdated: YYYY-MM-DD` into the frontmatter of MDX pages (read by components/last-updated.js).
//
//   npm run last-updated                 pages changed since the last commit (staged, unstaged, new) → today
//   npm run last-updated -- <files...>   the given pages → today
//   npm run last-updated -- --from-git   every page → the date of its last git commit (one-time seeding)
//   node scripts/last-updated.mjs --staged   staged pages → today, then re-stages them (run by .githooks/pre-commit)
import {execFileSync} from 'node:child_process'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGE_RE = /^app\/.*\.mdx?$/

const git = (...args) => execFileSync('git', args, {cwd: ROOT, encoding: 'utf8'}).trim()
const lines = (out) => out.split('\n').filter(Boolean)
const today = () => new Date().toISOString().slice(0, 10)

function setLastUpdated(file, date) {
    const abs = path.join(ROOT, file)
    const source = readFileSync(abs, 'utf8')
    const line = `lastUpdated: ${date}`
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/)
    let next
    if (!frontmatter) {
        next = `---\n${line}\n---\n\n${source}`
    } else if (/^lastUpdated:.*$/m.test(frontmatter[1])) {
        next = source.replace(frontmatter[0], frontmatter[0].replace(/^lastUpdated:.*$/m, line))
    } else {
        next = source.replace(frontmatter[0], `---\n${frontmatter[1]}\n${line}\n---${frontmatter[2]}`)
    }
    if (next === source) return false
    writeFileSync(abs, next)
    return true
}

const args = process.argv.slice(2)
const staged = args.includes('--staged')
let targets // [file, date][]

if (staged) {
    targets = lines(git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '--', 'app'))
        .filter((f) => PAGE_RE.test(f))
        .map((f) => [f, today()])
} else if (args.includes('--from-git')) {
    targets = lines(git('ls-files', 'app'))
        .filter((f) => PAGE_RE.test(f))
        .map((f) => [f, git('log', '-1', '--format=%cs', '--', f) || today()])
} else {
    const files = args.length
        ? args.map((f) => path.relative(ROOT, path.resolve(f)))
        : [...new Set([
            ...lines(git('diff', '--name-only', 'HEAD', '--', 'app')),
            ...lines(git('ls-files', '--others', '--exclude-standard', '--', 'app'))
        ])]
    targets = files.filter((f) => PAGE_RE.test(f) && existsSync(path.join(ROOT, f))).map((f) => [f, today()])
}

const changed = targets.filter(([file, date]) => setLastUpdated(file, date))
if (staged && changed.length) git('add', '--', ...changed.map(([file]) => file))
for (const [file, date] of changed) console.log(`${date}  ${file}`)
if (!staged || changed.length) console.log(`lastUpdated set on ${changed.length} page(s)`)
