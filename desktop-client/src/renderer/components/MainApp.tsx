import React from 'react';

interface MainAppProps {
  user: any;
}

function MainApp({ user }: MainAppProps) {
  return (
    <div className="h-full flex">
      {/* Server List */}
      <div className="w-20 bg-dark-300 flex flex-col items-center py-4 space-y-2">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold cursor-pointer hover:rounded-xl transition-all">
          SV
        </div>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-dark-200 flex flex-col">
        <div className="h-16 border-b border-dark-100 flex items-center px-4 font-semibold">
          SquadVoice Server
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-400 px-2 mb-2">VOICE CHANNELS</div>
          <div className="px-2 py-2 hover:bg-dark-100 rounded cursor-pointer">
            🔊 General
          </div>
          <div className="text-xs font-semibold text-gray-400 px-2 mb-2 mt-4">TEXT CHANNELS</div>
          <div className="px-2 py-2 hover:bg-dark-100 rounded cursor-pointer">
            # general
          </div>
        </div>
        <div className="h-16 bg-dark-300 flex items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
              {user.displayName[0]}
            </div>
            <div className="text-sm">
              <div className="font-semibold">{user.displayName}</div>
              <div className="text-xs text-gray-400">#{user.nickname}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-dark-100">
        <div className="h-16 border-b border-dark-200 flex items-center px-4 font-semibold">
          # general
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-400">Welcome to SquadVoice! 🎉</p>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
