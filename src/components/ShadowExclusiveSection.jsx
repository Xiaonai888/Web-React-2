import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com';

const sectionOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'new_exclusive', label: 'New Exclusive' },
  { key: 'popular_exclusive', label: 'Popular Exclusive' },
  { key: 'editor_pick', label: 'Editor Pick' },
  { key: 'premium_romance', label: 'Premium Romance' },
  { key: 'premium_fantasy', label: 'Premium Fantasy' },
  { key: 'completed_exclusive', label: 'Completed Exclusive' },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  :root {
    --se-bg: #F8FAFC;
    --se-card: #FFFFFF;
    --se-primary: #4F46E5;
    --se-primary-light: #EEF2FF;
    --se-text: #0F172A;
    --se-muted: #64748B;
    --se-border: #E2E8F0;
    --se-green: #10B981;
    --se-red: #EF4444;
  }

  * { box-sizing: border-box; }

  .se-page {
    min-height: 100vh;
    background: var(--se-bg);
    font-family: 'Inter', sans-serif;
    color: var(--se-text);
    padding: 28px 36px 60px;
  }

  .se-shell { max-width: 1500px; margin: 0 auto; }

  .se-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }

  .se-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    border-radius: 999px;
    background: #FFF7ED;
    color: #B45309;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .se-title {
    font-size: 30px;
    line-height: 1.15;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.04em;
  }

  .se-subtitle {
    margin-top: 8px;
    max-width: 760px;
    color: var(--se-muted);
    font-size: 14px;
    line-height: 1.7;
    font-weight: 500;
  }

  .se-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .se-button {
    height: 42px;
    border: 0;
    border-radius: 12px;
    padding: 0 16px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  .se-button:active { transform: scale(0.98); }

  .se-button-primary {
    background: var(--se-primary);
    color: white;
    box-shadow: 0 12px 24px rgba(79,70,229,0.22);
  }

  .se-button-ghost {
    background: white;
    color: var(--se-text);
    border: 1px solid var(--se-border);
  }

  .se-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .se-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 22px;
  }

  .se-stat-card {
    background: var(--se-card);
    border: 1px solid var(--se-border);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(15,23,42,0.04);
  }

  .se-stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .se-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 14px;
    background: var(--se-primary-light);
    color: var(--se-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .se-stat-label {
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--se-muted);
  }

  .se-stat-value {
    font-size: 28px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .se-stat-note {
    margin-top: 8px;
    color: var(--se-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .se-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.75fr);
    gap: 18px;
  }

  .se-card {
    background: var(--se-card);
    border: 1px solid var(--se-border);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(15,23,42,0.04);
    overflow: hidden;
  }

  .se-card-header {
    padding: 18px 20px;
    border-bottom: 1px solid var(--se-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .se-card-title {
    font-size: 16px;
    font-weight: 900;
    margin: 0;
  }

  .se-card-subtitle {
    margin-top: 4px;
    color: var(--se-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .se-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .se-tab {
    border: 1px solid var(--se-border);
    background: white;
    color: var(--se-muted);
    height: 34px;
    border-radius: 999px;
    padding: 0 13px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .se-tab.active {
    background: var(--se-primary);
    border-color: var(--se-primary);
    color: white;
  }

  .se-toolbar {
    padding: 14px 20px;
    border-bottom: 1px solid var(--se-border);
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .se-search {
    height: 42px;
    flex: 1;
    border: 1px solid var(--se-border);
    border-radius: 12px;
    padding: 0 14px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    outline: none;
  }

  .se-search:focus {
    border-color: var(--se-primary);
    box-shadow: 0 0 0 3px rgba(79,70,229,0.10);
  }

  .se-message {
    margin: 14px 20px 0;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.6;
  }

  .se-message.error {
    background: #FEF2F2;
    color: #B91C1C;
    border: 1px solid #FECACA;
  }

  .se-message.success {
    background: #ECFDF3;
    color: #047857;
    border: 1px solid #BBF7D0;
  }

  .se-list { padding: 12px; }

  .se-story-row {
    display: grid;
    grid-template-columns: 68px minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    padding: 12px;
    border-radius: 16px;
    transition: background 0.15s ease;
  }

  .se-story-row:hover { background: #F8FAFC; }

  .se-cover {
    width: 68px;
    aspect-ratio: 2 / 3;
    border-radius: 12px;
    background: #111827;
    overflow: hidden;
    box-shadow: 0 8px 18px rgba(15,23,42,0.12);
  }

  .se-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .se-story-title {
    font-size: 14px;
    font-weight: 900;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .se-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    color: var(--se-muted);
    font-size: 11.5px;
    font-weight: 700;
  }

  .se-pill {
    display: inline-flex;
    align-items: center;
    height: 24px;
    border-radius: 999px;
    padding: 0 9px;
    font-size: 10.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.25px;
  }

  .se-pill-pending { background: #FEF3C7; color: #B45309; }
  .se-pill-approved { background: #D1FAE5; color: #047857; }
  .se-pill-rejected { background: #FEE2E2; color: #B91C1C; }
  .se-pill-premium { background: #EEF2FF; color: #4F46E5; }
  .se-pill-free { background: #F1F5F9; color: #475569; }
  .se-pill-none { background: #F1F5F9; color: #475569; }

  .se-row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .se-small-btn {
    height: 34px;
    border-radius: 999px;
    border: 1px solid var(--se-border);
    background: white;
    color: var(--se-text);
    padding: 0 12px;
    font-size: 11.5px;
    font-weight: 900;
    cursor: pointer;
  }

  .se-small-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .se-small-btn.request {
    background: #EEF2FF;
    border-color: #C7D2FE;
    color: #4338CA;
  }

  .se-small-btn.approve {
    background: #ECFDF3;
    border-color: #BBF7D0;
    color: #047857;
  }

  .se-small-btn.reject {
    background: #FEF2F2;
    border-color: #FECACA;
    color: #B91C1C;
  }

  .se-small-btn.remove {
    background: #FFF7ED;
    border-color: #FED7AA;
    color: #C2410C;
  }

  .se-panel-body { padding: 18px 20px; }

  .se-section-box {
    padding: 14px;
    border: 1px solid var(--se-border);
    border-radius: 16px;
    margin-bottom: 12px;
    background: #FAFBFF;
  }

  .se-section-title {
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 4px;
  }

  .se-section-desc {
    color: var(--se-muted);
    font-size: 12px;
    line-height: 1.55;
    font-weight: 600;
  }

  .se-check-list { display: grid; gap: 10px; }

  .se-check-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    line-height: 1.5;
    color: #334155;
    font-weight: 600;
  }

  .se-check-icon {
    margin-top: 2px;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #DCFCE7;
    color: #047857;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }

  .se-note {
    margin-top: 12px;
    border-radius: 16px;
    border: 1px solid #FED7AA;
    background: #FFF7ED;
    padding: 14px;
    color: #9A3412;
    font-size: 12px;
    line-height: 1.6;
    font-weight: 700;
  }

  .se-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.38);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }

  .se-modal {
    width: min(520px, 100%);
    background: white;
    border-radius: 22px;
    box-shadow: 0 22px 70px rgba(15,23,42,0.22);
    border: 1px solid var(--se-border);
    overflow: hidden;
  }

  .se-modal-header {
    padding: 20px;
    border-bottom: 1px solid var(--se-border);
  }

  .se-modal-title {
    font-size: 18px;
    font-weight: 900;
    margin: 0;
  }

  .se-modal-subtitle {
    margin-top: 6px;
    color: var(--se-muted);
    font-size: 13px;
    line-height: 1.6;
    font-weight: 600;
  }

  .se-modal-body { padding: 20px; }

  .se-label {
    display: block;
    font-size: 12px;
    font-weight: 900;
    color: var(--se-text);
    margin-bottom: 8px;
  }

  .se-textarea {
    width: 100%;
    min-height: 92px;
    resize: vertical;
    border: 1px solid var(--se-border);
    border-radius: 14px;
    padding: 12px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    outline: none;
  }

  .se-textarea:focus {
    border-color: var(--se-primary);
    box-shadow: 0 0 0 3px rgba(79,70,229,0.10);
  }

  .se-checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
    margin-bottom: 16px;
  }

  .se-check-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    border: 1px solid var(--se-border);
    border-radius: 12px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    color: #334155;
  }

  .se-check-btn input { accent-color: var(--se-primary); }

  .se-modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--se-border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .se-empty {
    padding: 44px 20px;
    text-align: center;
    color: var(--se-muted);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.6;
  }

  @media (max-width: 1000px) {
    .se-page { padding: 22px 16px 50px; }
    .se-header { flex-direction: column; }
    .se-actions { justify-content: flex-start; }
    .se-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .se-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .se-stats { grid-template-columns: 1fr; }
    .se-toolbar { flex-direction: column; align-items: stretch; }
    .se-story-row { grid-template-columns: 58px minmax(0, 1fr); }
    .se-row-actions { grid-column: 1 / -1; justify-content: flex-start; padding-left: 72px; }
    .se-checkbox-grid { grid-template-columns: 1fr; }
  }
`;

function getAdminToken() {
  return (
    sessionStorage.getItem('shadow_admin_token') ||
    localStorage.getItem('shadow_admin_token') ||
    ''
  );
}

function StatusPill({ status }) {
  const normalized = String(status || 'none').toLowerCase();

  const className =
    normalized === 'approved'
      ? 'se-pill se-pill-approved'
      : normalized === 'pending'
      ? 'se-pill se-pill-pending'
      : normalized === 'rejected'
      ? 'se-pill se-pill-rejected'
      : 'se-pill se-pill-none';

  return <span className={className}>{normalized}</span>;
}

function AccessPill({ value }) {
  const normalized = String(value || 'free').toLowerCase();

  return (
    <span className={`se-pill ${normalized === 'premium' ? 'se-pill-premium' : 'se-pill-free'}`}>
      {normalized}
    </span>
  );
}

function StatCard({ icon, label, value, note }) {
  return (
    <div className="se-stat-card">
      <div className="se-stat-top">
        <div className="se-stat-label">{label}</div>
        <div className="se-stat-icon">{icon}</div>
      </div>
      <div className="se-stat-value">{value}</div>
      <div className="se-stat-note">{note}</div>
    </div>
  );
}

function StoryModal({
  open,
  mode,
  story,
  saving,
  selectedSections,
  setSelectedSections,
  note,
  setNote,
  keepPremium,
  setKeepPremium,
  onClose,
  onConfirm,
}) {
  if (!open || !story) return null;

  const titleMap = {
    approve: 'Approve Shadow Exclusive',
    reject: 'Reject Shadow Exclusive',
    remove: 'Remove from Shadow Exclusive',
    request: 'Move to Review',
    sections: 'Update Exclusive Sections',
  };

  const subtitleMap = {
    approve: 'Choose which Shadow Exclusive sections this story should appear in.',
    reject: 'Reject this story from the exclusive workflow. You can add a reason for records.',
    remove: 'This will remove the story from Shadow Exclusive and return it to normal sections.',
    request: 'Move this published story into Shadow Exclusive review/pending status.',
    sections: 'Update where this approved exclusive story appears.',
  };

  const showSections = mode === 'approve' || mode === 'sections';

  const toggleSection = (key) => {
    setSelectedSections((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      return [...current, key];
    });
  };

  return (
    <div className="se-modal-backdrop">
      <div className="se-modal">
        <div className="se-modal-header">
          <h2 className="se-modal-title">{titleMap[mode]}</h2>
          <p className="se-modal-subtitle">
            {story.title}
            <br />
            {subtitleMap[mode]}
          </p>
        </div>

        <div className="se-modal-body">
          {showSections ? (
            <>
              <label className="se-label">Exclusive Sections</label>
              <div className="se-checkbox-grid">
                {sectionOptions.map((section) => (
                  <label key={section.key} className="se-check-btn">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.key)}
                      onChange={() => toggleSection(section.key)}
                    />
                    {section.label}
                  </label>
                ))}
              </div>
            </>
          ) : null}

          {mode === 'remove' ? (
            <label className="se-check-btn" style={{ marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={keepPremium}
                onChange={(event) => setKeepPremium(event.target.checked)}
              />
              Keep story premium after removing from Shadow Exclusive
            </label>
          ) : null}

          {mode !== 'sections' ? (
            <>
              <label className="se-label">Admin Note</label>
              <textarea
                className="se-textarea"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional note..."
              />
            </>
          ) : null}
        </div>

        <div className="se-modal-footer">
          <button type="button" className="se-button se-button-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="se-button se-button-primary" onClick={onConfirm} disabled={saving}>
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShadowExclusive() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('approve');
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedSections, setSelectedSections] = useState(['featured']);
  const [note, setNote] = useState('');
  const [keepPremium, setKeepPremium] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(''), 3600);
  };

  const tabToStatus = (tab) => {
    const normalized = String(tab || '').toLowerCase();
    if (normalized === 'all') return 'all';
    return normalized;
  };

  async function apiFetch(path, options = {}) {
    const token = getAdminToken();

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Admin-Name': 'Admin',
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  async function fetchStories() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      const status = tabToStatus(activeTab);
      if (status !== 'all') params.set('status', status);
      if (search.trim()) params.set('search', search.trim());

      const data = await apiFetch(`/api/admin/exclusive/stories?${params.toString()}`);
      setStories(data.stories || []);
    } catch (error) {
      setStories([]);
      showMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Please check Render deployment.'
          : error.message || 'Failed to load stories',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const openActionModal = (mode, story) => {
    setModalMode(mode);
    setSelectedStory(story);
    setSelectedSections(story?.exclusive_sections?.length ? story.exclusive_sections : ['featured']);
    setNote(story?.exclusive_note || '');
    setKeepPremium(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedStory(null);
    setNote('');
    setSelectedSections(['featured']);
    setKeepPremium(false);
  };

  const runAction = async () => {
    if (!selectedStory) return;

    try {
      setSaving(true);

      let path = '';
      let body = {};

      if (modalMode === 'request') {
        path = `/api/admin/exclusive/stories/${selectedStory.id}/request`;
        body = { note };
      }

      if (modalMode === 'approve') {
        path = `/api/admin/exclusive/stories/${selectedStory.id}/approve`;
        body = {
          access_type: 'premium',
          exclusive_sections: selectedSections.length ? selectedSections : ['featured'],
          note,
        };
      }

      if (modalMode === 'reject') {
        path = `/api/admin/exclusive/stories/${selectedStory.id}/reject`;
        body = { note };
      }

      if (modalMode === 'remove') {
        path = `/api/admin/exclusive/stories/${selectedStory.id}/remove`;
        body = { keep_premium: keepPremium, note };
      }

      if (modalMode === 'sections') {
        path = `/api/admin/exclusive/stories/${selectedStory.id}/sections`;
        body = {
          exclusive_sections: selectedSections.length ? selectedSections : ['featured'],
        };
      }

      const data = await apiFetch(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });

      showMessage(data.message || 'Saved successfully');
      closeModal();
      await fetchStories();
    } catch (error) {
      showMessage(error.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const approved = stories.filter((story) => story.is_shadow_exclusive && story.exclusive_status === 'approved').length;
    const pending = stories.filter((story) => story.exclusive_status === 'pending').length;
    const rejected = stories.filter((story) => story.exclusive_status === 'rejected').length;
    const normal = stories.filter((story) => !story.is_shadow_exclusive && story.exclusive_status === 'none').length;

    return { approved, pending, rejected, normal };
  }, [stories]);

  return (
    <main className="se-page">
      <style>{styles}</style>

      <StoryModal
        open={modalOpen}
        mode={modalMode}
        story={selectedStory}
        saving={saving}
        selectedSections={selectedSections}
        setSelectedSections={setSelectedSections}
        note={note}
        setNote={setNote}
        keepPremium={keepPremium}
        setKeepPremium={setKeepPremium}
        onClose={closeModal}
        onConfirm={runAction}
      />

      <div className="se-shell">
        <header className="se-header">
          <div>
            <div className="se-kicker">👑 Premium Management</div>
            <h1 className="se-title">Shadow Exclusive</h1>
            <p className="se-subtitle">
              Review published stories, request author consent, approve premium access,
              choose exclusive sections, and remove stories when authors want normal monetization again.
            </p>
          </div>

          <div className="se-actions">
            <button type="button" className="se-button se-button-ghost" onClick={() => navigate('/admin')}>
              Back Dashboard
            </button>
            <button type="button" className="se-button se-button-primary" onClick={fetchStories} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </header>

        <section className="se-stats">
          <StatCard icon="📚" label="Loaded Stories" value={stories.length} note="Published stories available" />
          <StatCard icon="⏳" label="Pending Review" value={stats.pending} note="Need admin decision" />
          <StatCard icon="✅" label="Approved" value={stats.approved} note="Visible in exclusive area" />
          <StatCard icon="↩️" label="Normal / Removed" value={stats.normal} note="Not exclusive now" />
        </section>

        <section className="se-grid">
          <div className="se-card">
            <div className="se-card-header">
              <div>
                <h2 className="se-card-title">Exclusive Review Queue</h2>
                <div className="se-card-subtitle">
                  Approve only stories that meet Shadow quality and consent rules.
                </div>
              </div>

              <div className="se-tabs">
                {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`se-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="se-toolbar">
              <input
                className="se-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search published stories..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') fetchStories();
                }}
              />
              <button type="button" className="se-button se-button-ghost" onClick={fetchStories} disabled={loading}>
                Search
              </button>
            </div>

            {message ? (
              <div className={`se-message ${messageType === 'error' ? 'error' : 'success'}`}>
                {message}
              </div>
            ) : null}

            <div className="se-list">
              {loading ? (
                <div className="se-empty">Loading Shadow Exclusive stories...</div>
              ) : stories.length ? (
                stories.map((story) => (
                  <div className="se-story-row" key={story.id}>
                    <div className="se-cover">
                      {story.cover_url ? (
                        <img
                          src={story.cover_url}
                          alt={story.title}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <div className="se-story-title">{story.title || 'Untitled Story'}</div>
                      <div className="se-meta">
                        <span>{story.main_genre || 'Novel'}</span>
                        <span>•</span>
                        <span>{story.story_language || 'Unknown'}</span>
                        <span>•</span>
                        <span>EP {Number(story.total_episodes || 0)}</span>
                      </div>
                      <div className="se-meta" style={{ marginTop: 8 }}>
                        <StatusPill status={story.exclusive_status} />
                        <AccessPill value={story.access_type} />
                        {story.exclusive_sections?.length ? (
                          <span>{story.exclusive_sections.join(' / ')}</span>
                        ) : (
                          <span>No exclusive section</span>
                        )}
                      </div>
                    </div>

                    <div className="se-row-actions">
                      {story.exclusive_status === 'none' && !story.is_shadow_exclusive ? (
                        <button type="button" className="se-small-btn request" onClick={() => openActionModal('request', story)}>
                          Request
                        </button>
                      ) : null}

                      {story.exclusive_status !== 'approved' ? (
                        <button type="button" className="se-small-btn approve" onClick={() => openActionModal('approve', story)}>
                          Approve
                        </button>
                      ) : null}

                      {story.exclusive_status === 'approved' ? (
                        <button type="button" className="se-small-btn" onClick={() => openActionModal('sections', story)}>
                          Sections
                        </button>
                      ) : null}

                      {story.exclusive_status !== 'rejected' && story.exclusive_status !== 'none' ? (
                        <button type="button" className="se-small-btn reject" onClick={() => openActionModal('reject', story)}>
                          Reject
                        </button>
                      ) : null}

                      {story.is_shadow_exclusive ? (
                        <button type="button" className="se-small-btn remove" onClick={() => openActionModal('remove', story)}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="se-empty">
                  No stories found. Make sure there are published stories in the reader app.
                </div>
              )}
            </div>
          </div>

          <aside className="se-card">
            <div className="se-card-header">
              <div>
                <h2 className="se-card-title">Rules</h2>
                <div className="se-card-subtitle">Professional Shadow Exclusive workflow.</div>
              </div>
            </div>

            <div className="se-panel-body">
              <div className="se-section-box">
                <div className="se-section-title">Recommended Sections</div>
                <div className="se-section-desc">
                  Featured, New Exclusive, Popular Exclusive, Editor Pick, Premium Romance, Premium Fantasy, Completed Exclusive.
                </div>
              </div>

              <div className="se-check-list">
                <div className="se-check-item">
                  <span className="se-check-icon">✓</span>
                  <span>Author consent is required before approval.</span>
                </div>

                <div className="se-check-item">
                  <span className="se-check-icon">✓</span>
                  <span>Shadow Exclusive stories should not appear in normal sections.</span>
                </div>

                <div className="se-check-item">
                  <span className="se-check-icon">✓</span>
                  <span>Premium users can read; free users should see a paywall later.</span>
                </div>

                <div className="se-check-item">
                  <span className="se-check-icon">✓</span>
                  <span>Admin can remove a story if the author wants normal monetization again.</span>
                </div>
              </div>

              <div className="se-note">
                Remove calls backend to set:
                is_shadow_exclusive=false, exclusive_status=none, exclusive_sections=[].
                If keep premium is off, access_type becomes free.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
