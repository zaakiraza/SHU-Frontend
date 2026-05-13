import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../config';

const SuperadminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [universities, setUniversities] = useState([]);
  const [uniLoading, setUniLoading] = useState(true);
  const [uniError, setUniError] = useState('');

  const [pendingUniversities, setPendingUniversities] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState('');

  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [societyFilter, setSocietyFilter] = useState('');

  const [pendingCategories, setPendingCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchUniversities();
    fetchPendingUniversities();
    fetchPendingAdmins();
    fetchPendingCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users.');
      }

      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/universities?page=1&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch universities.');
      }

      const data = await response.json();
      const payload = data.data || {};
      setUniversities(Array.isArray(payload) ? payload : payload.universities || []);
    } catch (err) {
      setUniError(err.message);
    } finally {
      setUniLoading(false);
    }
  };

  const fetchPendingUniversities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/universities/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending universities.');
      }

      const data = await response.json();
      const pu = data.data || {};
      setPendingUniversities(Array.isArray(pu) ? pu : pu.universities || []);
    } catch (err) {
      setPendingError(err.message);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchPendingAdmins = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // admin/pending returns { data: { universities, societies, categories } }
        const payload = data.data || {};
        setPendingAdmins(Array.isArray(payload.societies) ? payload.societies : []);
      }
    } catch (err) {
      console.error('Failed to fetch pending societies', err);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchAnnouncements = async (societyId = '') => {
    setAnnouncementsLoading(true);
    try {
      let url = `${BASE_URL}/api/announcements?page=1&limit=10`;
      if (societyId) url += `&society=${encodeURIComponent(societyId)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const p = data.data || {};
        setAnnouncements(Array.isArray(p) ? p : p.announcements || []);
      }
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  };


  const handleApproveUniversity = async (universityId) => {
  try {
    setPendingError('');
      const response = await fetch(`${BASE_URL}/api/universities/${universityId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to approve university.');
    }

    // Remove from pending list visually
    setPendingUniversities(prev => prev.filter(u => (u._id || u.id) !== universityId));
  } catch (err) {
    setPendingError(err.message);
  }
};

const handleRejectUniversity = async (universityId) => {
  const reason = window.prompt("Please enter a reason for rejection:");
  if (reason === null) return; // User cancelled

  try {
    setPendingError('');
      const response = await fetch(`${BASE_URL}/api/universities/${universityId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ reason: reason || "No reason provided" })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to reject university.');
    }

    // Remove from pending list visually
    setPendingUniversities(prev => prev.filter(u => (u._id || u.id) !== universityId));
  } catch (err) {
    setPendingError(err.message);
  }
};

const fetchPendingCategories = async () => {
  try {
      const response = await fetch(`${BASE_URL}/api/categories/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch pending categories.');
    const data = await response.json();
    setPendingCategories(Array.isArray(data) ? data : data.categories || data.data || []);
  } catch (err) {
    setCatError(err.message);
  } finally {
    setCatLoading(false);
  }
};

const handleApproveCategory = async (catId) => {
  if (!window.confirm('Approve this category?')) return;
  try {
      const response = await fetch(`${BASE_URL}/api/categories/${catId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to approve category.');
    setPendingCategories(prev => prev.filter(c => (c._id || c.id) !== catId));
  } catch (err) {
    alert(err.message);
  }
};

const handleRejectCategory = async (catId) => {
  if (!window.confirm('Reject this category?')) return;
  try {
      const response = await fetch(`${BASE_URL}/api/categories/${catId}/reject`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to reject category.');
    setPendingCategories(prev => prev.filter(c => (c._id || c.id) !== catId));
  } catch (err) {
    alert(err.message);
  }
};

const handleDeleteAnnouncement = async (announcementId) => {
  if (!window.confirm('Are you sure you want to delete this announcement?')) return;
  try {
      const response = await fetch(`${BASE_URL}/api/announcements/${announcementId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete announcement.');
    }

    setAnnouncements(prev => prev.filter(a => (a._id || a.id) !== announcementId));
  } catch (err) {
    alert(err.message);
  }
};

return (
  <div className="container" style={{ padding: '40px 0' }}>
    <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Superadmin <span className="gradient-text">Portal</span></h1>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage platform users and university administrators.</p>

    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '24px' }}>Pending Approvals</h3>

      {pendingError && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
          {pendingError}
        </div>
      )}

      {pendingLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading pending requests...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>University Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Domain</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUniversities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No pending approvals.</td>
                </tr>
              ) : (
                pendingUniversities.map(uni => (
                  <tr key={uni._id || uni.id || uni.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{uni.name || 'N/A'}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{uni.domain || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn"
                          style={{ background: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleApproveUniversity(uni._id || uni.id)}
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          className="btn"
                          style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleRejectUniversity(uni._id || uni.id)}
                        >
                          <XCircle size={16} /> Reject
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

    <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--accent-blue)' }}>
      <h3 style={{ marginBottom: '24px' }}>Pending Societies</h3>

      {adminLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading pending societies...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Society Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>University</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdmins.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No pending societies.</td>
                </tr>
              ) : (
                pendingAdmins.map(soc => (
                  <tr key={soc._id || soc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{soc.name || 'N/A'}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{soc.university?.name || soc.university || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn"
                          style={{ background: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '6px 12px', fontSize: '12px' }}
                          onClick={async () => {
                            try {
                              const r = await fetch(`${BASE_URL}/api/societies/${soc._id || soc.id}/approve`, {
                                method: 'PATCH',
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
                              });
                              if (r.ok) setPendingAdmins(prev => prev.filter(s => (s._id || s.id) !== (soc._id || soc.id)));
                              else { const e = await r.json(); alert(e.message || 'Failed'); }
                            } catch { alert('Request failed'); }
                          }}
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          className="btn"
                          style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}
                          onClick={async () => {
                            const reason = window.prompt('Reason for rejection:');
                            if (reason === null) return;
                            try {
                              const r = await fetch(`${BASE_URL}/api/societies/${soc._id || soc.id}/reject`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
                                body: JSON.stringify({ reason: reason || 'No reason provided' })
                              });
                              if (r.ok) setPendingAdmins(prev => prev.filter(s => (s._id || s.id) !== (soc._id || soc.id)));
                              else { const e = await r.json(); alert(e.message || 'Failed'); }
                            } catch { alert('Request failed'); }
                          }}
                        >
                          <XCircle size={16} /> Reject
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

    <div className="glass-card">
      <h3 style={{ marginBottom: '24px' }}>All Users</h3>

      {error && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Email</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id || user.id || user.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{user.name || 'N/A'}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user.role === 'uniAdmin' && user.status === 'pending' ? (
                          <button className="btn" style={{ background: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '6px 12px', fontSize: '12px' }}>
                            <CheckCircle size={16} /> Approve
                          </button>
                        ) : (
                          <button className="btn" style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        )}
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

    <div className="glass-card" style={{ marginTop: '24px' }}>
      <h3 style={{ marginBottom: '24px' }}>Registered Universities</h3>

      {uniError && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
          {uniError}
        </div>
      )}

      {uniLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading universities...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>University Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Domain</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No universities found.</td>
                </tr>
              ) : (
                universities.map(uni => (
                  <tr key={uni._id || uni.id || uni.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{uni.name || 'N/A'}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{uni.domain || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn" style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}>
                          <Trash2 size={16} /> Delete
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

    {/* All Announcements Section */}
    <div className="glass-card" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3>All Announcements</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter by Society ID..."
            value={societyFilter}
            onChange={(e) => setSocietyFilter(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
          />
          <button
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '14px' }}
            onClick={() => {
              setAnnouncementsLoading(true);
              let url = `${BASE_URL}/api/announcements?page=1&limit=10`;
              if (societyFilter) url += `&society=${encodeURIComponent(societyFilter)}`;
              fetch(url, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
              })
                .then(r => r.json())
                .then(data => setAnnouncements(Array.isArray(data) ? data : data.announcements || data.data || []))
                .catch(console.error)
                .finally(() => setAnnouncementsLoading(false));
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>

      {announcementsLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading announcements...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Society</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Visibility</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No announcements found.</td>
                </tr>
              ) : (
                announcements.map(ann => (
                  <tr key={ann._id || ann.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{ann.title || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(159, 122, 234, 0.2)', color: 'var(--accent-purple)' }}>
                        {ann.type || ann.category || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{ann.society || ann.societyId || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: ann.scope === 'global' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(66, 153, 225, 0.2)', color: ann.scope === 'global' ? '#48BB78' : '#4299E1' }}>
                        {ann.scope === 'global' ? 'Global' : 'Internal'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 0' }}>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann._id || ann.id)}
                        className="btn"
                        style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}
                        title="Delete Announcement"
                      >
                        <Trash2 size={14} /> Delete
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

    <div className="glass-card" style={{ marginTop: '24px', borderLeft: '4px solid var(--accent-purple)' }}>
      <h3 style={{ marginBottom: '24px' }}>Pending Categories</h3>

      {catError && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
          {catError}
        </div>
      )}

      {catLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading categories...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Category Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCategories.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No pending categories.</td>
                </tr>
              ) : (
                pendingCategories.map(cat => (
                  <tr key={cat._id || cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{cat.name || 'N/A'}</td>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApproveCategory(cat._id || cat.id)}
                          className="btn"
                          style={{ background: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '6px 12px', fontSize: '12px' }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectCategory(cat._id || cat.id)}
                          className="btn"
                          style={{ background: 'rgba(245, 101, 101, 0.2)', color: '#F56565', padding: '6px 12px', fontSize: '12px' }}
                        >
                          <XCircle size={14} /> Reject
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
  </div>
);
};

export default SuperadminDashboard;
