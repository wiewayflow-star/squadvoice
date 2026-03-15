import React, { useState } from 'react';

interface TelegramStepProps {
  onNext: () => void;
  onSkip: () => void;
}

function TelegramStep({ onNext, onSkip }: TelegramStepProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleLinkTelegram = () => {
    // TODO: Open Telegram bot with verification code
    alert('Telegram linking will be implemented');
    onNext();
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
        <p className="text-gray-400">Add extra security to your account</p>
      </div>

      {showWarning && (
        <div className="p-4 bg-danger/20 border border-danger rounded-lg">
          <p className="text-sm">
            ⚠️ Without Telegram linking, your account will be less secure and you won't receive notifications.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleLinkTelegram}
          className="w-full py-3 bg-primary hover:bg-blue-600 rounded-lg font-semibold"
        >
          Link Telegram
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 bg-danger hover:bg-red-600 rounded-lg font-semibold"
        >
          {showWarning ? 'Continue Without Telegram' : 'Link Later'}
        </button>
      </div>
    </div>
  );
}

export default TelegramStep;
