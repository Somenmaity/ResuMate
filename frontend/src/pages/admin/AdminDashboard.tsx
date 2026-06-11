import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const adminFetch = (path: string, opts: RequestInit = {}) =>
  fetch(`${BASE_URL}/api/admin${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': localStorage.getItem('adminToken') || '',
      ...(opts.headers || {}),
    },
  }).then(r => r.json())

// ── types ──────────────────────────────────────────────────────────────────────
interface Stats {
  totalUsers: number; totalResumes: number;
  totalPayments: number; totalRevenue: number;
}
interface User {
  id: string; email: string; fullName: string; provider: string;
  createdAt: string; lastSignIn: string; emailConfirmed: boolean;
}
interface Template {
  id: string; name: string; active: boolean; premium: boolean; description: string;
}
interface AIConfig {
  model: string; temperature: number; maxTokens: number;
  systemPrompt: string; enabled: boolean;
}
interface Payment {
  id?: string; plan: string; amount: number; currency: string;
  customer_name: string; customer_email: string; gateway_payment_id: string;
  status: string; created_at: string;
}

// ── colour tokens ───────────────────────────────────────────────────────────────
const C = {
  bg:       '#0f172a',
  sidebar:  '#1e293b',
  card:     '#1e293b',
  border:   '#334155',
  text:     '#f1f5f9',
  muted:    '#94a3b8',
  accent:   '#6366f1',
  green:    '#10b981',
  red:      '#ef4444',
  amber:    '#f59e0b',
}

// ── reusable primitives ─────────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    backgroundColor: C.card, border: `1px solid ${C.border}`,
    borderRadius: '16px', padding: '24px', ...style,
  }}>{children}</div>
)

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '0.04em',
    backgroundColor: color + '22', color,
  }}>{label}</span>
)

const Btn = ({
  children, onClick, variant = 'primary', size = 'md', disabled = false, style = {},
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: 'primary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md'; disabled?: boolean; style?: React.CSSProperties;
}) => {
  const bg: Record<string, string> = {
    primary: C.accent, danger: C.red, ghost: 'transparent', success: C.green,
  }
  const pad = size === 'sm' ? '6px 14px' : '10px 20px'
  const fs  = size === 'sm' ? '12px' : '13px'
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        padding: pad, borderRadius: '10px', border: variant === 'ghost' ? `1px solid ${C.border}` : 'none',
        backgroundColor: disabled ? '#334155' : bg[variant], color: disabled ? C.muted : 'white',
        fontSize: fs, fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s', letterSpacing: '0.03em', ...style,
      }}
      onMouseEnter={e => { if (!disabled) (e.target as HTMLButtonElement).style.opacity = '0.85' }}
      onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1' }}
    >{children}</button>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
    {children}
  </label>
)

const Input = ({ value, onChange, placeholder = '', type = 'text', style = {} }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; style?: React.CSSProperties;
}) => (
  <input
    type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: '100%', padding: '10px 14px', borderRadius: '10px',
      border: `1.5px solid ${C.border}`, backgroundColor: '#0f172a',
      color: C.text, fontSize: '13px', outline: 'none',
      boxSizing: 'border-box', fontFamily: 'inherit', ...style,
    }}
  />
)

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: '44px', height: '24px', borderRadius: '12px',
      backgroundColor: checked ? C.accent : '#334155',
      cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: '3px',
      left: checked ? '23px' : '3px',
      width: '18px', height: '18px', borderRadius: '50%',
      backgroundColor: 'white', transition: 'left 0.2s',
    }} />
  </div>
)

// ── section: Dashboard overview ─────────────────────────────────────────────────
const DashboardSection = ({ stats }: { stats: Stats | null }) => {
  const cards = [
    { label: 'Total Users',    value: stats?.totalUsers    ?? '-', icon: '👤', color: C.accent },
    { label: 'Total Resumes',  value: stats?.totalResumes  ?? '-', icon: '📄', color: C.green  },
    { label: 'Total Payments', value: stats?.totalPayments ?? '-', icon: '💳', color: C.amber  },
    { label: 'Total Revenue',  value: stats ? `₹${stats.totalRevenue}` : '-', icon: '₹', color: '#ec4899' },
  ]
  return (
    <div>
      <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '800', margin: '0 0 24px', letterSpacing: '-0.5px' }}>
        Dashboard Overview
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(c => (
          <Card key={c.label} style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: C.muted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{c.label}</p>
                <p style={{ color: C.text, fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>{c.value}</p>
              </div>
              <div style={{ fontSize: '28px', opacity: 0.7 }}>{c.icon}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '800', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Guide</h3>
        {[
          { icon: '👤', title: 'User Management', desc: 'View all registered users, see their details, and delete accounts if needed.' },
          { icon: '🎨', title: 'Template Management', desc: 'Enable or disable resume templates, toggle premium status, and update descriptions.' },
          { icon: '🤖', title: 'AI Configuration', desc: 'Change the AI model, temperature, max tokens, and the system prompt used for enhancement.' },
          { icon: '💳', title: 'Payment Reports', desc: 'View all payment transactions, revenue by plan, and download summaries.' },
        ].map(item => (
          <div key={item.title} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <div>
              <p style={{ color: C.text, fontSize: '13px', fontWeight: '700', margin: '0 0 2px' }}>{item.title}</p>
              <p style={{ color: C.muted, fontSize: '12px', margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ── section: Users ──────────────────────────────────────────────────────────────
const UsersSection = ({ users, loading, onDelete }: {
  users: User[]; loading: boolean; onDelete: (id: string) => void
}) => {
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Delete user "${u.email}"?\nThis is permanent and cannot be undone.`)) return
    setDeleting(u.id)
    await onDelete(u.id)
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          User Management
          <span style={{ marginLeft: '10px', fontSize: '13px', fontWeight: '600', color: C.muted }}>
            {users.length} total
          </span>
        </h2>
        <Input value={search} onChange={setSearch} placeholder="Search by email or name…" style={{ width: '260px' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0' }}>Loading users…</div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Name / Email', 'Provider', 'Joined', 'Last Sign In', 'Email', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>No users found</td></tr>
                )}
                {filtered.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffffff08')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ color: C.text, fontSize: '13px', fontWeight: '700', margin: '0 0 2px' }}>
                        {u.fullName || '—'}
                      </p>
                      <p style={{ color: C.muted, fontSize: '12px', margin: 0 }}>{u.email}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge label={u.provider} color={u.provider === 'google' ? '#4285f4' : u.provider === 'linkedin_oidc' ? '#0a66c2' : C.muted} />
                    </td>
                    <td style={{ padding: '16px 20px', color: C.muted, fontSize: '12px', whiteSpace: 'nowrap' }}>{u.createdAt}</td>
                    <td style={{ padding: '16px 20px', color: C.muted, fontSize: '12px', whiteSpace: 'nowrap' }}>{u.lastSignIn || '—'}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge label={u.emailConfirmed ? 'Confirmed' : 'Pending'} color={u.emailConfirmed ? C.green : C.amber} />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Btn variant="danger" size="sm" disabled={deleting === u.id} onClick={() => handleDelete(u)}>
                        {deleting === u.id ? '…' : 'Delete'}
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── section: Templates ──────────────────────────────────────────────────────────
const TemplatesSection = ({ templates, loading, onSave }: {
  templates: Template[]; loading: boolean; onSave: (t: Template[]) => void
}) => {
  const [local, setLocal]   = useState<Template[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => { setLocal(templates) }, [templates])

  const update = (id: string, field: keyof Template, value: unknown) =>
    setLocal(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))

  const handleSave = async () => {
    setSaving(true)
    await onSave(local)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Template Management
        </h2>
        <Btn onClick={handleSave} disabled={saving} variant={saved ? 'success' : 'primary'}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0' }}>Loading templates…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {local.map(t => (
            <Card key={t.id} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* ID chip */}
                <div style={{ flexShrink: 0, width: '140px' }}>
                  <p style={{ color: C.muted, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Template ID</p>
                  <p style={{ color: C.text, fontSize: '13px', fontWeight: '700', margin: 0 }}>{t.id}</p>
                </div>

                {/* Name */}
                <div style={{ flex: '1', minWidth: '160px' }}>
                  <Label>Display Name</Label>
                  <Input value={t.name} onChange={v => update(t.id, 'name', v)} />
                </div>

                {/* Description */}
                <div style={{ flex: '2', minWidth: '200px' }}>
                  <Label>Description</Label>
                  <Input value={t.description} onChange={v => update(t.id, 'description', v)} />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexShrink: 0 }}>
                  <div>
                    <p style={{ color: C.muted, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Active</p>
                    <Toggle checked={t.active} onChange={v => update(t.id, 'active', v)} />
                  </div>
                  <div>
                    <p style={{ color: C.muted, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Premium</p>
                    <Toggle checked={t.premium} onChange={v => update(t.id, 'premium', v)} />
                  </div>
                </div>

                {/* Status badge */}
                <Badge label={t.active ? 'Active' : 'Inactive'} color={t.active ? C.green : C.muted} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── section: AI Config ──────────────────────────────────────────────────────────
const AVAILABLE_MODELS = [
  'minimax/minimax-m2.5',
  'anthropic/claude-3.5-haiku',
  'openai/gpt-4o-mini',
  'openai/gpt-3.5-turbo',
  'google/gemini-flash-1.5',
  'meta-llama/llama-3.1-8b-instruct',
]

const AIConfigSection = ({ config, loading, onSave }: {
  config: AIConfig | null; loading: boolean; onSave: (c: AIConfig) => void
}) => {
  const [local, setLocal]   = useState<AIConfig>({
    model: 'minimax/minimax-m2.5', temperature: 0.7, maxTokens: 800,
    systemPrompt: '', enabled: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => { if (config) setLocal(config) }, [config])

  const set = (field: keyof AIConfig, value: unknown) =>
    setLocal(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    await onSave(local)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          AI Configuration
        </h2>
        <Btn onClick={handleSave} disabled={saving} variant={saved ? 'success' : 'primary'}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Config'}
        </Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0' }}>Loading config…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '800', margin: '0 0 4px' }}>AI Enhancement</h3>
                <p style={{ color: C.muted, fontSize: '12px', margin: 0 }}>Enable or disable AI-powered resume enhancement globally</p>
              </div>
              <Toggle checked={local.enabled} onChange={v => set('enabled', v)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <Label>AI Model</Label>
                <select
                  value={local.model} onChange={e => set('model', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: `1.5px solid ${C.border}`, backgroundColor: '#0f172a',
                    color: C.text, fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  }}
                >
                  {AVAILABLE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number" value={local.maxTokens}
                  onChange={v => set('maxTokens', parseInt(v) || 800)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Label>Temperature: {local.temperature}</Label>
              </div>
              <input
                type="range" min={0} max={1} step={0.05} value={local.temperature}
                onChange={e => set('temperature', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: C.accent }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ color: C.muted, fontSize: '11px' }}>0 — Precise</span>
                <span style={{ color: C.muted, fontSize: '11px' }}>1 — Creative</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '800', margin: '0 0 12px' }}>System Prompt</h3>
            <p style={{ color: C.muted, fontSize: '12px', margin: '0 0 12px' }}>
              This prompt is prepended to every AI enhancement request. Keep it focused on professional resume writing.
            </p>
            <textarea
              value={local.systemPrompt}
              onChange={e => set('systemPrompt', e.target.value)}
              rows={10}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                border: `1.5px solid ${C.border}`, backgroundColor: '#0f172a',
                color: C.text, fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.6,
              }}
            />
          </Card>
        </div>
      )}
    </div>
  )
}

// ── section: Payments ───────────────────────────────────────────────────────────
const PLAN_COLORS: Record<string, string> = {
  resume:       '#6366f1',
  cover_letter: '#10b981',
  bundle:       '#f59e0b',
}
const PLAN_LABELS: Record<string, string> = {
  resume: 'Resume', cover_letter: 'Cover Letter', bundle: 'Bundle',
}

const PaymentsSection = ({ payments, loading, summary }: {
  payments: Payment[]; loading: boolean;
  summary: { totalRevenue: number; totalCount: number; byPlan: Record<string, number>; avgTransaction: number } | null
}) => {
  const [filterPlan, setFilterPlan] = useState('all')
  const [search, setSearch]         = useState('')

  const filtered = payments
    .filter(p => filterPlan === 'all' || p.plan === filterPlan)
    .filter(p =>
      p.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.gateway_payment_id?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '800', margin: '0 0 24px', letterSpacing: '-0.5px' }}>
        Payment Reports
      </h2>

      {/* Summary cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Total Revenue', value: `₹${summary.totalRevenue}`, color: '#ec4899' },
            { label: 'Total Transactions', value: summary.totalCount, color: C.accent },
            { label: 'Avg. Transaction', value: `₹${summary.avgTransaction}`, color: C.green },
            { label: 'Resume Plan', value: `₹${summary.byPlan?.resume || 0}`, color: '#6366f1' },
            { label: 'Cover Letter', value: `₹${summary.byPlan?.cover_letter || 0}`, color: C.green },
            { label: 'Bundle', value: `₹${summary.byPlan?.bundle || 0}`, color: C.amber },
          ].map(c => (
            <Card key={c.label} style={{ padding: '16px 20px' }}>
              <p style={{ color: C.muted, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{c.label}</p>
              <p style={{ color: c.color, fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>{c.value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'resume', 'cover_letter', 'bundle'].map(plan => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              style={{
                padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700', letterSpacing: '0.03em',
                backgroundColor: filterPlan === plan ? C.accent : C.border,
                color: filterPlan === plan ? 'white' : C.muted,
                transition: 'all 0.15s',
              }}
            >
              {plan === 'all' ? 'All' : PLAN_LABELS[plan] || plan}
            </button>
          ))}
        </div>
        <Input value={search} onChange={setSearch} placeholder="Search email, name, payment ID…" style={{ width: '260px' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0' }}>Loading payments…</div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Payment ID', 'Customer', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>No payments found</td></tr>
                )}
                {filtered.map((p, i) => (
                  <tr key={p.id || i}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffffff08')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: C.muted, fontSize: '11px', fontFamily: 'monospace' }}>
                        {(p.gateway_payment_id || '—').slice(0, 20)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ color: C.text, fontSize: '13px', fontWeight: '600', margin: '0 0 2px' }}>{p.customer_name || '—'}</p>
                      <p style={{ color: C.muted, fontSize: '11px', margin: 0 }}>{p.customer_email || '—'}</p>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge label={PLAN_LABELS[p.plan] || p.plan} color={PLAN_COLORS[p.plan] || C.muted} />
                    </td>
                    <td style={{ padding: '14px 20px', color: C.green, fontSize: '14px', fontWeight: '800' }}>
                      ₹{p.amount}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge label={p.status} color={p.status === 'success' ? C.green : C.red} />
                    </td>
                    <td style={{ padding: '14px 20px', color: C.muted, fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {p.created_at ? p.created_at.slice(0, 10) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── nav items ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  label: 'Dashboard',    icon: '📊' },
  { id: 'users',      label: 'Users',         icon: '👤' },
  { id: 'templates',  label: 'Templates',     icon: '🎨' },
  { id: 'ai-config',  label: 'AI Config',     icon: '🤖' },
  { id: 'payments',   label: 'Payments',      icon: '💳' },
]

// ── main AdminDashboard ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')

  const [stats,     setStats]     = useState<Stats | null>(null)
  const [users,     setUsers]     = useState<User[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [aiConfig,  setAiConfig]  = useState<AIConfig | null>(null)
  const [payments,  setPayments]  = useState<Payment[]>([])
  const [summary,   setSummary]   = useState<any>(null)

  const [loadingStats,     setLoadingStats]     = useState(false)
  const [loadingUsers,     setLoadingUsers]     = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [loadingAI,        setLoadingAI]        = useState(false)
  const [loadingPayments,  setLoadingPayments]  = useState(false)

  const adminEmail = localStorage.getItem('adminEmail') || 'admin'

  // fetch stats on mount
  useEffect(() => {
    setLoadingStats(true)
    adminFetch('/stats')
      .then(d => { if (d.success) setStats(d.stats) })
      .finally(() => setLoadingStats(false))
  }, [])

  // fetch section data when tab changes
  useEffect(() => {
    if (active === 'users' && users.length === 0) {
      setLoadingUsers(true)
      adminFetch('/users')
        .then(d => { if (d.success) setUsers(d.users) })
        .finally(() => setLoadingUsers(false))
    }
    if (active === 'templates' && templates.length === 0) {
      setLoadingTemplates(true)
      adminFetch('/templates')
        .then(d => { if (d.success) setTemplates(d.templates) })
        .finally(() => setLoadingTemplates(false))
    }
    if (active === 'ai-config' && !aiConfig) {
      setLoadingAI(true)
      adminFetch('/ai-config')
        .then(d => { if (d.success) setAiConfig(d.config) })
        .finally(() => setLoadingAI(false))
    }
    if (active === 'payments' && payments.length === 0) {
      setLoadingPayments(true)
      adminFetch('/payments')
        .then(d => {
          if (d.success) {
            setPayments(d.payments)
            setSummary(d.summary)
          }
        })
        .finally(() => setLoadingPayments(false))
    }
  }, [active])

  const handleDeleteUser = useCallback(async (id: string) => {
    const d = await adminFetch(`/users/${id}`, { method: 'DELETE' })
    if (d.success) {
      setUsers(prev => prev.filter(u => u.id !== id))
      // refresh stats
      adminFetch('/stats').then(d => { if (d.success) setStats(d.stats) })
    }
  }, [])

  const handleSaveTemplates = useCallback(async (tpl: Template[]) => {
    await adminFetch('/templates', { method: 'PUT', body: JSON.stringify({ templates: tpl }) })
  }, [])

  const handleSaveAI = useCallback(async (cfg: AIConfig) => {
    const d = await adminFetch('/ai-config', { method: 'PUT', body: JSON.stringify(cfg) })
    if (d.success) setAiConfig(d.config)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/admin/login')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', backgroundColor: C.bg,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: '232px', flexShrink: 0, backgroundColor: C.sidebar,
        borderRight: `1px solid ${C.border}`, display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', backgroundColor: C.accent,
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', fontWeight: '900', color: 'white',
            }}>R</div>
            <div>
              <p style={{ color: C.text, fontSize: '13px', fontWeight: '800', margin: '0 0 1px', letterSpacing: '-0.3px' }}>ResuMate AI</p>
              <p style={{ color: C.accent, fontSize: '10px', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflow: 'auto' }}>
          {NAV.map(item => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.accent + '22' : 'transparent',
                  color: isActive ? C.accent : C.muted,
                  fontSize: '13px', fontWeight: isActive ? '800' : '600',
                  marginBottom: '2px', transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
                {isActive && (
                  <div style={{
                    marginLeft: 'auto', width: '6px', height: '6px',
                    borderRadius: '50%', backgroundColor: C.accent,
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Stats mini */}
        {stats && (
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Users', val: stats.totalUsers },
                { label: 'Revenue', val: `₹${stats.totalRevenue}` },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ color: C.text, fontSize: '14px', fontWeight: '800', margin: '0 0 2px' }}>{s.val}</p>
                  <p style={{ color: C.muted, fontSize: '10px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin info + logout */}
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: C.accent + '33', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '800', color: C.accent, flexShrink: 0,
          }}>
            {adminEmail[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ color: C.text, fontSize: '11px', fontWeight: '700', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminEmail}
            </p>
            <p style={{ color: C.muted, fontSize: '10px', margin: 0 }}>Admin</p>
          </div>
          <button onClick={handleLogout} title="Logout" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.muted, fontSize: '16px', padding: '4px', flexShrink: 0,
          }}>⎋</button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflow: 'auto', padding: '36px 40px' }}>
        {active === 'dashboard' && <DashboardSection stats={stats} />}
        {active === 'users'     && (
          <UsersSection users={users} loading={loadingUsers} onDelete={handleDeleteUser} />
        )}
        {active === 'templates' && (
          <TemplatesSection templates={templates} loading={loadingTemplates} onSave={handleSaveTemplates} />
        )}
        {active === 'ai-config' && (
          <AIConfigSection config={aiConfig} loading={loadingAI} onSave={handleSaveAI} />
        )}
        {active === 'payments'  && (
          <PaymentsSection payments={payments} loading={loadingPayments} summary={summary} />
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
