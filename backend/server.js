require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const mysql = require('mysql2/promise')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretpetcare'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Ensure upload dir exists
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase()
    cb(null, base + '_' + Date.now() + ext)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ cho phép upload file hình ảnh.'))
    }
    cb(null, true)
  }
})

// MySQL pool
// MySQL pool
let pool
async function initDb() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '27032005',   // mật khẩu MySQL của bạn
    database: 'petcare_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }

  console.log('DB CONFIG =', config)  // log kiểm tra

  pool = await mysql.createPool(config)
  console.log('MySQL pool created')
}

// Auth helpers
function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      fullName: user.full_name,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Thiếu token xác thực.' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới được phép thực hiện thao tác này.' })
  }
  next()
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.send('PetCare backend (MySQL + JWT) is running.')
})

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body || {}
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc.' })
  }
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (rows.length > 0) {
      return res.json({ success: false, message: 'Email này đã được sử dụng.' })
    }
    const hash = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, phone || '', hash, 'customer']
    )
    return res.json({ success: true, message: 'Đăng ký thành công.' })
  } catch (err) {
    console.error('Register error', err)
    return res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body || {}
  if (!identifier || !password) {
    return res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' })
  }
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR full_name = ? LIMIT 1',
      [identifier, identifier]
    )
    const user = rows[0]
    if (!user) {
      return res.json({ success: false, message: 'Thông tin đăng nhập không chính xác.' })
    }
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.json({ success: false, message: 'Thông tin đăng nhập không chính xác.' })
    }
    const token = signToken(user)
    const safeUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
    return res.json({ success: true, user: safeUser, token })
  } catch (err) {
    console.error('Login error', err)
    return res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' })
  }
})

// Products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, category, description, price, image_url AS image, stock, status FROM products WHERE status = 'visible'"
    )
    res.json(rows)
  } catch (err) {
    console.error('Get products error', err)
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm.' })
  }
})

// Admin: create product (with optional image upload)
app.post(
  '/api/products',
  authMiddleware,
  adminOnly,
  upload.single('imageFile'),
  async (req, res) => {
    try {
      const { name, category, description, price, stock, status, image } = req.body || {}
      if (!name || !category || price == null) {
        return res.status(400).json({ message: 'Thiếu thông tin sản phẩm.' })
      }
      let imageUrl = image || null
      if (req.file) {
        imageUrl = '/uploads/' + req.file.filename
      }
      const [result] = await pool.query(
        'INSERT INTO products (name, category, description, price, image_url, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          category,
          description || '',
          Number(price) || 0,
          imageUrl,
          stock != null ? Number(stock) : 0,
          status || 'visible'
        ]
      )
      const [rows] = await pool.query(
        'SELECT id, name, category, description, price, image_url AS image, stock, status FROM products WHERE id = ?',
        [result.insertId]
      )
      res.json(rows[0])
    } catch (err) {
      console.error('Create product error', err)
      res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm.' })
    }
  }
)

// Admin: update product
app.put(
  '/api/products/:id',
  authMiddleware,
  adminOnly,
  upload.single('imageFile'),
  async (req, res) => {
    try {
      const productId = req.params.id
      const { name, category, description, price, stock, status, image } = req.body || {}
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId])
      const existing = rows[0]
      if (!existing) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' })
      }
      let imageUrl = image || existing.image_url
      if (req.file) {
        imageUrl = '/uploads/' + req.file.filename
      }
      const newName = name || existing.name
      const newCategory = category || existing.category
      const newDescription = description != null ? description : existing.description
      const newPrice = price != null ? Number(price) : existing.price
      const newStock = stock != null ? Number(stock) : existing.stock
      const newStatus = status || existing.status

      await pool.query(
        'UPDATE products SET name=?, category=?, description=?, price=?, image_url=?, stock=?, status=? WHERE id=?',
        [newName, newCategory, newDescription, newPrice, imageUrl, newStock, newStatus, productId]
      )

      const [updatedRows] = await pool.query(
        'SELECT id, name, category, description, price, image_url AS image, stock, status FROM products WHERE id = ?',
        [productId]
      )
      res.json(updatedRows[0])
    } catch (err) {
      console.error('Update product error', err)
      res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm.' })
    }
  }
)

// Admin: delete product
app.delete('/api/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const productId = req.params.id
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId])
    const existing = rows[0]
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' })
    }
    await pool.query('DELETE FROM products WHERE id = ?', [productId])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete product error', err)
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm.' })
  }
})

// Bookings
// Public: create booking
app.post('/api/bookings', async (req, res) => {
  const {
    ownerName,
    phone,
    email,
    petName,
    petType,
    petBreed,
    petWeight,
    petAge,
    service,
    date,
    time,
    note
  } = req.body || {}

  if (!ownerName || !phone || !petName || !petType || !service || !date || !time) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc cho lịch hẹn.' })
  }

  try {
    await pool.query(
      `INSERT INTO bookings
      (owner_name, phone, email, pet_name, pet_type, pet_breed, pet_weight, pet_age, service, date, time, note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        ownerName,
        phone,
        email || '',
        petName,
        petType,
        petBreed || '',
        petWeight || '',
        petAge || '',
        service,
        date,
        time,
        note || ''
      ]
    )
    res.json({ success: true, message: 'Đặt lịch thành công.' })
  } catch (err) {
    console.error('Create booking error', err)
    res.status(500).json({ message: 'Lỗi server khi tạo lịch hẹn.' })
  }
})

// Admin: list bookings
app.get('/api/bookings', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { date, status } = req.query
    let sql = 'SELECT * FROM bookings WHERE 1=1'
    const params = []
    if (date) {
      sql += ' AND date = ?'
      params.push(date)
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    sql += ' ORDER BY created_at DESC'
    const [rows] = await pool.query(sql, params)
    const mapped = rows.map((b) => ({
      id: 'BK' + String(b.id).padStart(4, '0'),
      ownerName: b.owner_name,
      phone: b.phone,
      email: b.email,
      petName: b.pet_name,
      petType: b.pet_type,
      petBreed: b.pet_breed,
      petWeight: b.pet_weight,
      petAge: b.pet_age,
      service: b.service,
      date: b.date ? b.date.toISOString().slice(0, 10) : '',
      time: b.time ? b.time.toString().slice(0, 5) : '',
      note: b.note,
      status: b.status
    }))
    res.json(mapped)
  } catch (err) {
    console.error('Get bookings error', err)
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách lịch hẹn.' })
  }
})

// Admin: update booking status
app.patch('/api/bookings/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body || {}
  if (!status) {
    return res.status(400).json({ message: 'Thiếu trạng thái.' })
  }
  try {
    // id dạng BK0001 => cắt bỏ BK
    const rawId = req.params.id
    const numericId = Number(String(rawId).replace(/^BK/, ''))
    if (!numericId) {
      return res.status(400).json({ message: 'Mã lịch hẹn không hợp lệ.' })
    }
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [numericId])
    if (!rows[0]) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' })
    }
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, numericId])
    res.json({ success: true })
  } catch (err) {
    console.error('Update booking status error', err)
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái lịch hẹn.' })
  }
})

// Global error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes('upload')) {
    return res.status(400).json({ message: err.message })
  }
  next(err)
})

// Start
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log('PetCare backend (MySQL + JWT) listening on port', PORT)
    })
  })
  .catch((err) => {
    console.error('Failed to init DB', err)
    process.exit(1)
  })