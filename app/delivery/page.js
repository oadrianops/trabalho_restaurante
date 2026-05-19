'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Delivery() {
  const [cart, setCart] = useState([]);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem('cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    };
    loadCart();

    // Listen to storage events to keep cart synced
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const updateQuantity = (itemId, change) => {
    const updated = cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean); // Filter out null items (quantity 0)

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (itemId) => {
    const updated = cart.filter(item => item.id !== itemId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Calculate prices
  const subtotal = cart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);
  const taxaEntrega = subtotal > 150 || subtotal === 0 ? 0.00 : 12.00;
  const total = subtotal + taxaEntrega;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nome: nome,
          cliente_telefone: telefone,
          endereco,
          total,
          itens: cart
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear cart
        localStorage.removeItem('cart');
        setCart([]);
        window.dispatchEvent(new Event('storage'));
        
        // Show success screen
        setCreatedOrder({
          id: data.orderId,
          nome,
          endereco,
          total,
          pagamento,
          isSimulated: data.isSimulated
        });
        setOrderSubmitted(true);
      } else {
        alert(data.error || 'Erro ao realizar o pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede ao enviar pedido:', error);
      alert('Erro de conexão ao realizar pedido. Verifique seu servidor.');
    } finally {
      setLoading(false);
    }
  };

  // If order is successfully submitted, show success card
  if (orderSubmitted && createdOrder) {
    return (
      <div className={styles.deliveryPage}>
        <div className="container">
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h2>Pedido Recebido!</h2>
            <p>
              Obrigado pelo seu pedido, <strong>{createdOrder.nome}</strong>! Nossa equipe de cozinha já foi notificada e está preparando os seus pratos com todo o carinho.
            </p>

            <div className={styles.orderDetails}>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Código do Pedido:</span>
                <span className={styles.orderVal}>#{createdOrder.id}</span>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Endereço de Entrega:</span>
                <span className={styles.orderVal}>{createdOrder.endereco}</span>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Método de Pagamento:</span>
                <span className={styles.orderVal}>{createdOrder.pagamento.toUpperCase()}</span>
              </div>
              <div className={styles.orderRow} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
                <span className={styles.orderLabel} style={{ color: 'var(--text-primary)' }}>Total Pago:</span>
                <span className={styles.orderVal} style={{ color: 'var(--accent-gold)' }}>R$ {createdOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {createdOrder.isSimulated 
                ? 'Nota: Banco de dados offline. O pedido foi registrado em modo de simulação.' 
                : 'Seu pedido foi registrado com sucesso no banco de dados MariaDB.'}
            </p>

            <Link href="/cardapio">
              <button className={styles.menuBtn}>Voltar ao Cardápio</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.deliveryPage}>
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <p className="subTitle" style={{ color: 'var(--accent-gold)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Cozinha na sua Casa</p>
          <h1>Gusto Delivery</h1>
          <div className="divider"></div>
          <p>Receba a sofisticação de nossos pratos assinados no conforto do seu lar.</p>
        </div>

        <div className={styles.layoutGrid}>
          
          {/* Left - Cart items */}
          <div className={styles.cartSection}>
            <h2>Seu Carrinho</h2>
            
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Seu carrinho de compras está vazio.</p>
                <Link href="/cardapio">
                  <button className={styles.menuBtn}>Ir para o Cardápio</button>
                </Link>
              </div>
            ) : (
              <div className={styles.cartList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemInfo}>
                      <h3>{item.nome}</h3>
                      <span className={styles.itemPrice}>R$ {item.preco.toFixed(2)} c/u</span>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.qtyControls}>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className={styles.qtyVal}>{item.quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <span style={{ fontWeight: 600, minWidth: '70px', textAlign: 'right' }}>
                        R$ {(item.preco * item.quantity).toFixed(2)}
                      </span>
                      <button className={styles.removeBtn} onClick={() => removeItem(item.id)} title="Remover item">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Checkout summary and form */}
          <div className={styles.checkoutSection}>
            <h2>Finalizar Pedido</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Taxa de Entrega</span>
              <span>
                {taxaEntrega === 0 ? (
                  <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>Grátis</span>
                ) : (
                  `R$ ${taxaEntrega.toFixed(2)}`
                )}
              </span>
            </div>

            {subtotal > 0 && subtotal < 150 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '1.5rem', textAlign: 'right' }}>
                Faltam R$ {(150 - subtotal).toFixed(2)} para obter Entrega Grátis!
              </p>
            )}

            <div className={styles.totalRow}>
              <span>Total Estimado</span>
              <span className={styles.totalPrice}>R$ {total.toFixed(2)}</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Seu Nome</label>
                <input 
                  type="text" 
                  id="nome" 
                  placeholder="Ex: Adrian Silva" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={cart.length === 0 || loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  id="telefone" 
                  placeholder="Ex: (11) 99999-9999" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  disabled={cart.length === 0 || loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endereco">Endereço Completo</label>
                <input 
                  type="text" 
                  id="endereco" 
                  placeholder="Ex: Av. Paulista, 1000, Apto 51 - São Paulo/SP" 
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  disabled={cart.length === 0 || loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pagamento">Forma de Pagamento</label>
                <select 
                  id="pagamento"
                  value={pagamento}
                  onChange={(e) => setPagamento(e.target.value)}
                  disabled={cart.length === 0 || loading}
                >
                  <option value="pix">PIX (Com 5% de Desconto na entrega)</option>
                  <option value="cartao">Cartão de Crédito/Débito (Máquina)</option>
                  <option value="dinheiro">Dinheiro (Levar troco)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={cart.length === 0 || loading}
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
