const { spawnSync } = require('child_process')
const { existsSync } = require('fs')
const { join } = require('path')

const serviceAccountKey = join(
  __dirname,
  '..',
  '..',
  'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json'
)
if (existsSync(serviceAccountKey) && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountKey
}

const candidates = [
  join(__dirname, '..', 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js'),
  join(process.env.APPDATA || '', 'npm', 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js'),
]

const firebaseJs = candidates.find(existsSync)
if (!firebaseJs) {
  console.error('firebase-tools not found. Run: npm install -D firebase-tools')
  process.exit(1)
}

const result = spawnSync(process.execPath, [firebaseJs, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: false,
})

process.exit(result.status ?? 1)
