import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Voice API
  startVoice: () => ipcRenderer.invoke('voice:start'),
  stopVoice: () => ipcRenderer.invoke('voice:stop'),
  
  // P2P API
  connectPeer: (peerId: string) => ipcRenderer.invoke('p2p:connect', peerId),
  disconnectPeer: (peerId: string) => ipcRenderer.invoke('p2p:disconnect', peerId),
  
  // Storage API
  saveData: (key: string, value: any) => ipcRenderer.invoke('storage:save', key, value),
  loadData: (key: string) => ipcRenderer.invoke('storage:load', key),
});
