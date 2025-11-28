
import React, { useState } from 'react'
import { useScrollAnimation } from './useScrollAnimation'
import { apiPost } from './utils'

export default function Services() {
  useScrollAnimation()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    const data = Object.fromEntries(new FormData(e.target).entries())

    const payload = {
      ownerName: data.ownerName,
      phone: data.phone,
      email: data.email || '',
      petName: data.petName,
      petType: data.petType,
      petBreed: data.petBreed || '',
      petWeight: data.petWeight || '',
      petAge: data.petAge || '',
      service: data.service,
      date: data.date,
      time: data.time,
      note: data.note || '',
    }

    try {
      await apiPost('/bookings', payload)
      setMessage('Yêu cầu đặt lịch của bạn đã được gửi. Chúng tôi sẽ liên hệ xác nhận.')
      e.target.reset()
    } catch (err) {
      setError('Không gửi được yêu cầu. Vui lòng kiểm tra lại server backend.')
    }
  }

  return (
    <div id="services">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Dịch vụ thú y tại PetCare</h2>
          <p className="section-subtitle">
            Danh sách dịch vụ đa dạng, đáp ứng mọi nhu cầu chăm sóc thú cưng.
          </p>
          <div className="service-grid">
            {[
              { icon: '🩺', title: 'Khám tổng quát', price: 'Từ 200.000đ', text: 'Kiểm tra sức khỏe tổng quát, phát hiện sớm bệnh lý.' },
              { icon: '💉', title: 'Tiêm phòng', price: 'Từ 150.000đ', text: 'Đảm bảo lịch tiêm phòng đúng chuẩn, đầy đủ.' },
              { icon: '🩻', title: 'Siêu âm - X-quang', price: 'Từ 300.000đ', text: 'Chẩn đoán hình ảnh với thiết bị tiên tiến.' },
              { icon: '🩹', title: 'Phẫu thuật', price: 'Theo từng ca', text: 'Phẫu thuật ngoại khoa, triệt sản, xử lý chấn thương.' },
              { icon: '🏠', title: 'Lưu trú', price: 'Từ 150.000đ/đêm', text: 'Nhà nghỉ thú cưng với không gian thoáng mát, sạch sẽ.' },
              { icon: '🧼', title: 'Spa - Tắm & Grooming', price: 'Từ 200.000đ', text: 'Tắm, sấy, cắt tỉa lông, vệ sinh toàn diện.' },
            ].map((s) => (
              <div key={s.title} className="card service-card animate-on-scroll">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="badge">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Đặt lịch khám</h2>
          <p className="section-subtitle">
            Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ để xác nhận lịch hẹn.
          </p>
          <form className="form-grid card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Họ tên chủ thú cưng<span>*</span>
              </label>
              <input type="text" name="ownerName" required />
            </div>
            <div className="form-group">
              <label>
                Số điện thoại<span>*</span>
              </label>
              <input type="tel" name="phone" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" />
            </div>

            <div className="form-group">
              <label>
                Tên thú cưng<span>*</span>
              </label>
              <input type="text" name="petName" required />
            </div>
            <div className="form-group">
              <label>
                Loài<span>*</span>
              </label>
              <select name="petType" required>
                <option value="">-- Chọn --</option>
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Giống</label>
              <input type="text" name="petBreed" />
            </div>

            <div className="form-group">
              <label>Cân nặng (kg)</label>
              <input type="number" step="0.1" min="0" name="petWeight" />
            </div>
            <div className="form-group">
              <label>Tuổi (năm)</label>
              <input type="number" min="0" name="petAge" />
            </div>

            <div className="form-group form-group-full">
              <label>
                Dịch vụ<span>*</span>
              </label>
              <select name="service" required>
                <option value="">-- Chọn dịch vụ --</option>
                <option>Khám tổng quát</option>
                <option>Tiêm phòng</option>
                <option>Siêu âm - X-quang</option>
                <option>Phẫu thuật</option>
                <option>Lưu trú</option>
                <option>Spa - Tắm & Grooming</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Ngày khám<span>*</span>
              </label>
              <input type="date" name="date" required />
            </div>
            <div className="form-group">
              <label>
                Giờ khám<span>*</span>
              </label>
              <input type="time" name="time" required />
            </div>

            <div className="form-group form-group-full">
              <label>Ghi chú thêm</label>
              <textarea
                name="note"
                rows="3"
                placeholder="Tình trạng hiện tại của thú cưng..."
              ></textarea>
            </div>

            <div className="form-actions form-group-full">
              <button type="submit" className="btn btn-primary">
                Gửi yêu cầu đặt lịch
              </button>
              {message && <p className="form-message success">{message}</p>}
              {error && <p className="form-message error">{error}</p>}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
