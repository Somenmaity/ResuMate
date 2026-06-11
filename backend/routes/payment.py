from flask import Blueprint, request, jsonify
import os
import hmac
import hashlib
import requests as http_requests
from requests.auth import HTTPBasicAuth

payment_bp = Blueprint('payment', __name__)


def get_razorpay_keys():
    key_id     = os.getenv('RAZORPAY_KEY_ID', '').strip()
    key_secret = os.getenv('RAZORPAY_KEY_SECRET', '').strip()
    return key_id, key_secret


@payment_bp.route('/create-order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        key_id, key_secret = get_razorpay_keys()

        if not key_id or not key_secret:
            return jsonify({'success': False, 'error': 'Razorpay keys not configured in .env'}), 500

        data   = request.get_json() or {}
        amount = int(data.get('amount', 99))
        plan   = data.get('plan', 'resume')

        # Direct Razorpay REST API — no SDK needed
        resp = http_requests.post(
            'https://api.razorpay.com/v1/orders',
            auth=HTTPBasicAuth(key_id, key_secret),
            json={
                'amount':          amount * 100,   # paise
                'currency':        'INR',
                'payment_capture': 1,
                'notes': {'plan': plan}
            },
            timeout=10
        )

        if resp.status_code != 200:
            err = resp.json().get('error', {})
            print(f'RAZORPAY ERROR: {resp.status_code} — {err}')
            return jsonify({
                'success': False,
                'error':   err.get('description', 'Razorpay order creation failed'),
                'code':    err.get('code', ''),
            }), 500

        order = resp.json()
        print(f'ORDER CREATED: {order["id"]} | ₹{amount}')

        return jsonify({
            'success':  True,
            'orderId':  order['id'],
            'amount':   order['amount'],
            'currency': order['currency'],
            'key':      key_id,
        })

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/verify', methods=['POST', 'OPTIONS'])
def verify_payment():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json() or {}

        payment_id = str(data.get('razorpay_payment_id', ''))
        order_id   = str(data.get('razorpay_order_id', ''))
        signature  = str(data.get('razorpay_signature', ''))
        amount     = int(data.get('amount', 99))
        plan       = str(data.get('plan', 'resume'))
        name       = str(data.get('name', ''))
        email      = str(data.get('email', ''))
        phone      = str(data.get('phone', ''))
        user_id    = data.get('userId')
        resume_id  = data.get('resumeId')

        # ── Verify signature ──────────────────────────────
        _, key_secret = get_razorpay_keys()

        if payment_id and order_id and signature and key_secret:
            message  = f"{order_id}|{payment_id}"
            expected = hmac.new(
                key_secret.encode('utf-8'),
                message.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            if expected != signature:
                print(f'SIGNATURE MISMATCH! expected={expected} got={signature}')
                return jsonify({'success': False, 'error': 'Invalid payment signature'}), 400

            print('Signature OK ✓')

        # ── Save to Supabase ──────────────────────────────
        try:
            from supabase import create_client
            supabase_url = os.getenv('SUPABASE_URL', '')
            supabase_key = os.getenv('SUPABASE_SERVICE_KEY', '')

            if supabase_url and supabase_key:
                supabase = create_client(supabase_url, supabase_key)

                payload = {
                    'amount':             amount,
                    'currency':           'INR',
                    'plan':               plan,
                    'gateway':            'razorpay',
                    'gateway_payment_id': payment_id,
                    'gateway_order_id':   order_id,
                    'customer_name':      name,
                    'customer_email':     email,
                    'customer_phone':     phone,
                    'status':             'success',
                }
                if user_id:  payload['user_id']  = str(user_id)
                if resume_id: payload['resume_id'] = str(resume_id)

                supabase.table('payments').insert(payload).execute()
                print(f'Payment saved ✓  plan={plan}  amount=₹{amount}')

                if resume_id:
                    supabase.table('resumes').update(
                        {'is_paid': True, 'status': 'completed'}
                    ).eq('id', str(resume_id)).execute()

        except Exception as db_err:
            print(f'DB save failed (non-fatal): {db_err}')

        return jsonify({'success': True, 'paymentId': payment_id, 'message': 'Payment verified'})

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
