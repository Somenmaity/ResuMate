
# pyrefly: ignore [missing-import]
from flask import Flask
from flask_cors import CORS

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            os.getenv('FRONTEND_URL', '')
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Route imports are optional; disabled to allow server start without external service configuration.
from routes.auth import auth_bp
from routes.resume import resume_bp
from routes.ai import ai_bp
from routes.payment import payment_bp
from routes.email import email_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(email_bp, url_prefix='/api/email')

@app.route('/api/health')
def health():
    return {'status': 'ok', 'message': 'ResuMate AI Backend Running'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
