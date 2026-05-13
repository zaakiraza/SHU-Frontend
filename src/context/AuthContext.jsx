import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: 'guest',
    university: null,
    email: null,
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setAuthLoading(false);
  }, []);

  const login = (userData) => {
    const updatedUser = {
      role: userData.role || 'student',
      university: userData.university || null,
      email: userData.email || null,
      id: userData.id || userData._id || null
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser({ role: 'guest', university: null, email: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setRole = (role, university = null) => {
    const updatedUser = {
      role,
      university,
      email: role !== 'guest' ? `user@${university ? university.toLowerCase().replace(' ', '') : 'admin'}.edu` : null,
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setRole, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
