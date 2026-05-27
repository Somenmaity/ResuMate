# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
import requests
import os

ai_bp = Blueprint('ai', __name__)

OPENROUTER_KEY = os.getenv('OPENROUTER_API_KEY')
MODEL = 'minimax/minimax-m2.5'

SYSTEM_PROMPT = """You are a professional resume writer with 10+ years experience.
STRICT RULES:
- ONLY improve existing text professionally
- NEVER add fake companies, achievements or experience
- NEVER invent information not provided by user
- Use strong action verbs
- Make content ATS-friendly
- Return ONLY improved text, nothing else"""

def call_openrouter(messages, max_tokens=800):
    response = requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {OPENROUTER_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://resumate-ai.com',
            'X-Title': 'ResuMate AI'
        },
        json={
            'model': MODEL,
            'messages': messages,
            'max_tokens': max_tokens,
            'temperature': 0.7
        }
    )
    data = response.json()
    return data['choices'][0]['message']['content'].strip()

@ai_bp.route('/enhance', methods=['POST'])
def enhance_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        section = data.get('section', 'content')

        if not text or len(text.strip()) < 5:
            return jsonify({
                'success': False,
                'error': 'Text too short'
            }), 400

        enhanced = call_openrouter([
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': f'Improve this {section} professionally. Return only improved text:\n\n{text}'}
        ])

        return jsonify({
            'success': True,
            'original': text,
            'enhanced': enhanced
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/enhance-full', methods=['POST'])
def enhance_full_resume():
    try:
        data = request.get_json()
        resume_data = data.get('resumeData', {})
        enhanced_data = dict(resume_data)

        # Enhance summary
        if resume_data.get('summary') and len(resume_data['summary'].strip()) > 10:
            enhanced_data['summary'] = call_openrouter([
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': f'Improve this professional summary:\n\n{resume_data["summary"]}'}
            ])

        # Enhance experience
        if resume_data.get('experience'):
            enhanced_experience = []
            for exp in resume_data['experience']:
                if exp.get('description') and len(exp['description'].strip()) > 10:
                    enhanced_desc = call_openrouter([
                        {'role': 'system', 'content': SYSTEM_PROMPT},
                        {'role': 'user', 'content': f'Improve this work experience description:\n\n{exp["description"]}'}
                    ])
                    enhanced_experience.append({**exp, 'description': enhanced_desc})
                else:
                    enhanced_experience.append(exp)
            enhanced_data['experience'] = enhanced_experience

        # Enhance projects
        if resume_data.get('projects'):
            enhanced_projects = []
            for proj in resume_data['projects']:
                if proj.get('description') and len(proj['description'].strip()) > 10:
                    enhanced_desc = call_openrouter([
                        {'role': 'system', 'content': SYSTEM_PROMPT},
                        {'role': 'user', 'content': f'Improve this project description:\n\n{proj["description"]}'}
                    ])
                    enhanced_projects.append({**proj, 'description': enhanced_desc})
                else:
                    enhanced_projects.append(proj)
            enhanced_data['projects'] = enhanced_projects

        return jsonify({
            'success': True,
            'enhancedData': enhanced_data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/analyze-jd', methods=['POST'])
def analyze_jd():
    try:
        data = request.get_json()
        jd_text = data.get('jdText', '')
        resume_text = data.get('resumeText', '')

        if not jd_text:
            return jsonify({'success': False, 'error': 'JD text required'}), 400

        if resume_text:
            prompt = f"""Optimize existing resume for this job description.
JD: {jd_text[:1500]}
RESUME: {resume_text[:1500]}
Return ONLY valid JSON with optimized resume data:
{{
  "personalInfo": {{"fullName": "", "title": "role from JD", "email": "", "phone": "", "location": "", "linkedin": ""}},
  "summary": "optimized summary for JD",
  "experience": [{{"id": 1, "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "rewritten for JD keywords"}}],
  "education": [{{"id": 1, "degree": "", "institution": "", "year": "", "grade": ""}}],
  "skills": ["skill1", "skill2"],
  "projects": [],
  "certifications": [],
  "languages": []
}}"""
        else:
            prompt = f"""Analyze JD and create resume structure.
JD: {jd_text[:1500]}
Return ONLY valid JSON:
{{
  "personalInfo": {{"fullName": "Your Full Name", "title": "exact role from JD", "email": "your@email.com", "phone": "+91 98765 43210", "location": "City, India", "linkedin": ""}},
  "summary": "tailored summary for this role",
  "experience": [{{"id": 1, "jobTitle": "relevant role", "company": "Previous Company", "location": "City", "startDate": "Jan 2021", "endDate": "Dec 2023", "current": false, "description": "relevant experience"}}],
  "education": [{{"id": 1, "degree": "relevant degree", "institution": "University", "year": "2020", "grade": ""}}],
  "skills": ["top skills from JD"],
  "projects": [{{"id": 1, "projectName": "Relevant Project", "description": "project details", "techStack": "technologies", "projectUrl": ""}}],
  "certifications": [],
  "languages": [{{"id": 1, "language": "English", "proficiency": "Fluent"}}]
}}"""

        result = call_openrouter(
            [{'role': 'user', 'content': prompt}],
            max_tokens=2000
        )

        import json
        clean = result.replace('```json', '').replace('```', '').strip()
        resume_data = json.loads(clean)

        return jsonify({
            'success': True,
            'resumeData': resume_data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/detect-jd-info', methods=['POST'])
def detect_jd_info():
    try:
        data = request.get_json()
        jd_text = data.get('jdText', '')

        result = call_openrouter([
            {'role': 'system', 'content': 'Extract info from JD. Return ONLY valid JSON.'},
            {'role': 'user', 'content': f'''Extract from JD:
{{
  "jobTitle": "detected title",
  "company": "company or Unknown",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "X years",
  "keyResponsibilities": ["resp1", "resp2"]
}}
JD: {jd_text[:1500]}'''}
        ], max_tokens=400)

        import json
        clean = result.replace('```json', '').replace('```', '').strip()
        info = json.loads(clean)

        return jsonify({'success': True, 'info': info})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
