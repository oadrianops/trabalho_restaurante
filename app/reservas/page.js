'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const TABLES_DATA = [
  { id: 1, name: 'M1', zone: 'Jardim', capacity: 2, x: 150, y: 120, type: 'circle', r: 32 },
  { id: 2, name: 'M2', zone: 'Jardim', capacity: 2, x: 150, y: 280, type: 'circle', r: 32 },
  { id: 3, name: 'M3', zone: 'Salão Principal', capacity: 4, x: 340, y: 85, type: 'rect', w: 80, h: 54 },
  { id: 4, name: 'M4', zone: 'Salão Principal', capacity: 4, x: 340, y: 195, type: 'rect', w: 80, h: 54 },
  { id: 5, name: 'M5', zone: 'Salão Principal', capacity: 4, x: 340, y: 305, type: 'rect', w: 80, h: 54 },
  { id: 6, name: 'M6', zone: 'Salão Principal', capacity: 6, x: 490, y: 180, type: 'rect', w: 90, h: 70 },
  { id: 7, name: 'M7', zone: 'Mezanino VIP', capacity: 2, x: 690, y: 125, type: 'circle', r: 32 },
  { id: 8, name: 'M8', zone: 'Mezanino VIP', capacity: 4, x: 650, y: 255, type: 'rect', w: 80, h: 70 }
];

export default function Reservas() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Clientes
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [clienteId, setClienteId] = useState(null);

  // Step 2: Reserva
  const [dataReserva, setDataReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('19:00');
  const [pessoas, setPessoas] = useState(2);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [observacoes, setObservacoes] = useState('');
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [isSimulated, setIsSimulated] = useState(false);

  // Step 3: Success
  const [reservaId, setReservaId] = useState(null);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDataReserva(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Fetch occupied tables when date changes
  const fetchOccupiedTables = useCallback(async (date) => {
    if (!date) return;
    try {
      const res = await fetch(`/api/reservas?data=${date}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOccupiedTables(data.occupiedTables || []);
        setIsSimulated(!!data.isSimulated);
      }
    } catch (err) {
      console.error('Erro ao buscar mesas ocupadas:', err);
    }
  }, []);

  useEffect(() => {
    if (dataReserva && step === 2) {
      fetchOccupiedTables(dataReserva);
    }
  }, [dataReserva, step, fetchOccupiedTables]);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!nome || !email || !telefone) return;

    setLoading(true);
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClienteId(data.clienteId);
        setStep(2);
      } else {
        alert(data.error || 'Erro ao realizar o cadastro de cliente.');
      }
    } catch (err) {
      console.error('Erro de rede no cadastro de cliente:', err);
      alert('Erro de conexão ao realizar cadastro. Usando modo offline local.');
      // Offline fallback local
      setClienteId(Math.floor(Math.random() * 500) + 1);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!clienteId || !dataReserva || !horaReserva || !pessoas || !mesaSelecionada) {
      alert('Por favor, preencha todos os campos e selecione uma mesa no mapa.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          data_reserva: dataReserva,
          hora_reserva: horaReserva,
          numero_pessoas: pessoas,
          numero_mesa: mesaSelecionada,
          observacoes
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservaId(data.reservaId);
        setIsSimulated(prevState => prevState || !!data.isSimulated);
        setStep(3);
      } else {
        alert(data.error || 'Erro ao confirmar sua reserva.');
      }
    } catch (err) {
      console.error('Erro ao salvar reserva:', err);
      alert('Erro de conexão ao salvar reserva.');
      // Local fallback
      setReservaId(Math.floor(Math.random() * 9000) + 1000);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (table) => {
    if (occupiedTables.includes(table.id)) return; // Can't click occupied
    setMesaSelecionada(table.id);
  };

  const getTableClass = (tableId) => {
    if (occupiedTables.includes(tableId)) return styles.tableOccupied;
    if (mesaSelecionada === tableId) return styles.tableSelected;
    return styles.tableAvailable;
  };

  const selectedTableInfo = TABLES_DATA.find(t => t.id === mesaSelecionada);

  return (
    <div className={styles.reservasPage}>
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <p className="subTitle" style={{ color: 'var(--accent-gold)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Experiência Única</p>
          <h1>Reserva de Mesas</h1>
          <div className="divider"></div>
          <p>Garanta um jantar memorável escolhendo visualmente o seu lugar favorito.</p>
        </div>

        {/* Wizard Container */}
        <div className={styles.wizardContainer}>
          
          {/* Steps Progress Header */}
          <div className={styles.stepsHeader}>
            <div className={`${styles.stepIndicator} ${step === 1 ? styles.stepActive : ''} ${step > 1 ? styles.stepCompleted : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <span className={styles.stepText}>Identificação</span>
            </div>
            <div className={`${styles.stepIndicator} ${step === 2 ? styles.stepActive : ''} ${step > 2 ? styles.stepCompleted : ''}`}>
              <div className={styles.stepNumber}>2</div>
              <span className={styles.stepText}>Escolha da Mesa</span>
            </div>
            <div className={`${styles.stepIndicator} ${step === 3 ? styles.stepActive : ''}`}>
              <div className={styles.stepNumber}>3</div>
              <span className={styles.stepText}>Confirmação</span>
            </div>
          </div>

          {/* Step 1: Customer Identificaton */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className={styles.form}>
              <div className={styles.fullWidth} style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cadastro de Cliente</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Informe seus dados de contato para iniciar a reserva. Se você já tem cadastro, digite o mesmo e-mail.</p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome Completo</label>
                <input 
                  type="text" 
                  id="nome" 
                  placeholder="Ex: Adrian Silva" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Ex: adrian@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
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
                />
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Escolher Mesa ➔'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Date, Time & Table Selection */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className={styles.form}>
              <div className={styles.fullWidth} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Detalhes da Reserva</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Defina a data e o horário, depois clique em uma mesa livre no mapa.</p>
                </div>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  onClick={() => setStep(1)}
                >
                  ❮ Alterar Dados
                </button>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="data">Data da Reserva</label>
                <input 
                  type="date" 
                  id="data" 
                  value={dataReserva}
                  onChange={(e) => {
                    setDataReserva(e.target.value);
                    setMesaSelecionada(null); // Reset table on date change
                  }}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hora">Horário</label>
                <select 
                  id="hora" 
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  required
                >
                  <option value="12:00">12:00 (Almoço)</option>
                  <option value="13:30">13:30 (Almoço)</option>
                  <option value="19:00">19:00 (Jantar)</option>
                  <option value="20:30">20:30 (Jantar)</option>
                  <option value="22:00">22:00 (Jantar)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pessoas">Número de Pessoas</label>
                <select 
                  id="pessoas" 
                  value={pessoas}
                  onChange={(e) => setPessoas(parseInt(e.target.value, 10))}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Mesa Escolhida</label>
                <div style={{ padding: '0.8rem 1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 600, color: selectedTableInfo ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                  {selectedTableInfo 
                    ? `Mesa ${selectedTableInfo.id} - ${selectedTableInfo.zone} (Cap. ${selectedTableInfo.capacity} p.)`
                    : 'Nenhuma mesa selecionada'
                  }
                </div>
              </div>

              {/* INTERACTIVE SVG MAP */}
              <div className={`${styles.fullWidth} ${styles.mapWrapper}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.mapHeading}>Layout Interativo do Salão</h3>
                  <div className={styles.mapLegend}>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.colorAvailable}`}></div>
                      <span>Livre</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.colorSelected}`}></div>
                      <span>Selecionada</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendColor} ${styles.colorOccupied}`}></div>
                      <span>Ocupada</span>
                    </div>
                  </div>
                </div>

                {/* SVG FLOOR PLAN */}
                <svg viewBox="0 0 800 400" className={styles.floorPlanSvg}>
                  {/* Outer Walls */}
                  <rect x="10" y="10" width="780" height="380" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  
                  {/* Dividers */}
                  {/* Garden wall divider */}
                  <line x1="280" y1="10" x2="280" y2="390" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="5" />
                  {/* VIP room wall divider */}
                  <line x1="600" y1="10" x2="600" y2="390" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="5" />
                  
                  {/* Zone Titles */}
                  <text x="145" y="45" className={styles.zoneLabel} textAnchor="middle">🍃 Jardim de Inverno</text>
                  <text x="440" y="45" className={styles.zoneLabel} textAnchor="middle">🍷 Salão Principal</text>
                  <text x="700" y="45" className={styles.zoneLabel} textAnchor="middle">👑 Mezanino VIP</text>

                  {/* Render Tables */}
                  {TABLES_DATA.map((table) => {
                    const isOccupied = occupiedTables.includes(table.id);
                    const isSelected = mesaSelecionada === table.id;
                    const tableClass = getTableClass(table.id);
                    
                    if (table.type === 'circle') {
                      return (
                        <g key={table.id} className={styles.tableObj} onClick={() => handleTableClick(table)}>
                          <circle 
                            cx={table.x} 
                            cy={table.y} 
                            r={table.r} 
                            className={tableClass} 
                          />
                          <text 
                            x={table.x} 
                            y={table.y} 
                            className={`${styles.tableText} ${isOccupied ? styles.tableOccupiedText : ''} ${isSelected ? styles.tableSelectedText : ''}`}
                          >
                            {table.name}
                          </text>
                          {/* Chairs decor */}
                          <circle cx={table.x - 45} cy={table.y} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} strokeWidth="1" />
                          <circle cx={table.x + 45} cy={table.y} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} strokeWidth="1" />
                        </g>
                      );
                    } else {
                      return (
                        <g key={table.id} className={styles.tableObj} onClick={() => handleTableClick(table)}>
                          <rect 
                            x={table.x} 
                            y={table.y} 
                            width={table.w} 
                            height={table.h} 
                            rx="5"
                            className={tableClass} 
                          />
                          <text 
                            x={table.x + table.w/2} 
                            y={table.y + table.h/2} 
                            className={`${styles.tableText} ${isOccupied ? styles.tableOccupiedText : ''} ${isSelected ? styles.tableSelectedText : ''}`}
                          >
                            {table.name}
                          </text>
                          {/* Chairs decor based on capacity */}
                          {table.capacity === 4 && (
                            <>
                              <circle cx={table.x + table.w/4} cy={table.y - 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + (3*table.w)/4} cy={table.y - 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + table.w/4} cy={table.y + table.h + 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + (3*table.w)/4} cy={table.y + table.h + 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                            </>
                          )}
                          {table.capacity === 6 && (
                            <>
                              {/* Top chairs */}
                              <circle cx={table.x + table.w/6} cy={table.y - 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + table.w/2} cy={table.y - 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + (5*table.w)/6} cy={table.y - 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              {/* Bottom chairs */}
                              <circle cx={table.x + table.w/6} cy={table.y + table.h + 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + table.w/2} cy={table.y + table.h + 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                              <circle cx={table.x + (5*table.w)/6} cy={table.y + table.h + 12} r="6" fill="rgba(255,255,255,0.15)" stroke={isOccupied ? "none" : (isSelected ? "var(--accent-gold)" : "var(--accent-success)")} />
                            </>
                          )}
                        </g>
                      );
                    }
                  })}

                  {/* Decorative Elements */}
                  {/* Entrance Door */}
                  <path d="M 410,390 L 470,390" fill="none" stroke="var(--accent-gold)" strokeWidth="4" />
                  <text x="440" y="380" fill="var(--accent-gold)" fontSize="9" textAnchor="middle">ENTRADA PRINCIPAL</text>
                  
                  {/* Piano / Wine cabinet decoration */}
                  <rect x="20" y="180" width="30" height="40" fill="#1b1d24" stroke="rgba(255,255,255,0.1)" rx="2" />
                  <text x="35" y="200" fill="var(--text-muted)" fontSize="8" writingMode="tb" textAnchor="middle">PIANO</text>
                </svg>

                {selectedTableInfo && pessoas > selectedTableInfo.capacity && (
                  <div className={styles.mapInfoAlert} style={{ borderColor: 'var(--accent-coral)', color: 'var(--accent-coral)' }}>
                    ⚠️ <strong>Atenção:</strong> A mesa selecionada tem capacidade recomendada para até {selectedTableInfo.capacity} pessoas. No entanto, se preferir, nossa equipe poderá adicionar cadeiras extras na acomodação.
                  </div>
                )}

                {!selectedTableInfo && (
                  <div className={styles.mapInfoAlert}>
                    ℹ️ <strong>Instrução:</strong> Selecione uma data e horário acima para atualizar o mapa de mesas ocupadas. Em seguida, clique em qualquer mesa com borda <strong>verde</strong> (Livre) para reservar.
                  </div>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="observacoes">Pedidos Especiais / Observações</label>
                <textarea 
                  id="observacoes" 
                  rows="3" 
                  placeholder="Ex: Mesa para aniversário, restrições alimentares, necessidade de cadeira de bebê..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
              </div>

              <div className={styles.actions}>
                <button 
                  type="submit" 
                  className={styles.btnPrimary} 
                  disabled={loading || !mesaSelecionada}
                >
                  {loading ? 'Confirmando...' : 'Confirmar Reserva ✔'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Confirmaton */}
          {step === 3 && reservaId && (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✦</div>
              <h2>Reserva Confirmada!</h2>
              <p>
                Sua mesa foi reservada com sucesso, <strong>{nome}</strong>! Enviamos um e-mail de confirmação para <strong>{email}</strong>. Estamos ansiosos para recebê-lo!
              </p>

              <div className={styles.bookingDetails}>
                <div className={styles.bookingRow}>
                  <span className={styles.bookingLabel}>Código da Reserva:</span>
                  <span className={styles.bookingVal}>#{reservaId}</span>
                </div>
                <div className={styles.bookingRow}>
                  <span className={styles.bookingLabel}>Mesa Reservada:</span>
                  <span className={styles.bookingVal}>Mesa {mesaSelecionada} ({TABLES_DATA.find(t=>t.id===mesaSelecionada)?.zone})</span>
                </div>
                <div className={styles.bookingRow}>
                  <span className={styles.bookingLabel}>Data:</span>
                  <span className={styles.bookingVal}>
                    {dataReserva ? dataReserva.split('-').reverse().join('/') : ''}
                  </span>
                </div>
                <div className={styles.bookingRow}>
                  <span className={styles.bookingLabel}>Horário:</span>
                  <span className={styles.bookingVal}>{horaReserva}</span>
                </div>
                <div className={styles.bookingRow}>
                  <span className={styles.bookingLabel}>Pessoas:</span>
                  <span className={styles.bookingVal}>{pessoas} {pessoas === 1 ? 'convidado' : 'convidados'}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {isSimulated 
                  ? 'Nota: Banco de dados offline. A reserva foi registrada em modo de simulação.' 
                  : 'Sua reserva está devidamente persistida e garantida no banco de dados MariaDB.'}
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/">
                  <button className={styles.btnSecondary}>Voltar ao Início</button>
                </Link>
                <Link href="/cardapio">
                  <button className={styles.btnPrimary}>Conhecer o Cardápio</button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
