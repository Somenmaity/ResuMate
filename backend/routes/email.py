from flask import Blueprint, request, jsonify
import requests
import os

email_bp = Blueprint('email', __name__)

@email_bp.route('/send-resume', methods=['POST'])
def send_resume_email():
    try:
        data = request.get_json()
        to_email = data.get('toEmail')
        to_name = data.get('toName')
        payment_id = data.get('paymentId')
        amount = data.get('amount')
        download_link = data.get('downloadLink')

        service_id = os.getenv('EMAILJS_SERVICE_ID')
        template_id = os.getenv('EMAILJS_TEMPLATE_ID')
        public_key = os.getenv('EMAILJS_PUBLIC_KEY')

        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json={
                'service_id': service_id,
                'template_id': template_id,
                'user_id': public_key,
                'template_params': {
                    'to_email': to_email,
                    'to_name': to_name,
                    'payment_id': payment_id,
                    'amount': amount,
                    'download_link': download_link
                }
            }
        )

        if response.status_code == 200:
            return jsonify({'success': True, 'message': 'Email sent!'})
        else:
            return jsonify({'success': False, 'error': 'Email failed'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
