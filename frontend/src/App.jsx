import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CircleX,
  IdCard,
  LoaderCircle,
  UserRound,
  WifiOff,
} from 'lucide-react'

// Logo imports (place these files in src/assets/)
import ajeerLogo from './assets/ajeer-logo.png'
import mlsdLogo from './assets/mlsd-logo.png'
import takamolLogo from './assets/takamol-logo.png'
import govtAuthLogo from './assets/digital-govt-auth-logo (1).svg'
import tamkeenLogo from './assets/tamkeen-logo-1 (1).svg'

const API_BASE_URL = (import.meta.env.VITE_MAXYY_API_BASE_URL || '').replace(/\/$/, '')
const verificationEndpoint = '/api/public/verify'

// Shared width + spacing for the main cards
const cardWidth =
  'w-[min(1120px,calc(100%_-_24px))] md:w-[min(1120px,calc(100%_-_40px))] mx-auto my-6 md:my-11'

// Tailwind classes for each state card tone
const tones = {
  default: {
    card: 'border border-[#e3e9e8] bg-white',
    icon: 'text-[#64748b]',
    title: 'text-[#202d29]',
  },
  inactive: {
    card: 'border-2 border-[#fecaca] bg-[#fff8f8]',
    icon: 'text-[#b91c1c]',
    title: 'text-[#b91c1c]',
  },
  invalid: {
    card: 'border border-[#fecaca] bg-white',
    icon: 'text-[#dc2626]',
    title: 'text-[#202d29]',
  },
  unavailable: {
    card: 'border border-[#fecaca] bg-white',
    icon: 'text-[#dc2626]',
    title: 'text-[#202d29]',
  },
  network: {
    card: 'border border-[#fecaca] bg-white',
    icon: 'text-[#dc2626]',
    title: 'text-[#202d29]',
  },
}

function LoadingState() {
  const t = tones.default
  return (
    <main
      className={`${cardWidth} ${t.card} flex min-h-[360px] flex-col items-center justify-center rounded-[18px] px-7 py-12 text-center shadow-[0_18px_50px_rgba(31,55,48,0.08)]`}
      aria-live="polite"
    >
      <LoaderCircle className={`${t.icon} animate-spin`} size={44} aria-hidden="true" />
      <h1 className={`${t.title} mt-[18px] mb-2 text-[clamp(24px,4vw,34px)] font-bold`}>
        Verifying permit
      </h1>
      <p className="m-0 max-w-[620px] leading-[1.65] text-[#66756f]">
        Please wait while we check the permit with MAXYY.
      </p>
    </main>
  )
}

function StateCard({ tone, icon: Icon, title, message }) {
  const t = tones[tone] || tones.default
  return (
    <main
      className={`${cardWidth} ${t.card} flex min-h-[360px] flex-col items-center justify-center rounded-[18px] px-7 py-12 text-center shadow-[0_18px_50px_rgba(31,55,48,0.08)]`}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={t.icon} size={48} aria-hidden="true" />
      <h1 className={`${t.title} mt-[18px] mb-2 text-[clamp(24px,4vw,34px)] font-bold`}>
        {title}
      </h1>
      <p className="m-0 max-w-[620px] leading-[1.65] text-[#66756f]">{message}</p>
    </main>
  )
}

function PermitDetails({ permit }) {
  const groups = [
    {
      title: 'Permit Information',
      icon: IdCard,
      className: 'border-b border-[#edf1f0] md:border-r',
      items: [
        ['Permit Number', permit.permitNumber],
        ['Permit Type', permit.permitType],
        ['Issue Date', permit.issueDate],
        ['Expiry Date', permit.expiryDate],
      ],
    },
    {
      title: 'Worker Information',
      icon: UserRound,
      className: 'border-b border-[#edf1f0]',
      items: [
        ['Worker Name', permit.workerName],
        ['Iqama / ID Number', permit.iqamaNumber],
        ['Nationality', permit.nationality],
        ['Job Title', permit.jobTitle],
        ['Date of Birth', permit.dateOfBirth],
        ['Gender', permit.gender],
      ],
    },
    {
      title: 'Establishment',
      icon: Building2,
      className: 'md:col-span-2',
      items: [
        ['Iqama Mosasa Number', permit.iqamaMosasaNumber],
        ['Establishment Name / اسم المنشأة', permit.establishmentName],
      ],
    },
  ]

  return (
    <main
      className={`${cardWidth} rounded-[18px] border border-[#e3e9e8] bg-white shadow-[0_18px_50px_rgba(31,55,48,0.08)]`}
    >
      {/* Header */}
      <div className="flex min-h-[112px] flex-col items-start justify-between gap-6 border-b border-[#edf1f0] px-5 py-[22px] min-[431px]:flex-row min-[431px]:items-start md:items-center md:px-8 md:py-[26px]">
        <div>
          <p className="mb-[5px] text-xs font-extrabold uppercase tracking-[0.12em] text-[#74827f]">
            Permit Verification
          </p>
          <h1 className="m-0 text-[clamp(24px,3vw,34px)] leading-[1.15] font-bold text-[#172033]">
            {permit.workerName}
          </h1>
        </div>
        <div className="inline-flex flex-none items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#dcfce7] px-4 py-2.5 text-[15px] font-extrabold uppercase text-[#166534]">
          <BadgeCheck size={20} aria-hidden="true" />
          <span>Active</span>
        </div>
      </div>

      {/* Info groups */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr]">
        {groups.map(({ title, icon: Icon, items, className }) => (
          <section className={`px-5 py-[22px] md:px-8 md:py-7 ${className}`} key={title}>
            <div className="mb-5 flex items-center gap-[9px] text-[#16794a]">
              <Icon size={19} aria-hidden="true" />
              <h2 className="m-0 text-base font-bold text-[#26352f]">{title}</h2>
            </div>
            <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-[18px] md:grid-cols-2">
              {items.map(([label, value]) => (
                <div className="min-w-0" key={label}>
                  <dt className="mb-[5px] text-xs font-bold text-[#7a8985]">{label}</dt>
                  <dd className="m-0 text-[15px] font-bold break-words text-[#202d29]">
                    {value || '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
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

  if (state.type === 'loading') return <LoadingState />

  if (state.type === 'inactive') {
    return (
      <StateCard
        tone="inactive"
        icon={AlertTriangle}
        title="INACTIVE PERMIT"
        message="This permit is currently inactive. Please contact the relevant authority for further information."
      />
    )
  }

  if (state.type === 'network') {
    return (
      <StateCard tone="network" icon={WifiOff} title="Network Error" message={state.message} />
    )
  }

  if (state.type === 'unavailable') {
    return (
      <StateCard
        tone="unavailable"
        icon={CircleX}
        title="API Unavailable"
        message={state.message}
      />
    )
  }

  if (state.type === 'invalid') {
    return (
      <StateCard
        tone="invalid"
        icon={CircleX}
        title="Invalid or Not Found"
        message={state.message}
      />
    )
  }

  return <PermitDetails permit={state.permit} />
}

function NotFound() {
  return (
    <StateCard
      tone="invalid"
      icon={CircleX}
      title="Permit Token Required"
      message="Open a verification link in the format /verify/:token."
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f3f6f8] bg-[radial-gradient(circle_at_85%_10%,rgba(21,128,61,0.07),transparent_24rem)]">
        {/* Top bar with logos */}
        <header className="flex h-16 items-center justify-between border-b border-[#e2e8ec] bg-white px-[clamp(20px,5vw,72px)] md:h-[72px]">
          <Link className="inline-flex items-center no-underline" to="/" aria-label="AJEER home">
            <img src={ajeerLogo} alt="أجير Ajeer" className="block h-8 w-auto md:h-[38px]" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-semibold text-[#64748b] md:inline">
              Permit Verification
            </span>
            <img
              src={mlsdLogo}
              alt="وزارة الموارد البشرية والتنمية الاجتماعية"
              className="block h-[38px] w-auto md:h-11"
            />
          </div>
        </header>

        <Routes>
          <Route path="/verify/:token" element={<VerificationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Partner logos footer */}
        <footer className="mx-auto flex w-[min(1120px,calc(100%_-_24px))] flex-wrap items-center justify-center gap-x-7 gap-y-5 border-t border-[#e2e8ec] pt-7 pb-10 md:w-[min(1120px,calc(100%_-_40px))] md:gap-x-11">
          <img src={takamolLogo} alt="تكامل Takamol" className="block h-8 w-auto" />
          <img
            src={govtAuthLogo}
            alt="هيئة الحكومة الرقمية Digital Government Authority"
            className="block h-[38px] w-auto"
          />
          <img
            src={tamkeenLogo}
            alt="تمكين للتقنيات Tamkeen Technologies"
            className="block h-8 w-auto"
          />
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App