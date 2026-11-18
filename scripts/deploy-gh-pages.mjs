/**
 * Builds the app for GitHub Pages and publishes the dist/ folder
 * to the gh-pages branch at https://ikechuwkwu11.github.io/TicketMaster/
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, VITE_BASE: '/TicketMaster/' },
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('npx', ['cross-env', 'VITE_BASE=/TicketMaster/', 'vite', 'build'])
run('npx', ['gh-pages', '-d', 'dist', '-b', 'gh-pages'])
console.log('\nLive URL: https://ikechuwkwu11.github.io/TicketMaster/\n')
