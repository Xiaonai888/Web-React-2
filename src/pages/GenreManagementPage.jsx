import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com';
const MAX_TABS = 12;

function getAdminToken() {
  return sessionStorage.getItem('shadow_admin_token') || localStorage.getItem('shadow_admin_token') || '';
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg:#F8FAFC;
    --card:#fff;
    --primary:#4F46E5;
    --light:#EEF2FF;
    --text:#0F172A;
    --muted:#64748B;
    --soft:#94A3B8;
    --border:#E2E8F0;
    --success:#10B981;
    --successBg:#D1FAE5;
    --danger:#EF4444;
    --dangerBg:#FEE2E2;
    --warning:#F59E0B;
    --warningBg:#FEF3C7;
    --side:80px;
    --sideOpen:260px;
  }

  * { box-sizing:border-box; margin:0; padding:0; }

  body {
    font-family:Inter, sans-serif;
    background:var(--bg);
    color:var(--text);
  }

  .genre-dashboard-wrapper {
    height:100vh;
    display:flex;
    background:var(--bg);
    overflow:hidden;
  }

  .sidebar {
    width:var(--side);
    background:#fff;
    border-right:1px solid var(--border);
    padding:20px 14px;
    overflow:auto;
    overflow-x:hidden;
    transition:.25s;
    flex-shrink:0;
  }

  .sidebar:hover {
    width:var(--sideOpen);
    box-shadow:10px 0 30px rgba(15,23,42,.05);
  }

  .sidebar-logo {
    height:40px;
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:28px;
    padding-left:10px;
  }

  .logo-mark {
    width:34px;
    height:34px;
    border-radius:14px;
    background:linear-gradient(135deg,#4F46E5,#7C3AED);
    color:#fff;
    display:grid;
    place-items:center;
    font-weight:900;
    flex-shrink:0;
  }

  .logo-text {
    opacity:0;
    white-space:nowrap;
    color:var(--primary);
    font-weight:900;
    font-size:18px;
  }

  .sidebar:hover .logo-text,
  .sidebar:hover .nav-text,
  .sidebar:hover .nav-group-label {
    opacity:1;
  }

  .nav-group-label {
    opacity:0;
    display:block;
    margin:18px 0 8px 12px;
    font-size:10px;
    font-weight:900;
    text-transform:uppercase;
    letter-spacing:1px;
    color:var(--soft);
    white-space:nowrap;
  }

  .nav-item {
    height:44px;
    display:flex;
    align-items:center;
    border-radius:12px;
    padding:0 12px;
    color:var(--muted);
    cursor:pointer;
    margin-bottom:2px;
    font-weight:700;
    white-space:nowrap;
    border:0;
    background:transparent;
    width:100%;
    font-family:inherit;
    font-size:14px;
    text-align:left;
  }

  .nav-item:hover,
  .nav-item.active {
    background:var(--light);
    color:var(--primary);
  }

  .nav-icon {
    width:20px;
    text-align:center;
    flex-shrink:0;
  }

  .nav-text {
    opacity:0;
    margin-left:14px;
    transition:.2s;
  }

  .main-content {
    flex:1;
    overflow:auto;
  }

  .header {
    height:70px;
    background:#fff;
    border-bottom:1px solid var(--border);
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:0 36px;
    position:sticky;
    top:0;
    z-index:10;
  }

  .header h2 {
    font-size:17px;
    font-weight:900;
  }

  .header-pill {
    height:34px;
    display:flex;
    align-items:center;
    gap:8px;
    border:1px solid var(--border);
    background:#fff;
    color:var(--muted);
    border-radius:999px;
    padding:0 12px;
    font-size:12px;
    font-weight:800;
  }

  .content-body {
    padding:28px 36px 48px;
    max-width:1600px;
    margin:0 auto;
  }

  .page-title-row {
    margin-bottom:22px;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:18px;
  }

  .page-title-row h1 {
    font-size:27px;
    font-weight:900;
    letter-spacing:-.04em;
  }

  .page-title-row p {
    font-size:13.5px;
    color:var(--muted);
    margin-top:5px;
    line-height:1.6;
  }

  .grid-shell {
    display:grid;
    grid-template-columns:minmax(0,1fr) 390px;
    gap:22px;
    align-items:start;
  }

  .panel {
    background:#fff;
    border:1px solid var(--border);
    border-radius:22px;
    box-shadow:0 8px 28px rgba(15,23,42,.06);
    overflow:hidden;
  }

  .panel-header {
    padding:20px 22px;
    border-bottom:1px solid var(--border);
    display:flex;
    justify-content:space-between;
    gap:14px;
    align-items:center;
  }

  .panel-title h3 {
    font-size:16px;
    font-weight:900;
  }

  .panel-title p {
    margin-top:4px;
    color:var(--muted);
    font-size:12.5px;
    line-height:1.5;
  }

  .panel-body {
    padding:20px 22px 22px;
  }

  .btn {
    height:40px;
    border:0;
    border-radius:999px;
    padding:0 16px;
    font-family:inherit;
    font-size:12px;
    font-weight:900;
    cursor:pointer;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
  }

  .btn.primary {
    background:var(--primary);
    color:#fff;
    box-shadow:0 12px 24px rgba(79,70,229,.18);
  }

  .btn.dark {
    background:#0F172A;
    color:#fff;
  }

  .btn.soft {
    background:var(--light);
    color:var(--primary);
  }

  .btn.white {
    background:#fff;
    color:var(--text);
    border:1px solid var(--border);
  }

  .btn.danger {
    background:var(--dangerBg);
    color:var(--danger);
  }

  .btn:disabled {
    opacity:.55;
    cursor:not-allowed;
    box-shadow:none;
  }

  .message {
    border-radius:16px;
    padding:12px 14px;
    font-size:12.5px;
    font-weight:800;
    margin-bottom:16px;
    line-height:1.5;
  }

  .message.error {
    background:var(--dangerBg);
    color:var(--danger);
  }

  .message.success {
    background:var(--successBg);
    color:#047857;
  }

  .featured-list {
    display:flex;
    flex-wrap:wrap;
    gap:10px;
  }

  .featured-chip {
    min-height:42px;
    border:1px solid var(--border);
    background:#fff;
    color:var(--text);
    border-radius:999px;
    display:flex;
    align-items:center;
    gap:8px;
    padding:0 12px;
    font-size:12px;
    font-weight:900;
  }

  .featured-chip.locked {
    background:#0F172A;
    color:#fff;
    border-color:#0F172A;
  }

  .featured-chip .order {
    width:22px;
    height:22px;
    border-radius:999px;
    background:rgba(79,70,229,.12);
    color:var(--primary);
    display:grid;
    place-items:center;
    font-size:10px;
    font-weight:900;
  }

  .featured-chip.locked .order {
    background:rgba(255,255,255,.18);
    color:#fff;
  }

  .featured-chip button {
    width:22px;
    height:22px;
    border:0;
    border-radius:999px;
    cursor:pointer;
    background:#F1F5F9;
    color:var(--muted);
  }

  .featured-chip.locked button {
    cursor:not-allowed;
    background:rgba(255,255,255,.16);
    color:#fff;
  }

  .genre-picker {
    margin-top:18px;
    border-top:1px solid var(--border);
    padding-top:18px;
  }

  .search-input {
    height:42px;
    border:1px solid var(--border);
    background:#F8FAFC;
    border-radius:999px;
    display:flex;
    align-items:center;
    gap:10px;
    padding:0 14px;
    margin-bottom:14px;
  }

  .search-input input {
    border:0;
    outline:0;
    background:transparent;
    flex:1;
    min-width:0;
    font-family:inherit;
    color:var(--text);
    font-weight:700;
  }

  .genre-options {
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:10px;
  }

  .genre-option {
    border:1px solid var(--border);
    background:#fff;
    min-height:44px;
    border-radius:14px;
    padding:0 12px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    cursor:pointer;
    font-family:inherit;
    color:var(--text);
    font-size:12px;
    font-weight:900;
  }

  .genre-option.selected {
    background:var(--light);
    color:var(--primary);
    border-color:#C7D2FE;
  }

  .genre-option:disabled {
    opacity:.45;
    cursor:not-allowed;
  }

  .records-tools {
    display:flex;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
  }

  .records-tools .search-input {
    min-width:280px;
    margin-bottom:0;
  }

  .records-table {
    width:100%;
    border-collapse:collapse;
  }

  .records-table th {
    text-align:left;
    color:var(--soft);
    font-size:11px;
    font-weight:900;
    text-transform:uppercase;
    letter-spacing:.05em;
    padding:13px 14px;
    border-bottom:1px solid var(--border);
    background:#F8FAFC;
  }

  .records-table td {
    padding:14px;
    border-bottom:1px solid #EEF2F7;
    vertical-align:middle;
  }

  .records-table tr:last-child td {
    border-bottom:0;
  }

  .genre-name {
    font-size:13.5px;
    font-weight:900;
    color:var(--text);
  }

  .genre-slug {
    margin-top:4px;
    color:var(--muted);
    font-size:11.5px;
    font-weight:700;
  }

  .badge {
    height:26px;
    border-radius:999px;
    display:inline-flex;
    align-items:center;
    padding:0 10px;
    font-size:11px;
    font-weight:900;
  }

  .badge.active {
    background:var(--successBg);
    color:#047857;
  }

  .badge.inactive {
    background:#F1F5F9;
    color:var(--muted);
  }

  .row-actions {
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:8px;
  }

  .icon-btn {
    width:34px;
    height:34px;
    border:1px solid var(--border);
    background:#fff;
    border-radius:12px;
    cursor:pointer;
    color:var(--muted);
  }

  .icon-btn:hover {
    background:var(--light);
    color:var(--primary);
  }

  .icon-btn.danger:hover {
    background:var(--dangerBg);
    color:var(--danger);
  }

  .form-card {
    display:grid;
    gap:14px;
  }

  .field label {
    display:block;
    font-size:12px;
    font-weight:900;
    color:var(--text);
    margin-bottom:8px;
  }

  .field input {
    width:100%;
    height:42px;
    border:1px solid var(--border);
    border-radius:14px;
    padding:0 13px;
    outline:0;
    font-family:inherit;
    font-weight:700;
    background:#F8FAFC;
  }

  .field input:focus {
    border-color:var(--primary);
    background:#fff;
    box-shadow:0 0 0 4px rgba(79,70,229,.08);
  }

  .toggle-row {
    height:42px;
    border:1px solid var(--border);
    border-radius:14px;
    padding:0 13px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    background:#F8FAFC;
    font-size:12.5px;
    font-weight:800;
  }

  .toggle {
    width:46px;
    height:26px;
    border:0;
    border-radius:999px;
    background:#CBD5E1;
    padding:3px;
    cursor:pointer;
    transition:.2s;
  }

  .toggle span {
    width:20px;
    height:20px;
    display:block;
    border-radius:999px;
    background:#fff;
    transition:.2s;
  }

  .toggle.active {
    background:var(--primary);
  }

  .toggle.active span {
    transform:translateX(20px);
  }

  .empty {
    padding:38px;
    text-align:center;
    color:var(--muted);
    font-size:13px;
    font-weight:700;
  }

  @media (max-width:1100px) {
    .grid-shell { grid-template-columns:1fr; }
    .genre-options { grid-template-columns:repeat(2,minmax(0,1fr)); }
  }

  @media (max-width:760px) {
    .genre-dashboard-wrapper { display:block; height:auto; min-height:100vh; }
    .sidebar { display:none; }
    .header { padding:0 18px; }
    .content-body { padding:22px 16px 36px; }
    .page-title-row { display:block; }
    .genre-options { grid-template-columns:1fr; }
    .records-tools .search-input { min-width:0; width:100%; }
    .records-table { min-width:780px; }
    .records-scroll { overflow:auto; }
  }
`;

function Sidebar({ activePath }) {
  const navigate = useNavigate();

  const items = [
    { label: 'Dashboard', path: '/admin', icon: 'fa-solid fa-chart-line', group: 'Main' },
    { label: 'Slide Section', path: '/slides', icon: 'fa-regular fa-images' },
    { label: 'Banner System', path: '/banners', icon: 'fa-solid fa-panorama' },
    { label: 'Genre', path: '/genres', icon: 'fa-solid fa-layer-group' },
    { label: 'Shadow Exclusive', path: '/shadow-exclusive', icon: 'fa-solid fa-crown', group: 'Content' },
    { label: 'Authors', path: '/authors', icon: 'fa-solid fa-users' },
    { label: 'Recommended', path: '/recommended', icon: 'fa-solid fa-star' },
    { label: 'Ranking', path: '/ranking', icon: 'fa-solid fa-ranking-star' },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: 'fa-solid fa-clock-rotate-left', group: 'Admin' },
    { label: 'Settings', path: '/admin/settings', icon: 'fa-solid fa-gear' },
  ];

  let lastGroup = '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        <div className="logo-text">Shadow Admin</div>
      </div>

      {items.map((item) => {
        const showGroup = item.group && item.group !== lastGroup;
        if (item.group) lastGroup = item.group;

        return (
          <React.Fragment key={item.path}>
            {showGroup ? <div className="nav-group-label">{item.group}</div> : null}
            <button
              type="button"
              onClick={() => navigate(item.path)}
              className={`nav-item ${activePath === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon"><i className={item.icon} /></span>
              <span className="nav-text">{item.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </aside>
  );
}

function Message({ type, children, onClose }) {
  if (!children) return null;
  return (
    <button type="button" onClick={onClose} className={`message ${type}`}>
      {children}
    </button>
  );
}

function GenreForm({ editingGenre, onCancel, onSubmit, saving }) {
  const [name, setName] = useState(editingGenre?.name || '');
  const [slug, setSlug] = useState(editingGenre?.slug || '');
  const [sortOrder, setSortOrder] = useState(editingGenre?.sort_order || 0);
  const [isActive, setIsActive] = useState(editingGenre?.is_active ?? true);

  useEffect(() => {
    setName(editingGenre?.name || '');
    setSlug(editingGenre?.slug || '');
    setSortOrder(editingGenre?.sort_order || 0);
    setIsActive(editingGenre?.is_active ?? true);
  }, [editingGenre]);

  const handleNameChange = (value) => {
    setName(value);
    if (!editingGenre) setSlug(slugify(value));
  };

  return (
    <div className="form-card">
      <div className="field">
        <label>Genre Name</label>
        <input value={name} onChange={(event) => handleNameChange(event.target.value)} placeholder="Romance" />
      </div>

      <div className="field">
        <label>Slug</label>
        <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="romance" />
      </div>

      <div className="field">
        <label>Sort Order</label>
        <input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
      </div>

      <div className="toggle-row">
        <span>Active</span>
        <button type="button" onClick={() => setIsActive((value) => !value)} className={`toggle ${isActive ? 'active' : ''}`}>
          <span />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: editingGenre ? '1fr 1fr' : '1fr', gap: 10 }}>
        {editingGenre ? (
          <button type="button" onClick={onCancel} className="btn white" disabled={saving}>
            Cancel
          </button>
        ) : null}

        <button
          type="button"
          className="btn primary"
          disabled={saving}
          onClick={() => onSubmit({ name, slug, sort_order: Number(sortOrder || 0), is_active: isActive })}
        >
          {saving ? 'Saving...' : editingGenre ? 'Save Changes' : 'Add Genre'}
        </button>
      </div>
    </div>
  );
}

export default function GenreManagementPage() {
  const [genres, setGenres] = useState([]);
  const [featuredTabs, setFeaturedTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [search, setSearch] = useState('');
  const [editingGenre, setEditingGenre] = useState(null);

  const token = getAdminToken();

  const selectedGenreIds = useMemo(() => {
    return featuredTabs
      .filter((tab) => !tab.is_locked && tab.genre_id)
      .map((tab) => tab.genre_id);
  }, [featuredTabs]);

  const selectedCount = featuredTabs.length;

  const filteredGenres = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return genres;
    return genres.filter((genre) => {
      return (
        genre.name.toLowerCase().includes(q) ||
        genre.slug.toLowerCase().includes(q)
      );
    });
  }, [genres, search]);

  const activeGenres = useMemo(() => genres.filter((genre) => genre.is_active), [genres]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [recordsData, tabsData] = await Promise.all([
        request('/api/genres/admin/records'),
        request('/api/genres/featured-tabs?include_inactive=true'),
      ]);

      setGenres(recordsData.genres || []);
      setFeaturedTabs(tabsData.tabs || []);
    } catch (error) {
      showMessage(error.message || 'Failed to load genre system', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFeaturedTabs = async (nextGenreIds) => {
    try {
      setSaving(true);

      const data = await request('/api/genres/admin/featured-tabs', {
        method: 'PUT',
        body: JSON.stringify({ genre_ids: nextGenreIds }),
      });

      setFeaturedTabs(data.tabs || []);
      showMessage('For You genre tabs updated.');
    } catch (error) {
      showMessage(error.message || 'Failed to update For You tabs', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = (genre) => {
    if (!genre.is_active) return;

    const alreadySelected = selectedGenreIds.includes(genre.id);

    if (alreadySelected) {
      saveFeaturedTabs(selectedGenreIds.filter((id) => id !== genre.id));
      return;
    }

    if (selectedCount >= MAX_TABS) {
      showMessage('You can show up to 12 tabs including Today.', 'error');
      return;
    }

    saveFeaturedTabs([...selectedGenreIds, genre.id]);
  };

  const handleMoveFeatured = (genreId, direction) => {
    const index = selectedGenreIds.indexOf(genreId);
    if (index === -1) return;

    const next = [...selectedGenreIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    saveFeaturedTabs(next);
  };

  const handleSaveGenre = async (payload) => {
    if (!payload.name?.trim()) {
      showMessage('Genre name is required.', 'error');
      return;
    }

    try {
      setSaving(true);

      if (editingGenre) {
        await request(`/api/genres/admin/records/${editingGenre.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showMessage('Genre updated.');
      } else {
        await request('/api/genres/admin/records', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showMessage('Genre created.');
      }

      setEditingGenre(null);
      await loadData();
    } catch (error) {
      showMessage(error.message || 'Failed to save genre', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (genre) => {
    await handleSaveDirect(genre, { is_active: !genre.is_active });
  };

  const handleSaveDirect = async (genre, changes) => {
    try {
      setSaving(true);

      await request(`/api/genres/admin/records/${genre.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: genre.name,
          slug: genre.slug,
          sort_order: genre.sort_order,
          is_active: genre.is_active,
          ...changes,
        }),
      });

      showMessage('Genre updated.');
      await loadData();
    } catch (error) {
      showMessage(error.message || 'Failed to update genre', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGenre = async (genre) => {
    const ok = window.confirm(`Delete "${genre.name}"? If stories use this genre, backend will block deletion.`);
    if (!ok) return;

    try {
      setSaving(true);

      await request(`/api/genres/admin/records/${genre.id}`, {
        method: 'DELETE',
      });

      showMessage('Genre deleted.');
      await loadData();
    } catch (error) {
      showMessage(error.message || 'Failed to delete genre', 'error');
    } finally {
      setSaving(false);
    }
  };

  const todayTab = featuredTabs.find((tab) => tab.is_locked) || { label: 'Today', slug: 'today', is_locked: true };
  const editableTabs = featuredTabs.filter((tab) => !tab.is_locked);

  return (
    <div className="genre-dashboard-wrapper">
      <style>{styles}</style>

      <Sidebar activePath="/genres" />

      <main className="main-content">
        <header className="header">
          <h2>Genre Management</h2>
          <div className="header-pill">
            <i className="fa-solid fa-layer-group" />
            For You Tabs {selectedCount}/{MAX_TABS}
          </div>
        </header>

        <div className="content-body">
          <div className="page-title-row">
            <div>
              <h1>Genre System</h1>
              <p>
                Manage all story genres and choose up to 12 tabs for the For You page. Today is locked and always first.
              </p>
            </div>

            <button type="button" className="btn white" onClick={loadData} disabled={loading || saving}>
              <i className="fa-solid fa-rotate" />
              Refresh
            </button>
          </div>

          <Message type={messageType} onClose={() => setMessage('')}>
            {message}
          </Message>

          <div className="grid-shell">
            <div>
              <section className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h3>For You Genre Tabs</h3>
                    <p>Today is locked. Choose and reorder the other 11 visible tabs.</p>
                  </div>

                  <span className="badge active">{selectedCount}/{MAX_TABS}</span>
                </div>

                <div className="panel-body">
                  <div className="featured-list">
                    <div className="featured-chip locked">
                      <span className="order">1</span>
                      <i className="fa-solid fa-lock" />
                      {todayTab.label || 'Today'}
                      <button type="button" disabled>×</button>
                    </div>

                    {editableTabs.map((tab, index) => (
                      <div className="featured-chip" key={tab.id || tab.slug}>
                        <span className="order">{index + 2}</span>
                        {tab.label}
                        <button
                          type="button"
                          title="Move left"
                          onClick={() => handleMoveFeatured(tab.genre_id, -1)}
                          disabled={saving || index === 0}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          title="Move right"
                          onClick={() => handleMoveFeatured(tab.genre_id, 1)}
                          disabled={saving || index === editableTabs.length - 1}
                        >
                          ›
                        </button>
                        <button
                          type="button"
                          title="Remove"
                          onClick={() => saveFeaturedTabs(selectedGenreIds.filter((id) => id !== tab.genre_id))}
                          disabled={saving}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="genre-picker">
                    <div className="search-input">
                      <i className="fa-solid fa-magnifying-glass" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search genre to select for For You tabs..."
                      />
                    </div>

                    <div className="genre-options">
                      {activeGenres.map((genre) => {
                        const selected = selectedGenreIds.includes(genre.id);
                        const limitReached = selectedCount >= MAX_TABS && !selected;

                        return (
                          <button
                            key={genre.id}
                            type="button"
                            className={`genre-option ${selected ? 'selected' : ''}`}
                            disabled={saving || limitReached}
                            onClick={() => handleToggleFeatured(genre)}
                          >
                            <span>{genre.name}</span>
                            <i className={`fa-solid ${selected ? 'fa-check' : 'fa-plus'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <section className="panel" style={{ marginTop: 22 }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <h3>All Genre Records</h3>
                    <p>Add, edit, disable, or delete genres. Delete is blocked if stories already use that genre.</p>
                  </div>

                  <div className="records-tools">
                    <div className="search-input">
                      <i className="fa-solid fa-magnifying-glass" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search records..."
                      />
                    </div>
                  </div>
                </div>

                <div className="records-scroll">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Genre</th>
                        <th>Status</th>
                        <th>Sort</th>
                        <th>Stories</th>
                        <th>For You</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6"><div className="empty">Loading genres...</div></td>
                        </tr>
                      ) : null}

                      {!loading && filteredGenres.length === 0 ? (
                        <tr>
                          <td colSpan="6"><div className="empty">No genre records found.</div></td>
                        </tr>
                      ) : null}

                      {!loading && filteredGenres.map((genre) => {
                        const selected = selectedGenreIds.includes(genre.id);

                        return (
                          <tr key={genre.id}>
                            <td>
                              <div className="genre-name">{genre.name}</div>
                              <div className="genre-slug">{genre.slug}</div>
                            </td>

                            <td>
                              <span className={`badge ${genre.is_active ? 'active' : 'inactive'}`}>
                                {genre.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>

                            <td style={{ color: 'var(--muted)', fontWeight: 800 }}>{genre.sort_order}</td>
                            <td style={{ color: 'var(--muted)', fontWeight: 800 }}>{genre.story_count || 0}</td>
                            <td>
                              <span className={`badge ${selected ? 'active' : 'inactive'}`}>
                                {selected ? 'Shown' : 'Hidden'}
                              </span>
                            </td>

                            <td>
                              <div className="row-actions">
                                <button type="button" className="icon-btn" onClick={() => setEditingGenre(genre)} title="Edit">
                                  <i className="fa-solid fa-pen" />
                                </button>

                                <button type="button" className="icon-btn" onClick={() => handleToggleActive(genre)} title={genre.is_active ? 'Disable' : 'Enable'} disabled={saving}>
                                  <i className={`fa-solid ${genre.is_active ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </button>

                                <button type="button" className="icon-btn danger" onClick={() => handleDeleteGenre(genre)} title="Delete" disabled={saving}>
                                  <i className="fa-regular fa-trash-can" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <h3>{editingGenre ? 'Edit Genre' : 'Add Genre'}</h3>
                  <p>{editingGenre ? 'Update genre details.' : 'Create a new genre record.'}</p>
                </div>
              </div>

              <div className="panel-body">
                <GenreForm
                  editingGenre={editingGenre}
                  onCancel={() => setEditingGenre(null)}
                  onSubmit={handleSaveGenre}
                  saving={saving}
                />

                <div style={{
                  marginTop: 18,
                  borderRadius: 16,
                  background: '#F8FAFC',
                  padding: 14,
                  color: 'var(--muted)',
                  fontSize: 12,
                  lineHeight: 1.7,
                  fontWeight: 700,
                }}>
                  <b style={{ color: 'var(--text)' }}>Rule:</b> Today is not a genre record. It is a locked For You tab that shows mixed/latest content. Other tabs come from active genre records.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
