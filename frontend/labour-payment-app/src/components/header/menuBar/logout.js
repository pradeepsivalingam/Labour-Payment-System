import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session/token
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    // Optional: Call backend logout API if needed
    // await fetch('/api/logout', ...);
    // Instantly redirect to login
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: 16,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
