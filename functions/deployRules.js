const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')
const https = require('https')

const projectId = 'medmitra-46913'
const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

let accessToken = ''

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const req = https.request(
      {
        hostname: 'firebaserules.googleapis.com',
        path: urlPath,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = ''
        res.on('data', (c) => (raw += c))
        res.on('end', () => {
          const parsed = raw ? JSON.parse(raw) : {}
          if (res.statusCode >= 400) reject(new Error(parsed.error?.message || raw))
          else resolve(parsed)
        })
      }
    )
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function deployRules(label, rulesFile, releaseName) {
  const source = fs.readFileSync(path.join(__dirname, '..', rulesFile), 'utf8')
  const ruleset = await apiRequest('POST', `/v1/projects/${projectId}/rulesets`, {
    source: { files: [{ name: rulesFile, content: source }] },
  })
  await apiRequest('POST', `/v1/projects/${projectId}/releases`, {
    name: `projects/${projectId}/releases/${releaseName}`,
    rulesetName: ruleset.name,
  })
  console.log(`Deployed ${label} rules`)
}

async function main() {
  const token = await admin.credential.cert(serviceAccount).getAccessToken()
  accessToken = token.access_token
  await deployRules('Firestore', 'firestore.rules', 'cloud.firestore')
  await deployRules('Storage', 'storage.rules', 'firebase.storage')
}

main().catch((err) => {
  console.error('Rules deploy failed:', err.message)
  process.exit(1)
})
