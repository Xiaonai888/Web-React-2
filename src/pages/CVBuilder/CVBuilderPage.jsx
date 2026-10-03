import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Home,
  ImagePlus,
  LayoutTemplate,
  MoreVertical,
  Plus,
  Save,
  Trash2,
  User
} from 'lucide-react'

const DRAFT_KEY = 'shadow_cv_builder_draft_v1'
const SAVED_KEY = 'shadow_cv_builder_saved_v1'

const templates = [
  { id: 'modern-blue', name: 'Modern Blue', accent: '#2563eb', side: '#164e9b', soft: '#eff6ff' },
  { id: 'minimal', name: 'Minimal', accent: '#111827', side: '#ffffff', soft: '#f9fafb' },
  { id: 'professional', name: 'Professional', accent: '#334155', side: '#e2e8f0', soft: '#f8fafc' },
  { id: 'creative-pink', name: 'Creative Pink', accent: '#e11d48', side: '#fff1f2', soft: '#fff7f8' },
  { id: 'academic', name: 'Academic', accent: '#7c3aed', side: '#ede9fe', soft: '#faf5ff' },
  { id: 'dark', name: 'Dark', accent: '#fbbf24', side: '#111827', soft: '#1f2937' },
  { id: 'emerald', name: 'Emerald', accent: '#059669', side: '#064e3b', soft: '#ecfdf5' },
  { id: 'sunset', name: 'Sunset', accent: '#f97316', side: '#7c2d12', soft: '#fff7ed' },
  { id: 'rose-gold', name: 'Rose Gold', accent: '#be7c6b', side: '#f7e7e1', soft: '#fff8f6' },
  { id: 'mono', name: 'Mono', accent: '#000000', side: '#ededed', soft: '#fafafa' }
]

const initialCv = {
  id: 'draft',
  title: 'My Professional CV',
  templateId: 'modern-blue',
  profile: {
    fullName: 'Sophea Chen',
    jobTitle: 'Frontend Developer',
    email: 'sophea@email.com',
    phone: '+855 12 345 678',
    location: 'Phnom Penh, Cambodia',
    about: 'Passionate frontend developer with experience in React and modern web technologies. I love creating beautiful, fast and user-friendly applications.',
    photo: ''
  },
  experience: [
    { role: 'Frontend Developer', company: 'Tech Company', period: 'Jan 2022 – Present' },
    { role: 'Junior Developer', company: 'Startup Company', period: 'Jun 2020 – Dec 2021' }
  ],
  education: [
    { degree: 'Bachelor of Computer Science', school: 'Royal University of Phnom Penh', period: '2016 – 2020' }
  ],
  skills: ['React', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Git & GitHub'],
  languages: ['Khmer', 'English', 'Chinese']
}

const copy = (value) => JSON.parse(JSON.stringify(value))

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    return saved ? JSON.parse(saved) : copy(initialCv)
  } catch {
    return copy(initialCv)
  }
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  } catch {
    return []
  }
}

function TemplateCard({ item, active, onClick }) {
  return (
    <button type="button" className={`cvb-template ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="cvb-template-paper">
        <div className="cvb-template-side" style={{ background: item.side }} />
        <div className="cvb-template-lines">
          <span style={{ background: item.accent }} />
          <i />
          <i />
          <b />
          <i />
          <i />
        </div>
      </div>
      <strong>{item.name}</strong>
    </button>
  )
}

function CVPreview({ data, mini = false }) {
  const style = templates.find((item) => item.id === data.templateId) || templates[0]
  const dark = style.id === 'dark'
  const sideLight = ['minimal', 'professional', 'creative-pink', 'academic', 'rose-gold', 'mono'].includes(style.id)

  return (
    <div className={`cvb-cv ${mini ? 'mini' : ''}`} style={{ background: dark ? '#111827' : '#fff', color: dark ? '#fff' : '#111827' }}>
      <aside style={{ background: style.side, color: sideLight ? '#111827' : '#fff' }}>
        <div className="cvb-avatar">
          {data.profile.photo ? <img src={data.profile.photo} alt="" /> : <User size={mini ? 16 : 32} />}
        </div>
        <h2>{data.profile.fullName || 'Your Name'}</h2>
        <p>{data.profile.jobTitle || 'Professional Title'}</p>

        <section>
          <h4>CONTACT</h4>
          <small>{data.profile.email || 'email@example.com'}</small>
          <small>{data.profile.phone || '+855 ...'}</small>
          <small>{data.profile.location || 'Location'}</small>
        </section>

        <section>
          <h4>SKILLS</h4>
          {data.skills.slice(0, 8).map((item, index) => <small key={`${item}-${index}`}>{item}</small>)}
        </section>

        <section>
          <h4>LANGUAGES</h4>
          {data.languages.slice(0, 6).map((item, index) => <small key={`${item}-${index}`}>{item}</small>)}
        </section>
      </aside>

      <main>
        <h1>{data.profile.fullName || 'Your Name'}</h1>
        <h5>{data.profile.jobTitle || 'Professional Title'}</h5>

        <section>
          <h3 style={{ color: style.accent }}>ABOUT ME</h3>
          <p>{data.profile.about || 'Write your professional summary here.'}</p>
        </section>

        <section>
          <h3 style={{ color: style.accent }}>EXPERIENCE</h3>
          {data.experience.map((item, index) => (
            <div className="cvb-entry" key={`${item.role}-${index}`}>
              <strong>{item.role || 'Job Title'}</strong>
              <span>{item.company || 'Company'}</span>
              <small>{item.period || 'Period'}</small>
            </div>
          ))}
        </section>

        <section>
          <h3 style={{ color: style.accent }}>EDUCATION</h3>
          {data.education.map((item, index) => (
            <div className="cvb-entry" key={`${item.degree}-${index}`}>
              <strong>{item.degree || 'Degree'}</strong>
              <span>{item.school || 'School'}</span>
              <small>{item.period || 'Period'}</small>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default function CVBuilderPage() {
  const navigate = useNavigate()
  const photoRef = useRef(null)
  const [screen, setScreen] = useState('home')
  const [editorTab, setEditorTab] = useState('profile')
  const [data, setData] = useState(loadDraft)
  const [savedCvs, setSavedCvs] = useState(loadSaved)

  const currentTemplate = useMemo(
    () => templates.find((item) => item.id === data.templateId) || templates[0],
    [data.templateId]
  )

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  }, [data])

  const updateProfile = (key, value) => {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, [key]: value }
    }))
  }

  const chooseTemplate = (templateId) => {
    setData((current) => ({ ...current, templateId }))
  }

  const updateObjectItem = (section, index, key, value) => {
    setData((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)
    }))
  }

  const addObjectItem = (section) => {
    const blank = section === 'experience'
      ? { role: '', company: '', period: '' }
      : { degree: '', school: '', period: '' }

    setData((current) => ({
      ...current,
      [section]: [...current[section], blank]
    }))
  }

  const removeObjectItem = (section, index) => {
    setData((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const updateTextItem = (section, index, value) => {
    setData((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index ? value : item)
    }))
  }

  const addTextItem = (section) => {
    setData((current) => ({
      ...current,
      [section]: [...current[section], '']
    }))
  }

  const removeTextItem = (section, index) => {
    setData((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const handlePhoto = (file) => {
    if (!file || !String(file.type || '').startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => updateProfile('photo', String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const createNew = () => {
    const next = copy(initialCv)
    next.id = String(Date.now())
    next.title = 'New CV'
    next.profile = { ...next.profile, fullName: '', jobTitle: '', email: '', phone: '', location: '', about: '', photo: '' }
    next.experience = [{ role: '', company: '', period: '' }]
    next.education = [{ degree: '', school: '', period: '' }]
    next.skills = ['']
    next.languages = ['']
    setData(next)
    setEditorTab('profile')
    setScreen('editor')
  }

  const saveCurrent = () => {
    const item = { ...data, id: data.id === 'draft' ? String(Date.now()) : data.id, updatedAt: Date.now() }
    const next = [item, ...savedCvs.filter((cv) => cv.id !== item.id)].slice(0, 20)
    setData(item)
    setSavedCvs(next)
    localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    localStorage.setItem(DRAFT_KEY, JSON.stringify(item))
  }

  const openSaved = (item) => {
    setData(copy(item))
    setEditorTab('profile')
    setScreen('editor')
  }

  const downloadPdf = () => {
    setScreen('preview')
    setTimeout(() => window.print(), 100)
  }

  const editorTabs = [
    ['profile', 'Profile'],
    ['experience', 'Experience'],
    ['education', 'Education'],
    ['skills', 'Skills'],
    ['languages', 'Languages']
  ]

  return (
    <div className="cvb-shell">
      <style>{`
        .cvb-shell{min-height:100vh;background:#f6f7fb;color:#111827;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .cvb-header{position:sticky;top:0;z-index:40;height:68px;background:rgba(255,255,255,.95);backdrop-filter:blur(18px);border-bottom:1px solid #e5e7eb}
        .cvb-header-inner{max-width:1120px;height:100%;margin:auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between}
        .cvb-icon{width:42px;height:42px;border:0;border-radius:50%;background:transparent;display:grid;place-items:center;color:inherit}
        .cvb-title{font-size:20px;font-weight:950;letter-spacing:-.03em}
        .cvb-main{max-width:1120px;margin:auto;padding:18px 16px 100px}
        .cvb-hero{background:linear-gradient(135deg,#5b38f3,#7c3aed 55%,#2563eb);color:#fff;border-radius:28px;padding:28px;display:grid;grid-template-columns:1.2fr .8fr;align-items:center;min-height:230px;box-shadow:0 24px 56px rgba(79,70,229,.24)}
        .cvb-hero h1{font-size:38px;line-height:1.02;letter-spacing:-.045em;margin:0 0 10px;font-weight:950}
        .cvb-hero p{margin:0 0 20px;max-width:560px;opacity:.9}
        .cvb-btn{border:0;border-radius:16px;padding:13px 16px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#fff;color:#4f46e5;cursor:pointer}
        .cvb-btn.blue{background:linear-gradient(135deg,#4f46e5,#2563eb);color:#fff}
        .cvb-btn.soft{background:#eef2ff;color:#4f46e5}
        .cvb-hero-art{display:grid;place-items:center}
        .cvb-demo-paper{width:180px;aspect-ratio:.72;background:#fff;border-radius:14px;transform:rotate(4deg);box-shadow:0 20px 44px rgba(0,0,0,.22);position:relative;overflow:hidden}
        .cvb-demo-paper:before{content:"";position:absolute;inset:0 auto 0 0;width:34%;background:#164e9b}
        .cvb-demo-paper:after{content:"";position:absolute;left:43%;right:10%;top:16%;height:58%;background:repeating-linear-gradient(to bottom,#cbd5e1 0 5px,transparent 5px 18px)}
        .cvb-section-head{display:flex;align-items:center;justify-content:space-between;margin:24px 2px 12px}
        .cvb-section-head h2{margin:0;font-size:20px;font-weight:950}
        .cvb-link{border:0;background:transparent;color:#4f46e5;font-weight:900;cursor:pointer}
        .cvb-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
        .cvb-template{border:0;background:transparent;color:inherit;padding:0;cursor:pointer}
        .cvb-template strong{display:block;font-size:12px;margin-top:8px}
        .cvb-template.active .cvb-template-paper{outline:3px solid #5b4df5;box-shadow:0 12px 30px rgba(79,70,229,.2)}
        .cvb-template-paper{position:relative;aspect-ratio:.72;background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 8px 22px rgba(15,23,42,.08)}
        .cvb-template-side{position:absolute;inset:0 auto 0 0;width:34%}
        .cvb-template-lines{position:absolute;left:42%;right:9%;top:14%;display:flex;flex-direction:column;gap:7px}
        .cvb-template-lines span{height:8px;width:70%;border-radius:999px}
        .cvb-template-lines i,.cvb-template-lines b{display:block;height:4px;background:#d8dee9;border-radius:999px}
        .cvb-template-lines b{width:45%;margin-top:7px;background:#94a3b8}
        .cvb-editor{display:grid;grid-template-columns:minmax(320px,430px) minmax(470px,1fr);gap:20px;align-items:start}
        .cvb-card{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:18px;box-shadow:0 10px 30px rgba(15,23,42,.06)}
        .cvb-card h2{margin:0 0 4px;font-size:22px}.cvb-muted{margin:0 0 18px;color:#6b7280;font-size:13px}
        .cvb-tabs{display:flex;gap:8px;overflow-x:auto;margin:0 -2px 18px;padding:2px 2px 6px;scrollbar-width:none}
        .cvb-tabs::-webkit-scrollbar{display:none}
        .cvb-tab{border:1px solid #e2e8f0;background:#f8fafc;color:#64748b;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:900;white-space:nowrap;cursor:pointer}
        .cvb-tab.active{border-color:#5b4df5;background:#eef2ff;color:#4f46e5}
        .cvb-photo-row{display:flex;align-items:center;gap:14px;margin-bottom:16px}
        .cvb-photo{width:84px;height:84px;border-radius:50%;background:#eef2ff;display:grid;place-items:center;overflow:hidden;color:#4f46e5}
        .cvb-photo img{width:100%;height:100%;object-fit:cover}
        .cvb-field{display:block;margin-bottom:13px}.cvb-field span{display:block;font-size:12px;font-weight:850;margin-bottom:6px}
        .cvb-field input,.cvb-field textarea{width:100%;box-sizing:border-box;border:1px solid #d9deea;border-radius:13px;padding:12px 13px;font:inherit;background:#fff;color:#111827;outline:none}
        .cvb-field textarea{min-height:105px;resize:vertical}.cvb-field input:focus,.cvb-field textarea:focus{border-color:#5b4df5;box-shadow:0 0 0 3px rgba(91,77,245,.1)}
        .cvb-editor-item{border:1px solid #e5e7eb;border-radius:18px;padding:14px;margin-bottom:12px;background:#fafbff}
        .cvb-item-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .cvb-item-head strong{font-size:13px}
        .cvb-remove{width:34px;height:34px;border:0;border-radius:10px;background:#fff1f2;color:#e11d48;display:grid;place-items:center;cursor:pointer}
        .cvb-list-row{display:grid;grid-template-columns:1fr 38px;gap:8px;align-items:center;margin-bottom:9px}
        .cvb-list-row input{width:100%;box-sizing:border-box;border:1px solid #d9deea;border-radius:13px;padding:12px 13px;font:inherit;background:#fff;color:#111827;outline:none}
        .cvb-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
        .cvb-preview-sticky{position:sticky;top:86px}.cvb-preview-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-weight:900}
        .cvb-cv{display:grid;grid-template-columns:32% 68%;aspect-ratio:.707;border-radius:14px;overflow:hidden;box-shadow:0 22px 52px rgba(15,23,42,.16)}
        .cvb-cv aside,.cvb-cv main{padding:7%;min-width:0}.cvb-avatar{width:74px;height:74px;border-radius:50%;overflow:hidden;background:rgba(255,255,255,.25);display:grid;place-items:center;margin-bottom:12px}
        .cvb-avatar img{width:100%;height:100%;object-fit:cover}.cvb-cv aside h2{font-size:17px;line-height:1.05;margin:0 0 3px}.cvb-cv aside>p{font-size:9px;margin:0 0 18px;opacity:.85}
        .cvb-cv aside section{margin-top:17px}.cvb-cv aside h4{font-size:8px;margin:0 0 7px;letter-spacing:.08em}.cvb-cv aside small{display:block;font-size:7.5px;margin-bottom:5px;word-break:break-word}
        .cvb-cv main h1{font-size:27px;line-height:1;margin:0}.cvb-cv main h5{font-size:10px;color:#64748b;margin:4px 0 20px}.cvb-cv main section{margin-top:16px}
        .cvb-cv main h3{font-size:9px;margin:0 0 7px;letter-spacing:.06em}.cvb-cv main p{font-size:8.5px;line-height:1.55;color:#64748b;margin:0}
        .cvb-entry{display:flex;flex-direction:column;margin-bottom:10px}.cvb-entry strong{font-size:9px}.cvb-entry span{font-size:8px;margin-top:2px}.cvb-entry small{font-size:7px;color:#64748b;margin-top:1px}
        .cvb-cv.mini{border-radius:5px;box-shadow:none}.cvb-cv.mini .cvb-avatar{width:28px;height:28px;margin-bottom:3px}.cvb-cv.mini aside h2{font-size:5px}.cvb-cv.mini aside>p{font-size:3px;margin-bottom:3px}
        .cvb-cv.mini aside section{margin-top:3px}.cvb-cv.mini aside h4{font-size:2.8px;margin-bottom:2px}.cvb-cv.mini aside small{font-size:2.6px;margin-bottom:1px}.cvb-cv.mini main h1{font-size:7px}
        .cvb-cv.mini main h5{font-size:3px;margin-bottom:4px}.cvb-cv.mini main section{margin-top:4px}.cvb-cv.mini main h3{font-size:3px;margin-bottom:2px}.cvb-cv.mini main p,.cvb-cv.mini .cvb-entry span,.cvb-cv.mini .cvb-entry small{font-size:2.6px}
        .cvb-cv.mini .cvb-entry{margin-bottom:2px}.cvb-cv.mini .cvb-entry strong{font-size:3px}
        .cvb-saved{display:grid;gap:12px}.cvb-saved-item{display:grid;grid-template-columns:74px 1fr auto;gap:12px;align-items:center;border:1px solid #e5e7eb;background:#fff;border-radius:18px;padding:12px;color:inherit;text-align:left}
        .cvb-saved-item h3{margin:0 0 4px;font-size:15px}.cvb-saved-item p{margin:0;color:#6b7280;font-size:12px}.cvb-thumb{width:74px}
        .cvb-bottom{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:50;width:min(620px,calc(100% - 24px));display:grid;grid-template-columns:repeat(4,1fr);background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border:1px solid #e5e7eb;border-radius:22px;padding:8px;box-shadow:0 16px 40px rgba(15,23,42,.15)}
        .cvb-nav{border:0;background:transparent;border-radius:15px;padding:8px 4px;color:#6b7280;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;font-weight:850}.cvb-nav.active{background:#eef2ff;color:#4f46e5}
        .cvb-preview-page{max-width:760px;margin:auto}.cvb-preview-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
        @media(max-width:850px){.cvb-main{padding:14px 14px 96px}.cvb-hero{grid-template-columns:1fr;min-height:auto;padding:22px}.cvb-hero h1{font-size:29px}.cvb-hero-art{display:none}.cvb-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.cvb-editor{grid-template-columns:1fr}.cvb-preview-sticky{display:none}.cvb-card{border-radius:20px}}
        @media print{body *{visibility:hidden!important}.cvb-print,.cvb-print *{visibility:visible!important}.cvb-print{position:absolute!important;left:0;top:0;width:100%!important}.cvb-header,.cvb-bottom,.cvb-preview-actions{display:none!important}.cvb-cv{box-shadow:none!important;border-radius:0!important}}
        .dark .cvb-shell{background:#08090c;color:#f8fafc}.dark .cvb-header,.dark .cvb-card,.dark .cvb-saved-item,.dark .cvb-bottom{background:rgba(17,19,24,.96);border-color:#292d36}
        .dark .cvb-field input,.dark .cvb-field textarea,.dark .cvb-list-row input{background:#111318;color:#f8fafc;border-color:#30343f}.dark .cvb-muted,.dark .cvb-saved-item p{color:#9ca3af}
        .dark .cvb-tab{background:#151821;border-color:#30343f;color:#9ca3af}.dark .cvb-tab.active{background:#25214a;color:#c7c2ff;border-color:#5b4df5}
        .dark .cvb-editor-item{background:#111318;border-color:#2b3039}.dark .cvb-remove{background:#32151c}
      `}</style>

      <header className="cvb-header">
        <div className="cvb-header-inner">
          <button className="cvb-icon" type="button" onClick={() => screen === 'home' ? navigate(-1) : setScreen('home')}>
            <ArrowLeft size={21} />
          </button>
          <div className="cvb-title">{screen === 'templates' ? 'Choose Template' : screen === 'saved' ? 'My CVs' : screen === 'preview' ? 'CV Preview' : 'CV Builder'}</div>
          <button className="cvb-icon" type="button"><MoreVertical size={21} /></button>
        </div>
      </header>

      <main className="cvb-main">
        {screen === 'home' && (
          <>
            <section className="cvb-hero">
              <div>
                <h1>Create Your Professional CV</h1>
                <p>Build once, switch template anytime. Your CV data stays on this device.</p>
                <button className="cvb-btn" type="button" onClick={createNew}><Plus size={18} /> Create New CV</button>
              </div>
              <div className="cvb-hero-art"><div className="cvb-demo-paper" /></div>
            </section>

            <div className="cvb-section-head">
              <h2>Popular Templates</h2>
              <button className="cvb-link" type="button" onClick={() => setScreen('templates')}>See All</button>
            </div>

            <div className="cvb-grid">
              {templates.slice(0, 6).map((item) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  active={data.templateId === item.id}
                  onClick={() => {
                    chooseTemplate(item.id)
                    setEditorTab('profile')
                    setScreen('editor')
                  }}
                />
              ))}
            </div>
          </>
        )}

        {screen === 'editor' && (
          <div className="cvb-editor">
            <section className="cvb-card">
              <h2>CV Information</h2>
              <p className="cvb-muted">Everything is saved locally on this device.</p>

              <div className="cvb-tabs">
                {editorTabs.map(([key, label]) => (
                  <button
                    className={`cvb-tab ${editorTab === key ? 'active' : ''}`}
                    key={key}
                    type="button"
                    onClick={() => setEditorTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {editorTab === 'profile' && (
                <>
                  <div className="cvb-photo-row">
                    <div className="cvb-photo">{data.profile.photo ? <img src={data.profile.photo} alt="" /> : <User size={34} />}</div>
                    <div>
                      <input ref={photoRef} hidden type="file" accept="image/*" onChange={(e) => handlePhoto(e.target.files?.[0])} />
                      <button className="cvb-btn blue" type="button" onClick={() => photoRef.current?.click()}><ImagePlus size={17} /> Add Photo</button>
                    </div>
                  </div>

                  {[
                    ['fullName', 'Full Name', 'Your full name'],
                    ['jobTitle', 'Job Title', 'Frontend Developer'],
                    ['email', 'Email', 'you@example.com'],
                    ['phone', 'Phone', '+855 ...'],
                    ['location', 'Location', 'Phnom Penh, Cambodia']
                  ].map(([key, label, placeholder]) => (
                    <label className="cvb-field" key={key}>
                      <span>{label}</span>
                      <input value={data.profile[key]} onChange={(e) => updateProfile(key, e.target.value)} placeholder={placeholder} />
                    </label>
                  ))}

                  <label className="cvb-field">
                    <span>About Me</span>
                    <textarea value={data.profile.about} onChange={(e) => updateProfile('about', e.target.value)} placeholder="Write a short professional summary..." />
                  </label>
                </>
              )}

              {editorTab === 'experience' && (
                <>
                  {data.experience.map((item, index) => (
                    <div className="cvb-editor-item" key={index}>
                      <div className="cvb-item-head">
                        <strong>Experience {index + 1}</strong>
                        <button className="cvb-remove" type="button" onClick={() => removeObjectItem('experience', index)}><Trash2 size={16} /></button>
                      </div>
                      <label className="cvb-field">
                        <span>Job Title</span>
                        <input value={item.role} onChange={(e) => updateObjectItem('experience', index, 'role', e.target.value)} placeholder="Frontend Developer" />
                      </label>
                      <label className="cvb-field">
                        <span>Company</span>
                        <input value={item.company} onChange={(e) => updateObjectItem('experience', index, 'company', e.target.value)} placeholder="Company name" />
                      </label>
                      <label className="cvb-field">
                        <span>Period</span>
                        <input value={item.period} onChange={(e) => updateObjectItem('experience', index, 'period', e.target.value)} placeholder="Jan 2022 – Present" />
                      </label>
                    </div>
                  ))}
                  <button className="cvb-btn soft" type="button" onClick={() => addObjectItem('experience')}><Plus size={17} /> Add Experience</button>
                </>
              )}

              {editorTab === 'education' && (
                <>
                  {data.education.map((item, index) => (
                    <div className="cvb-editor-item" key={index}>
                      <div className="cvb-item-head">
                        <strong>Education {index + 1}</strong>
                        <button className="cvb-remove" type="button" onClick={() => removeObjectItem('education', index)}><Trash2 size={16} /></button>
                      </div>
                      <label className="cvb-field">
                        <span>Degree</span>
                        <input value={item.degree} onChange={(e) => updateObjectItem('education', index, 'degree', e.target.value)} placeholder="Bachelor of Computer Science" />
                      </label>
                      <label className="cvb-field">
                        <span>School / University</span>
                        <input value={item.school} onChange={(e) => updateObjectItem('education', index, 'school', e.target.value)} placeholder="University name" />
                      </label>
                      <label className="cvb-field">
                        <span>Period</span>
                        <input value={item.period} onChange={(e) => updateObjectItem('education', index, 'period', e.target.value)} placeholder="2016 – 2020" />
                      </label>
                    </div>
                  ))}
                  <button className="cvb-btn soft" type="button" onClick={() => addObjectItem('education')}><Plus size={17} /> Add Education</button>
                </>
              )}

              {editorTab === 'skills' && (
                <>
                  {data.skills.map((item, index) => (
                    <div className="cvb-list-row" key={index}>
                      <input value={item} onChange={(e) => updateTextItem('skills', index, e.target.value)} placeholder={`Skill ${index + 1}`} />
                      <button className="cvb-remove" type="button" onClick={() => removeTextItem('skills', index)}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button className="cvb-btn soft" type="button" onClick={() => addTextItem('skills')}><Plus size={17} /> Add Skill</button>
                </>
              )}

              {editorTab === 'languages' && (
                <>
                  {data.languages.map((item, index) => (
                    <div className="cvb-list-row" key={index}>
                      <input value={item} onChange={(e) => updateTextItem('languages', index, e.target.value)} placeholder={`Language ${index + 1}`} />
                      <button className="cvb-remove" type="button" onClick={() => removeTextItem('languages', index)}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button className="cvb-btn soft" type="button" onClick={() => addTextItem('languages')}><Plus size={17} /> Add Language</button>
                </>
              )}

              <div className="cvb-actions">
                <button className="cvb-btn blue" type="button" onClick={saveCurrent}><Save size={17} /> Save Draft</button>
                <button className="cvb-btn" type="button" onClick={() => setScreen('preview')}><Eye size={17} /> Preview</button>
              </div>
            </section>

            <section className="cvb-preview-sticky">
              <div className="cvb-preview-top">
                <span>Live Preview</span>
                <button className="cvb-link" type="button" onClick={() => setScreen('templates')}>Change Template</button>
              </div>
              <CVPreview data={data} />
            </section>
          </div>
        )}

        {screen === 'templates' && (
          <>
            <div className="cvb-section-head">
              <div>
                <h2>Choose Template</h2>
                <p className="cvb-muted">10 styles now • ready to expand to 50</p>
              </div>
            </div>
            <div className="cvb-grid">
              {templates.map((item) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  active={data.templateId === item.id}
                  onClick={() => {
                    chooseTemplate(item.id)
                    setScreen('preview')
                  }}
                />
              ))}
            </div>
          </>
        )}

        {screen === 'preview' && (
          <section className="cvb-preview-page">
            <div className="cvb-print"><CVPreview data={data} /></div>
            <div className="cvb-preview-actions">
              <button className="cvb-btn" type="button" onClick={() => setScreen('templates')}><LayoutTemplate size={17} /> Templates</button>
              <button className="cvb-btn blue" type="button" onClick={downloadPdf}><Download size={17} /> PDF</button>
            </div>
          </section>
        )}

        {screen === 'saved' && (
          <>
            <div className="cvb-section-head">
              <h2>My CVs</h2>
              <button className="cvb-btn blue" type="button" onClick={createNew}><Plus size={17} /> New CV</button>
            </div>
            <div className="cvb-saved">
              {savedCvs.map((item) => (
                <button className="cvb-saved-item" type="button" key={item.id} onClick={() => openSaved(item)}>
                  <div className="cvb-thumb"><CVPreview data={item} mini /></div>
                  <div>
                    <h3>{item.title || item.profile.fullName || 'My CV'}</h3>
                    <p>{item.profile.jobTitle || 'Professional CV'}</p>
                  </div>
                  <ChevronRight size={20} />
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <nav className="cvb-bottom">
        {[
          ['home', Home, 'Home'],
          ['saved', FileText, 'My CVs'],
          ['templates', LayoutTemplate, 'Templates'],
          ['editor', User, 'Profile']
        ].map(([key, Icon, label]) => (
          <button className={`cvb-nav ${screen === key ? 'active' : ''}`} key={key} type="button" onClick={() => setScreen(key)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
