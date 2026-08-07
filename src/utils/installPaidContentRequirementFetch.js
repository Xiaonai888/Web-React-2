let activeRequirementDecision = null

function applyStyles(element, styles) {
  Object.assign(element.style, styles)
  return element
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US')
}

function getRequirementDetails(requirement = {}) {
  if (requirement.type === 'manga') {
    return {
      rule: `Paid manga episodes require at least ${formatNumber(requirement.required_pages)} story pages.`,
      current: `Current total: ${formatNumber(requirement.current_pages)} pages.`,
    }
  }

  if (requirement.type === 'chat_story') {
    return {
      rule: `Paid Chat Story episodes require at least ${formatNumber(requirement.required_messages)} chat messages and ${formatNumber(requirement.required_characters)} characters.`,
      current: `Current total: ${formatNumber(requirement.current_messages)} messages and ${formatNumber(requirement.current_characters)} characters.`,
    }
  }

  const language = String(requirement.language || 'Khmer')

  return {
    rule: `Paid ${language} novel episodes require at least ${formatNumber(requirement.required_characters)} characters.`,
    current: `Current length: ${formatNumber(requirement.current_characters)} characters.`,
  }
}

function requestPaidRequirementDecision(requirement) {
  if (activeRequirementDecision) return activeRequirementDecision

  activeRequirementDecision = new Promise((resolve) => {
    const previousOverflow = document.body.style.overflow
    const details = getRequirementDetails(requirement)
    const overlay = applyStyles(document.createElement('div'), {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(15, 23, 42, 0.52)',
      boxSizing: 'border-box',
    })
    const dialog = applyStyles(document.createElement('section'), {
      width: '100%',
      maxWidth: '410px',
      borderRadius: '22px',
      background: '#ffffff',
      padding: '24px 20px 20px',
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.28)',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    })
    const icon = applyStyles(document.createElement('div'), {
      width: '52px',
      height: '52px',
      margin: '0 auto',
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff1f3',
      color: '#fe526e',
      fontSize: '22px',
      fontWeight: '800',
    })
    const title = applyStyles(document.createElement('h2'), {
      margin: '16px 0 0',
      color: '#111827',
      fontSize: '18px',
      lineHeight: '1.35',
      fontWeight: '800',
      textAlign: 'center',
    })
    const message = applyStyles(document.createElement('p'), {
      margin: '12px 0 0',
      color: '#667085',
      fontSize: '13px',
      lineHeight: '1.7',
      textAlign: 'center',
    })
    const requirementBox = applyStyles(document.createElement('div'), {
      marginTop: '16px',
      padding: '14px',
      borderRadius: '14px',
      background: '#f7f7fa',
      color: '#344054',
      fontSize: '12px',
      lineHeight: '1.7',
      textAlign: 'center',
    })
    const explanation = applyStyles(document.createElement('p'), {
      margin: '14px 0 0',
      color: '#667085',
      fontSize: '12px',
      lineHeight: '1.65',
      textAlign: 'center',
    })
    const actions = applyStyles(document.createElement('div'), {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '10px',
      marginTop: '20px',
    })
    const continueButton = applyStyles(document.createElement('button'), {
      height: '48px',
      border: '1px solid #e4e7ec',
      borderRadius: '999px',
      background: '#ffffff',
      color: '#111827',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
    })
    const freeButton = applyStyles(document.createElement('button'), {
      height: '48px',
      border: '0',
      borderRadius: '999px',
      background: '#111827',
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
    })

    icon.textContent = '!'
    title.textContent = 'More Content Is Needed for Paid Access'
    message.textContent =
      'To keep paid episodes fair and worthwhile for readers, this episode has not yet reached the minimum content requirement.'
    requirementBox.textContent = `${details.rule} ${details.current}`
    explanation.textContent =
      'You can continue editing until it becomes eligible for paid access, or publish it as a Free episode now. Free episodes do not need to meet the paid-content requirement.'
    continueButton.textContent = 'Continue Editing'
    freeButton.textContent = 'Publish as Free'

    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    dialog.setAttribute('aria-labelledby', 'paid-content-requirement-title')
    title.id = 'paid-content-requirement-title'

    const finish = (publishFree) => {
      window.removeEventListener('keydown', handleKeyDown)
      overlay.remove()
      document.body.style.overflow = previousOverflow
      activeRequirementDecision = null
      resolve(publishFree)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') finish(false)
    }

    continueButton.addEventListener('click', () => finish(false))
    freeButton.addEventListener('click', () => finish(true))
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) finish(false)
    })
    window.addEventListener('keydown', handleKeyDown)

    actions.append(continueButton, freeButton)
    dialog.append(icon, title, message, requirementBox, explanation, actions)
    overlay.append(dialog)
    document.body.append(overlay)
    document.body.style.overflow = 'hidden'
    continueButton.focus()
  })

  return activeRequirementDecision
}

function buildFreeRetryInit(init = {}) {
  if (typeof init.body !== 'string') return null

  try {
    const body = JSON.parse(init.body)
    body.is_free_published = true
    body.isFreePublished = true

    return {
      ...init,
      body: JSON.stringify(body),
    }
  } catch {
    return null
  }
}

export function installPaidContentRequirementFetch() {
  if (window.__shadowPaidContentRequirementFetchInstalled) return

  window.__shadowPaidContentRequirementFetchInstalled = true
  const apiFetch = window.fetch.bind(window)

  window.fetch = async (input, init = {}) => {
    const response = await apiFetch(input, init)

    if (response.status !== 409) return response

    const data = await response.clone().json().catch(() => ({}))

    if (data.code !== 'PAID_CONTENT_REQUIREMENT_NOT_MET') {
      return response
    }

    const publishFree = await requestPaidRequirementDecision(
      data.paid_requirement || data.paidRequirement || {}
    )

    if (!publishFree) return response

    const retryInit = buildFreeRetryInit(init)
    if (!retryInit) return response

    return apiFetch(input, retryInit)
  }
}
