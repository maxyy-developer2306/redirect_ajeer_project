import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import './portal.css'

// Image imports (place these files in src/assets/)
import ajeerLogo from './assets/ajeer-logo.png'
import mlsdLogo from './assets/mlsd-logo.png'
import takamolLogo from './assets/takamol-logo.png'
import govtAuthLogo from './assets/digital-govt-auth-logo (1).svg'
import tamkeenLogo from './assets/tamkeen-logo-1 (1).svg'

const API_BASE_URL = (import.meta.env.VITE_MAXYY_API_BASE_URL || '').replace(/\/$/, '')
const verificationEndpoint = '/api/public/verify'

// Converts nationality to Arabic when needed
const formatNationality = (nat) => {
  if (!nat) return '-'
  const trimmed = String(nat).trim()
  if (trimmed.toLowerCase() === 'pakistani' || trimmed.toLowerCase() === 'pakistan') {
    return 'باكستاني'
  }
  return trimmed
}

// Converts gender to Arabic when needed
const formatGender = (gender) => {
  if (!gender) return '-'
  const trimmed = String(gender).trim()
  if (trimmed.toLowerCase() === 'male') return 'ذكر'
  if (trimmed.toLowerCase() === 'female') return 'أنثى'
  return trimmed
}

// Single label + value row
function Row({ label, value, ltr = false }) {
  return (
    <div className="vp-row">
      <div className="vp-label">{label}</div>
      <div dir={ltr ? 'ltr' : undefined} className="vp-value">
        {value || '-'}
      </div>
    </div>
  )
}

// Shared page layout (header + card + footer + chat button)
function PortalLayout({ children }) {
  useEffect(() => {
    // Dynamic Tajawal font injection
    if (!document.getElementById('tajawal-font')) {
      const link = document.createElement('link')
      link.id = 'tajawal-font'
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap'
      document.head.appendChild(link)
    }

    // Dynamic FontAwesome injection
    if (!document.getElementById('font-awesome-css')) {
      const faLink = document.createElement('link')
      faLink.id = 'font-awesome-css'
      faLink.rel = 'stylesheet'
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
      document.head.appendChild(faLink)
    }
  }, [])

  return (
    <div dir="rtl" className="vp-root">
      {/* Top Header */}
      <div className="vp-topbar">
        <div style={{ height: 32 }}>
          <img src={ajeerLogo} alt="أجير" style={{ height: 32, display: 'block' }} />
        </div>
        <div style={{ height: 38 }}>
          <img
            src={mlsdLogo}
            alt="وزارة الموارد البشرية والتنمية الاجتماعية"
            style={{ height: 38, display: 'block' }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="vp-container">
        {/* Main Data Card */}
        <div className="vp-card">
          {/* Banner Logo Section */}
          <div className="vp-banner">
            <img src={ajeerLogo} alt="أجير" style={{ height: 48 }} />
            <img src={mlsdLogo} alt="الموارد البشرية" style={{ height: 50 }} />
          </div>

          {/* Page Title */}
          <h1 className="vp-title">التحقق من تصريح أجير</h1>

          {children}
        </div>

        {/* Footer Navigation Links */}
        <div className="vp-footer">
          <div className="vp-footer-group">
            <h4>أجير</h4>
            <ul>
              <li>
                <a href="#">عن أجير</a>
              </li>
              <li>
                <a href="#">خدمات أجير</a>
              </li>
            </ul>
          </div>

          <div className="vp-footer-group">
            <h4>الدعم</h4>
            <ul>
              <li>
                <a href="#">الدعم و المساعدة</a>
              </li>
              <li>
                <a href="#">الأسئلة الشائعة</a>
              </li>
            </ul>
          </div>

          <div className="vp-footer-group">
            <h4>الشروط و الخصوصية</h4>
            <ul>
              <li>
                <a href="#">الشروط والأحكام</a>
              </li>
              <li>
                <a href="#">سياسة الخصوصية</a>
              </li>
            </ul>
          </div>

          <div className="vp-footer-group">
            <h4>تواصل معنا</h4>
            <div className="vp-social">
              <a href="tel:">
                <i className="fa-solid fa-phone"></i>
              </a>
              <a href="#">
                <i className="fa-solid fa-paper-plane"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Partner Logos Footer */}
        <div dir="rtl" className="vp-partners">
          <div className="vp-partners-left">
            <img
              src={mlsdLogo}
              alt="الموارد البشرية والتنمية الاجتماعية"
              style={{ height: 42, display: 'block' }}
            />
            <img src={takamolLogo} alt="تكامل Takamol" style={{ height: 30, display: 'block' }} />
          </div>

          <div className="vp-partners-right">
            <div className="vp-partner-row">
              <span>مسجل لدى</span>
              <img
                src={govtAuthLogo}
                alt="هيئة الحكومة الرقمية Digital Government Authority"
                style={{ height: 35, display: 'block' }}
              />
            </div>

            <div className="vp-partner-col">
              <span></span>
              <img
                src={tamkeenLogo}
                alt="تمكين للتقنيات Tamkeen Technologies"
                style={{ height: 32, display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Widget Button */}
      <a href="#" title="Chat Support" className="vp-chat">
        <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, fill: '#fff' }}>
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      </a>
    </div>
  )
}

// Permit details (same UI as the old portal)
function PermitDetails({ permit }) {
  return (
    <>
      {/* Status Badge */}
      <div className="vp-status">
        <span>ساري / فعال</span>
      </div>

      {/* Success Message */}
      <div className="vp-success">تم التحقق من التصريح بنجاح</div>

      {/* Section 1: Permit Details */}
      <div className="vp-section">
        <div className="vp-section-title">بيانات التصريح</div>
        <Row label="رقم التصريح" value={permit.permitNumber} ltr />
        <Row label="نوع التصريح" value={permit.permitType} />
        <Row label="تاريخ بداية التصريح" value={permit.issueDate} ltr />
        <Row label="تاريخ نهاية التصريح" value={permit.expiryDate} ltr />
      </div>

      {/* Section 2: Worker Details */}
      <div className="vp-section">
        <div className="vp-section-title">بيانات العامل</div>
        <Row label="اسم العامل" value={permit.workerName} ltr />
        <Row label="رقم الهوية / الإقامة" value={permit.iqamaNumber} ltr />
        <Row label="الجنسية" value={formatNationality(permit.nationality)} />
        <Row label="المهنة" value={permit.jobTitle} />
        <Row label="الجنس" value={formatGender(permit.gender)} />
        <Row label="تاريخ الميلاد" value={permit.dateOfBirth} ltr />
      </div>

      {/* Section 3: Establishment Details */}
      <div className="vp-section">
        <div className="vp-section-title">بيانات المنشأة</div>
        <Row label="رقم المنشأة" value={permit.iqamaMosasaNumber} ltr />
        <Row label="اسم المنشأة" value={permit.establishmentName} />
      </div>
    </>
  )
}

function VerificationPage() {
  const { token } = useParams()
  const [state, setState] = useState({ type: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function verifyPermit() {
      setState({ type: 'loading' })

      if (!API_BASE_URL) {
        setState({
          type: 'unavailable',
          message: 'The verification service is not configured.',
        })
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}${verificationEndpoint}/${encodeURIComponent(token)}`,
          { signal: controller.signal, headers: { Accept: 'application/json' } },
        )

        let data = null
        try {
          data = await response.json()
        } catch {
          data = null
        }

        if (!response.ok) {
          if (response.status === 400) {
            setState({
              type: 'invalid',
              message: data?.message || 'Invalid permit token',
            })
          } else if (response.status === 404) {
            setState({
              type: 'invalid',
              message: data?.message || 'Permit not found',
            })
          } else {
            setState({
              type: 'unavailable',
              message: data?.message || 'The verification API is unavailable.',
            })
          }
          return
        }

        if (data?.status === 'inactive') {
          setState({ type: 'inactive' })
          return
        }

        if (data?.status === 'active' && data?.valid === true && data?.permit) {
          setState({ type: 'active', permit: data.permit })
          return
        }

        if (data?.status === 'invalid' || data?.valid === false) {
          setState({
            type: 'invalid',
            message: data?.message || 'Invalid permit token',
          })
          return
        }

        setState({
          type: 'invalid',
          message: data?.message || 'The permit response could not be verified.',
        })
      } catch (error) {
        if (error.name === 'AbortError') return
        setState({
          type: 'network',
          message: 'Unable to connect to the verification service.',
        })
      }
    }

    verifyPermit()
    return () => controller.abort()
  }, [token])

  let content

  if (state.type === 'loading') {
    content = <div className="vp-loading">جاري التحميل...</div>
  } else if (state.type === 'inactive') {
    content = (
      <div className="vp-error">
        هذا التصريح غير فعال حالياً. يرجى التواصل مع الجهة المختصة لمزيد من المعلومات.
      </div>
    )
  } else if (state.type === 'active') {
    content = <PermitDetails permit={state.permit} />
  } else {
    // invalid / network / unavailable
    content = <div className="vp-error">{state.message}</div>
  }

  return <PortalLayout>{content}</PortalLayout>
}

function NotFound() {
  return (
    <PortalLayout>
      <div className="vp-error">Open a verification link in the format /verify/:token.</div>
    </PortalLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify/:token" element={<VerificationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App