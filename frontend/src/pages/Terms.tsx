import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
  const navigate  = useNavigate()
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms')

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f9fafb',
      padding: '40px 20px', fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
            Last Updated: June 3, 2026
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden'
        }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            {(['terms', 'privacy'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '16px 28px', fontSize: '14px', fontWeight: '700', border: 'none',
                  background: 'none', cursor: 'pointer',
                  color: tab === t ? '#4F46E5' : '#9ca3af',
                  borderBottom: tab === t ? '2px solid #4F46E5' : '2px solid transparent',
                }}
              >
                {t === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </button>
            ))}
          </div>

          <div style={{ padding: '36px 40px', lineHeight: '1.8' }}>

            {tab === 'terms' && (
              <>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '28px' }}>
                  Welcome to ResuMate AI ("Platform"), owned and operated by <strong>Upquarx Technology Private Limited</strong> ("Company", "We", "Us", or "Our"). This document is an electronic record in terms of the Information Technology Act, 2000, and rules thereunder, and constitutes a legally binding agreement between the Company and any person or entity accessing, browsing, or using the Platform as a Job Seeker, Professional, or User (collectively referred to as "User" or "You").
                </p>

                <Section title="1. Acceptable Use and Account Security">
                  <BulletList items={[
                    'Eligibility: By creating an account or using our services, you represent and warrant that you are at least 18 years of age and possess the legal capacity to enter into a binding contract under Indian law. Minors may only access the platform under parental or guardian supervision.',
                    'Information Veracity: Users assume an absolute obligation to provide true, accurate, and updated information during registration. Impersonation, masquerading, or providing AI-manipulated/fraudulent biographical data is strictly prohibited and will result in instant termination.',
                    'Credential Security: The safety and confidentiality of your account credentials (passwords, OTPs, or API keys) rest solely with the User. You are fully liable for all activities occurring under your account. Any unauthorized access must be reported to support@resumate.ai immediately.',
                  ]} />
                </Section>

                <Section title="2. Specific Service Disclaimers and Terms">
                  <SubSection title="A. Resume Builder">
                    <BulletList items={[
                      'No Guarantee of Placement: ResuMate AI is an AI-driven resume creation, enhancement, and formatting tool. The Company explicitly disclaims any warranties or guarantees regarding successful job placement, responses from potential employers, or selection post-submission.',
                      'Input Data License: By uploading resumes, text inputs, or job descriptions, you grant the Platform a non-exclusive, royalty-free license to process this data solely to run your AI enhancements, generate resume content, and provide the requested services.',
                    ]} />
                  </SubSection>
                  <SubSection title="B. AI Enhancement Feature">
                    <BulletList items={[
                      'AI-Powered Suggestions: The Platform utilises AI systems to analyse and enhance resume content, suggest improvements, and generate professional summaries. The Company does not warrant the absolute accuracy or completeness of AI-generated suggestions.',
                      'User Responsibility: All AI-generated content is provided as a starting point. Users must review, verify, and edit content before submitting resumes to employers or job portals.',
                    ]} />
                  </SubSection>
                  <SubSection title="C. Cover Letter Generator">
                    <BulletList items={[
                      'The Cover Letter Generator produces AI-drafted letters based on user inputs. These are templates for convenience and must be reviewed and personalised by the User before use.',
                      'The Company is not a party to any employment application outcome resulting from the use of generated cover letters.',
                    ]} />
                  </SubSection>
                  <SubSection title="D. Payment & Downloads">
                    <BulletList items={[
                      'Resume download (PDF + DOCX), Cover Letter generation, and Bundle services are available as one-time payments processed via Razorpay.',
                      'Pricing is subject to change based on active marketing campaigns. Refer to the Pricing section for current rates.',
                    ]} />
                  </SubSection>
                </Section>

                <Section title="3. Special Disclaimer for Artificial Intelligence (AI) and Machine Learning Generated Content">
                  <BulletList items={[
                    'Nature of AI Outputs: The User explicitly acknowledges and agrees that certain features on the Platform — including resume enhancement, summary generation, cover letter writing, and job description analysis — are powered by complex Artificial Intelligence and Machine Learning algorithms.',
                    'The "As-Is" Blueprint and Hallucinations: AI-generated outputs are predictive and generative in nature. The Company does not warrant or guarantee the absolute accuracy, completeness, timeliness, relevancy, or reliability of any content generated by the Platform. The User acknowledges that AI systems are susceptible to technical anomalies, data gaps, or algorithmic "hallucinations" (generating inaccurate or fictional data/responses).',
                    'For Candidates/Job Seekers: Resumes, cover letters, and AI-generated content are templates provided for convenience. It is your sole responsibility to review, cross-verify, and edit this content for accuracy before submitting it to external employers or portals. The Company is not liable for any discrepancies or rejections resulting from unverified AI-generated text.',
                    'No Professional Advice: No AI-generated output, automated career guidance, or feedback provided on the Platform constitutes formal legal, psychological, employment, or career-guarantee advice.',
                    'Third-Party AI Systems: The Platform integrates with industry-standard foundational AI models and hosting environments. The Company shall not be held liable for systemic outages, infrastructure failures, API throttling, or data processing errors originating from these external technology sub-providers.',
                  ]} />
                </Section>

                <Section title="4. Commercials and Refund Policies">
                  <BulletList items={[
                    'Pricing Structure: ResuMate AI operates on a Pay-Per-Use model. Current pricing: Resume Download — ₹99, Cover Letter — ₹21, Bundle (Resume + Cover Letter) — ₹110.',
                    'No-Refund Policy: All paid purchases and processed service invoices are final. No refunds will be issued for completed transactions, unutilised downloads, or account closures initiated by the User.',
                    'Pricing Changes: The Company reserves the right to modify pricing at any time. Existing paid sessions will not be retroactively affected.',
                  ]} />
                </Section>

                <Section title="5. Prohibited Conduct and System Safety">
                  Users agree not to engage in any of the following restricted behaviours:
                  <BulletList items={[
                    'Scraping and Data Mining: Deploying spiders, crawlers, scrapers, or manual extraction tools to harvest resume data, templates, or analytical scoring structures without explicit written permission.',
                    'Reverse Engineering: Attempting to decompile, decode, reverse engineer, or extract the source code or proprietary weights of our underlying AI evaluation algorithms.',
                    'Prohibited Content: Uploading information that is defamatory, obscene, invasive of privacy, hate-speech oriented, or infringes on third-party intellectual property.',
                    'System Sabotage: Knowingly introducing viruses, trojan horses, logic bombs, or attempting denial-of-service (DDoS) attacks against the platform\'s infrastructure.',
                    'Fraudulent Use: Creating fake resumes, misrepresenting qualifications, or generating fictitious employment records using the AI tools provided.',
                  ]} />
                </Section>

                <Section title="6. Intellectual Property Rights">
                  All software, algorithms, UI designs, brands, logos (including the ResuMate AI logo), features, data models, resume templates, and content displayed on the Platform are the exclusive intellectual property of Upquarx Technology Private Limited. No user may copy, frame, duplicate, or adapt any asset for commercial usage outside the internal scopes of the provided software licence. Resume content created by the User belongs to the User.
                </Section>

                <Section title="7. Limitation of Liability and Indemnity">
                  <BulletList items={[
                    'As-Is Availability: The Platform and its integrated AI engines are provided on an "as-is" and "as-available" baseline. The Company does not guarantee uninterrupted runtime or absolute flawlessness of AI responses.',
                    'Cap on Liability: To the maximum extent permitted under applicable Indian laws, Upquarx Technology Private Limited shall not be liable for any indirect, incidental, consequential, or punitive damages, loss of profits, revenue, or career opportunities. Our maximum aggregate liability for any verifiable claim shall not exceed the actual fee paid by you to the Company in the 3 months preceding the claim.',
                    'Indemnity: Users agree to indemnify, defend, and hold harmless the Company, its directors, employees, and partners from any third-party claims, damages, liabilities, or legal costs arising out of your breach of these Terms of Service or violation of statutory compliance codes.',
                  ]} />
                </Section>

                <Section title="8. DPDPA (Data Privacy) Compliance">
                  Your privacy is parameter-locked. In accordance with the Digital Personal Data Protection Act (DPDPA), 2023, any collection, storage, processing, or deletion of your personal data is handled strictly under our unified Privacy Policy. Users retain absolute rights to withdraw data processing consents, access personal data summaries, or request profile rectification by reaching out directly to our Grievance Officer.
                </Section>

                <Section title="9. Governing Law and Dispute Resolution">
                  <BulletList items={[
                    'Jurisdiction: These terms shall be governed by, interpreted, and construed exclusively in accordance with the laws of India.',
                    'Arbitration: Any legal dispute, conflict, or claim arising out of or relating to this agreement shall be settled through binding arbitration under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Mumbai, Maharashtra, and the proceedings shall be conducted in the English language.',
                    'Courts: Subject to arbitration rules, the competent courts located in Mumbai, India shall have exclusive jurisdiction over any ancillary matters arising from this agreement.',
                  ]} />
                </Section>

                <Section title="10. Statutory Grievance Redressal Mechanisms">
                  In compliance with the Information Technology Act, 2000 and consumer protection guidelines, any grievances or compliance concerns regarding the Platform can be formally logged with our Grievance Officer:
                  <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}><strong>Attn:</strong> Grievance Redressal Cell</p>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}><strong>Entity:</strong> Upquarx Technology Private Limited</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:support@resumate.ai" style={{ color: '#4F46E5', fontWeight: '600' }}>
                        support@resumate.ai
                      </a>
                    </p>
                  </div>
                </Section>
              </>
            )}

            {tab === 'privacy' && (
              <>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '28px' }}>
                  This Privacy Policy describes how Upquarx Technology Private Limited collects, uses, and protects your personal information when you use ResuMate AI, in compliance with the Digital Personal Data Protection Act (DPDPA), 2023.
                </p>

                <Section title="1. Data We Collect">
                  <BulletList items={[
                    'Account Information: Email address, full name (via signup, Google OAuth, or LinkedIn OAuth)',
                    'Resume Data: All content you enter in the resume builder — work experience, education, skills, projects, and personal details',
                    'Payment Information: Transaction ID, plan type, and amount — processed securely by Razorpay. We never store card or banking details.',
                    'Usage Data: Pages visited, features used, and interaction patterns — used solely for improving the platform',
                    'Device & Technical Data: IP address, browser type, and operating system for security and debugging purposes',
                  ]} />
                </Section>

                <Section title="2. How We Use Your Data">
                  <BulletList items={[
                    'To provide, maintain, and improve the resume building and AI enhancement services',
                    'To authenticate your account and maintain its security',
                    'To process payments and send payment confirmation emails',
                    'To send important service-related communications (no unsolicited marketing)',
                    'To analyse anonymised usage patterns for product improvement',
                  ]} />
                </Section>

                <Section title="3. Data Storage & Security">
                  Your data is stored in Supabase (PostgreSQL) with encryption at rest and in transit using TLS/SSL protocols. We follow industry best practices including role-based access control and regular security audits to protect your information.
                </Section>

                <Section title="4. Third-Party Services">
                  <BulletList items={[
                    'Supabase — Database and authentication (data stored in secure cloud infrastructure)',
                    'Razorpay — Payment processing (PCI-DSS compliant)',
                    'OpenRouter / AI Providers — Resume content enhancement (text sent only for processing your request)',
                    'EmailJS — Transactional email delivery',
                  ]} />
                </Section>

                <Section title="5. Data Sharing">
                  We do not sell, trade, or rent your personal data to third parties. Data is shared only with the service providers listed above, strictly for fulfilling the services you request. We may disclose data if required by law or valid legal process.
                </Section>

                <Section title="6. Your Rights (DPDPA 2023)">
                  <BulletList items={[
                    'Right to Access: Request a summary of personal data we hold about you',
                    'Right to Correction: Request correction of inaccurate or incomplete data',
                    'Right to Erasure: Request deletion of your account and all associated data',
                    'Right to Withdraw Consent: Withdraw consent for data processing at any time',
                    'Right to Grievance: Lodge a complaint with our Grievance Officer',
                  ]} />
                </Section>

                <Section title="7. Cookies">
                  We use essential session cookies to maintain your login state. We do not use advertising or tracking cookies. You may disable cookies in your browser settings, but this may affect platform functionality.
                </Section>

                <Section title="8. Data Retention">
                  Your resume data and account information are retained for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days, except where retention is required by applicable law.
                </Section>

                <Section title="9. Contact & Grievance Officer">
                  For privacy concerns, data requests, or to exercise your DPDPA rights:
                  <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}><strong>Entity:</strong> Upquarx Technology Private Limited</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:support@resumate.ai" style={{ color: '#4F46E5', fontWeight: '600' }}>
                        support@resumate.ai
                      </a>
                    </p>
                  </div>
                </Section>
              </>
            )}

          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>
          © 2026 ResuMate AI — Upquarx Technology Private Limited. All rights reserved.
        </p>
      </div>
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '28px' }}>
    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '10px', borderLeft: '3px solid #4F46E5', paddingLeft: '10px' }}>
      {title}
    </h3>
    <div style={{ fontSize: '14px', color: '#4b5563' }}>{children}</div>
  </div>
)

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '14px' }}>
    <p style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 6px' }}>{title}</p>
    {children}
  </div>
)

const BulletList = ({ items }: { items: string[] }) => (
  <ul style={{ paddingLeft: '20px', margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {items.map((item, i) => (
      <li key={i} style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.7' }}>{item}</li>
    ))}
  </ul>
)

export default Terms
