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

var tr = dnsList.result.filter((a) => a.name == '_acme-challenge.' + CERTBOT_DOMAIN)[0]
if (tr == null) {
  console.log('Domain %O challenge record not found...', CERTBOT_DOMAIN)
  process.exit(1)
}
if (tr.id == null) throw new Error('Could not retrieve required information')

console.log('Found challenge record for domain %O, starting deletion...', CERTBOT_DOMAIN)
await cloudflare.dns.records.delete(tr.id, {
  zone_id: CLOUDFLARE_ZONE_ID,
  body: null,
})
console.log('Deletion successful')

process.exit(0)
