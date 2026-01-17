import { useEffect, useState } from 'react'
import { FileText, TrendingUp, Clock, Shield, ArrowRight, CheckCircle2, Zap, Bell, Lock } from 'lucide-react'

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10, 14, 39, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} style={{ color: 'white' }} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InvoiceFlow</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="/login" style={{ padding: '0.625rem 1.5rem', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }}>Login</a>
            <a href="/register" style={{ padding: '0.625rem 1.5rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '8px', color: 'white', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }}>Sign Up</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 5rem', marginTop: '60px' }}>
        <div style={{ maxWidth: '56rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.2', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Invoicing Reimagined
          </h1>
          
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '48px', maxWidth: '48rem', margin: '0 auto 48px' }}>
            Create professional invoices in 60 seconds. Track payments in real-time. Get paid 3x faster.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
            <a href="/register" style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '8px', fontWeight: '700', fontSize: '18px', color: 'white', textDecoration: 'none', display: 'inline-block', maxWidth: '300px', margin: '0 auto', cursor: 'pointer' }}>
              Start Free Trial →
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', maxWidth: '48rem', margin: '0 auto' }}>
            {[
              { value: '50K+', label: 'Users' },
              { value: '€2M+', label: 'Invoiced' },
              { value: '98%', label: 'Happy' },
              { value: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                <p style={{ fontSize: '24px', fontWeight: '900', color: '#60a5fa', marginBottom: '0.5rem' }}>{stat.value}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '8rem 1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', textAlign: 'center', marginBottom: '48px', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Powerful Features
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: FileText, title: 'Smart Invoices', desc: 'Create professional invoices in 60 seconds' },
              { icon: TrendingUp, title: 'Analytics', desc: 'Real-time payment tracking and insights' },
              { icon: Bell, title: 'Notifications', desc: 'Instant alerts for all invoice events' },
              { icon: Clock, title: 'Time Tracking', desc: 'Automatic invoice generation' },
              { icon: Lock, title: 'Secure', desc: 'Bank-level encryption and GDPR compliant' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second load times globally' }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} style={{ padding: '32px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={32} style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', textAlign: 'center', marginBottom: '48px' }}>Simple Pricing</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Free', price: '€0', features: ['5 invoices/month', 'Basic templates', 'Email support'] },
              { name: 'Pro', price: '€9', features: ['Unlimited invoices', 'Premium templates', 'Payment tracking', '24/7 support'], highlight: true },
              { name: 'Business', price: '€49', features: ['Everything in Pro', 'API access', 'Custom branding', 'Priority support'] }
            ].map((plan, i) => (
              <div key={i} style={{
                padding: '32px',
                borderRadius: '16px',
                border: plan.highlight ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                background: plan.highlight ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
                <p style={{ fontSize: '36px', fontWeight: '900', color: '#60a5fa', marginBottom: '24px' }}>
                  {plan.price}<span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>/mo</span>
                </p>
                <ul style={{ marginBottom: '24px', listStyle: 'none', padding: 0 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <CheckCircle2 size={20} style={{ color: '#10b981' }} /> {f}
                    </li>
                  ))}
                </ul>
                <a href="/register" style={{ display: 'block', padding: '12px 24px', background: '#3b82f6', borderRadius: '8px', color: 'white', textDecoration: 'none', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '32px' }}>Ready to Get Started?</h2>
        <a href="/register" style={{ display: 'inline-block', padding: '1rem 2.5rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '8px', fontWeight: '700', fontSize: '18px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
          Start Free Trial Now
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '32px 24px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
        <p>© 2026 InvoiceFlow. Built for professionals.</p>
      </footer>
    </div>
  )
}