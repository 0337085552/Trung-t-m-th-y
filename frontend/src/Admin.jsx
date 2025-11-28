
import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext'
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  getCategoryLabel,
  formatCurrency,
  API_BASE_URL,
  STORAGE_KEYS,
} from './utils'
import { useScrollAnimation } from './useScrollAnimation'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
)

function RevenueChart() {
  const canvasRef = React.useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const chart = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        datasets: [
          {
            label: 'Doanh thu (triệu VND)',
            data: [30, 42, 38, 55, 48, 60],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    })
    return () => chart.destroy()
  }, [])

  return <canvas ref={canvasRef} height="200" />
}

function BookingChart() {
  const canvasRef = React.useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const chart = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: 'Số lịch đặt',
            data: [8, 12, 15, 10, 14, 18, 16],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
        elements: { line: { tension: 0.4 } },
      },
    })
    return () => chart.destroy()
  }, [])

  return <canvas ref={canvasRef} height="200" />
}

function ServiceChart() {
  const canvasRef = React.useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const chart = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Khám tổng quát', 'Tiêm phòng', 'Spa & Grooming', 'Lưu trú', 'Khác'],
        datasets: [
          {
            data: [35, 25, 20, 10, 10],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      },
    })
    return () => chart.destroy()
  }, [])

  return <canvas ref={canvasRef} height="200" />
}

export default function Admin() {
  useScrollAnimation()
  const { user, logout } = useAuth()
  const [section, setSection] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [products, setProducts] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingProduct, setEditingProduct] = useState(null)
  const [productMessage, setProductMessage] = useState('')
  const [loadError, setLoadError] = useState('')

  const loadData = async () => {
    try {
      const [bookingRes, productRes] = await Promise.all([
        apiGet('/bookings'),
        apiGet('/products'),
      ])
      setBookings(bookingRes)
      setProducts(productRes)
      setLoadError('')
    } catch (err) {
      setLoadError('Không tải được dữ liệu từ backend. Vui lòng kiểm tra server.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredBookings = useMemo(
    () =>
      bookings.filter((bk) => {
        let ok = true
        if (filterDate) ok = ok && bk.date === filterDate
        if (filterStatus !== 'all') ok = ok && bk.status === filterStatus
        return ok
      }),
    [bookings, filterDate, filterStatus],
  )

  const handleBookingStatus = async (id, status) => {
    try {
      await apiPatch(`/bookings/${id}/status`, { status })
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    } catch {
      alert('Không cập nhật được trạng thái. Vui lòng thử lại.')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product || {})
    setProductMessage('')
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return
    try {
      await apiDelete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Không xóa được sản phẩm. Vui lòng thử lại.')
    }
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    const formEl = e.target
    const formData = new FormData(formEl)
    const data = Object.fromEntries(formData.entries())
    const price = Number(data.price) || 0
    const stock = Number(data.stock) || 0

    if (!data.name || !data.category || !data.price) {
      setProductMessage('Vui lòng nhập đầy đủ thông tin bắt buộc.')
      return
    }

    try {
      const file = formData.get('imageFile')
      let result
      if (file && file.size > 0) {
        // multipart/form-data with image upload
        const fd = new FormData()
        if (data.id) fd.append('id', data.id)
        fd.append('name', data.name)
        fd.append('category', data.category)
        fd.append('description', data.description || '')
        fd.append('price', String(price))
        fd.append('stock', String(stock))
        fd.append('status', data.status || 'visible')
        fd.append('imageFile', file)

        const method = data.id ? 'PUT' : 'POST'
        const url = data.id ? `/products/${data.id}` : '/products'

        const res = await fetch(API_BASE_URL + url, {
          method,
          headers: (() => {
            const headers = {}
            try {
              const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
              if (token) headers['Authorization'] = 'Bearer ' + token
            } catch {}
            return headers
          })(),
          body: fd,
        })
        if (!res.ok) {
          throw new Error('Lỗi khi lưu sản phẩm.')
        }
        result = await res.json()
      } else {
        // JSON only, no file
        if (data.id) {
          result = await apiPut(`/products/${data.id}`, {
            name: data.name,
            category: data.category,
            description: data.description,
            price,
            image: data.image,
            stock,
            status: data.status || 'visible',
          })
        } else {
          result = await apiPost('/products', {
            name: data.name,
            category: data.category,
            description: data.description,
            price,
            image: data.image,
            stock,
            status: data.status || 'visible',
          })
        }
      }

      if (data.id) {
        setProducts((prev) => prev.map((p) => (p.id === result.id ? result : p)))
      } else {
        setProducts((prev) => [...prev, result])
      }

      setProductMessage('Lưu sản phẩm thành công.')
      setEditingProduct(null)
    } catch (err) {
      console.error(err)
      setProductMessage('Không lưu được sản phẩm. Vui lòng kiểm tra backend / quyền admin.')
    }
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />
  }

  return (
    <div id="admin">
      <section className="section section-admin">
        <div className="container admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-user">
              <div className="admin-avatar">🐾</div>
              <div>
                <p>{user.fullName || 'Admin'}</p>
                <span className="admin-role">Quản trị viên</span>
              </div>
            </div>
            <nav className="admin-nav">
              <button
                className={`admin-link ${section === 'bookings' ? 'admin-link-active' : ''}`}
                onClick={() => setSection('bookings')}
              >
                Quản lý đặt lịch
              </button>
              <button
                className={`admin-link ${section === 'products' ? 'admin-link-active' : ''}`}
                onClick={() => setSection('products')}
              >
                Quản lý sản phẩm
              </button>
              <button
                className={`admin-link ${section === 'stats' ? 'admin-link-active' : ''}`}
                onClick={() => setSection('stats')}
              >
                Thống kê báo cáo
              </button>
              <button className="admin-link" onClick={logout}>
                Đăng xuất
              </button>
            </nav>
          </aside>

          <div className="admin-main">
            {loadError && <p className="form-message error">{loadError}</p>}

            {section === 'bookings' && (
              <div className="admin-section admin-section-active" id="adminBookings">
                <div className="admin-section-header">
                  <h2>Quản lý đặt lịch</h2>
                  <div className="admin-filters">
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã</th>
                        <th>Tên khách</th>
                        <th>SĐT</th>
                        <th>Tên thú cưng</th>
                        <th>Dịch vụ</th>
                        <th>Ngày giờ</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length ? (
                        filteredBookings.map((bk) => (
                          <tr key={bk.id}>
                            <td>{bk.id}</td>
                            <td>{bk.ownerName}</td>
                            <td>{bk.phone}</td>
                            <td>{bk.petName}</td>
                            <td>{bk.service}</td>
                            <td>
                              {bk.date} {bk.time}
                            </td>
                            <td>
                              <span className={`badge-status ${bk.status}`}>
                                {bk.status === 'pending'
                                  ? 'Chờ duyệt'
                                  : bk.status === 'approved'
                                  ? 'Đã duyệt'
                                  : 'Đã hủy'}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="approve"
                                  onClick={() => handleBookingStatus(bk.id, 'approved')}
                                >
                                  Duyệt
                                </button>
                                <button
                                  className="cancel"
                                  onClick={() => handleBookingStatus(bk.id, 'cancelled')}
                                >
                                  Hủy
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8}>Chưa có lịch đặt phù hợp.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="table-note">
                  * Dữ liệu được lưu trên backend (file JSON) cho mục đích demo.
                </p>
              </div>
            )}

            {section === 'products' && (
              <div className="admin-section admin-section-active" id="adminProducts">
                <div className="admin-section-header">
                  <h2>Quản lý sản phẩm</h2>
                  <button className="btn btn-primary" onClick={() => handleEditProduct({})}>
                    + Thêm sản phẩm
                  </button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Hình</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length ? (
                        products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <img
                                src={p.image || 'https://placehold.co/80x80'}
                                alt={p.name}
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '0.75rem',
                                  objectFit: 'cover',
                                }}
                              />
                            </td>
                            <td>{p.name}</td>
                            <td>{getCategoryLabel(p.category)}</td>
                            <td>{formatCurrency(p.price)}</td>
                            <td>{p.stock ?? 0}</td>
                            <td>{p.status === 'visible' ? 'Hiển thị' : 'Ẩn'}</td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="approve"
                                  onClick={() => handleEditProduct(p)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="cancel"
                                  onClick={() => handleDeleteProduct(p.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>Chưa có sản phẩm nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {editingProduct && (
                  <div className="modal show">
                    <div
                      className="modal-backdrop"
                      onClick={() => setEditingProduct(null)}
                    ></div>
                    <div className="modal-content card">
                      <div className="modal-header">
                        <h3>{editingProduct.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
                        <button
                          className="modal-close"
                          onClick={() => setEditingProduct(null)}
                        >
                          &times;
                        </button>
                      </div>
                      <form onSubmit={handleSaveProduct}>
                        <input type="hidden" name="id" defaultValue={editingProduct.id || ''} />
                        <div className="form-group">
                          <label>
                            Tên sản phẩm<span>*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={editingProduct.name || ''}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Danh mục<span>*</span>
                          </label>
                          <select
                            name="category"
                            defaultValue={editingProduct.category || 'food'}
                            required
                          >
                            <option value="food">Thức ăn</option>
                            <option value="litter">Cát vệ sinh</option>
                            <option value="cage">Chuồng / balo</option>
                            <option value="toy">Đồ chơi / phụ kiện</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Mô tả</label>
                          <textarea
                            name="description"
                            rows="3"
                            defaultValue={editingProduct.description || ''}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Giá (VND)<span>*</span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            min="0"
                            defaultValue={editingProduct.price || 0}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Link hình ảnh</label>
                          <input
                            type="url"
                            name="image"
                            placeholder="https://..."
                            defaultValue={editingProduct.image || ''}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tồn kho</label>
                          <input
                            type="number"
                            name="stock"
                            min="0"
                            defaultValue={editingProduct.stock || 0}
                          />
                        </div>
                        <div className="form-group">
                          <label>Trạng thái</label>
                          <select
                            name="status"
                            defaultValue={editingProduct.status || 'visible'}
                          >
                            <option value="visible">Hiển thị</option>
                            <option value="hidden">Ẩn</option>
                          </select>
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn btn-primary">
                            Lưu
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setEditingProduct(null)}
                          >
                            Hủy
                          </button>
                        </div>
                        <p className="form-message">{productMessage}</p>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'stats' && (
              <div className="admin-section admin-section-active" id="adminStats">
                <div className="admin-section-header">
                  <h2>Thống kê báo cáo</h2>
                </div>
                <div className="stats-grid">
                  <div className="card stat-card">
                    <h3>Doanh thu theo tháng (demo)</h3>
                    <RevenueChart />
                  </div>
                  <div className="card stat-card">
                    <h3>Số lượng đặt lịch theo ngày (demo)</h3>
                    <BookingChart />
                  </div>
                  <div className="card stat-card">
                    <h3>Dịch vụ được đặt nhiều nhất (demo)</h3>
                    <ServiceChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
