import { useAuth } from '../context/AuthContext';

const RoleSwitcher = () => {
  const { user, setRole } = useAuth();

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 9999 }}>
      <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Dev: Role Switcher</h4>
      <select 
        value={`${user.role}|${user.university || ''}`} 
        onChange={(e) => {
          const [role, uni] = e.target.value.split('|');
          setRole(role, uni || null);
        }}
        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none' }}
      >
        <option value="guest|">Guest (Logged Out)</option>
        <option value="student|Stanford University">Student (Stanford)</option>
        <option value="student|MIT">Student (MIT)</option>
        <option value="society_admin|Stanford University">Society Admin (Stanford)</option>
        <option value="uni_admin|Stanford University">Uni Admin (Stanford)</option>
        <option value="superadmin|">Superadmin</option>
      </select>
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--accent-pink)' }}>
        Current Role: {user.role}
      </div>
    </div>
  );
};

export default RoleSwitcher;
