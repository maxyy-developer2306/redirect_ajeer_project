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
import './App.css'

// Logo imports (place these files in src/assets/)
import ajeerLogo from './assets/ajeer-logo.png'
import mlsdLogo from './assets/mlsd-logo.png'
import takamolLogo from './assets/takamol-logo.png'
import govtAuthLogo from './assets/digital-govt-auth-logo (1).svg'
import tamkeenLogo from './assets/tamkeen-logo-1 (1).svg'

const API_BASE_URL = (import.meta.env.VITE_MAXYY_API_BASE_URL || '').replace(/\/$/, '')
const verificationEndpoint = '/api/public/verify'

function LoadingState() {
  return (
    <main className="state-card" aria-live="polite">
      <LoaderCircle className="state-icon spin" size={44} aria-hidden="true" />
      <h1>Verifying permit</h1>
      <p>Please wait while we check the permit with MAXYY.</p>
    </main>
  )
}

function StateCard({ tone, icon: Icon, title, message }) {
  return (
    <main className={`state-card state-${tone}`} role="alert" aria-live="assertive">
      <Icon className="state-icon" size={48} aria-hidden="true" />
      <h1>{title}</h1>
      <p>{message}</p>
    </main>
  )
}

function PermitDetails({ permit }) {
  const groups = [
    {
      title: 'Permit Information',
      icon: IdCard,
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
      items: [
        ['Iqama Mosasa Number', permit.iqamaMosasaNumber],
        ['Establishment Name / اسم المنشأة', permit.establishmentName],
      ],
    },
  ]

  return (
    <main className="permit-card">
      <div className="permit-header">
        <div>
          <p className="eyebrow">Permit Verification</p>
          <h1>{permit.workerName}</h1>
        </div>
        <div className="active-status">
          <BadgeCheck size={20} aria-hidden="true" />
          <span>Active</span>
        </div>
      </div>

      <div className="permit-groups">
        {groups.map(({ title, icon: Icon, items }) => (
          <section className="info-section" key={title}>
            <div className="section-heading">
              <Icon size={19} aria-hidden="true" />
              <h2>{title}</h2>
            </div>
            <dl className="details-grid">
              {items.map(([label, value]) => (
                <div className="detail-item" key={label}>
                  <dt>{label}</dt>
                  <dd>{value || '—'}</dd>
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
      <div className="app-shell">
        {/* Top bar with logos */}
        <header className="topbar">
          <Link className="brand" to="/" aria-label="AJEER home">
            <img src={ajeerLogo} alt="أجير Ajeer" className="brand-logo" />
          </Link>
          <div className="topbar-right">
            <span className="verification-label">Permit Verification</span>
            <img
              src={mlsdLogo}
              alt="وزارة الموارد البشرية والتنمية الاجتماعية"
              className="topbar-logo"
            />
          </div>
        </header>

        <Routes>
          <Route path="/verify/:token" element={<VerificationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Partner logos footer */}
        <footer className="partners">
          <img src={takamolLogo} alt="تكامل Takamol" className="partner-logo" />
          <img
            src={govtAuthLogo}
            alt="هيئة الحكومة الرقمية Digital Government Authority"
            className="partner-logo partner-logo-lg"
          />
          <img
            src={tamkeenLogo}
            alt="تمكين للتقنيات Tamkeen Technologies"
            className="partner-logo"
          />
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App