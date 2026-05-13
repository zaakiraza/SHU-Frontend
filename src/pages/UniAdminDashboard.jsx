import { useAuth } from '../context/AuthContext';
import { Plus, Building, Megaphone, Globe, Lock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

const UniAdminDashboard = () => {
  const { user } = useAuth();

  // University Registration State
  const [uniName, setUniName] = useState('');
  const [uniDesc, setUniDesc] = useState('');
  const [uniLocation, setUniLocation] = useState('');
  const [uniWebsite, setUniWebsite] = useState('');
  const [uniDomain, setUniDomain] = useState('');
  const [uniLogo, setUniLogo] = useState('');
  const [uniLoading, setUniLoading] = useState(false);
  const [uniError, setUniError] = useState('');
  const [uniSuccess, setUniSuccess] = useState('');

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState('event');
  const [annSociety, setAnnSociety] = useState('');
  const [annVisibility, setAnnVisibility] = useState('all');
  const [annLoading, setAnnLoading] = useState(false);
  const [annError, setAnnError] = useState('');
  const [annSuccess, setAnnSuccess] = useState('');

  // Create Society State
  const [socName, setSocName] = useState('');
  const [socDesc, setSocDesc] = useState('');
  const [socUniversity, setSocUniversity] = useState(user?.university || '');
  const [socLogo, setSocLogo] = useState('');
  const [socAdminId, setSocAdminId] = useState('');
  const [socLoading, setSocLoading] = useState(false);
  const [socError, setSocError] = useState('');
  const [socSuccess, setSocSuccess] = useState('');

  // Societies State
  const [societies, setSocieties] = useState([]);
  const [societiesLoading, setSocietiesLoading] = useState(true);
  const [societiesError, setSocietiesError] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');

  // Pending Societies State
  const [pendingSocieties, setPendingSocieties] = useState([]);
  const [pendingSocietiesLoading, setPendingSocietiesLoading] = useState(true);
  const [pendingSocietiesError, setPendingSocietiesError] = useState('');

  // Category Creation State
  const [catName, setCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  useEffect(() => {
    fetchSocieties();
    fetchPendingSocieties();
  }, []);

  const fetchSocieties = async (uniId = '') => {
    setSocietiesLoading(true);
    setSocietiesError('');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      let url = `${baseUrl}/api/societies?page=1&limit=10`;
      if (uniId) url += `&university=${encodeURIComponent(uniId)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch societies.');
      const data = await response.json();
      const payload = data.data || {};
      setSocieties(Array.isArray(payload) ? payload : payload.societies || []);
    } catch (err) {
      setSocietiesError(err.message);
    } finally {
      setSocietiesLoading(false);
    }
  };

  const fetchPendingSocieties = async () => {
    setPendingSocietiesLoading(true);
    setPendingSocietiesError('');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/societies/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch pending societies.');
      const data = await response.json();
      setPendingSocieties(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setPendingSocietiesError(err.message);
    } finally {
      setPendingSocietiesLoading(false);
    }
  };

  const handleCreateSociety = async (e) => {
    e.preventDefault();
    setSocLoading(true);
    setSocError('');
    setSocSuccess('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/societies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          name: socName,
          description: socDesc,
          university: socUniversity,
          logo: socLogo || '',
          societyAdminId: socAdminId
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to create society.');

      setSocSuccess(`Society "${socName}" created successfully!`);
      setSocName('');
      setSocDesc('');
      setSocUniversity('');
      setSocLogo('');
      setSocAdminId('');
      fetchSocieties(); // Refresh the societies list
    } catch (err) {
      setSocError(err.message);
    } finally {
      setSocLoading(false);
    }
  };

  const handleApproveSociety = async (societyId) => {
    try {
      setPendingSocietiesError('');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/societies/${societyId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to approve society.');
      }

      // Remove from pending list and refresh approved list
      setPendingSocieties(prev => prev.filter(s => (s._id || s.id) !== societyId));
      fetchSocieties();
    } catch (err) {
      setPendingSocietiesError(err.message);
    }
  };

  const handleRejectSociety = async (societyId) => {
    const reason = window.prompt("Please enter a reason for rejection:");
    if (reason === null) return; // User cancelled

    try {
      setPendingSocietiesError('');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/societies/${societyId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ reason: reason || "Verification not complete" })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to reject society.');
      }

      // Remove from pending list visually
      setPendingSocieties(prev => prev.filter(s => (s._id || s.id) !== societyId));
    } catch (err) {
      setPendingSocietiesError(err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setCatLoading(true);
    setCatError('');
    setCatSuccess('');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ name: catName })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to create category.');
      setCatSuccess(`Category "${catName}" submitted for approval!`);
      setCatName('');
    } catch (err) {
      setCatError(err.message);
    } finally {
      setCatLoading(false);
    }
  };

  const handleAssignAdmin = async (societyId) => {
    const userId = window.prompt("Please enter the User ID for the Society Admin:");
    if (!userId) return; // User cancelled or left empty

    try {
      setSocietiesError('');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/societies/${societyId}/assign-admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to assign admin.');
      }

      alert('Admin assigned successfully!');
      fetchSocieties(); // Refresh the list
    } catch (err) {
      setSocietiesError(err.message);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setAnnLoading(true);
    setAnnError('');
    setAnnSuccess('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          type: annType,
          society: annSociety || null,
          visibility: annVisibility,
          targetSociety: null
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to create announcement.');

      setAnnSuccess(`Announcement "${annTitle}" posted successfully!`);
      setAnnTitle('');
      setAnnContent('');
      setAnnType('event');
      setAnnSociety('');
      setAnnVisibility('all');
    } catch (err) {
      setAnnError(err.message);
    } finally {
      setAnnLoading(false);
    }
  };

  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    setUniLoading(true);
    setUniError('');
    setUniSuccess('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/universities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          name: uniName,
          description: uniDesc,
          location: uniLocation,
          website: uniWebsite,
          emailDomain: uniDomain,
          logo: uniLogo
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register university.');
      }

      setUniSuccess('University registered successfully. Awaiting superadmin approval.');
      setUniName('');
      setUniDesc('');
      setUniLocation('');
      setUniWebsite('');
      setUniDomain('');
      setUniLogo('');
    } catch (err) {
      setUniError(err.message);
    } finally {
      setUniLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>University <span className="gradient-text">Admin</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage {user.university} societies, members, and announcements.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* Register University Form */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} className="gradient-text" /> Register Your University
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>Submit your institution's details to the Super Admin for domain verification and platform access.</p>

          {uniError && (
            <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
              {uniError}
            </div>
          )}

          {uniSuccess && (
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>
              {uniSuccess}
            </div>
          )}

          <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }} onSubmit={handleCreateUniversity}>
            <input type="text" placeholder="University Name" required value={uniName} onChange={e => setUniName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="text" placeholder="Email Domain (e.g. stanford.edu)" required value={uniDomain} onChange={e => setUniDomain(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="text" placeholder="City, Country" required value={uniLocation} onChange={e => setUniLocation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="url" placeholder="Website URL (e.g. https://...)" required value={uniWebsite} onChange={e => setUniWebsite(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="url" placeholder="Logo Image URL (Optional)" value={uniLogo} onChange={e => setUniLogo(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <textarea placeholder="Short Description..." required value={uniDesc} onChange={e => setUniDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', gridColumn: '1 / -1', resize: 'vertical' }} />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={uniLoading} style={{ opacity: uniLoading ? 0.7 : 1 }}>
                {uniLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>

        {/* Create Society */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Create Society</h3>
          
          {socError && (
            <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>{socError}</div>
          )}
          {socSuccess && (
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>{socSuccess}</div>
          )}

          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleCreateSociety}>
            <input type="text" placeholder="Society Name *" required value={socName} onChange={e => setSocName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <textarea placeholder="Description *" required value={socDesc} onChange={e => setSocDesc(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} />
            <input type="text" placeholder="University ID *" required value={socUniversity} onChange={e => setSocUniversity(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="text" placeholder="Society Admin User ID *" required value={socAdminId} onChange={e => setSocAdminId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <input type="url" placeholder="Logo URL (Optional)" value={socLogo} onChange={e => setSocLogo(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <button type="submit" className="btn btn-primary" disabled={socLoading} style={{ opacity: socLoading ? 0.7 : 1 }}>
              {socLoading ? 'Creating...' : <><Plus size={18} /> Create Society</>}
            </button>
          </form>
        </div>

        {/* Post Announcement */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={20} /> Post Announcement
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>Create university-wide events, internships, or notices.</p>

          {annError && (
            <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>{annError}</div>
          )}
          {annSuccess && (
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>{annSuccess}</div>
          )}

          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handlePostAnnouncement}>
            <input type="text" placeholder="Title *" required value={annTitle} onChange={e => setAnnTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            <textarea placeholder="Content / Description *" rows={3} required value={annContent} onChange={e => setAnnContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} />
            <select value={annType} onChange={e => setAnnType(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="event">Event</option>
              <option value="internship">Internship</option>
              <option value="general">General Notice</option>
              <option value="industrial_visit">Industrial Visit</option>
            </select>
            <select value={annVisibility} onChange={e => setAnnVisibility(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="all">🌐 Visible: All Universities</option>
              <option value="university">🏫 Visible: My University Only</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {annVisibility === 'all' ? <Globe size={16} color="var(--accent-purple)" /> : <Lock size={16} color="var(--accent-pink)" />}
              {annVisibility === 'all' ? 'Visible to all universities on the platform.' : 'Visible only to your university.'}
            </div>
            <button type="submit" className="btn btn-primary" disabled={annLoading} style={{ opacity: annLoading ? 0.7 : 1 }}>
              {annLoading ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>
        </div>

        {/* Create Category */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Request New Category</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>Add a new category for reviews (e.g., "Internships", "Facilities").</p>
          
          {catError && (
            <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>{catError}</div>
          )}
          {catSuccess && (
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>{catSuccess}</div>
          )}

          <form style={{ display: 'flex', gap: '12px' }} onSubmit={handleCreateCategory}>
            <input 
              type="text" 
              placeholder="Category Name (e.g. Canteen)" 
              required 
              value={catName} 
              onChange={e => setCatName(e.target.value)} 
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
            <button type="submit" className="btn btn-primary" disabled={catLoading} style={{ whiteSpace: 'nowrap', opacity: catLoading ? 0.7 : 1 }}>
              {catLoading ? 'Submitting...' : 'Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Pending Societies */}
      <div className="glass-card" style={{ marginTop: '32px', borderLeft: '4px solid var(--accent-pink)' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} /> Pending Society Approvals
        </h3>

        {pendingSocietiesError && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {pendingSocietiesError}
          </div>
        )}

        {pendingSocietiesLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading pending societies...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Society Name</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Requested By</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>University</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSocieties.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No pending society approvals.</td>
                  </tr>
                ) : (
                  pendingSocieties.map(society => (
                    <tr key={society._id || society.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 0', fontWeight: '500' }}>{society.name || 'N/A'}</td>
                      <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {society.createdBy?.name || society.requestedBy || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {society.university?.name || society.universityId || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 0' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn"
                            style={{ background: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleApproveSociety(society._id || society.id)}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn"
                            style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleRejectSociety(society._id || society.id)}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Societies List */}
      <div className="glass-card" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> Societies
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Filter by University ID..."
              value={universityFilter}
              onChange={e => setUniversityFilter(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '14px' }}
              onClick={() => fetchSocieties(universityFilter)}
            >
              Filter
            </button>
          </div>
        </div>

        {societiesError && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {societiesError}
          </div>
        )}

        {societiesLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading societies...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Society Name</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Chairperson</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Members</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>University</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {societies.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No societies found.</td>
                  </tr>
                ) : (
                  societies.map(society => (
                    <tr key={society._id || society.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 0', fontWeight: '500' }}>{society.name || 'N/A'}</td>
                      <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {society.chairperson?.name || society.chairperson || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>
                        {society.memberCount ?? society.members?.length ?? 0}
                      </td>
                      <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {society.university?.name || society.universityId || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 0' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                          background: society.status === 'active' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)',
                          color: society.status === 'active' ? '#48BB78' : '#F56565'
                        }}>
                          {society.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 0' }}>
                        <button
                          className="btn"
                          style={{ background: 'rgba(159, 122, 234, 0.2)', color: 'var(--accent-purple)', padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleAssignAdmin(society._id || society.id)}
                        >
                          Assign Admin
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniAdminDashboard;
