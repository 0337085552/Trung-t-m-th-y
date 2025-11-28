
import React from 'react'
import { useScrollAnimation } from './useScrollAnimation'

export default function About() {
  useScrollAnimation()

  return (
    <div id="about">
      <section className="section">
        <div className="container about-layout">
          <div className="about-text animate-on-scroll">
            <h2 className="section-title">Về PetCare</h2>
            <p>
              PetCare được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe toàn diện
              cho thú cưng tại Việt Nam. Chúng tôi tin rằng thú cưng là một thành viên trong gia đình
              và xứng đáng nhận được tình yêu thương cũng như sự chăm sóc tốt nhất.
            </p>
            <p>
              Với đội ngũ bác sĩ thú y giàu kinh nghiệm, trang thiết bị hiện đại và quy trình làm việc
              khoa học, PetCare cam kết mang đến cho bạn trải nghiệm dịch vụ chuyên nghiệp, tận tâm.
            </p>
            <ul className="about-list">
              <li>Sứ mệnh: Chăm sóc sức khỏe và hạnh phúc cho thú cưng.</li>
              <li>Tầm nhìn: Trở thành hệ thống thú y uy tín hàng đầu.</li>
              <li>Giá trị: Tận tâm - Chuyên nghiệp - Minh bạch.</li>
            </ul>
          </div>
          <div className="about-gallery animate-on-scroll">
            <img
              src="https://images.pexels.com/photos/7469410/pexels-photo-7469410.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Phòng khám thú y"
            />
            <img
              src="https://images.pexels.com/photos/6235237/pexels-photo-6235237.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Cơ sở vật chất"
            />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Đội ngũ bác sĩ</h2>
          <div className="doctor-grid">
            {[
              {
                name: 'BS. Nguyễn Minh Khoa',
                specialty: 'Chuyên khoa nội - ngoại tổng quát',
                exp: '12 năm kinh nghiệm',
                text: 'Đặc biệt trong điều trị bệnh lý tiêu hóa, hô hấp ở chó mèo.',
                img: 'https://images.pexels.com/photos/6234583/pexels-photo-6234583.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
              {
                name: 'BS. Trần Thảo Vy',
                specialty: 'Chẩn đoán hình ảnh & phẫu thuật',
                exp: '9 năm kinh nghiệm',
                text: 'Phụ trách siêu âm, X-quang và các ca phẫu thuật chuyên sâu.',
                img: 'https://images.pexels.com/photos/6234604/pexels-photo-6234604.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
              {
                name: 'BS. Lê Quang Huy',
                specialty: 'Dinh dưỡng & hành vi',
                exp: '7 năm kinh nghiệm',
                text: 'Tư vấn chế độ ăn, chăm sóc đặc biệt và hành vi thú cưng.',
                img: 'https://images.pexels.com/photos/6234601/pexels-photo-6234601.jpeg?auto=compress&cs=tinysrgb&w=800',
              },
            ].map((d) => (
              <div key={d.name} className="card doctor-card animate-on-scroll">
                <img src={d.img} alt={d.name} />
                <div className="doctor-info">
                  <h3>{d.name}</h3>
                  <p className="doctor-specialty">{d.specialty}</p>
                  <p className="doctor-exp">{d.exp}</p>
                  <p>{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
