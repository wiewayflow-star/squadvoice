# SquadVoice - Development Roadmap

## Phase 1: Foundation ✅ (Current)

**Status**: In Progress  
**Timeline**: Weeks 1-2

### Completed
- [x] Project structure (monorepo)
- [x] Signal server (WebSocket + REST API)
- [x] PostgreSQL schema
- [x] Desktop client shell (Electron)
- [x] Registration flow UI
- [x] Crypto key generation
- [x] Telegram bot integration
- [x] Documentation

### In Progress
- [ ] WebSocket connection from client
- [ ] User authentication flow
- [ ] Basic UI polish

## Phase 2: Voice Engine 🎤

**Status**: Not Started  
**Timeline**: Weeks 3-5

### Goals
- [ ] WebRTC voice capture/playback
- [ ] Opus codec integration
- [ ] Audio processing (AEC, noise suppression)
- [ ] Voice Activity Detection (VAD)
- [ ] Push-to-talk functionality
- [ ] P2P mesh for small rooms (<15 users)
- [ ] Basic voice quality optimization

### Deliverables
- Working voice chat for 2-15 participants
- Low latency (<100ms)
- Good audio quality
- Stable P2P connections

## Phase 3: Messaging 💬

**Status**: Not Started  
**Timeline**: Weeks 6-7

### Goals
- [ ] Signal Protocol implementation
- [ ] X3DH key exchange
- [ ] Double Ratchet encryption
- [ ] WebRTC data channels
- [ ] Text channel UI
- [ ] Message history (local storage)
- [ ] Message delivery confirmation

### Deliverables
- E2E encrypted text messaging
- Text channels
- Local message history
- Reliable message delivery

## Phase 4: Advanced Voice 🔊

**Status**: Not Started  
**Timeline**: Weeks 8-10

### Goals
- [ ] Peer-hosted SFU (15-30 users)
- [ ] Selective forwarding
- [ ] Active speaker detection
- [ ] Sub-mesh topology (30+ users)
- [ ] Dynamic topology switching
- [ ] Voice quality metrics
- [ ] Adaptive bitrate

### Deliverables
- Support for 30+ participants
- Optimized bandwidth usage
- Automatic topology selection
- Performance monitoring

## Phase 5: Server Management 🏢

**Status**: Not Started  
**Timeline**: Weeks 11-12

### Goals
- [ ] Create/delete servers
- [ ] Create/delete channels
- [ ] Invite system
- [ ] Roles & permissions
- [ ] User management (kick, ban)
- [ ] Server settings
- [ ] Channel categories

### Deliverables
- Full server management
- Role-based permissions
- Invite links
- Moderation tools

## Phase 6: Polish & Optimization ✨

**Status**: Not Started  
**Timeline**: Weeks 13-15

### Goals
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Memory leak fixes
- [ ] Error handling
- [ ] Logging system
- [ ] Analytics (privacy-focused)
- [ ] Settings panel
- [ ] Keyboard shortcuts

### Deliverables
- Polished user interface
- Stable performance
- Better error messages
- User preferences

## Phase 7: Security Audit 🔒

**Status**: Not Started  
**Timeline**: Weeks 16-17

### Goals
- [ ] Code security review
- [ ] Penetration testing
- [ ] Crypto implementation audit
- [ ] Dependency audit
- [ ] Privacy review
- [ ] Fix security issues
- [ ] Security documentation

### Deliverables
- Security audit report
- Fixed vulnerabilities
- Security best practices guide

## Phase 8: Beta Release 🚀

**Status**: Not Started  
**Timeline**: Week 18

### Goals
- [ ] Beta testing program
- [ ] Bug fixes
- [ ] Performance tuning
- [ ] Documentation updates
- [ ] Release notes
- [ ] Distribution setup

### Deliverables
- Beta release for Windows/Linux/macOS
- Public beta testing
- Feedback collection

## Future Features 🔮

### Short-term (3-6 months)
- Screen sharing
- File transfers (P2P)
- Voice recording
- Custom emoji
- Themes
- Mobile notifications via Telegram

### Long-term (6-12 months)
- Mobile apps (React Native)
- Video calls
- Screen annotations
- Integrations (webhooks)
- Federation (multiple servers)
- Blockchain identity (optional)

## Success Metrics

### Phase 2 (Voice)
- Latency: <100ms (P2P)
- Audio quality: MOS >4.0
- Connection success rate: >95%

### Phase 3 (Messaging)
- Message delivery: >99.9%
- Encryption overhead: <10ms
- Storage efficiency: <1MB per 1000 messages

### Phase 4 (Advanced Voice)
- Support 50+ users per room
- Bandwidth: <100 kbps per user
- CPU usage: <20% during calls

### Phase 8 (Beta)
- 1000+ beta testers
- <10 critical bugs
- User satisfaction: >4.0/5.0

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to any phase.

## Updates

This roadmap is updated monthly. Last update: March 2026
