export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 1.25rem', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>
            AG<span style={{ color: '#7c6fff' }}>.</span>learn
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            Material baseado no Prof. Alexandre Zamberlan — Técnicas de IA / UFN<br />
            Feito com React + Vite · Hospedado no Vercel
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="tag tag-purple">React</span>
          <span className="tag tag-blue">Vite</span>
          <span className="tag tag-green">Vercel</span>
        </div>
      </div>
    </footer>
  )
}
