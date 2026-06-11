from flask import Blueprint, request, jsonify
import os
import json

admin_bp = Blueprint('admin', __name__)

# ── helpers ────────────────────────────────────────────────────────────────────

def _verify_admin(req):
    token = (
        req.headers.get('X-Admin-Token', '')
        or req.headers.get('Authorization', '').replace('Bearer ', '')
    )
    secret = os.getenv('ADMIN_SECRET_KEY', '')
    return bool(token and secret and token == secret)


def _supabase():
    from supabase import create_client
    return create_client(
        os.getenv('SUPABASE_URL', ''),
        os.getenv('SUPABASE_SERVICE_KEY', '')
    )


CONFIG_DIR = os.path.dirname(__file__)

TEMPLATE_CONFIG = os.path.join(CONFIG_DIR, '..', 'template_config.json')
AI_CONFIG       = os.path.join(CONFIG_DIR, '..', 'ai_config.json')


def _read_json(path, default):
    try:
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    except Exception:
        pass
    return default


def _write_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)


DEFAULT_TEMPLATES = [
    {'id': 'travis-classic', 'name': 'Travis Classic', 'active': True,  'premium': False, 'description': 'Clean professional layout'},
    {'id': 'travis-sidebar', 'name': 'Travis Sidebar', 'active': True,  'premium': False, 'description': 'Two-column sidebar layout'},
    {'id': 'mira-modern',    'name': 'Mira Modern',    'active': True,  'premium': True,  'description': 'Bold modern design'},
    {'id': 'alex-minimal',   'name': 'Alex Minimal',   'active': True,  'premium': False, 'description': 'Clean minimalist style'},
]

DEFAULT_AI = {
    'model':        'minimax/minimax-m2.5',
    'temperature':  0.7,
    'maxTokens':    800,
    'systemPrompt': 'You are a professional resume writer with 10+ years experience.\nSTRICT RULES:\n- ONLY improve existing text professionally\n- NEVER add fake companies, achievements or experience\n- NEVER invent information not provided by user\n- Use strong action verbs\n- Make content ATS-friendly\n- Return ONLY improved text, nothing else',
    'enabled':      True,
}

# ── 11.1  Admin login ───────────────────────────────────────────────────────────

@admin_bp.route('/login', methods=['POST', 'OPTIONS'])
def admin_login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    try:
        data     = request.get_json() or {}
        email    = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        admin_email    = os.getenv('ADMIN_EMAIL', '').strip().lower()
        admin_password = os.getenv('ADMIN_PASSWORD', '').strip()
        admin_secret   = os.getenv('ADMIN_SECRET_KEY', '')

        if not admin_email or not admin_password:
            return jsonify({'success': False, 'error': 'Admin credentials not configured on server'}), 500

        if email == admin_email and password == admin_password:
            return jsonify({'success': True, 'token': admin_secret, 'admin': {'email': email}})

        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── 11.2  Dashboard stats ───────────────────────────────────────────────────────

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        sb = _supabase()

        # users
        try:
            users_resp = sb.auth.admin.list_users()
            user_count = len(users_resp) if users_resp else 0
        except Exception:
            user_count = 0

        # resumes
        try:
            res_resp   = sb.table('resumes').select('id', count='exact').execute()
            resume_cnt = res_resp.count or len(res_resp.data or [])
        except Exception:
            resume_cnt = 0

        # payments
        try:
            pay_resp      = sb.table('payments').select('amount, plan, created_at').execute()
            pay_data      = pay_resp.data or []
            total_revenue = sum(p.get('amount', 0) for p in pay_data)
            pay_count     = len(pay_data)
        except Exception:
            total_revenue = 0
            pay_count     = 0

        return jsonify({
            'success': True,
            'stats': {
                'totalUsers':    user_count,
                'totalResumes':  resume_cnt,
                'totalPayments': pay_count,
                'totalRevenue':  total_revenue,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── 11.2  User management ───────────────────────────────────────────────────────

@admin_bp.route('/users', methods=['GET'])
def get_users():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        sb    = _supabase()
        users = sb.auth.admin.list_users()
        result = []
        for u in (users or []):
            meta = u.user_metadata or {}
            result.append({
                'id':             u.id,
                'email':          u.email or '',
                'fullName':       meta.get('full_name', meta.get('name', '')),
                'provider':       (u.app_metadata or {}).get('provider', 'email'),
                'createdAt':      str(u.created_at)[:10] if u.created_at else '',
                'lastSignIn':     str(u.last_sign_in_at)[:10] if u.last_sign_in_at else '-',
                'emailConfirmed': u.email_confirmed_at is not None,
            })
        return jsonify({'success': True, 'users': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        sb = _supabase()
        sb.auth.admin.delete_user(user_id)
        return jsonify({'success': True, 'message': 'User deleted'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/users/resumes/<user_id>', methods=['GET'])
def get_user_resumes(user_id):
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        sb   = _supabase()
        res  = sb.table('resumes').select('id, title, template_id, status, created_at').eq('user_id', user_id).execute()
        return jsonify({'success': True, 'resumes': res.data or []})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── 11.3  Template management ───────────────────────────────────────────────────

@admin_bp.route('/templates', methods=['GET'])
def get_templates():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    config = _read_json(TEMPLATE_CONFIG, {'templates': DEFAULT_TEMPLATES})
    return jsonify({'success': True, 'templates': config.get('templates', DEFAULT_TEMPLATES)})


@admin_bp.route('/templates', methods=['PUT'])
def update_templates():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        data      = request.get_json() or {}
        templates = data.get('templates', [])
        _write_json(TEMPLATE_CONFIG, {'templates': templates})
        return jsonify({'success': True, 'templates': templates})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── 11.4  AI configuration management ──────────────────────────────────────────

@admin_bp.route('/ai-config', methods=['GET'])
def get_ai_config():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    config = _read_json(AI_CONFIG, DEFAULT_AI)
    return jsonify({'success': True, 'config': config})


@admin_bp.route('/ai-config', methods=['PUT'])
def update_ai_config():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        data = request.get_json() or {}
        _write_json(AI_CONFIG, data)
        return jsonify({'success': True, 'config': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── 11.5  Payment reports ───────────────────────────────────────────────────────

@admin_bp.route('/payments', methods=['GET'])
def get_payments():
    if not _verify_admin(request):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401
    try:
        sb   = _supabase()
        res  = sb.table('payments').select('*').order('created_at', desc=True).execute()
        data = res.data or []

        # aggregate by plan
        plan_totals = {}
        for p in data:
            plan = p.get('plan', 'unknown')
            plan_totals[plan] = plan_totals.get(plan, 0) + p.get('amount', 0)

        total_revenue = sum(p.get('amount', 0) for p in data)

        return jsonify({
            'success':      True,
            'payments':     data,
            'summary': {
                'totalRevenue':     total_revenue,
                'totalCount':       len(data),
                'byPlan':           plan_totals,
                'avgTransaction':   round(total_revenue / len(data), 2) if data else 0,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
