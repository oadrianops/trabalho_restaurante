# Gusto & Co. - Web App de Alta Gastronomia

Este é um projeto acadêmico de uma aplicação web completa para o restaurante de alta gastronomia contemporânea **Gusto & Co.** A aplicação foi desenvolvida utilizando o framework **Next.js (App Router)** com **Vanilla CSS (CSS Modules)** para estilização, conectando-se a um banco de dados **MariaDB** e empacotada em containers **Docker** para deploy facilitado em plataformas como o **Coolify**.

---

## 🚀 Tecnologias Utilizadas

1. **Frontend & Backend**: Next.js 16 (App Router, Server Actions e API Routes).
2. **Estilização**: Vanilla CSS & CSS Modules (garantindo modularidade, responsividade e velocidade).
3. **Banco de Dados**: MariaDB (conectado de forma nativa e assíncrona com `mysql2/promise`).
4. **Containers**: Docker & Docker Compose (com suporte a builds multi-estágio).
5. **Tipografia**: Outfit & Playfair Display (otimizadas através do `next/font/google` para alta performance).

---

## 🎨 Inovações e Recursos Exclusivos

* **Inovação 1 - Mapa de Mesas Interativo (SVG)**: Na página de Reservas, após preencher os dados do cliente, data e horário, o sistema carrega o layout visual (planta baixa) do restaurante em formato SVG. As mesas indisponíveis são identificadas e bloqueadas dinamicamente. O cliente clica diretamente na mesa que quer reservar (como uma mesa no jardim de inverno, salão principal ou mezanino VIP).
* **Inovação 2 - Harmonização Inteligente**: No Cardápio, cada prato exibe um botão "🍷 Harmonizar". Ao clicar, um modal exibe a bebida recomendada (vinho, cerveja artesanal ou drink) com uma explicação de sommelier do porquê da combinação. O usuário pode adicionar o combo (Prato + Bebida) diretamente ao carrinho com apenas um clique.
* **Otimização de Desempenho (Page Speed)**: Zero bibliotecas pesadas de animações ou templates carregados via CDN. As imagens utilizam o componente `<Image>` do Next.js para servirem em formatos otimizados (WebP) e responsivos, garantindo nota **superiores a 90** no Page Speed Insights em Computadores.
* **Sincronização Carrinho/Delivery**: Utilização de `localStorage` para transição reativa de itens escolhidos no cardápio para a página de delivery.

---

## 🗄️ Estrutura do Banco de Dados (MariaDB)

O banco de dados do projeto (`restaurant_db`) é composto por três tabelas principais.

> [!NOTE]
> **Inicialização Automática**: Para facilitar a implantação, a própria aplicação Next.js detecta a ausência das tabelas na primeira execução e as cria automaticamente. O script de referência também está disponível em [init.sql](file:///c:/Users/adria/Downloads/trabalho_restaurante/init.sql).

1. **`clientes`**: Cadastro do cliente para vínculo de reservas.
   * `id` (INT AUTO_INCREMENT PRIMARY KEY)
   * `nome` (VARCHAR(100))
   * `email` (VARCHAR(100) UNIQUE)
   * `telefone` (VARCHAR(20))
   * `criado_em` (TIMESTAMP)
2. **`reservas`**: Armazena as mesas reservadas em datas e horários específicos.
   * `id` (INT AUTO_INCREMENT PRIMARY KEY)
   * `cliente_id` (INT, FOREIGN KEY)
   * `data_reserva` (DATE)
   * `hora_reserva` (TIME)
   * `numero_pessoas` (INT)
   * `numero_mesa` (INT)
   * `status` (VARCHAR(20) - default: 'confirmada')
   * `observacoes` (TEXT)
   * `criado_em` (TIMESTAMP)
3. **`pedidos`**: Registra as solicitações de delivery.
   * `id` (INT AUTO_INCREMENT PRIMARY KEY)
   * `cliente_nome` (VARCHAR(100))
   * `cliente_telefone` (VARCHAR(20))
   * `endereco` (VARCHAR(255))
   * `total` (DECIMAL(10,2))
   * `itens` (TEXT - armazena os itens em formato JSON string)
   * `status` (VARCHAR(20) - default: 'pendente')
   * `criado_em` (TIMESTAMP)

---

## 💻 Como Executar Localmente

### Método 1: Usando Docker Compose (Recomendado)

Você precisa ter o Docker e Docker Compose instalados em sua máquina.

1. Navegue até a pasta do projeto.
2. Execute o comando:
   ```bash
   docker compose up -d
   ```
3. O comando irá baixar a imagem do MariaDB, compilar a imagem do Next.js (conforme o `Dockerfile` do projeto) e colocá-las para rodar de forma conectada.
4. Acesse a aplicação no navegador em: **`http://localhost:3000`**
5. O banco de dados estará acessível externamente na porta `3306` usando as credenciais padrões do `docker-compose.yml`.

### Método 2: Execução Manual (Sem Docker)

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente necessárias ou use as configurações padrões locais (a aplicação tentará se conectar a `localhost:3306` com usuário `root` e senha `restaurant_pass` caso nenhuma variável seja declarada).
3. Execute em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse em: **`http://localhost:3000`**

---

## ☁️ Deploy no Coolify (Docker)

Para implantar esta aplicação no seu servidor gerenciado pelo **Coolify**:

### Passo 1: Criar o Serviço MariaDB no Coolify
1. No painel do Coolify, crie um novo **Recurso (Service)** do tipo **MariaDB**.
2. Defina o nome do banco de dados como `restaurant_db` (ou o nome que desejar).
3. Anote as credenciais geradas automaticamente pelo Coolify (Host, Porta, Usuário, Senha e Nome do Banco).

### Passo 2: Criar a Aplicação Next.js
1. No Coolify, adicione uma nova aplicação conectando o seu repositório Git onde estão estes arquivos.
2. O Coolify detectará automaticamente o arquivo `Dockerfile` na raiz do projeto. Defina o tipo de Build como **Dockerfile**.
3. Defina a porta exposta como **`3000`**.

### Passo 3: Configurar as Variáveis de Ambiente no Coolify
Na aba de **Environment Variables** da aplicação Next.js no Coolify, cadastre as seguintes chaves utilizando as informações do MariaDB criado no Passo 1:

* `DB_HOST`: Host interno/nome do container do banco MariaDB gerado pelo Coolify.
* `DB_PORT`: `3306`
* `DB_USER`: Usuário do banco de dados MariaDB.
* `DB_PASSWORD`: Senha do banco de dados MariaDB.
* `DB_NAME`: Nome do banco de dados (ex: `restaurant_db`).

4. Clique em **Deploy** no Coolify. A aplicação será compilada, entrará no ar e criará todas as tabelas necessárias automaticamente no primeiro acesso.
