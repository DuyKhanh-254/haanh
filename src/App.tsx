import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Heart,
  Home as HomeIcon,
  Menu,
  MessageCircleHeart,
  Search,
  Sparkles,
  Stars,
  X,
} from 'lucide-react'
import { assignments } from './data'
import type { Assignment } from './types'

type Route = 'home' | 'projects' | 'summary' | 'thanks' | `assignment-${number}`

const navigation = [
  { id: 'home', label: 'Trang chủ', icon: HomeIcon },
  { id: 'projects', label: 'Bài tập', icon: FolderOpen },
  { id: 'summary', label: 'Tổng kết', icon: Stars },
  { id: 'thanks', label: 'Lời cảm ơn', icon: Heart },
] as const

function getRoute(): Route {
  const route = window.location.hash.replace('#/', '').replace('#', '')
  if (/^assignment-[1-6]$/.test(route)) return route as Route
  if (['home', 'projects', 'summary', 'thanks'].includes(route)) return route as Route
  return 'home'
}

function go(route: Route) {
  window.location.hash = `/${route}`
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function AmbientDecor() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="orb orb-one" />
      <span className="orb orb-two" />
      <span className="spark spark-one">✦</span>
      <span className="spark spark-two">✧</span>
      <span className="spark spark-three">✦</span>
    </div>
  )
}

function Sidebar({ route, open, close, toggle }: { route: Route; open: boolean; close: () => void; toggle: () => void }) {
  const current = route.startsWith('assignment-') ? 'projects' : route

  return (
    <>
      <button className="menu-button" onClick={toggle} aria-label={open ? 'Đóng trình đơn' : 'Mở trình đơn'}>
        {open ? <X /> : <Menu />}
      </button>
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <button className="identity" onClick={() => go('home')} aria-label="Về trang chủ">
          <img src="./avatar.jpg" alt="Bùi Hà Anh" />
          <span>HA</span>
        </button>
        <nav aria-label="Điều hướng chính">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = current === item.id
            return (
              <button
                key={item.id}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => {
                  go(item.id)
                  close()
                }}
                aria-current={active ? 'page' : undefined}
              >
                <span className="nav-node"><Icon size={19} /></span>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <span className="sidebar-mark">BHA · 2026</span>
      </aside>
      {open && <button className="nav-backdrop" aria-label="Đóng trình đơn" onClick={close} />}
    </>
  )
}

function SectionIntro({ kicker, title, accent, description }: { kicker: string; title: string; accent?: string; description: string }) {
  return (
    <header className="section-intro reveal">
      <span className="kicker"><Sparkles size={14} /> {kicker}</span>
      <h1>{title} {accent && <em>{accent}</em>}</h1>
      <p>{description}</p>
    </header>
  )
}

function Home() {
  return (
    <div className="home-page page-shell">
      <section className="hero">
        <div className="hero-copy reveal">
          <span className="kicker"><Sparkles size={14} /> Digital learning portfolio</span>
          <p className="hello">Xin chào, mình là</p>
          <h1>Bùi Hà Anh</h1>
          <h2>sinh viên <em>Ngôn ngữ &amp; Văn hóa Hàn Quốc.</em></h2>
          <p className="hero-description">
            Mình là sinh viên Trường Đại học Ngoại ngữ – ĐHQGHN. Portfolio này ghi lại sáu sản phẩm thực hành của học phần Nhập môn Công nghệ số và Ứng dụng trí tuệ nhân tạo, từ quản lý dữ liệu đến sử dụng AI có trách nhiệm.
          </p>
          <div className="identity-chips">
            <span>MSSV 25042320</span>
            <span>ULIS · VNU</span>
            <span>VNU1001_E252064</span>
          </div>
          <div className="hero-actions">
            <button className="button primary" onClick={() => go('projects')}>Khám phá bài tập <ArrowRight size={17} /></button>
            <button className="button ghost" onClick={() => go('summary')}>Xem tổng kết</button>
          </div>
        </div>

        <div className="profile-stage reveal delay-one">
          <span className="profile-scribble">Hành trình số<br />của mình ↘</span>
          <div className="profile-halo" />
          <figure className="profile-card">
            <img src="./avatar.jpg" alt="Ảnh chân dung Bùi Hà Anh" />
            <figcaption>
              <span>안녕하세요!</span>
              <strong>Hà Anh · ULIS</strong>
            </figcaption>
          </figure>
          <div className="floating-note note-one"><BookOpen size={22} /><span>06 bài học</span></div>
          <div className="floating-note note-two"><Sparkles size={22} /><span>AI có trách nhiệm</span></div>
        </div>
      </section>

      <section className="featured reveal">
        <div className="featured-heading">
          <span className="index">01</span>
          <div><small>FEATURED JOURNEY</small><h3>Sáu dấu mốc, một hành trình trưởng thành số.</h3></div>
        </div>
        <button className="featured-preview" onClick={() => go('projects')}>
          <img src="./report-pages/bai-3/page-1.png" alt="Trang đầu bài tập viết prompt" />
          <span className="preview-caption"><strong>Viết prompt hiệu quả</strong><small>Xem toàn bộ 6 bài tập</small></span>
          <span className="round-arrow"><ArrowRight /></span>
        </button>
      </section>
    </div>
  )
}

function AssignmentCard({ item, index }: { item: Assignment; index: number }) {
  return (
    <article className="project-card reveal" style={{ '--accent': item.color, '--delay': `${index * 70}ms` } as React.CSSProperties}>
      <button className="project-image" onClick={() => go(`assignment-${item.id}`)} aria-label={`Mở ${item.title}`}>
        <img src={`./report-pages/bai-${item.id}/page-1.png`} alt={`Trang đầu ${item.shortTitle}`} loading="lazy" />
        <span className="open-badge"><ArrowRight /></span>
      </button>
      <div className="project-content">
        <div className="project-meta"><span>0{item.id}</span><span>{item.eyebrow}</span></div>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <div className="tag-row">{item.skills.slice(0, 2).map((skill) => <span key={skill}>{skill}</span>)}</div>
        <button className="text-link" onClick={() => go(`assignment-${item.id}`)}>Xem nội dung đầy đủ <ArrowRight size={16} /></button>
      </div>
    </article>
  )
}

function Projects() {
  return (
    <div className="projects-page page-shell">
      <SectionIntro
        kicker="06 learning projects"
        title="Bài tập như những"
        accent="mảnh ghép phát sáng."
        description="Mỗi sản phẩm lưu lại cả kết quả và quá trình mình thực hành một kỹ năng số mới. Chọn một bài để xem toàn bộ nội dung, hình ảnh và phần đúc kết."
      />
      <div className="project-grid">
        {assignments.map((item, index) => <AssignmentCard key={item.id} item={item} index={index} />)}
      </div>
      <div className="next-section reveal">
        <span>Đã xem hết sáu sản phẩm?</span>
        <button className="button primary" onClick={() => go('summary')}>Đọc tổng kết <ArrowRight size={17} /></button>
      </div>
    </div>
  )
}

function AssignmentDetail({ item }: { item: Assignment }) {
  const pages = Array.from({ length: item.pageCount }, (_, i) => i + 1)
  const nextAssignment = assignments.find((assignment) => assignment.id === item.id + 1)
  return (
    <article className="assignment-page page-shell">
      <button className="back-link" onClick={() => go('projects')}><ArrowLeft size={17} /> Trở về danh sách bài tập</button>
      <header className="assignment-hero reveal" style={{ '--accent': item.color } as React.CSSProperties}>
        <div>
          <span className="kicker">{item.eyebrow}</span>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
        <span className="assignment-number">0{item.id}</span>
      </header>

      <section className="brief-grid reveal">
        <div className="brief-card objective-card">
          <Search size={22} />
          <div><span>Mục tiêu</span><p>{item.objective}</p></div>
        </div>
        <div className="brief-card">
          <FileText size={22} />
          <div><span>Quá trình thực hiện</span><ul>{item.process.map((step) => <li key={step}><Check size={15} />{step}</li>)}</ul></div>
        </div>
      </section>

      <section className="document-section reveal">
        <div className="document-heading">
          <div><span className="kicker">Nội dung báo cáo</span><h2>Tài liệu đầy đủ</h2></div>
          <p>{item.pageCount} trang · giữ nguyên chữ, bảng biểu và hình ảnh từ file gốc</p>
        </div>
        <div className="document-pages">
          {pages.map((page) => (
            <figure key={page} className="document-page">
              <img src={`./report-pages/bai-${item.id}/page-${page}.png`} alt={`Bài ${item.id}, trang ${page}`} loading={page > 2 ? 'lazy' : 'eager'} />
              <figcaption>Trang {page} / {item.pageCount}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="lesson-card reveal">
        <div className="lesson-icon"><Sparkles /></div>
        <div>
          <span className="kicker">Đúc kết sau bài tập</span>
          <h2>Bài học mình giữ lại</h2>
          <p>{item.lesson}</p>
          <div className="tag-row">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
      </section>

      <footer className="assignment-footer reveal">
        <div><small>Lưu trữ sản phẩm</small><strong>Tải báo cáo để xem ngoại tuyến</strong></div>
        <div className="footer-actions">
          {item.externalUrl && <a className="button ghost" href={item.externalUrl} target="_blank" rel="noreferrer">Xem sản phẩm Canva <ExternalLink size={17} /></a>}
          <a className="button ghost" href={`./files/bai-${item.id}.pdf`} target="_blank" rel="noreferrer">Mở PDF <ExternalLink size={17} /></a>
          <a className="button primary" href={`./files/bai-${item.id}.pdf`} download={`Bui-Ha-Anh-Bai-${item.id}.pdf`}>Tải PDF <Download size={17} /></a>
        </div>
      </footer>

      <button
        className="next-assignment reveal"
        onClick={() => go(nextAssignment ? `assignment-${nextAssignment.id}` : 'summary')}
      >
        <span>
          <small>{nextAssignment ? `Bài 0${nextAssignment.id}` : 'Hoàn thành 06 bài tập'}</small>
          <strong>{nextAssignment ? nextAssignment.shortTitle : 'Xem tổng kết hành trình'}</strong>
        </span>
        <span className="next-assignment-arrow"><ArrowRight /></span>
      </button>
    </article>
  )
}

const skillGroups = [
  { number: '01', title: 'Tư duy học thuật', text: 'Tìm kiếm có chiến lược, đánh giá nguồn và trình bày thông tin có căn cứ.', icon: Search, color: '#ffd8a8' },
  { number: '02', title: 'Cộng tác số', text: 'Phân công, theo dõi tiến độ và phối hợp trên không gian trực tuyến.', icon: MessageCircleHeart, color: '#d7e9de' },
  { number: '03', title: 'Làm việc với AI', text: 'Viết prompt rõ ràng, kiểm chứng đầu ra và sáng tạo nội dung có chủ đích.', icon: Sparkles, color: '#f6dce7' },
  { number: '04', title: 'Trách nhiệm số', text: 'Giữ liêm chính học thuật, minh bạch công cụ và bảo vệ dữ liệu cá nhân.', icon: Check, color: '#cfe4f5' },
]

function Summary() {
  return (
    <div className="summary-page page-shell">
      <SectionIntro
        kicker="Reflection & growth"
        title="Điều còn lại sau"
        accent="mỗi lần thực hành."
        description="Sáu bài tập không chỉ tạo ra sáu sản phẩm. Chúng giúp mình nhìn rõ hơn cách học, cách cộng tác và cách dùng công nghệ một cách tỉnh táo."
      />
      <section className="skills-layout">
        <div className="skill-list">
          {skillGroups.map((skill, index) => {
            const Icon = skill.icon
            return (
              <article className="skill-card reveal" key={skill.number} style={{ '--accent': skill.color, '--delay': `${index * 80}ms` } as React.CSSProperties}>
                <span className="skill-number">{skill.number}</span>
                <span className="skill-icon"><Icon /></span>
                <div><h2>{skill.title}</h2><p>{skill.text}</p></div>
              </article>
            )
          })}
        </div>
        <article className="reflection-panel reveal delay-one">
          <span className="kicker">Lời kết hành trình</span>
          <blockquote>“Công nghệ có ý nghĩa khi giúp mình học sâu hơn, làm việc rõ ràng hơn và hành động có trách nhiệm hơn.”</blockquote>
          <p>
            Ban đầu, việc chọn lọc nguồn, phối hợp nhiều công cụ và kiểm tra đầu ra AI khiến mình mất khá nhiều thời gian. Qua từng bài tập, mình dần biết chia nhỏ nhiệm vụ, đặt câu hỏi chính xác và tự đánh giá chất lượng sản phẩm thay vì chỉ chờ một đáp án có sẵn.
          </p>
          <p>
            Điều mình tâm đắc nhất là công nghệ không thay thế quá trình học. Nó mở rộng khả năng của người học khi được sử dụng minh bạch, có kiểm chứng và đi cùng trách nhiệm cá nhân.
          </p>
          <div className="reflection-sign"><span>Bùi Hà Anh</span><small>ULIS · 2026</small></div>
        </article>
      </section>
      <div className="summary-cta reveal">
        <div><span>Chặng cuối</span><h2>Một lời cảm ơn chân thành.</h2></div>
        <button className="button primary" onClick={() => go('thanks')}>Đi tới lời cảm ơn <ArrowRight size={17} /></button>
      </div>
    </div>
  )
}

function Thanks() {
  return (
    <div className="thanks-page page-shell">
      <section className="thanks-card reveal">
        <span className="thanks-star">✦</span>
        <span className="kicker"><Heart size={14} /> The final note</span>
        <h1>Cảm ơn thầy cô<br /><em>đã đồng hành.</em></h1>
        <div className="thanks-divider"><span /><Heart size={18} /><span /></div>
        <p>
          Em xin chân thành cảm ơn thầy cô đã tận tình hướng dẫn trong suốt học phần Nhập môn Công nghệ số và Ứng dụng trí tuệ nhân tạo. Những kiến thức, góp ý và cơ hội thực hành đã giúp em tự tin hơn khi học tập trong môi trường số.
        </p>
        <p>
          Portfolio này là dấu mốc nhỏ ghi lại sự trưởng thành của em. Em sẽ tiếp tục rèn luyện để sử dụng công nghệ hiệu quả, sáng tạo và có trách nhiệm hơn trong những chặng đường sắp tới.
        </p>
        <figure className="thanks-portrait"><img src="./avatar.jpg" alt="Bùi Hà Anh" /><figcaption>Trân trọng · Bùi Hà Anh</figcaption></figure>
        <button className="button primary" onClick={() => go('home')}>Trở về trang chủ <ArrowRight size={17} /></button>
      </section>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) window.location.hash = '/home'
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const assignment = useMemo(() => {
    if (!route.startsWith('assignment-')) return null
    return assignments.find((item) => item.id === Number(route.split('-')[1])) ?? null
  }, [route])

  return (
    <div className="app">
      <AmbientDecor />
      <Sidebar route={route} open={menuOpen} close={() => setMenuOpen(false)} toggle={() => setMenuOpen((value) => !value)} />
      <main>
        {route === 'home' && <Home />}
        {route === 'projects' && <Projects />}
        {route === 'summary' && <Summary />}
        {route === 'thanks' && <Thanks />}
        {assignment && <AssignmentDetail item={assignment} />}
      </main>
      <button className="scroll-cue" onClick={() => window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' })} aria-label="Cuộn xuống"><ArrowDown size={17} /></button>
    </div>
  )
}

export default App
