
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, getCategoryLabel, formatCurrency } from './utils'
import { useScrollAnimation } from './useScrollAnimation'

const testimonials = [
  {
    name: 'Ngọc Anh',
    role: 'Sen của mèo Mimi',
    text: 'Bác sĩ rất nhẹ nhàng, tư vấn kỹ. Mình hoàn toàn yên tâm khi đưa Mimi đến đây.',
    avatar:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Quốc Huy',
    role: 'Sen của cún Bắp',
    text: 'Dịch vụ spa rất tốt, Bắp lúc nào cũng sạch thơm sau khi tắm ở PetCare.',
    avatar:
      'https://images.pexels.com/photos/745045/pexels-photo-745045.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Mai Trang',
    role: 'Sen của mèo Mỡ',
    text: 'Đội ngũ bác sĩ rất tận tâm, hỗ trợ Mỡ vượt qua ca phẫu thuật khó. Cảm ơn PetCare!',
    avatar:
      'https://images.pexels.com/photos/4587182/pexels-photo-4587182.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)

  useScrollAnimation([category])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await apiGet('/products')
        if (!cancelled) {
          setProducts(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không tải được danh sách sản phẩm. Vui lòng kiểm tra lại server backend.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts =
    category === 'all' ? products : products.filter((p) => p.category === category)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div id="home">
      <section className="hero section">
        <div className="container hero-inner">
          <div className="hero-content animate-on-scroll">
            <h1>Trung tâm thú y chăm sóc thú cưng toàn diện</h1>
            <p>
              PetCare mang đến dịch vụ khám chữa bệnh, tiêm phòng, spa - grooming, lưu trú
              và cấp cứu 24/7 cho thú cưng của bạn.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/services')}>
                Đặt lịch khám
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/services')}>
                Xem dịch vụ
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat-number">10+</span>
                <span className="stat-label">Năm kinh nghiệm</span>
              </div>
              <div>
                <span className="stat-number">5K+</span>
                <span className="stat-label">Thú cưng đã chăm sóc</span>
              </div>
              <div>
                <span className="stat-number">24/7</span>
                <span className="stat-label">Cấp cứu</span>
              </div>
            </div>
          </div>
          <div className="hero-image animate-on-scroll">
            <div className="hero-card">
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.MmvH90tt7_8X3BnzO1FwPQHaFL?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Bác sĩ thú y và thú cưng"
              />
              <div className="hero-floating-card">
                <span>⭐ 4.9/5</span>
                <p>Hơn 1.000+ đánh giá hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section features">
        <div className="container">
          <h2 className="section-title">Tiện ích nổi bật</h2>
          <p className="section-subtitle">
            Tất cả những gì thú cưng của bạn cần, trong một trung tâm duy nhất.
          </p>
          <div className="feature-grid">
            {[
              { icon: '🩺', title: 'Khám & chữa bệnh', text: 'Bác sĩ thú y nhiều kinh nghiệm, trang thiết bị hiện đại.' },
              { icon: '💉', title: 'Tiêm phòng', text: 'Phác đồ tiêm phòng đầy đủ, theo khuyến cáo quốc tế.' },
              { icon: '🧼', title: 'Spa & Grooming', text: 'Tắm, cắt tỉa lông, vệ sinh tai - răng nhẹ nhàng, thư giãn.' },
              { icon: '🏠', title: 'Lưu trú', text: 'Không gian lưu trú sạch sẽ, an toàn, có camera quan sát.' },
              { icon: '🚑', title: 'Cấp cứu 24/7', text: 'Luôn sẵn sàng hỗ trợ trong mọi tình huống khẩn cấp.' },
              { icon: '❤️', title: 'Tư vấn dinh dưỡng', text: 'Thiết kế khẩu phần ăn phù hợp cho từng thú cưng.' },
            ].map((f) => (
              <div key={f.title} className="card feature-card animate-on-scroll">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section products">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Sản phẩm cho thú cưng</h2>
              <p className="section-subtitle">
                Lựa chọn đa dạng cho chó, mèo với nguồn gốc rõ ràng.
              </p>
            </div>
            <div className="product-filters">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'food', label: 'Thức ăn' },
                { key: 'litter', label: 'Cát vệ sinh' },
                { key: 'cage', label: 'Chuồng / balo' },
                { key: 'toy', label: 'Đồ chơi / phụ kiện' },
              ].map((c) => (
                <button
                  key={c.key}
                  className={`chip ${category === c.key ? 'chip-active' : ''}`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {loading && <p>Đang tải sản phẩm...</p>}
          {error && <p className="form-message error">{error}</p>}
          <div className="product-grid">
            {!loading && !error && (
              filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <article key={product.id} className="card product-card animate-on-scroll">
                    <div className="product-thumb">
                      <img
                        src={
                          product.image ||
                          'https://placehold.co/400x300?text=Pet+Product'
                        }
                        alt={product.name}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{getCategoryLabel(product.category)}</p>
                      <p className="product-price">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-outline btn-sm">Xem chi tiết</button>
                      <button className="btn btn-primary btn-sm">Thêm vào giỏ</button>
                    </div>
                  </article>
                ))
              ) : (
                <p>Chưa có sản phẩm phù hợp trong danh mục này.</p>
              )
            )}
          </div>
          <div className="promo-banner animate-on-scroll">
            <div className="promo-content">
              <h3>Combo chăm sóc toàn diện - Giảm đến 20%</h3>
              <p>
                Gồm khám tổng quát, tắm spa, cắt tỉa lông và tư vấn dinh dưỡng cho thú cưng.
              </p>
              <button className="btn btn-light" onClick={() => navigate('/services')}>
                Đặt lịch combo ngay
              </button>
            </div>
            <div className="promo-image">
              <img
                src="https://images.pexels.com/photos/5731865/pexels-photo-5731865.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Thú cưng dễ thương"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">Khách hàng nói gì về PetCare</h2>
          <div className="testimonial-slider" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-avatar">
                  <img src={t.avatar} alt={t.name} />
                </div>
                <div className="testimonial-content">
                  <h3>{t.name}</h3>
                  <p className="testimonial-role">{t.role}</p>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-rating">★★★★★</div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-controls">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === activeSlide ? 'slider-dot-active' : ''}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2>Liên hệ ngay để được tư vấn miễn phí</h2>
            <p>
              Đội ngũ bác sĩ thú y luôn sẵn sàng hỗ trợ bạn trong việc chăm sóc thú cưng.
            </p>
          </div>
          <div className="cta-actions">
            <a href="tel:0123456789" className="btn btn-light">
              Gọi ngay
            </a>
            <button className="btn btn-outline" onClick={() => navigate('/services')}>
              Đặt lịch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
