from flask import Blueprint, request, jsonify
from supabase import create_client
import os

resume_bp = Blueprint('resume', __name__)

_supabase = None

def get_supabase():
    global _supabase
    if _supabase is None:
        _supabase = create_client(
            os.getenv('SUPABASE_URL', ''),
            os.getenv('SUPABASE_SERVICE_KEY', '')
        )
    return _supabase

def get_user_from_token(token):
    try:
        user = get_supabase().auth.get_user(token)
        return user.user
    except:
        return None

@resume_bp.route('/save', methods=['POST'])
def save_resume():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user = get_user_from_token(token)
        if not user:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401

        data = request.get_json()
        resume_data = data.get('resumeData', {})
        resume_id = data.get('resumeId')
        template_id = data.get('templateId', 'travis-classic')

        payload = {
            'user_id': user.id,
            'title': resume_data.get('personalInfo', {}).get('fullName', 'My Resume') + "'s Resume",
            'template_id': template_id,
            'personal_info': resume_data.get('personalInfo', {}),
            'summary': resume_data.get('summary', ''),
            'experience': resume_data.get('experience', []),
            'education': resume_data.get('education', []),
            'skills': resume_data.get('skills', []),
            'projects': resume_data.get('projects', []),
            'certifications': resume_data.get('certifications', []),
            'languages': resume_data.get('languages', []),
            'status': 'draft'
        }

        if resume_id:
            result = get_supabase().table('resumes').update(payload).eq('id', resume_id).eq('user_id', user.id).execute()
            resume = result.data[0] if result.data else None
        else:
            result = get_supabase().table('resumes').insert(payload).execute()
            resume = result.data[0] if result.data else None

        if not resume:
            return jsonify({'success': False, 'error': 'Save failed'}), 500

        return jsonify({
            'success': True,
            'resumeId': resume['id'],
            'resume': resume
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@resume_bp.route('/list', methods=['GET'])
def get_resumes():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user = get_user_from_token(token)
        if not user:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401

        result = get_supabase().table('resumes').select('*').eq('user_id', user.id).order('updated_at', desc=True).execute()

        return jsonify({
            'success': True,
            'resumes': result.data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@resume_bp.route('/<resume_id>', methods=['GET'])
def get_resume(resume_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user = get_user_from_token(token)
        if not user:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401

        result = get_supabase().table('resumes').select('*').eq('id', resume_id).eq('user_id', user.id).single().execute()

        return jsonify({
            'success': True,
            'resume': result.data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@resume_bp.route('/delete/<resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user = get_user_from_token(token)
        if not user:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401

        get_supabase().table('resumes').delete().eq('id', resume_id).eq('user_id', user.id).execute()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
