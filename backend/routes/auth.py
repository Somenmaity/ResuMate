# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
# pyrefly: ignore [missing-import]
from supabase import create_client
import os

auth_bp = Blueprint('auth', __name__)

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY')
)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')

        if not email or not password:
            return jsonify({
                'success': False,
                'error': 'Email and password required'
            }), 400

        response = supabase.auth.admin.create_user({
            'email': email,
            'password': password,
            'user_metadata': {'full_name': full_name},
            'email_confirm': True
        })

        return jsonify({
            'success': True,
            'user': {
                'id': response.user.id,
                'email': response.user.email,
                'fullName': full_name
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        response = supabase.auth.sign_in_with_password({
            'email': email,
            'password': password
        })

        return jsonify({
            'success': True,
            'user': {
                'id': response.user.id,
                'email': response.user.email,
                'fullName': response.user.user_metadata.get('full_name', '')
            },
            'session': {
                'access_token': response.session.access_token,
                'refresh_token': response.session.refresh_token
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Invalid email or password'
        }), 401

@auth_bp.route('/signout', methods=['POST'])
def signout():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        supabase.auth.sign_out()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@auth_bp.route('/user', methods=['GET'])
def get_user():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'success': False, 'error': 'No token'}), 401

        user = supabase.auth.get_user(token)
        return jsonify({
            'success': True,
            'user': {
                'id': user.user.id,
                'email': user.user.email,
                'fullName': user.user.user_metadata.get('full_name', '')
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 401
