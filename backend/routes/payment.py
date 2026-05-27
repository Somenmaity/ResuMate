# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
import os
import hmac
import hashlib

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/create-order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        # pyrefly: ignore [missing-import]
        import razorpay
        
        key_id = os.getenv('RAZORPAY_KEY_ID', '')
        key_secret = os.getenv('RAZORPAY_KEY_SECRET', '')
        
        if not key_id or not key_secret:
            return jsonify({
                'success': False,
                'error': 'Razorpay keys not configured'
            }), 500

        client = razorpay.Client(auth=(key_id, key_secret))

        data = request.get_json() or {}
        amount = int(data.get('amount', 199))
        plan = data.get('plan', 'basic')

        order = client.order.create({
            'amount': amount * 100,
            'currency': 'INR',
            'payment_capture': 1
        })

        return jsonify({
            'success': True,
            'orderId': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key': key_id
        })

    except Exception as e:
        print(f'CREATE ORDER ERROR: {str(e)}')
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@payment_bp.route('/verify', methods=['POST', 'OPTIONS'])
def verify_payment():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json() or {}
        print(f'VERIFY DATA RECEIVED: {data}')

        payment_id  = str(data.get('razorpay_payment_id', ''))
        order_id    = str(data.get('razorpay_order_id', ''))
        signature   = str(data.get('razorpay_signature', ''))
        amount      = int(data.get('amount', 199))
        plan        = str(data.get('plan', 'basic'))
        name        = str(data.get('name', ''))
        email       = str(data.get('email', ''))
        phone       = str(data.get('phone', ''))
        user_id     = data.get('userId')
        resume_id   = data.get('resumeId')

        # Signature verify
        key_secret = os.getenv('RAZORPAY_KEY_SECRET', '')
        
        if payment_id and order_id and signature and key_secret:
            message = f"{order_id}|{payment_id}"
            expected = hmac.new(
                key_secret.encode('utf-8'),
                message.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            if expected != signature:
                print(f'SIGNATURE MISMATCH!')
                return jsonify({
                    'success': False,
                    'error': 'Invalid payment signature'
                }), 400
            
            print('Signature verified OK')

        # Save to Supabase
        try:
            # pyrefly: ignore [missing-import]
            from supabase import create_client
            
            supabase_url = os.getenv('SUPABASE_URL', '')
            supabase_key = os.getenv('SUPABASE_SERVICE_KEY', '')
            
            if supabase_url and supabase_key:
                supabase = create_client(supabase_url, supabase_key)

                payment_payload = {
                    'amount': amount,
                    'currency': 'INR',
                    'plan': plan,
                    'gateway': 'razorpay',
                    'gateway_payment_id': payment_id,
                    'gateway_order_id': order_id,
                    'customer_name': name,
                    'customer_email': email,
                    'customer_phone': phone,
                    'status': 'success'
                }

                if user_id:
                    payment_payload['user_id'] = str(user_id)
                if resume_id:
                    payment_payload['resume_id'] = str(resume_id)

                result = supabase.table('payments').insert(
                    payment_payload
                ).execute()
                print(f'Payment saved to DB: {result.data}')

                if resume_id:
                    supabase.table('resumes').update({
                        'is_paid': True,
                        'status': 'completed'
                    }).eq('id', str(resume_id)).execute()
                    print('Resume marked as paid')
            else:
                print('Supabase not configured - skipping DB save')

        except Exception as db_err:
            print(f'DB ERROR (non-fatal): {str(db_err)}')
            import traceback
            traceback.print_exc()

        return jsonify({
            'success': True,
            'paymentId': payment_id,
            'message': 'Payment verified successfully'
        })

    except Exception as e:
        print(f'VERIFY ERROR: {str(e)}')
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500