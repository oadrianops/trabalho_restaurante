import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Image with Next.js optimization */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.25 }}>
          <Image 
            src="/images/hero.png" 
            alt="Interior do Restaurante Gusto & Co." 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
        </div>
        
        <div className={styles.heroContent}>
          <p className={styles.subTitle}>Experiência Gastronômica Exclusiva</p>
          <h1 className={styles.title}>
            A Arte da Alta Gastronomia <span>Contemporânea</span>
          </h1>
          <p className={styles.description}>
            Harmonizando ingredientes selecionados, técnicas modernas e paixão pela culinária para criar pratos que surpreendem os sentidos.
          </p>
          <div className={styles.btnGroup}>
            <Link href="/reservas">
              <button className={styles.primaryBtn}>Reservar uma Mesa</button>
            </Link>
            <Link href="/cardapio">
              <button className={styles.secondaryBtn}>Ver Cardápio</button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p className={styles.subTitle} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Nossa História</p>
              <h2>Gusto & Co. <span>Sabor e Sofisticação</span></h2>
              <div className={styles.divider} style={{ margin: '1rem 0 2rem 0' }}></div>
              <p>
                Fundado em 2018 pelo Chef Executivo Henrique Lima, o Gusto & Co. nasceu do desejo de redefinir a culinária contemporânea brasileira com influências da clássica gastronomia francesa e italiana.
              </p>
              <p>
                Cada prato é uma obra de arte pensada nos mínimos detalhes: do frescor dos insumos fornecidos por pequenos produtores locais à apresentação impecável e harmonização com vinhos refinados.
              </p>
              <div className={styles.aboutHighlight}>
                "Cozinhar não é apenas alimentar o corpo, mas sim tocar a alma através de sabores inesquecíveis."
                <br /><strong style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', notStyle: 'normal' }}>— Chef Henrique Lima</strong>
              </div>
            </div>
            
            <div style={{ position: 'relative', height: '450px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
              <Image 
                src="/images/hero.png" 
                alt="Chef Henrique Lima preparando um prato" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.subTitle}>Destaques do Chef</p>
            <h2>Pratos Assinatura</h2>
            <div className={styles.divider}></div>
            <p>Uma prévia de nossas criações mais apreciadas pelos paladares mais exigentes.</p>
          </div>

          <div className={styles.featuredGrid}>
            
            {/* Appetizer */}
            <div className={styles.dishCard}>
              <div className={styles.dishImagePlaceholder}>
                <Image 
                  src="/images/dish_appetizer.png" 
                  alt="Tartare de Mignon" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
                <span className={styles.dishTag}>Entrada</span>
              </div>
              <div className={styles.dishInfo}>
                <h3 className={styles.dishTitle}>
                  Tartare de Mignon 
                  <span className={styles.dishPrice}>R$ 68</span>
                </h3>
                <p className={styles.dishDesc}>
                  Filet mignon picado na ponta da faca, temperado com especiarias da casa, gema de codorna curada e brotos orgânicos. Acompanha torradas de brioche artesanal.
                </p>
              </div>
            </div>

            {/* Main */}
            <div className={styles.dishCard}>
              <div className={styles.dishImagePlaceholder}>
                <Image 
                  src="/images/dish_tenderloin.png" 
                  alt="Filet Mignon Glaciado" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
                <span className={styles.dishTag}>Principal</span>
              </div>
              <div className={styles.dishInfo}>
                <h3 className={styles.dishTitle}>
                  Filet ao Redução 
                  <span className={styles.dishPrice}>R$ 125</span>
                </h3>
                <p className={styles.dishDesc}>
                  Mignon grelhado ao ponto do chef, redução de vinho do Porto, aspargos grelhados na manteiga de ervas e purê de batata baroa trufado.
                </p>
              </div>
            </div>

            {/* Dessert */}
            <div className={styles.dishCard}>
              <div className={styles.dishImagePlaceholder}>
                <Image 
                  src="/images/dish_dessert.png" 
                  alt="Grand Gateau au Chocolat" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
                <span className={styles.dishTag}>Sobremesa</span>
              </div>
              <div className={styles.dishInfo}>
                <h3 className={styles.dishTitle}>
                  Petit Gateau Belga 
                  <span className={styles.dishPrice}>R$ 42</span>
                </h3>
                <p className={styles.dishDesc}>
                  Bolinho quente de chocolate belga 70% cacau com recheio cremoso fluído, servido com sorvete de baunilha Bourbon e calda fresca de framboesas orgânicas.
                </p>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/cardapio">
              <button className={styles.secondaryBtn}>Ver Cardápio Completo</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Reservation Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <p className={styles.subTitle}>Ambiente Exclusivo</p>
            <h2>Garanta sua Experiência</h2>
            <p>
              Dispomos de mesas com localizações privilegiadas (jardim de inverno, salão principal e mezanino VIP). Use nosso sistema interativo para escolher a mesa ideal para a sua noite.
            </p>
            <Link href="/reservas">
              <button className={styles.primaryBtn}>Escolher Mesa Interativa</button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
