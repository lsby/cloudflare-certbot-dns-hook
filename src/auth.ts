#!/usr/bin/env node
import Cloudflare from 'cloudflare'
import dotenv from 'dotenv'

console.log('Start running...')

dotenv.config()

const CLOUDFLARE_API_TOKEN = process.env['CLOUDFLARE_API_TOKEN']
const CERTBOT_DOMAIN = process.env['CERTBOT_DOMAIN']
const CERTBOT_VALIDATION = process.env['CERTBOT_VALIDATION']
const CLOUDFLARE_ZONE_ID = process.env['CLOUDFLARE_ZONE_ID']!

if (!CLOUDFLARE_API_TOKEN || !CERTBOT_DOMAIN || !CERTBOT_VALIDATION || !CLOUDFLARE_ZONE_ID) {
  console.log(
    'Necessary environment variables not provided: CLOUDFLARE_API_TOKEN, CERTBOT_DOMAIN, CERTBOT_VALIDATION, CLOUDFLARE_ZONE_ID',
  )
  process.exit(1)
}

const cloudflare = new Cloudflare({ apiToken: CLOUDFLARE_API_TOKEN })

console.log('Querying DNS record list...')
const dnsList = await cloudflare.dns.records.list({ zone_id: CLOUDFLARE_ZONE_ID })

var tr = dnsList.result.filter((a) => a.name == CERTBOT_DOMAIN)[0]
if (tr == null) {
  console.log('Domain %O not found...', CERTBOT_DOMAIN)
  process.exit(1)
}

console.log('Domain %O found, adding challenge record...', CERTBOT_DOMAIN)
await cloudflare.dns.records.create({
  zone_id: CLOUDFLARE_ZONE_ID,
  content: CERTBOT_VALIDATION,
  name: '_acme-challenge.' + CERTBOT_DOMAIN,
  type: 'TXT',
})
console.log('Successfully added')

console.log('Wait for a minute for DNS propagation....')
await new Promise((res, _rej) => {
  setTimeout(() => {
    res(null)
  }, 60 * 1000)
})

process.exit(0)
