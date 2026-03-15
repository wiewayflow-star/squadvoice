import React, { useState } from 'react';

interface PasswordStepProps {
  onNext: (password: string) => void;
  onBack: () => void;
}

function PasswordStep({ onNext, onBack }: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onNext(password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Create Password</h1>
        <p className="text-gray-400">Secure your account</p>
      </div>

      <div className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-3 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
        />
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-dark-100 hover:bg-dark-200 rounded-lg font-semibold"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PasswordStep;
