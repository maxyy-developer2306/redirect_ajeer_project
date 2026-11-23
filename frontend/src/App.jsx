import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'

// Logo imports (place these files in src/assets/)
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

// Shows only the date part of ISO strings (2026-11-18T00:00:00.000Z -> 2026-11-18)
const formatDate = (value) => {
  if (!value) return '-'
  return String(value).split('T')[0]
}

// Single label + value row
function Row({ label, value, ltr = false }) {
  return (
    <div className="border-b border-[#e2e8f0] last:border-b-0">
      <div className="bg-[#f8fafc] py-[10px] px-[16px] text-[#374151] text-[15px] font-medium text-right">
        {label}
      </div>
      <div
        dir={ltr ? 'ltr' : undefined}
        className="py-[12px] px-[16px] text-black text-[16px] font-bold text-right break-words bg-white"
      >
        {value || '-'}
      </div>
    </div>
  )
}

// Section wrapper with grey title bar
function Section({ title, children }) {
  return (
    <div className="border-b border-[#e2e8f0] last:border-b-0">
      <div className="bg-[#edf2f7] py-[12px] px-[16px] text-[17px] font-bold text-[#111827] text-right border-b border-[#e2e8f0]">
        {title}
      </div>
      {children}
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
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8fafc] text-[#1a202c] font-['Tajawal',sans-serif] text-right text-base leading-normal"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-[#e2e8f0] w-full">
        <div className="h-[32px]">
          <img src={ajeerLogo} alt="أجير" className="h-[32px] block" />
        </div>
        <div className="h-[38px]">
          <img
            src={mlsdLogo}
            alt="وزارة الموارد البشرية والتنمية الاجتماعية"
            className="h-[38px] block"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[480px] mx-auto my-[15px] px-[12px]">
        {/* Main Data Card */}
        <div className="bg-white border border-[#dcdcdc] rounded-[2px] overflow-hidden mb-[30px]">
          {/* Banner Logo Section */}
          <div className="flex justify-center items-center gap-[15px] pt-[25px] pb-[15px] px-[15px] border-b border-[#e2e8f0]">
            <img src={ajeerLogo} alt="أجير" className="h-[48px]" />
            <img src={mlsdLogo} alt="الموارد البشرية" className="h-[50px]" />
          </div>

          {/* Page Title */}
          <h1 className="text-center text-[22px] font-[800] text-[#111827] py-[18px] px-[10px] border-b border-[#e2e8f0]">
            التحقق من تصريح أجير
          </h1>

          {children}
        </div>

        {/* Footer Navigation Links */}
        <div className="mt-[30px] px-[10px] text-right">
          <div className="mb-[25px]">
            <h4 className="text-[16px] text-[#111827] mb-[10px] font-bold">أجير</h4>
            <ul className="list-none p-0">
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">عن أجير</a>
              </li>
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">خدمات أجير</a>
              </li>
            </ul>
          </div>

          <div className="mb-[25px]">
            <h4 className="text-[16px] text-[#111827] mb-[10px] font-bold">الدعم</h4>
            <ul className="list-none p-0">
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">الدعم و المساعدة</a>
              </li>
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">الأسئلة الشائعة</a>
              </li>
            </ul>
          </div>

          <div className="mb-[25px]">
            <h4 className="text-[16px] text-[#111827] mb-[10px] font-bold">الشروط و الخصوصية</h4>
            <ul className="list-none p-0">
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">الشروط والأحكام</a>
              </li>
              <li className="mb-[8px]">
                <a href="#" className="text-[#6b7280] text-[14px] font-medium no-underline hover:underline">سياسة الخصوصية</a>
              </li>
            </ul>
          </div>

          <div className="mb-[25px]">
            <h4 className="text-[16px] text-[#111827] mb-[10px] font-bold">تواصل معنا</h4>
            <div className="flex justify-start items-center gap-[18px] mt-[10px]">
              <a href="tel:" className="text-[#1f2937] text-[18px] no-underline hover:text-black">
                <i className="fa-solid fa-phone"></i>
              </a>
              <a href="#" className="text-[#1f2937] text-[18px] no-underline hover:text-black">
                <i className="fa-solid fa-paper-plane"></i>
              </a>
              <a href="#" className="text-[#1f2937] text-[18px] no-underline hover:text-black">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Partner Logos Footer */}
        <div
          dir="rtl"
          className="flex justify-between items-start pt-[25px] pb-[35px] border-t border-[#e5e7eb] mt-[25px]"
        >
          <div className="w-1/2 flex flex-col items-end gap-[20px] pl-[15px]">
            <img
              src={mlsdLogo}
              alt="الموارد البشرية والتنمية الاجتماعية"
              className="h-[42px] block"
            />
            <img src={takamolLogo} alt="تكامل Takamol" className="h-[30px] block" />
          </div>

          <div className="w-1/2 flex flex-col items-start gap-[25px] pr-[15px] border-r border-[#e5e7eb]">
            <div className="flex flex-row items-center gap-[8px]">
              <span className="text-[11px] text-[#6b7280] font-medium">مسجل لدى</span>
              <img
                src={govtAuthLogo}
                alt="هيئة الحكومة الرقمية Digital Government Authority"
                className="h-[35px] block"
              />
            </div>

            <div className="flex flex-col items-start gap-[4px]">
              <span className="text-[11px] text-[#6b7280] font-medium"></span>
              <img
                src={tamkeenLogo}
                alt="تمكين للتقنيات Tamkeen Technologies"
                className="h-[32px] block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Widget Button */}
      <a
        href="#"
        title="Chat Support"
        className="fixed bottom-[25px] left-[20px] bg-[#38a169] w-[62px] h-[62px] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] z-[999] no-underline cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] fill-white">
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
      <div className="text-center py-[16px] px-[10px] border-b border-[#e2e8f0]">
        <span className="inline-block text-[#0d8a5f] text-[20px] font-bold">ساري / فعال</span>
      </div>

      {/* Success Message */}
      <div className="text-center text-[#4b5563] text-[15px] py-[18px] px-[10px] border-b border-[#e2e8f0] font-medium">
        تم التحقق من التصريح بنجاح
      </div>

      {/* Section 1: Permit Details */}
      <Section title="بيانات التصريح">
        <Row label="رقم التصريح" value={permit.permitNumber} ltr />
        <Row label="نوع التصريح" value={permit.permitType} />
        <Row label="تاريخ بداية التصريح" value={formatDate(permit.issueDate)} ltr />
        <Row label="تاريخ نهاية التصريح" value={formatDate(permit.expiryDate)} ltr />
      </Section>

      {/* Section 2: Worker Details */}
      <Section title="بيانات العامل">
        <Row label="اسم العامل" value={permit.workerName} ltr />
        <Row label="رقم الهوية / الإقامة" value={permit.iqamaNumber} ltr />
        <Row label="الجنسية" value={formatNationality(permit.nationality)} />
        <Row label="المهنة" value={permit.jobTitle} />
        <Row label="الجنس" value={formatGender(permit.gender)} />
        <Row label="تاريخ الميلاد" value={formatDate(permit.dateOfBirth)} ltr />
      </Section>

      {/* Section 3: Establishment Details */}
      <Section title="بيانات المنشأة">
        <Row label="رقم المنشأة" value={permit.iqamaMosasaNumber} ltr />
        <Row label="اسم المنشأة" value={permit.establishmentName} />
      </Section>
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
    content = <div className="text-center py-10 text-gray-500 font-bold">جاري التحميل...</div>
  } else if (state.type === 'inactive') {
    content = (
      <div className="text-center py-[40px] px-[20px] text-[16px] text-[#dc2626] font-bold">
        هذا التصريح غير فعال حالياً. يرجى التواصل مع الجهة المختصة لمزيد من المعلومات.
      </div>
    )
  } else if (state.type === 'active') {
    content = <PermitDetails permit={state.permit} />
  } else {
    // invalid / network / unavailable
    content = (
      <div className="text-center py-[40px] px-[20px] text-[16px] text-[#dc2626] font-bold">
        {state.message}
      </div>
    )
  }

  return <PortalLayout>{content}</PortalLayout>
}

function NotFound() {
  return (
    <PortalLayout>
      <div className="text-center py-[40px] px-[20px] text-[16px] text-[#dc2626] font-bold">
        Open a verification link in the format /verify/:token.
      </div>
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