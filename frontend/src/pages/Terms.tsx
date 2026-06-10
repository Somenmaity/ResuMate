import React from 'react'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f9fafb',
      padding: '40px 20px', fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4F46E5', fontSize: '14px', fontWeight: '600',
              marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0
            }}
          >
            ← Back
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'
          }}>
            <div style={{
              width: '40px', height: '40px', backgroundColor: '#4F46E5',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '900'
            }}>R</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 }}>
              ResuMate AI
            </h1>
          </div>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Last updated: June 2026
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden'
        }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{
              padding: '16px 28px', fontSize: '14px', fontWeight: '700',
              color: '#4F46E5', borderBottom: '2px solid #4F46E5', cursor: 'default'
            }}>Terms of Service</div>
            <div style={{
              padding: '16px 28px', fontSize: '14px', fontWeight: '600',
              color: '#9ca3af', cursor: 'default'
            }}>Privacy Policy</div>
          </div>

          <div style={{ padding: '36px 40px', lineHeight: '1.8' }}>

            {/* Terms of Service */}
            <Section title="1. Acceptance of Terms">
              By accessing or using ResuMate AI ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </Section>

            <Section title="2. Description of Service">
              ResuMate AI is an AI-powered resume builder that helps users create, enhance, and download
              professional resumes. The Service includes AI-assisted content suggestions, multiple resume
              templates, and PDF/DOCX export functionality.
            </Section>

            <Section title="3. User Accounts">
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must be at least 13 years old to use this Service.</li>
                <li>One person may not maintain more than one free account.</li>
              </ul>
            </Section>

            <Section title="4. User Data & Content">
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>You retain full ownership of the resume content you create.</li>
                <li>We store your resume data to enable saving and editing across sessions.</li>
                <li>We do not sell your personal data to third parties.</li>
                <li>AI enhancement features send your resume content to third-party AI APIs (OpenRouter/Gemini) solely for processing your request.</li>
              </ul>
            </Section>

            <Section title="5. Payment & Subscriptions">
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>Some features require a paid subscription or one-time payment.</li>
                <li>Payments are processed securely via Razorpay.</li>
                <li>All fees are non-refundable unless required by applicable law.</li>
                <li>We reserve the right to modify pricing with 30 days notice.</li>
              </ul>
            </Section>

            <Section title="6. Prohibited Uses">
              You may not use the Service to:
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>Create fraudulent resumes or misrepresent your qualifications</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse-engineer or extract the AI models we use</li>
                <li>Scrape or automate access to the Service without permission</li>
              </ul>
            </Section>

            <Section title="7. Intellectual Property">
              The ResuMate AI platform, including its design, code, and AI features, is the intellectual
              property of ResuMate AI. The resume content you create belongs to you. Our templates are
              licensed to you for personal use; commercial redistribution of templates is not permitted.
            </Section>

            <Section title="8. Disclaimers">
              The Service is provided "as is." We make no warranties about job placement outcomes.
              AI-generated suggestions should be reviewed by you before use. We are not responsible
              for decisions made by employers based on resumes created using this Service.
            </Section>

            <Section title="9. Limitation of Liability">
              To the maximum extent permitted by law, ResuMate AI shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the Service.
            </Section>

            <Section title="10. Changes to Terms">
              We may update these terms periodically. Continued use of the Service after changes
              constitutes acceptance of the revised terms. We will notify users of material changes
              via email or in-app notification.
            </Section>

            <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '32px 0' }} />

            {/* Privacy Policy Summary */}
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>
              Privacy Policy
            </h2>

            <Section title="Data We Collect">
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li><strong>Account info:</strong> Email address, name (via signup or Google/LinkedIn OAuth)</li>
                <li><strong>Resume data:</strong> Content you enter in the resume builder</li>
                <li><strong>Usage data:</strong> Pages visited, features used (for improving the product)</li>
                <li><strong>Payment info:</strong> Processed by Razorpay — we never store card details</li>
              </ul>
            </Section>

            <Section title="How We Use Your Data">
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>To provide and improve the resume builder service</li>
                <li>To authenticate your account and keep it secure</li>
                <li>To send important service-related emails (no marketing spam)</li>
                <li>To process payments via Razorpay</li>
              </ul>
            </Section>

            <Section title="Data Storage & Security">
              Your data is stored in Supabase (PostgreSQL) with encryption at rest and in transit.
              We follow industry best practices to protect your information.
            </Section>

            <Section title="Your Rights">
              You may request deletion of your account and all associated data at any time by
              contacting us. You can also export your resume data directly from the builder.
            </Section>

            <Section title="Contact">
              For privacy concerns or data requests, contact us at:{' '}
              <a href="mailto:support@resumate.ai" style={{ color: '#4F46E5', fontWeight: '600' }}>
                support@resumate.ai
              </a>
            </Section>

          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>
          © 2026 ResuMate AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}

// Helper component for sections
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
      {title}
    </h3>
    <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>{children}</p>
  </div>
)

export default Terms
