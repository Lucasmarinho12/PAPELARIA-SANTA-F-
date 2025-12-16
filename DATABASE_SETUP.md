# 🗄️ Guia de Configuração do Banco de Dados

## Pré-requisitos

1. **PostgreSQL Database**: Você precisa de um banco de dados PostgreSQL. Opções recomendadas:
   - [Neon](https://neon.tech) - Grátis, serverless PostgreSQL
   - [Supabase](https://supabase.com) - Grátis, com autenticação integrada
   - [Railway](https://railway.app) - Deploy fácil
   - PostgreSQL local

2. **Connection String**: Você precisará da string de conexão do banco no formato:
   ```
   postgresql://username:password@host:port/database
   ```

## 📋 Passos para Configurar

### 1. Configurar Variável de Ambiente

Adicione a variável `DATABASE_URL` ao seu projeto:

**Para desenvolvimento local (.env.local):**
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

**Para Vercel (Produção):**
1. Vá para o dashboard do projeto no Vercel
2. Settings → Environment Variables
3. Adicione `DATABASE_URL` com sua connection string

### 2. Criar as Tabelas

Execute o script para criar todas as tabelas necessárias:

```bash
node scripts/setup-database.js
```

Este script criará:
- ✅ Tabela de usuários (users)
- ✅ Tabela de categorias (categories)
- ✅ Tabela de produtos (products)
- ✅ Tabela de pedidos (orders)
- ✅ Tabela de itens do pedido (order_items)
- ✅ Tabela de sessões (session)

### 3. Popular com Dados Iniciais

Execute o script para adicionar categorias e produtos iniciais:

```bash
node scripts/seed-database.js
```

Este script adiciona:
- 📁 6 categorias (Escola, Escritório, Arte, Informática, Papel, Escrita)
- 📦 18 produtos com preços e estoque

### 4. Criar Usuário Administrador

Execute o script para criar o usuário admin:

```bash
npm run seed-admin
```

Credenciais do admin:
- **Email:** admin@papeleriasantafe.com
- **Senha:** Admin123!

## 🔧 Comandos Úteis

```bash
# Configurar tudo de uma vez (após ter o DATABASE_URL)
node scripts/setup-database.js && node scripts/seed-database.js && npm run seed-admin

# Verificar tabelas no banco
psql $DATABASE_URL -c "\dt"

# Ver produtos cadastrados
psql $DATABASE_URL -c "SELECT name, price FROM products LIMIT 5"
```

## ⚠️ Solução de Problemas

**Erro: "password authentication failed"**
- Verifique se o DATABASE_URL está correto
- Confirme usuário e senha do banco

**Erro: "relation already exists"**
- As tabelas já existem. Use `DROP TABLE` se quiser recriá-las

**Erro: "cannot connect to server"**
- Verifique se o banco está online
- Confirme o host e porta na connection string

## 🚀 Próximos Passos

Após configurar o banco de dados:

1. Inicie o servidor: `npm start`
2. Acesse o admin: `/admin/new-product.html`
3. Faça login com as credenciais do admin
4. Comece a gerenciar produtos!

## 📊 Estrutura do Banco de Dados

```
users
├─ id (UUID)
├─ name
├─ email (unique)
├─ password_hash
├─ phone
├─ address
├─ is_admin
└─ created_at

categories
├─ id (SERIAL)
└─ name (unique)

products
├─ id (SERIAL)
├─ name
├─ category_id → categories(id)
├─ description
├─ price
├─ stock
├─ image_url
└─ created_at

orders
├─ id (UUID)
├─ user_id → users(id)
├─ total
├─ whatsapp_sent
└─ created_at

order_items
├─ id (SERIAL)
├─ order_id → orders(id)
├─ product_id → products(id)
├─ quantity
└─ unit_price
