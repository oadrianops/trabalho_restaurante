import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || 'restaurant_pass';
    const database = process.env.DB_NAME || 'restaurant_db';

    console.log(`Inicializando pool de conexão com o banco de dados MariaDB em ${host}:${port}`);

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}

export async function query(sql, params) {
  const dbPool = getPool();
  try {
    const [results] = await dbPool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('deu erro na query:', error);
    throw error;
  }
}

export async function initDb() {
  console.log('Verificando tabelas...');
  try {
    // Cria a tabela de clientes
    await query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefone VARCHAR(20) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Cria tabela de reservas (relacionada com cliente_id)
    await query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        data_reserva DATE NOT NULL,
        hora_reserva TIME NOT NULL,
        numero_pessoas INT NOT NULL,
        numero_mesa INT NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmada',
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Cria a tabela de pedidos do delivery (guarda os itens como texto JSON)
    await query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_nome VARCHAR(100) NOT NULL,
        cliente_telefone VARCHAR(20) NOT NULL,
        endereco VARCHAR(255) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        itens TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Tabelas prontas e banco conectado.');
    return true;
  } catch (error) {
    console.error('Nao deu pra inicializar o banco:', error);
    return false;
  }
}
