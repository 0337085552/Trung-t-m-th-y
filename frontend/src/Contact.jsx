
import React, { useState } from 'react'
import { useScrollAnimation } from './useScrollAnimation'

export default function Contact() {
  useScrollAnimation()
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cảm ơn bạn đã liên hệ, chúng tôi sẽ phản hồi sớm nhất có thể.')
    e.target.reset()
  }

  return (
    <div id="contact">
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info animate-on-scroll">
            <h2 className="section-title">Liên hệ với PetCare</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua thông tin bên dưới.
            </p>
            <ul className="contact-list">
              <li>
                <strong>Địa chỉ:</strong> 123 Đường Thú Cưng, Quận 1, TP. Hồ Chí Minh
              </li>
              <li>
                <strong>Điện thoại:</strong> <a href="tel:0123456789">0123 456 789</a>
              </li>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:contact@petcare.vn">contact@petcare.vn</a>
              </li>
              <li>
                <strong>Giờ làm việc:</strong> 8:00 - 21:00 (Thứ 2 - Chủ nhật)
              </li>
            </ul>
            <div className="contact-map">
              <iframe
                title="Bản đồ PetCare"
                src="https://maps.google.com/maps?q=Ho%20Chi%20Minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div className="contact-form-wrapper animate-on-scroll">
            <h3>Gửi liên hệ</h3>
            <form className="card" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Họ tên<span>*</span>
                </label>
                <input type="text" name="name" required />
              </div>
              <div className="form-group">
                <label>
                  Email hoặc số điện thoại<span>*</span>
                </label>
                <input type="text" name="contact" required />
              </div>
              <div className="form-group">
                <label>
                  Nội dung cần hỗ trợ<span>*</span>
                </label>
                <textarea name="message" rows="4" required />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Gửi liên hệ
                </button>
              </div>
              <p className={`form-message ${message ? 'success' : ''}`}>{message}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
