'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isLinkActive = (path) => pathname === path;

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          Gusto<span className={styles.logoGold}>&Co.</span>
        </Link>

        <button 
          className={styles.menuToggle} 
          onClick={toggleMenu}
          aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <nav className={`${styles.navLinks} ${isOpen ? styles.navLinksActive : ''}`}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isLinkActive('/') ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Início
          </Link>
          <Link 
            href="/cardapio" 
            className={`${styles.navLink} ${isLinkActive('/cardapio') ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Cardápio
          </Link>
          <Link 
            href="/delivery" 
            className={`${styles.navLink} ${isLinkActive('/delivery') ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Delivery
          </Link>
          <Link 
            href="/reservas" 
            className={`${styles.navLink} ${isLinkActive('/reservas') ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Reservas
          </Link>
          
          <Link href="/reservas" onClick={closeMenu}>
            <button className={styles.reserveBtn}>Reservar Mesa</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
