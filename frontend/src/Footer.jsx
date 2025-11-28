
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">🐾</span>
            <div className="logo-text">
              <span className="logo-title">PetCare</span>
              <span className="logo-subtitle">Trung tâm thú y</span>
            </div>
          </div>
          <p>
            Chăm sóc thú cưng toàn diện với đội ngũ bác sĩ thú y tận tâm và giàu kinh nghiệm.
          </p>
        </div>
        <div className="footer-links">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/services">Dịch vụ</Link>
            </li>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <button
                style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer' }}
                onClick={() => alert('Trang chính sách đang được cập nhật')}
              >
                Chính sách bảo mật
              </button>
            </li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Liên hệ</h4>
          <ul>
            <li>📍 123 Đường Thú Cưng, Quận 1, TP.HCM</li>
            <li>📞 0123 456 789</li>
            <li>✉️ contact@petcare.vn</li>
          </ul>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              📘
            </a>
            <a href="#" aria-label="Instagram">
              📸
            </a>
            <a href="#" aria-label="TikTok">
              🎵
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 PetCare Veterinary Center. All rights reserved.</p>
      </div>
    </footer>
  )
}
