import React, { useState, useRef } from 'react';
import { API_URL, TELEGRAM_BOT } from '../../config';

interface TelegramStepProps {
  onNext: () => void;
  onSkip: () => void;
}

function TelegramStep({ onNext, onSkip }: TelegramStepProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [botOpened, setBotOpened] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLinkTelegram = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id || 'temp';
      await fetch(`${API_URL}/api/telegram/request-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      window.open(`https://t.me/${TELEGRAM_BOT}?start=${userId}`, '_blank');
      setBotOpened(true);
    } catch {
      window.open(`https://t.me/${TELEGRAM_BOT}`, '_blank');
      setBotOpened(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Enter all 6 digits');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id || 'temp';
      const res = await fetch(`${API_URL}/api/telegram/confirm-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (res.ok) {
        onNext();
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch {
      setError('Server unavailable');
    } finally {
      setVerifying(false);
    }
  };

  const handleSkip = () => {
    if (!showWarning) {
      setShowWarning(true);
    } else {
      onSkip();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Link Telegram</h1>
        <p className="text-gray-400">
          {botOpened ? 'Enter the code sent to you in Telegram' : 'Add extra security to your account'}
        </p>
      </div>

      {showWarning && !botOpened && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ Without Telegram your account will be less secure and you won't receive notifications.
          </p>
        </div>
      )}

      {!botOpened ? (
        <div className="space-y-3">
          <button
            onClick={handleLinkTelegram}
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Opening...' : 'Link Telegram'}
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            {showWarning ? 'Continue Without Telegram' : 'Link Later'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold bg-dark-100 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-primary"
              />
            ))}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={verifying || digits.join('').length !== 6}
            className="w-full py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Confirm'}
          </button>

          <button
            onClick={() => { setBotOpened(false); setDigits(['','','','','','']); setError(''); }}
            className="w-full py-2 text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default TelegramStep;
