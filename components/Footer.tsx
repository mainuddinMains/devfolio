interface FooterProps {
  name: string
}

export default function Footer({ name }: FooterProps) {
  return (
    <footer
      style={{
        borderTop: '1px solid #2a2a2a',
        background: '#0f0f0f',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#888', fontSize: '0.875rem' }}>© 2025 {name}</p>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: '#555',
          marginTop: '0.4rem',
        }}
      >
        Built with Next.js
      </p>
    </footer>
  )
}
