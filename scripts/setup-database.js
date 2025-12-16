const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

async function setupDatabase() {
  const client = await pool.connect()

  try {
    console.log("🚀 Starting database setup...\n")

    // Create extension
    console.log("📦 Creating UUID extension...")
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    console.log("✅ UUID extension ready\n")

    // Users table
    console.log("👥 Creating users table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        address TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("✅ Users table created\n")

    // Categories table
    console.log("📁 Creating categories table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `)
    console.log("✅ Categories table created\n")

    // Products table
    console.log("📦 Creating products table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("✅ Products table created\n")

    // Orders table
    console.log("🛒 Creating orders table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        total NUMERIC(10,2) NOT NULL,
        whatsapp_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("✅ Orders table created\n")

    // Order items table
    console.log("📝 Creating order_items table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL
      )
    `)
    console.log("✅ Order items table created\n")

    // Session table
    console.log("🔐 Creating session table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
    `)
    console.log("✅ Session table created\n")

    console.log("✅ Database setup completed successfully!\n")
    console.log("📋 Next steps:")
    console.log("   1. Run: node scripts/seed-database.js")
    console.log("   2. Run: npm run seed-admin\n")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

setupDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
