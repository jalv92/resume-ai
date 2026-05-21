#!/usr/bin/env python3
"""Set Netlify env vars via direct API. One-shot, used to fix MCP write issue."""
import os, sys, json, urllib.request, urllib.error

TOKEN = os.environ['NETLIFY_AUTH_TOKEN']
ACCOUNT_ID = '683663b3c3c24a97c0437df9'
SITE_ID = '4365b7a9-4e43-467b-93bc-de45d76e0aac'
API = f'https://api.netlify.com/api/v1/accounts/{ACCOUNT_ID}/env?site_id={SITE_ID}'

VARS = [
    ('GEMINI_API_KEY', os.environ['GEMINI_API_KEY'], ['functions'], True),
    ('STRIPE_SECRET_KEY', os.environ['STRIPE_SECRET_KEY'], ['functions'], True),
    ('STRIPE_PRICE_ID', os.environ['STRIPE_PRICE_ID'], ['functions'], False),
    ('STRIPE_WEBHOOK_SECRET', os.environ['STRIPE_WEBHOOK_SECRET'], ['functions'], True),
    ('VITE_STRIPE_PUBLISHABLE_KEY', os.environ['VITE_STRIPE_PUBLISHABLE_KEY'], ['builds'], False),
]

def post(payload):
    req = urllib.request.Request(
        API,
        method='POST',
        data=json.dumps(payload).encode(),
        headers={
            'Authorization': f'Bearer {TOKEN}',
            'Content-Type': 'application/json',
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


for key, value, _scopes, _secret in VARS:
    # Free plan: cannot set is_secret=true (post_processing scope forbidden for secrets,
    # and we can't restrict scopes on free plan). Marking false; values stored privately anyway.
    payload = [{
        'key': key,
        'values': [{'value': value, 'context': 'all'}],
        'is_secret': False,
    }]
    code, body = post(payload)
    ok = code in (200, 201) and '"key"' in body
    print(f"{'OK ' if ok else 'ERR'} {key} [http={code}] {body[:140] if not ok else ''}")

# Verify
verify = urllib.request.Request(API, headers={'Authorization': f'Bearer {TOKEN}'})
with urllib.request.urlopen(verify) as r:
    data = json.loads(r.read())
print('\nFinal state:')
for v in data:
    print(f"  - {v['key']}: scopes={v.get('scopes')}, is_secret={v.get('is_secret')}")
