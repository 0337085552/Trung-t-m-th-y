
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './authContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const navClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' active' : '')

  return (
    <header className="main-header">
      <div className="container header-inner">
        <div
          className="logo"
          onClick={() => {
            navigate('/')
          }}
        >
          <span className="logo-icon">🐾</span>
          <div className="logo-text">
            <span className="logo-title">PetCare</span>
            <span className="logo-subtitle">Trung tâm thú y</span>
          </div>
        </div>
        <nav className={`main-nav ${open ? 'show' : ''}`}>
          <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
            Trang chủ
          </NavLink>
          <NavLink to="/services" className={navClass} onClick={() => setOpen(false)}>
            Dịch vụ
          </NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>
            Giới thiệu
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => setOpen(false)}>
            Liên hệ
          </NavLink>
          <NavLink to="/auth" className={navClass} onClick={() => setOpen(false)}>
            {user ? `Xin chào, ${user.fullName || 'Người dùng'}` : 'Đăng nhập / Đăng ký'}
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                'nav-link nav-admin' + (isActive ? ' active' : '')
              }
              onClick={() => setOpen(false)}
            >
              Admin
            </NavLink>
          )}
        </nav>
        <button className="btn btn-primary btn-cta" onClick={() => navigate('/services')}>
          Đặt lịch ngay
        </button>
        <button
          className="nav-toggle"
          aria-label="Mở menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
