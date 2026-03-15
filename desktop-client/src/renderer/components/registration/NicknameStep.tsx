import React, { useState } from 'react';

interface NicknameStepProps {
  onNext: (nickname: string) => void;
}

function NicknameStep({ onNext }: NicknameStepProps) {
  const [nickname, setNickname] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const checkNickname = async () => {
    if (!nickname || nickname.length < 3) {
      setError('Nickname must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
      setError('Only letters, numbers and underscores allowed');
      return;
    }
    onNext(nickname);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to SquadVoice</h1>
        <p className="text-gray-400">Choose your nickname</p>
      </div>

      <div>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter nickname"
          className="w-full px-4 py-3 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
          maxLength={32}
        />
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
      </div>

      <button
        onClick={checkNickname}
        disabled={checking}
        className="w-full py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
      >
        {checking ? 'Checking...' : 'Next'}
      </button>
    </div>
  );
}

export default NicknameStep;
