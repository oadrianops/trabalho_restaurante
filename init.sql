-- Script de Inicialização do Banco de Dados MariaDB
-- Restaurante Gusto & Co.

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabela de Reservas
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

-- 3. Tabela de Pedidos (Delivery)
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nome VARCHAR(100) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  itens TEXT NOT NULL, -- Contém a string JSON com os detalhes dos itens
  status VARCHAR(20) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
