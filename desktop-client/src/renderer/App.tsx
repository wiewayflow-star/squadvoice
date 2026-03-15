import React, { useState } from 'react';
import Registration from './components/Registration';
import MainApp from './components/MainApp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleRegistrationComplete = (userData: any, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', token);
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {!isAuthenticated ? (
        <Registration onComplete={handleRegistrationComplete} />
      ) : (
        <MainApp user={user} />
      )}
    </div>
  );
}

export default App;
