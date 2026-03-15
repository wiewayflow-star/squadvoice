import React, { useState } from 'react';
import NicknameStep from './registration/NicknameStep';
import PasswordStep from './registration/PasswordStep';
import TelegramStep from './registration/TelegramStep';
import ProfileStep from './registration/ProfileStep';

interface RegistrationProps {
  onComplete: (user: any, token: string) => void;
}

type Step = 'nickname' | 'password' | 'telegram' | 'profile';

function Registration({ onComplete }: RegistrationProps) {
  const [step, setStep] = useState<Step>('nickname');
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    displayName: '',
    avatarHash: '',
    publicKey: '',
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100">
      <div className="w-full max-w-md p-8">
        {step === 'nickname' && (
          <NicknameStep
            onNext={(nickname) => {
              updateFormData({ nickname });
              setStep('password');
            }}
          />
        )}
        {step === 'password' && (
          <PasswordStep
            onNext={(password) => {
              updateFormData({ password });
              setStep('telegram');
            }}
            onBack={() => setStep('nickname')}
          />
        )}
        {step === 'telegram' && (
          <TelegramStep
            onNext={() => setStep('profile')}
            onSkip={() => setStep('profile')}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            formData={formData}
            onComplete={onComplete}
            onBack={() => setStep('telegram')}
          />
        )}
      </div>
    </div>
  );
}

export default Registration;
