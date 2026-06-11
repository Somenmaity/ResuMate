from flask import Blueprint, request, jsonify
import os
import hmac
import hashlib
import requests as http_requests

webhook_bp = Blueprint('webhook', __name__)

# ── signature verification ─────────────────────────────────────────────────────

def _verify_signature(req) -> bool:
    """
    Supabase sends the webhook secret in the x-webhook-secret header.
    If SUPABASE_WEBHOOK_SECRET is not set we skip verification (dev mode).
    """
    secret = os.getenv('SUPABASE_WEBHOOK_SECRET', '').strip()
    if not secret:
        print('[WEBHOOK] Warning: SUPABASE_WEBHOOK_SECRET not set — skipping verification')
        return True
    incoming = req.headers.get('x-webhook-secret', '')
    return hmac.compare_digest(secret, incoming)


# ── email helper ───────────────────────────────────────────────────────────────

def _send_email(to_email: str, to_name: str, template_params: dict) -> bool:
    service_id  = os.getenv('VITE_EMAILJS_SERVICE_ID', os.getenv('EMAILJS_SERVICE_ID', ''))
    template_id = os.getenv('VITE_EMAILJS_TEMPLATE_ID', os.getenv('EMAILJS_TEMPLATE_ID', ''))
    public_key  = os.getenv('VITE_EMAILJS_PUBLIC_KEY',  os.getenv('EMAILJS_PUBLIC_KEY', ''))

    if not service_id or not template_id or not public_key:
        print('[WEBHOOK] EmailJS keys not configured — email skipped')
        return False

    try:
        resp = http_requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json={
                'service_id':      service_id,
                'template_id':     template_id,
                'user_id':         public_key,
                'template_params': {
                    'to_email': to_email,
                    'to_name':  to_name,
                    **template_params,
                },
            },
            timeout=10,
        )
        ok = resp.status_code == 200
        print(f'[WEBHOOK] Email {"sent OK" if ok else "FAILED"} to {to_email}')
        return ok
    except Exception as e:
        print(f'[WEBHOOK] Email exception: {e}')
        return False


# ── /api/webhooks/payment ──────────────────────────────────────────────────────
# Supabase config:  Table = payments  |  Event = INSERT

@webhook_bp.route('/payment', methods=['POST'])
def payment_webhook():
    if not _verify_signature(request):
        print('[WEBHOOK] payment — invalid signature')
        return jsonify({'success': False, 'error': 'Invalid webhook secret'}), 401

    payload = request.get_json(silent=True) or {}
    event   = payload.get('type', '')       # INSERT / UPDATE / DELETE
    record  = payload.get('record', {})

    print(f'[WEBHOOK] payment event={event}  record={record}')

    if event != 'INSERT':
        return jsonify({'success': True, 'message': f'Event {event} ignored'}), 200

    name        = record.get('customer_name',  'Valued User')
    email       = record.get('customer_email', '')
    amount      = record.get('amount',         0)
    plan        = record.get('plan',           'resume')
    payment_id  = record.get('gateway_payment_id', 'N/A')
    currency    = record.get('currency',       'INR')

    plan_labels = {'resume': 'Resume Download', 'cover_letter': 'Cover Letter', 'bundle': 'Resume + Cover Letter Bundle'}
    plan_label  = plan_labels.get(plan, plan.replace('_', ' ').title())

    if email:
        _send_email(
            to_email=email,
            to_name=name,
            template_params={
                'payment_id':    payment_id,
                'amount':        f'INR {amount}',
                'plan':          plan_label,
                'download_link': f'{os.getenv("FRONTEND_URL", "http://localhost:5173")}/download',
            },
        )

    return jsonify({'success': True, 'message': 'Payment webhook processed'})


# ── /api/webhooks/resume ───────────────────────────────────────────────────────
# Supabase config:  Table = resumes  |  Event = UPDATE

@webhook_bp.route('/resume', methods=['POST'])
def resume_webhook():
    if not _verify_signature(request):
        print('[WEBHOOK] resume — invalid signature')
        return jsonify({'success': False, 'error': 'Invalid webhook secret'}), 401

    payload    = request.get_json(silent=True) or {}
    event      = payload.get('type', '')
    record     = payload.get('record', {})
    old_record = payload.get('old_record', {})

    print(f'[WEBHOOK] resume event={event}  id={record.get("id")}')

    if event != 'UPDATE':
        return jsonify({'success': True, 'message': f'Event {event} ignored'}), 200

    # Only act when is_paid just changed to True
    just_paid = record.get('is_paid') is True and not (old_record or {}).get('is_paid')

    if just_paid:
        resume_id = record.get('id', '')
        user_id   = record.get('user_id', '')
        title     = record.get('title', 'Resume')
        print(f'[WEBHOOK] Resume {resume_id} marked as paid — user={user_id} title="{title}"')
        # Future: trigger PDF generation, notify user, etc.

    return jsonify({'success': True, 'message': 'Resume webhook processed'})


# ── /api/webhooks/user ─────────────────────────────────────────────────────────
# Supabase config:  Table = auth.users  |  Event = INSERT  (new user signup)

@webhook_bp.route('/user', methods=['POST'])
def user_webhook():
    if not _verify_signature(request):
        print('[WEBHOOK] user — invalid signature')
        return jsonify({'success': False, 'error': 'Invalid webhook secret'}), 401

    payload = request.get_json(silent=True) or {}
    event   = payload.get('type', '')
    record  = payload.get('record', {})

    print(f'[WEBHOOK] user event={event}  email={record.get("email")}')

    if event != 'INSERT':
        return jsonify({'success': True, 'message': f'Event {event} ignored'}), 200

    email    = record.get('email', '')
    metadata = record.get('raw_user_meta_data') or {}
    name     = metadata.get('full_name') or metadata.get('name') or email.split('@')[0].title()

    if email:
        _send_email(
            to_email=email,
            to_name=name,
            template_params={
                'payment_id':    'WELCOME',
                'amount':        '—',
                'plan':          'Account Created',
                'download_link': f'{os.getenv("FRONTEND_URL", "http://localhost:5173")}/jd',
            },
        )

    return jsonify({'success': True, 'message': 'User webhook processed'})
