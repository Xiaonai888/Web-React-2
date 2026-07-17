const fs = require('fs')
const path = require('path')

const root = process.cwd()
const profilePath = path.join(root, 'src', 'pages', 'ProfilePage.jsx')
const backupPath = path.join(root, 'src', 'pages', 'ProfilePage.jsx.before-reader-tabs.bak')

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(profilePath)) {
  fail('src/pages/ProfilePage.jsx was not found.')
}

let content = fs.readFileSync(profilePath, 'utf8')
const original = content

const stateMarker =
  "  const [profileMenuOpen, setProfileMenuOpen] = useState(false)"
const newState =
  "  const [profileTabMessage, setProfileTabMessage] = useState('')"

if (!content.includes(newState)) {
  if (!content.includes(stateMarker)) {
    fail('Profile menu state marker was not found.')
  }

  content = content.replace(
    stateMarker,
    `${stateMarker}\n${newState}`
  )
}

const functionMarker = "  const isOwnProfile = true"

const helperFunction = `  function showProfileTabComingSoon(label) {
    setProfileTabMessage(
      \`\${label} is coming soon.\`
    )

    window.setTimeout(() => {
      setProfileTabMessage('')
    }, 2200)
  }

`

if (!content.includes('showProfileTabComingSoon')) {
  if (!content.includes(functionMarker)) {
    fail('Profile ownership marker was not found.')
  }

  content = content.replace(
    functionMarker,
    `${helperFunction}${functionMarker}`
  )
}

const oldTabs = `          <section className="sticky top-[58px] z-20 border-y border-[#f0eef6] bg-white">
            <div className="grid grid-cols-3 text-center text-[12px] font-extrabold text-[#111827]">
              <button className="relative py-3">
                All
                <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#111827]" />
              </button>
              <button className="py-3">Reels</button>
              <button className="py-3">Photo</button>
            </div>
          </section>`

const newTabs = `          <section className="sticky top-[58px] z-20 border-y border-[#f0eef6] bg-white">
            <div className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-normal text-[#6b7280]">
              <button
                type="button"
                className="rounded-full bg-[#f1f2f4] px-4 py-2 font-semibold text-[#111827]"
              >
                All
              </button>

              <button
                type="button"
                onClick={() =>
                  showProfileTabComingSoon('Reels')
                }
                className="rounded-full px-4 py-2 font-normal text-[#6b7280] active:bg-[#f7f7fb]"
              >
                Reels
              </button>

              <button
                type="button"
                onClick={() =>
                  showProfileTabComingSoon('Photo')
                }
                className="rounded-full px-4 py-2 font-normal text-[#6b7280] active:bg-[#f7f7fb]"
              >
                Photo
              </button>
            </div>

            {profileTabMessage ? (
              <div
                role="status"
                className="absolute left-4 top-[54px] z-30 rounded-[12px] bg-[#111827] px-3 py-2 text-[11px] font-normal text-white shadow-lg"
              >
                {profileTabMessage}
              </div>
            ) : null}
          </section>`

if (!content.includes(newTabs)) {
  if (!content.includes(oldTabs)) {
    fail('Old All / Reels / Photo tab block was not found.')
  }

  content = content.replace(oldTabs, newTabs)
}

if (content === original) {
  console.log('Reader Profile tabs are already updated.')
  process.exit(0)
}

if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, original, 'utf8')
  console.log('Backup created: src/pages/ProfilePage.jsx.before-reader-tabs.bak')
}

fs.writeFileSync(profilePath, content, 'utf8')

console.log('Reader Profile tabs updated successfully.')
console.log('All uses the Author Page active pill style.')
console.log('Reels and Photo show Coming soon.')
