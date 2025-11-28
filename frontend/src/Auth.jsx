
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './authContext'
import { useScrollAnimation } from './useScrollAnimation'

export default function Auth() {
  useScrollAnimation()
  const [tab, setTab] = useState('login')
  const { login, register } = useAuth()
  const [loginMessage, setLoginMessage] = useState('')
  const [loginStatus, setLoginStatus] = useState('')
  const [registerMessage, setRegisterMessage] = useState('')
  const [registerStatus, setRegisterStatus] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginMessage('')
    setLoginStatus('')
    const data = Object.fromEntries(new FormData(e.target).entries())
    const res = await login(data.identifier, data.password)
    if (!res.success) {
      setLoginMessage(res.message)
      setLoginStatus('error')
      return
    }
    setLoginMessage('Đăng nhập thành công!')
    setLoginStatus('success')
    if (res.user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterMessage('')
    setRegisterStatus('')
    const data = Object.fromEntries(new FormData(e.target).entries())
    if (data.password !== data.confirmPassword) {
      setRegisterMessage('Mật khẩu xác nhận không khớp.')
      setRegisterStatus('error')
      return
    }
    const res = await register({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    })
    if (!res.success) {
      setRegisterMessage(res.message || 'Đăng ký thất bại.')
      setRegisterStatus('error')
      return
    }
    setRegisterMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.')
    setRegisterStatus('success')
    e.target.reset()
  }

  return (
    <div id="auth">
      <section className="section section-auth">
        <div className="container auth-layout">
          <div className="auth-intro animate-on-scroll">
            <h2>Chào mừng đến với PetCare</h2>
            <p>
              Đăng nhập để quản lý lịch hẹn, theo dõi thú cưng của bạn
              hoặc truy cập bảng điều khiển Admin nếu bạn là quản trị viên.
            </p>
            <ul>
              <li>Khách hàng: đặt lịch, xem thông tin cơ bản.</li>
              <li>Admin: quản lý đặt lịch, sản phẩm, xem thống kê.</li>
            </ul>
            <div className="auth-demo">
              <p>
                <strong>Tài khoản admin mẫu:</strong>
              </p>
              <p>
                Email: <code>admin@petcare.vn</code>
              </p>
              <p>
                Mật khẩu: <code>123456</code>
              </p>
            </div>
          </div>
          <div className="auth-forms card animate-on-scroll">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'login' ? 'auth-tab-active' : ''}`}
                onClick={() => setTab('login')}
              >
                Đăng nhập
              </button>
              <button
                className={`auth-tab ${tab === 'register' ? 'auth-tab-active' : ''}`}
                onClick={() => setTab('register')}
              >
                Đăng ký
              </button>
            </div>
            {tab === 'login' ? (
              <div className="auth-tab-content auth-tab-content-active" id="loginTab">
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label>Email / Tên đăng nhập</label>
                    <input type="text" name="identifier" required />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="form-group form-remember">
                    <label>
                      <input type="checkbox" name="remember" />
                      Nhớ tôi
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Đăng nhập
                    </button>
                  </div>
                  <p className={`form-message ${loginStatus}`}>{loginMessage}</p>
                </form>
              </div>
            ) : (
              <div className="auth-tab-content auth-tab-content-active" id="registerTab">
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input type="text" name="fullName" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" name="phone" required />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input type="password" name="confirmPassword" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Đăng ký
                    </button>
                  </div>
                  <p className={`form-message ${registerStatus}`}>{registerMessage}</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
