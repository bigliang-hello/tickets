import CryptoJS from 'crypto-js'

function sha256(message: string) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

function hmacSha256(key: CryptoJS.lib.WordArray | string, message: string) {
  return CryptoJS.HmacSHA256(message, key)
}

function getDate(ts: number) {
  const d = new Date(ts * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function buildTC3Headers(service: string, action: string, version: string, region: string, payload: any, secretId: string, secretKey: string) {
  const timestamp = Math.floor(Date.now() / 1000)
  const date = getDate(timestamp)
  const host = `${service}.tencentcloudapi.com`
  const httpRequestMethod = 'POST'
  const canonicalUri = '/'
  const canonicalQueryString = ''
  const contentType = 'application/json; charset=utf-8'
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`
  const signedHeaders = 'content-type;host'
  const hashedRequestPayload = sha256(JSON.stringify(payload))
  const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`
  const algorithm = 'TC3-HMAC-SHA256'
  const credentialScope = `${date}/${service}/tc3_request`
  const hashedCanonicalRequest = sha256(canonicalRequest)
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`
  const kDate = hmacSha256(CryptoJS.enc.Utf8.parse('TC3' + secretKey), date)
  const kService = hmacSha256(kDate, service)
  const kSigning = hmacSha256(kService, 'tc3_request')
  const signature = hmacSha256(kSigning, stringToSign).toString(CryptoJS.enc.Hex)
  const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  return { timestamp, host, contentType, authorization, action, version, region }
}