export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '4rem 1.5rem 3rem',
      maxWidth: 900, margin: '0 auto',
    }}>
      <div style={{
        background: 'rgba(34,197,94,0.05)',
        border: '1px solid rgba(34,197,94,0.15)',
        borderRadius: 16, padding: '2rem',
        marginBottom: '3rem',
      }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#22c55e' }}>
          🚀 Como publicar esse site no Vercel (grátis)
        </h3>
        <ol style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 2, paddingLeft: '1.2rem' }}>
          <li>Crie uma conta em <strong style={{ color: '#fff' }}>vercel.com</strong> (use o GitHub para login)</li>
          <li>Faça upload do projeto ou conecte ao seu repositório GitHub</li>
          <li>O Vercel detecta automaticamente que é Vite/React</li>
          <li>Clique em <strong style={{ color: '#fff' }}>Deploy</strong> — em menos de 1 minuto o site está no ar</li>
          <li>Você recebe um link <strong style={{ color: '#22c55e' }}>seusite.vercel.app</strong> público e gratuito</li>
        </ol>
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          # Comandos pra rodar localmente primeiro:<br />
          npm install<br />
          npm run dev &nbsp;&nbsp;# http://localhost:5173<br />
          npm run build &nbsp;# gera a pasta /dist para deploy
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>AG Interativo</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            Baseado no material do Prof. Alexandre Zamberlan — Técnicas de IA / UFN
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="tag tag-blue">React</span>
          <span className="tag tag-green">Vite</span>
          <span className="tag tag-purple">Vercel</span>
        </div>
      </div>
    </footer>
  )
}
