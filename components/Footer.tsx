interface FooterProps {
  name: string
}

export default function Footer({ name }: FooterProps) {
  const linkStyle: React.CSSProperties = {
    color: '#434656',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.15s',
  }

  return (
    <footer
      style={{
        background: '#0e0e0e',
        borderTop: '1px solid rgba(67,70,86,0.2)',
        padding: '4rem 2rem',
        width: '100%',
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Left: copyright */}
        <p
          style={{
            color: '#8e90a2',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 500,
          }}
        >
          © 2025 {name} | ENGINEERED FOR PERFORMANCE
        </p>

        {/* Right: links */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub', href: 'https://github.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Source', href: '#' },
            { label: 'CV', href: '#' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={linkStyle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#b8c3ff' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#434656' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  )
}
