import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          
          {/* Logo & Description */}
          <div className={styles.footerCol}>
            <Link href="/" className={styles.logo}>
              Gusto<span className={styles.logoGold}>&Co.</span>
            </Link>
            <p className={styles.footerDesc}>
              Alta gastronomia contemporânea em um ambiente sofisticado. Pratos autorais e uma carta de vinhos selecionada para proporcionar experiências memoráveis.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <span>Ig</span>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <span>Fb</span>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Tripadvisor">
                <span>Ta</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h3>Navegação</h3>
            <ul className={styles.linksList}>
              <li><Link href="/">Início</Link></li>
              <li><Link href="/cardapio">Cardápio</Link></li>
              <li><Link href="/delivery">Delivery</Link></li>
              <li><Link href="/reservas">Reservas</Link></li>
            </ul>
          </div>

          {/* Horários */}
          <div className={styles.footerCol}>
            <h3>Funcionamento</h3>
            <ul className={styles.linksList} style={{pointerEvents: 'none'}}>
              <li>Segunda - Quinta<br /><span style={{color: 'var(--text-primary)'}}>12:00 às 23:00</span></li>
              <li>Sexta - Sábado<br /><span style={{color: 'var(--text-primary)'}}>12:00 às 00:00</span></li>
              <li>Domingo & Feriados<br /><span style={{color: 'var(--text-primary)'}}>12:00 às 22:00</span></li>
            </ul>
          </div>

          {/* Contato */}
          <div className={styles.footerCol}>
            <h3>Contato</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>Av. Paulista, 1000<br />Bela Vista, São Paulo - SP</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>(11) 3254-9000</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>contato@gustoandco.com.br</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} Gusto & Co. Todos os direitos reservados. Trabalho Acadêmico.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
