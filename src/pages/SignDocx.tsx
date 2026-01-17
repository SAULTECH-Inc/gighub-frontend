import { Upload, FileText, User, CheckCircle, Edit3, Download, Shield, Clock, Eye, X, Plus, Type, Calendar, Image, ZoomIn, ZoomOut, Move, ChevronLeft, Mail, Settings, LogOut, Users, Search, Filter, MoreVertical, Share2, Copy, Bell, HelpCircle, Folder, TrendingUp, Activity, FileClock, UserPlus, MessageCircle, Linkedin, Twitter, Facebook, Star, Briefcase, Lock, Palette, Database } from 'lucide-react';
import { useState, useRef } from 'react';

const SignDocx = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('landing');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [userIdentity, setUserIdentity] = useState({ fullName: '', initials: '', signature: null, passport: null, address: '', company: '', role: '' });
    const [detectedFields, setDetectedFields] = useState<any[]>([]);
    const [manualFields, setManualFields] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAuditTrail, setShowAuditTrail] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [documents] = useState([
        { id: 1, name: 'Employment Contract.pdf', status: 'completed', date: '2025-01-05', size: '245 KB', sharedWith: 3 },
        { id: 2, name: 'NDA Agreement.pdf', status: 'draft', date: '2025-01-04', size: '156 KB', sharedWith: 0 }
    ]);
    const [teamMembers] = useState([
        { id: 1, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Admin', docsProcessed: 45, status: 'active' },
        { id: 2, name: 'Michael Chen', email: 'michael@company.com', role: 'Editor', docsProcessed: 32, status: 'active' }
    ]);

    const fileInputRef = useRef(null);

    const handleLogin = (email) => {
        setCurrentUser({ id: 1, name: 'John Anderson', email, company: 'Tech Solutions Inc.', plan: 'Professional', docsThisMonth: 24, teamSize: 3 });
        setIsAuthenticated(true);
        setCurrentView('dashboard');
    };

    const simulateAIDetection = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setDetectedFields([
                { id: 1, type: 'signature', x: 100, y: 500, width: 200, height: 60, confidence: 0.95, status: 'auto-filled', value: 'Signature' },
                { id: 2, type: 'name', x: 100, y: 300, width: 250, height: 30, confidence: 0.92, status: 'auto-filled', value: userIdentity.fullName || 'Full Name' }
            ]);
            setIsProcessing(false);
            setCurrentView('review');
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setUploadedDocument({ name: file.name, size: (file.size / 1024).toFixed(2) + ' KB', uploadDate: new Date().toISOString() });
            simulateAIDetection();
        }
    };

    const shareDocument = (platform) => {
        const url = window.location.href;
        const text = `Signed document: ${uploadedDocument?.name}`;
    const links = {
      email: `mailto:?subject=${encodeURIComponent(uploadedDocument?.name)}&body=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    if (links[platform]) window.open(links[platform], '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <div className="landing">
          <nav className="nav">
            <div className="brand"><Shield size={32} /><span>SignatureAI</span></div>
            <div className="actions">
              <button onClick={() => setCurrentView('login')}>Login</button>
              <button className="primary" onClick={() => setCurrentView('signup')}>Get Started</button>
            </div>
          </nav>
          {currentView === 'landing' && (
            <div className="hero">
              <h1>Sign Documents with <span className="gradient">AI Intelligence</span></h1>
              <p>The smartest way to sign, manage, and share documents</p>
              <button className="btn-hero" onClick={() => setCurrentView('signup')}>Start Free Trial</button>
              <div className="stats">
                <div><strong>10M+</strong><span>Documents</span></div>
                <div><strong>50K+</strong><span>Users</span></div>
                <div><strong>99.9%</strong><span>Uptime</span></div>
              </div>
            </div>
          )}
          {(currentView === 'login' || currentView === 'signup') && (
            <div className="auth">
              <Shield size={48} />
              <h2>{currentView === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <input placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="full" onClick={() => handleLogin('user@email.com')}>
                {currentView === 'login' ? 'Sign In' : 'Create Account'}
              </button>
              <p>
                {currentView === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <a onClick={() => setCurrentView(currentView === 'login' ? 'signup' : 'login')}>
                  {currentView === 'login' ? ' Sign up' : ' Sign in'}
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <nav className="app-nav">
            <div className="brand" onClick={() => setCurrentView('dashboard')}><Shield size={28} /><span>SignatureAI</span></div>
            <div className="links">
              {['dashboard', 'history', 'team', 'templates'].map(v => (
                <button key={v} className={currentView === v ? 'active' : ''} onClick={() => setCurrentView(v)}>{v}</button>
              ))}
            </div>
            <div className="actions">
              <button><Bell size={20} /></button>
              <div className="user-menu">
                <button className="user-btn"><User size={20} /><span>{currentUser?.name?.split(' ')[0]}</span></button>
                <div className="dropdown">
                  <button onClick={() => setCurrentView('profile')}><User size={16} />Profile</button>
                  <button onClick={() => setCurrentView('settings')}><Settings size={16} />Settings</button>
                  <button onClick={() => { setIsAuthenticated(false); setCurrentView('landing'); }}><LogOut size={16} />Logout</button>
                </div>
              </div>
            </div>
          </nav>
          <main className="main">
            {currentView === 'dashboard' && (
              <div className="dashboard">
                <div className="header">
                  <div><h1>Welcome, {currentUser?.name?.split(' ')[0]}! 👋</h1><p>Here's what's happening today</p></div>
                  <button className="primary" onClick={() => fileInputRef.current?.click()}><Upload size={20} />Upload</button>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
                <div className="stats">
                  {[{icon: FileText, label: 'This Month', value: 24}, {icon: CheckCircle, label: 'Completed', value: 2}].map((s, i) => (
                    <div key={i} className="card"><s.icon size={24} /><div className="value">{s.value}</div><div>{s.label}</div></div>
                  ))}
                </div>
                <div className="recent">
                  <h3>Recent Documents</h3>
                  {documents.map(d => (
                    <div key={d.id} className="doc"><FileText /><div><h4>{d.name}</h4><p>{d.date}</p></div><span className={d.status}>{d.status}</span></div>
                  ))}
                </div>
              </div>
            )}
            {currentView === 'profile' && (
              <div className="profile">
                <h2>Profile</h2>
                <div className="form">
                  <input placeholder="Name" defaultValue={currentUser?.name} />
                  <input placeholder="Email" defaultValue={currentUser?.email} />
                  <button className="primary">Save</button>
                </div>
              </div>
            )}
            {currentView === 'history' && (
              <div className="history">
                <h2>Work History</h2>
                {documents.map(d => (
                  <div key={d.id} className="doc-large"><FileText size={28} /><div><h4>{d.name}</h4><p>{d.date} • {d.size}</p></div></div>
                ))}
              </div>
            )}
            {currentView === 'team' && (
              <div className="team">
                <h2>Team</h2>
                {teamMembers.map(m => (
                  <div key={m.id} className="member"><User size={32} /><div><h4>{m.name}</h4><p>{m.email}</p></div><span>{m.role}</span></div>
                ))}
              </div>
            )}
            {currentView === 'review' && (
              <div className="review">
                <div className="toolbar">
                  <div><FileText /><span>{uploadedDocument?.name}</span></div>
                  <div className="zoom">
                    <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}><ZoomOut /></button>
                    <span>{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}><ZoomIn /></button>
                  </div>
                </div>
                {isProcessing ? (
                  <div className="processing"><div className="spinner" /><h3>AI analyzing...</h3></div>
                ) : (
                  <div className="content">
                    <div className="canvas">
                      <div className="page" style={{ transform: `scale(${zoomLevel})` }}>
                        <div className="pdf">
                          <h3>EMPLOYMENT AGREEMENT</h3>
                          <p>Name: <span className="placeholder">Name</span></p>
                          <p>Date: <span className="placeholder">Date</span></p>
                        </div>
                        {detectedFields.map((f: any) => (
                          <div key={f.id} className="field" style={{ left: f.x, top: f.y, width: f.width, height: f.height }}>
                            <span>{f.type}</span><button onClick={() => setDetectedFields(detectedFields.filter(df => df.id !== f.id))}><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="sidebar">
                      <div className="section">
                        <h3>Detected Fields</h3>
                        {detectedFields.map(f => (
                          <div key={f.id} className="field-item"><span>{f.type}</span><span>{Math.round(f.confidence * 100)}%</span></div>
                        ))}
                      </div>
                      <button className="primary full" onClick={() => setCurrentView('completed')}><CheckCircle />Finalize</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentView === 'completed' && (
              <div className="completed">
                <CheckCircle size={64} className="success" />
                <h2>Document Signed Successfully!</h2>
                <div className="info">
                  <div><span>Document:</span><span>{uploadedDocument?.name}</span></div>
                  <div><span>Signed by:</span><span>{currentUser?.name}</span></div>
                </div>
                <div className="actions">
                  <button className="secondary"><Eye />View</button>
                  <button className="primary"><Download />Download</button>
                  <button className="primary" onClick={() => setShowShareModal(true)}><Share2 />Share</button>
                </div>
              </div>
            )}
          </main>
          {showShareModal && (
            <div className="modal" onClick={() => setShowShareModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>Share Document</h3><button onClick={() => setShowShareModal(false)}><X /></button></div>
                <div className="share-grid">
                  {[{icon: Mail, name: 'Email', key: 'email'}, {icon: MessageCircle, name: 'WhatsApp', key: 'whatsapp'}, {icon: Linkedin, name: 'LinkedIn', key: 'linkedin'}].map(s => (
                    <button key={s.key} onClick={() => shareDocument(s.key)}><s.icon size={32} /><span>{s.name}</span></button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app { min-height: 100vh; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); color: #e8eaf6; font-family: -apple-system, sans-serif; }
        
        .nav, .app-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; background: rgba(10,14,39,0.8); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .brand { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; cursor: pointer; }
        .brand svg { color: #00d4ff; }
        .actions { display: flex; gap: 1rem; }
        button { padding: 0.75rem 1.5rem; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; background: rgba(255,255,255,0.05); color: #a0a8c0; transition: all 0.3s; }
        button:hover { background: rgba(255,255,255,0.1); color: #00d4ff; }
        button.primary, .btn-hero { background: linear-gradient(135deg, #00d4ff 0%, #0080ff 100%); color: white; }
        button.primary:hover, .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(0,212,255,0.5); }
        button.secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        button.full { width: 100%; }
        
        .hero { text-align: center; padding: 8rem 3rem; max-width: 1000px; margin: 0 auto; }
        .hero h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1; }
        .gradient { background: linear-gradient(135deg, #00d4ff 0%, #0080ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.3rem; color: #a0a8c0; margin-bottom: 3rem; }
        .btn-hero { display: inline-flex; padding: 1.25rem 2.5rem; font-size: 1.1rem; }
        .stats { display: flex; justify-content: center; gap: 4rem; margin-top: 4rem; }
        .stats div { text-align: center; }
        .stats strong { display: block; font-size: 2.5rem; color: #00d4ff; margin-bottom: 0.5rem; }
        .stats span { color: #a0a8c0; }
        
        .auth { max-width: 450px; margin: 8rem auto; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 3rem; text-align: center; }
        .auth svg { color: #00d4ff; margin-bottom: 2rem; }
        .auth h2 { font-size: 2rem; margin-bottom: 2rem; }
        .auth input { width: 100%; padding: 1rem 1.25rem; margin-bottom: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #e8eaf6; }
        .auth input:focus { outline: none; border-color: #00d4ff; box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
        .auth p { margin-top: 2rem; color: #a0a8c0; }
        .auth a { color: #00d4ff; cursor: pointer; }
        
        .links { display: flex; gap: 0.5rem; flex: 1; justify-content: center; }
        .links button { text-transform: capitalize; }
        .links button.active { color: #00d4ff; background: rgba(0,212,255,0.1); }
        .user-menu { position: relative; }
        .user-btn { display: flex; align-items: center; gap: 0.5rem; }
        .dropdown { display: none; position: absolute; top: calc(100% + 0.5rem); right: 0; min-width: 200px; background: rgba(26,31,58,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.5rem; }
        .user-menu:hover .dropdown { display: block; }
        .dropdown button { width: 100%; justify-content: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; }
        
        .main { padding: 2rem 3rem; max-width: 1600px; margin: 0 auto; }
        .dashboard { display: flex; flex-direction: column; gap: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { color: #a0a8c0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
        .stats .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; transition: all 0.3s; }
        .stats .card:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
        .stats .card svg { color: #00d4ff; margin-bottom: 1rem; }
        .stats .value { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        
        .recent { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; }
        .recent h3 { margin-bottom: 1.5rem; }
        .doc { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 0.75rem; }
        .doc svg { color: #00d4ff; }
        .doc h4 { margin-bottom: 0.25rem; }
        .doc p { color: #a0a8c0; font-size: 0.85rem; }
        .doc span { padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.85rem; }
        .doc span.completed { background: rgba(34,197,94,0.2); color: #4ade80; }
        .doc span.draft { background: rgba(251,191,36,0.2); color: #fbbf24; }
        
        .profile, .history, .team { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; }
        .profile h2, .history h2, .team h2 { margin-bottom: 2rem; }
        .form { display: flex; flex-direction: column; gap: 1rem; max-width: 600px; }
        .form input { padding: 1rem 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #e8eaf6; }
        .doc-large { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 16px; margin-bottom: 1rem; }
        .doc-large svg { color: #00d4ff; }
        .member { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 16px; margin-bottom: 1rem; }
        .member svg { background: rgba(0,212,255,0.2); padding: 1rem; border-radius: 50%; color: #00d4ff; }
        
        .review { display: flex; flex-direction: column; gap: 2rem; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; }
        .toolbar > div { display: flex; align-items: center; gap: 1rem; }
        .toolbar svg { color: #00d4ff; }
        .zoom { display: flex; align-items: center; gap: 1rem; }
        .zoom button { padding: 0.5rem; width: 40px; height: 40px; }
        .processing { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 500px; }
        .spinner { width: 60px; height: 60px; border: 4px solid rgba(0,212,255,0.2); border-top-color: #00d4ff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .content { display: grid; grid-template-columns: 1fr 400px; gap: 2rem; }
        .canvas { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; overflow: auto; }
        .page { transform-origin: top left; }
        .pdf { width: 800px; background: white; padding: 60px; border-radius: 8px; color: #000; }
        .pdf h3 { text-align: center; margin-bottom: 2rem; }
        .pdf p { margin-bottom: 1rem; }
        .placeholder { display: inline-block; padding: 2px 8px; background: #f0f0f0; border-radius: 4px; min-width: 150px; }
        .field { position: absolute; border: 2px solid #00d4ff; background: rgba(0,212,255,0.1); border-radius: 4px; padding: 4px 8px; font-size: 12px; display: flex; align-items: center; justify-content: space-between; }
        .field button { padding: 0; width: 20px; height: 20px; border-radius: 50%; background: rgba(239,68,68,0.8); }
        .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; }
        .section h3 { margin-bottom: 1rem; }
        .field-item { display: flex; justify-content: space-between; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 0.75rem; }
        
        .completed { text-align: center; max-width: 700px; margin: 4rem auto; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 4rem; }
        .success { color: #4ade80; margin-bottom: 2rem; }
        .completed h2 { margin-bottom: 2rem; }
        .info { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; text-align: left; }
        .info > div { display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .info > div:last-child { border-bottom: none; }
        .info span:first-child { color: #a0a8c0; }
        .actions { display: flex; gap: 1rem; }
        .actions button { flex: 1; }
        
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: rgba(26,31,58,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 2.5rem; max-width: 600px; width: 90%; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header button { padding: 0.5rem; width: 40px; height: 40px; }
        .share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .share-grid button { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .share-grid button:hover { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3); }
        
        @media (max-width: 1200px) { .content { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { 
          .nav, .app-nav, .main { padding: 1rem 1.5rem; }
          .hero { padding: 4rem 1.5rem; }
          .hero h1 { font-size: 2.5rem; }
          .stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default SignDocx;