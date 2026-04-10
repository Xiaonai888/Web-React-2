import { Link } from 'react-router-dom'

function SettingsRow({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-2xl border border-[#efefef] bg-white px-4 py-4 shadow-sm transition hover:bg-[#fafafa]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f7f8]">
          <span className="text-[17px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-[13px] font-extrabold tracking-tight text-[#111]">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#8b8b95]">
            {subtitle}
          </p>
        </div>
      </div>
      <i className="fas fa-chevron-right shrink-0 text-[12px] text-[#b6b6bf]" />
    </Link>
  )
}

export default function SettingsSection() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">Settings</h2>
      </div>

      <div className="space-y-3">
        <SettingsRow to="/settings" icon="⚙️" title="Settings & Privacy" subtitle="Open language, privacy, reading preferences, and more." />
        <SettingsRow to="/settings" icon="🔔" title="Notifications" subtitle="Check updates, alerts, and account-related notifications." />
        <SettingsRow to="/settings" icon="🛡️" title="Privacy & Safety" subtitle="Manage your personal information and reader safety options." />
      </div>
    </>
  )
}
