import React, { useState } from 'react';
import { generateKeyPair } from '../../../crypto/keys';

interface ProfileStepProps {
  formData: any;
  onComplete: (user: any, token: string) => void;
  onBack: () => void;
}

function ProfileStep({ formData, onComplete, onBack }: ProfileStepProps) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAvatar = (name: string) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { initial: name[0]?.toUpperCase() || '?', gradient: color };
  };

  const handleSubmit = async () => {
    if (!displayName) {
      setError('Display name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const keyPair = await generateKeyPair();
      const publicKeyBase64 = btoa(String.fromCharCode(...keyPair.publicKey));

      // Store keys locally
      localStorage.setItem('private_key', btoa(String.fromCharCode(...keyPair.privateKey)));
      localStorage.setItem('public_key', publicKeyBase64);

      const user = {
        id: crypto.randomUUID(),
        nickname: formData.nickname,
        displayName,
        publicKey: publicKeyBase64,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(user));
      onComplete(user, 'local-token');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const avatar = generateAvatar(displayName);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Complete Profile</h1>
        <p className="text-gray-400">How should we call you?</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
          style={{ background: avatar.gradient }}
        >
          {avatar.initial}
        </div>

        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          className="w-full px-4 py-3 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
          maxLength={64}
        />
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 bg-dark-100 hover:bg-dark-200 rounded-lg font-semibold disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Complete'}
        </button>
      </div>
    </div>
  );
}

export default ProfileStep;
