import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfile(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Daraz Clone
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-sm font-medium text-gray-700">
            Cart
          </Link>
          {profile ? (
            <>
              <span className="text-sm text-gray-600">{profile.name}</span>
              <Link to="/dashboard" className="text-sm text-gray-700">
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-white bg-orange-500 px-3 py-2 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
