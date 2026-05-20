'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const MENU_ITEMS = [
  // Entradas
  {
    id: 1,
    nome: 'Tartare de Mignon',
    preco: 68.00,
    categoria: 'entradas',
    descricao: 'Filet mignon picado na ponta da faca, temperado com especiarias da casa, gema de codorna curada e brotos orgânicos. Acompanha torradas de brioche artesanal.',
    imagem: '/images/dish_appetizer.png',
    tags: ['sem glúten'],
    harmonizacao: {
      bebida: 'Pinot Noir Suave',
      tipo: 'Vinho Tinto',
      icone: '🍷',
      preco: 35.00,
      descricao: 'A acidez vibrante e os aromas de frutas vermelhas deste Pinot Noir cortam a untuosidade do tartare, complementando o sabor delicado da carne crua sem sobrecarregar o prato.'
    }
  },
  {
    id: 2,
    nome: 'Burrata ao Pesto',
    preco: 58.00,
    categoria: 'entradas',
    descricao: 'Burrata cremosa servida sobre cama de rúcula fresca, pesto de manjericão artesanal, tomates cereja assados e redução balsâmica. Acompanha focaccia da casa.',
    imagem: '/images/dish_burrata.png',
    tags: ['vegetariano'],
    harmonizacao: {
      bebida: 'Sauvignon Blanc',
      tipo: 'Vinho Branco',
      icone: '🥂',
      preco: 32.00,
      descricao: 'As notas herbáceas e cítricas do Sauvignon Blanc combinam perfeitamente com o manjericão do pesto, enquanto a alta acidez equilibra a cremosidade da burrata.'
    }
  },
  {
    id: 3,
    nome: 'Bruschetta di Parma',
    preco: 52.00,
    categoria: 'entradas',
    descricao: 'Fatias de pão italiano tostadas no azeite de ervas, cobertas com presunto de Parma premium, figos grelhados, queijo de cabra cremoso e mel trufado.',
    imagem: '/images/dish_bruschetta.png',
    tags: [],
    harmonizacao: {
      bebida: 'Espumante Brut Chardonnay',
      tipo: 'Espumante',
      icone: '🍾',
      preco: 38.00,
      descricao: 'A efervescência e a secura do espumante limpam o paladar da riqueza do queijo de cabra e do presunto de Parma, realçando as notas adocicadas do figo e do mel.'
    }
  },
  // Pratos Principais
  {
    id: 4,
    nome: 'Filet ao Porto',
    preco: 125.00,
    categoria: 'principais',
    descricao: 'Filet mignon grelhado ao ponto do chef, redução de vinho do Porto, aspargos grelhados na manteiga de ervas e purê de batata baroa trufado.',
    imagem: '/images/dish_tenderloin.png',
    tags: ['sem glúten'],
    harmonizacao: {
      bebida: 'Cabernet Sauvignon Reserva',
      tipo: 'Vinho Tinto',
      icone: '🍷',
      preco: 42.00,
      descricao: 'Um tinto encorpado com taninos estruturados é o par clássico para carnes vermelhas ricas. A redução de vinho do Porto no prato encontra eco nas notas de frutas escuras do vinho.'
    }
  },
  {
    id: 5,
    nome: 'Risoto de Cogumelos',
    preco: 98.00,
    categoria: 'principais',
    descricao: 'Risoto de arroz arbóreo cozido lentamente com caldo artesanal de cogumelos, blend de cogumelos frescos (shimeji, paris e porcini), finalizado com queijo pecorino e azeite trufado.',
    imagem: '/images/dish_risoto.png',
    tags: ['vegetariano', 'sem glúten'],
    harmonizacao: {
      bebida: 'Vinho Merlot Envelhecido',
      tipo: 'Vinho Tinto',
      icone: '🍷',
      preco: 36.00,
      descricao: 'Os aromas terrosos dos cogumelos e o toque de trufa combinam de forma espetacular com a textura aveludada e notas de madeira deste Merlot de corpo médio.'
    }
  },
  {
    id: 6,
    nome: 'Salmão Grelhado',
    preco: 110.00,
    categoria: 'principais',
    descricao: 'Posta de salmão grelhada com crosta de gergelim, molho suave de maracujá fresco, acompanhada de legumes da estação grelhados no azeite de oliva extra virgem.',
    imagem: '/images/dish_salmon.png',
    tags: ['sem glúten'],
    harmonizacao: {
      bebida: 'Chardonnay Amadeirado',
      tipo: 'Vinho Branco',
      icone: '🥂',
      preco: 35.00,
      descricao: 'A estrutura amanteigada de um Chardonnay fermentado em carvalho complementa a textura gordurosa do salmão, enquanto sua acidez equilibra o molho cítrico de maracujá.'
    }
  },
  {
    id: 7,
    nome: 'Nhoque de Mandioquinha',
    preco: 88.00,
    categoria: 'principais',
    descricao: 'Nhoque artesanal de mandioquinha salteado na manteiga de sálvia, servido com ragu de carne seca desfiada cozida lentamente e finalizado com queijo coalho gratinado.',
    imagem: '/images/dish_nhoque.png',
    tags: [],
    harmonizacao: {
      bebida: 'Cerveja IPA Artesanal',
      tipo: 'Cerveja',
      icone: '🍺',
      preco: 22.00,
      descricao: 'O amargor acentuado e notas de lúpulo cítricas da IPA cortam a riqueza da carne seca e do queijo coalho, limpando o paladar a cada gole com refrescância.'
    }
  },
  // Sobremesas
  {
    id: 8,
    nome: 'Petit Gateau Belga',
    preco: 42.00,
    categoria: 'sobremesas',
    descricao: 'Bolinho quente de chocolate belga 70% cacau com recheio cremoso fluído, servido com sorvete de baunilha Bourbon e calda fresca de framboesas orgânicas.',
    imagem: '/images/dish_dessert.png',
    tags: ['vegetariano'],
    harmonizacao: {
      bebida: 'Vinho do Porto Tawny',
      tipo: 'Vinho Fortificado',
      icone: '🍷',
      preco: 30.00,
      descricao: 'A doçura complexa e as notas de castanhas e passas do Porto Tawny complementam perfeitamente o amargor do chocolate 70% e o azedinho da framboesa.'
    }
  },
  {
    id: 9,
    nome: 'Crème Brûlée de Baunilha',
    preco: 38.00,
    categoria: 'sobremesas',
    descricao: 'Clássico creme de gemas e creme de leite fresco aromatizado com fava de baunilha Bourbon, coberto com uma casquinha crocante de açúcar caramelizado no maçarico.',
    imagem: '/images/dish_creme_brulee.png',
    tags: ['vegetariano', 'sem glúten'],
    harmonizacao: {
      bebida: 'Colheita Tardia (Late Harvest)',
      tipo: 'Vinho de Sobremesa',
      icone: '🥂',
      preco: 28.00,
      descricao: 'Um vinho doce de sobremesa tardia oferece notas de mel e damasco que realçam a doçura da baunilha sem brigar com a textura cremosa do clássico francês.'
    }
  },
  {
    id: 10,
    nome: 'Pudim de Leite Ninho',
    preco: 30.00,
    categoria: 'sobremesas',
    descricao: 'Pudim ultra cremoso de Leite Ninho com textura aveludada sem furinhos, regado com uma generosa calda de caramelo dourada perfeita.',
    imagem: '/images/dish_pudim.png',
    tags: ['vegetariano', 'sem glúten'],
    harmonizacao: {
      bebida: 'Espresso Gourmet',
      tipo: 'Café',
      icone: '☕',
      preco: 10.00,
      descricao: 'O amargor limpo e as notas torradas de um café espresso gourmet 100% arábica equilibram com perfeição a extrema doçura do leite condensado e do caramelo.'
    }
  },
  // Bebidas
  {
    id: 11,
    nome: 'Vinho Cabernet Sauvignon (Taça)',
    preco: 35.00,
    categoria: 'bebidas',
    descricao: 'Taça de vinho tinto seco encorpado, aromático e de taninos marcantes.',
    imagem: '/images/drink_wine.png',
    tags: ['vegano', 'sem glúten'],
    harmonizacao: null
  },
  {
    id: 12,
    nome: 'Vinho Chardonnay (Taça)',
    preco: 32.00,
    categoria: 'bebidas',
    descricao: 'Taça de vinho branco frutado, refrescante com notas amanteigadas.',
    imagem: '/images/drink_wine_white.png',
    tags: ['vegano', 'sem glúten'],
    harmonizacao: null
  },
  {
    id: 13,
    nome: 'Gin Tônica Imperial',
    preco: 38.00,
    categoria: 'bebidas',
    descricao: 'Gin premium importado, água tônica artesanal, fatias de pepino, zimbro e um toque de alecrim fresco.',
    imagem: '/images/drink_gin.png',
    tags: ['vegano', 'sem glúten'],
    harmonizacao: null
  },
  {
    id: 14,
    nome: 'Cerveja IPA Artesanal',
    preco: 22.00,
    categoria: 'bebidas',
    descricao: 'Cerveja artesanal local de estilo India Pale Ale, aromática e encorpada.',
    imagem: '/images/drink_beer.png',
    tags: ['vegano'],
    harmonizacao: null
  },
  {
    id: 15,
    nome: 'Água San Pellegrino',
    preco: 18.00,
    categoria: 'bebidas',
    descricao: 'Água mineral gaseificada naturalmente, importada diretamente da Itália (750ml).',
    imagem: '/images/drink_water.png',
    tags: ['vegano', 'sem glúten'],
    harmonizacao: null
  }
];

export default function Cardapio() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const selectCategory = (category) => {
    setActiveCategory(category);
  };

  const openPairing = (dish) => {
    setSelectedDish(dish);
  };

  const closePairing = () => {
    setSelectedDish(null);
  };

  const addToCart = (item, notifyName = null) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.id === item.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch standard storage event to update other pages/components instantly
    window.dispatchEvent(new Event('storage'));
    
    setToastMessage(`Adicionado: ${notifyName || item.nome} no carrinho!`);
  };

  const addPairingToCart = () => {
    if (!selectedDish) return;
    
    // Add dish
    addToCart(selectedDish);
    
    // Add beverage
    const bevItem = {
      id: selectedDish.id + 100, // Safe offset for fake item ids
      nome: `${selectedDish.harmonizacao.bebida} (${selectedDish.harmonizacao.tipo})`,
      preco: selectedDish.harmonizacao.preco
    };
    
    // Wait slightly to let the first add finish or do it together
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Add dish
    const extDish = cart.find(i => i.id === selectedDish.id);
    if (extDish) {
      extDish.quantity += 1;
    } else {
      cart.push({ id: selectedDish.id, nome: selectedDish.nome, preco: selectedDish.preco, quantity: 1 });
    }
    // Add beverage
    const extBev = cart.find(i => i.id === bevItem.id);
    if (extBev) {
      extBev.quantity += 1;
    } else {
      cart.push({ id: bevItem.id, nome: bevItem.nome, preco: bevItem.preco, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    setToastMessage(`Combo Harmonizado adicionado com sucesso!`);
    closePairing();
  };

  // Filter items
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'todos' || item.categoria === activeCategory;
    const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`${styles.menuPage} animate-fade-in`}>

      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <p className="subTitle" style={{ color: 'var(--accent-gold)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Experiência Gusto</p>
          <h1>Nosso Cardápio</h1>
          <div className="divider"></div>
          <p>Explore pratos inspiradores criados com rigor técnico e ingredientes locais nobres.</p>
        </div>

        {/* Controls: Search and Filters */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por prato ou ingrediente..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.tabs}>
            {['todos', 'entradas', 'principais', 'sobremesas', 'bebidas'].map((category) => (
              <button
                key={category}
                className={`${styles.tabBtn} ${activeCategory === category ? styles.activeTabBtn : ''}`}
                onClick={() => selectCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('principais', 'Pratos Principais')}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className={styles.menuGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.menuItemCard}>
              <div className={styles.itemImage}>
                <Image 
                  src={item.imagem} 
                  alt={item.nome} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <div className={styles.itemContent}>
                <div>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemName}>{item.nome}</h3>
                    <span className={styles.itemPrice}>R$ {item.preco.toFixed(2)}</span>
                  </div>
                  <p className={styles.itemDescription}>{item.descricao}</p>
                </div>
                
                <div className={styles.itemFooter}>
                  <div className={styles.itemTags}>
                    {item.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className={`${styles.tag} ${tag === 'vegetariano' ? styles.tagVegan : styles.tagGluten}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.harmonizacao && (
                      <button 
                        className={styles.pairBtn}
                        onClick={() => openPairing(item)}
                        title="Ver Harmonização Inteligente"
                      >
                        🍷 Harmonizar
                      </button>
                    )}
                    <button 
                      className={styles.pairBtn} 
                      style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', borderColor: 'var(--accent-gold)' }}
                      onClick={() => addToCart(item)}
                    >
                      🛒 + Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Nenhum prato encontrado com esses termos de busca.
            </div>
          )}
        </div>

      </div>

      {/* Smart Beverage Pairing Modal */}
      <div className={`${styles.modalOverlay} ${selectedDish ? styles.modalOverlayActive : ''}`} onClick={closePairing}>
        {selectedDish && (
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closePairing}>✕</button>
            
            <div className={styles.pairingHeader}>
              <p>Inovação Gusto & Co.</p>
              <h2>Harmonização Inteligente</h2>
            </div>
            
            <div className={styles.pairingBody}>
              <div className={styles.selectedDishInfo}>
                <h3>{selectedDish.nome}</h3>
                <p>{selectedDish.descricao}</p>
                <div className={styles.pairingPriceInfo}>Prato: R$ {selectedDish.preco.toFixed(2)}</div>
              </div>
              
              <div style={{ textAlign: 'center', color: 'var(--accent-gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                ✦ Combina Perfeitamente Com ✦
              </div>

              <div className={styles.recommendationCard}>
                <div className={styles.beverageIcon}>
                  {selectedDish.harmonizacao.icone}
                </div>
                <div className={styles.beverageDetails}>
                  <h4>{selectedDish.harmonizacao.bebida}</h4>
                  <p style={{ color: 'var(--accent-gold)', fontWeight: '600', marginBottom: '0.3rem' }}>{selectedDish.harmonizacao.tipo}</p>
                  <p>{selectedDish.harmonizacao.descricao}</p>
                  <div className={styles.pairingPriceInfo} style={{ marginTop: '0.4rem' }}>Bebida: R$ {selectedDish.harmonizacao.preco.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.tabBtn} onClick={closePairing}>Fechar</button>
              <button 
                className={styles.tabBtn} 
                style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', borderColor: 'var(--accent-gold)' }}
                onClick={addPairingToCart}
              >
                🛒 Adicionar Combo (+R$ {(selectedDish.preco + selectedDish.harmonizacao.preco).toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}

    </div>
  );
}
