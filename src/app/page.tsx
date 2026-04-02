"use client";
import { useState } from "react";
import CarShowroom from "@/src/components/CarShowroom";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  // --- AUTH & SESSION ---
  const [isIgnited, setIsIgnited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; code: string } | null>(null);
  
  const [regName, setRegName] = useState("");
  const [regCode, setRegCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [authError, setAuthError] = useState(false);

  // --- HUD DATA ---
  const [folders, setFolders] = useState([{ id: 'default', name: 'MAIN_SYSTEM' }]);
  const [activeFolder, setActiveFolder] = useState('default');
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean; folderId: string }[]>([]);
  const [input, setInput] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  // --- STAGE 4: PERFORMANCE ANALYTICS ---
  const currentTasks = tasks.filter(t => t.folderId === activeFolder);
  const completedCount = currentTasks.filter(t => t.completed).length;
  const totalCount = currentTasks.length;
  const speed = totalCount > 0 ? Math.round((completedCount / totalCount) * 310) : 0;
  const rpmLevel = Math.min((input.length / 25) * 100, 100);

  // --- HANDLERS ---
  const handleIgniteClick = () => setIsIgnited(true);

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName && regCode) {
      setUserProfile({ name: regName.toUpperCase(), code: regCode });
      setIsLoggedIn(true);
    }
  };

  const onVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile && verifyCode === userProfile.code) {
      setIsLoggedIn(true);
      setVerifyCode("");
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 1000);
    }
  };

  const addTask = () => {
    if (!input) return;
    setTasks([{ id: Date.now(), text: input, completed: false, folderId: activeFolder }, ...tasks]);
    setInput("");
  };

  const addFolder = () => {
    if (!newFolderName) return;
    const id = Date.now().toString();
    setFolders([...folders, { id, name: newFolderName.toUpperCase() }]);
    setActiveFolder(id);
    setNewFolderName("");
  };

  const deleteFolder = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id === 'default') return;
    setFolders(folders.filter(f => f.id !== id));
    setTasks(tasks.filter(t => t.folderId !== id));
    if (activeFolder === id) setActiveFolder('default');
  };

  return (
    <main className="relative min-h-screen bg-m-carbon text-white overflow-hidden font-sans italic uppercase">
      {/* 3D Car Background - Fully Interactable */}
      <div className="absolute inset-0 z-0">
        <CarShowroom isIgnited={isIgnited} />
      </div>

      {/* M-Stripes Branding */}
      <div className="absolute top-0 w-full h-1.5 flex z-50">
        <div className="h-full w-1/3 bg-m-light-blue shadow-[0_0_20px_#81c4ff]"></div>
        <div className="h-full w-1/3 bg-m-dark-blue"></div>
        <div className="h-full w-1/3 bg-m-red shadow-[0_0_20px_#e7222e]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen pt-12 pb-6 px-10 pointer-events-none">
        {/* Header */}
        <div className="text-center pointer-events-auto mb-4">
          <h1 className="text-5xl font-black italic tracking-tighter">M <span className="text-m-red">LIST</span></h1>
          <p className="text-m-light-blue tracking-[0.4em] text-[10px] mt-2 font-bold opacity-70">
            {isLoggedIn ? `STATUS: OPTIMIZED // PILOT: ${userProfile?.name}` : "STATUS: ENGINE_LOCKED"}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            
            {/* 1. INITIAL IGNITION */}
            {!isIgnited && (
              <motion.div 
                key="ignite" 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="w-full flex flex-col items-center pointer-events-auto"
              >
                <div className="h-[55vh]" />
                <button 
                  onClick={handleIgniteClick} 
                  className="group relative px-24 py-5 border border-m-red/50 bg-m-carbon/40 backdrop-blur-md overflow-hidden transition-all hover:border-m-red shadow-[0_0_30px_rgba(231,34,46,0.1)]"
                >
                  <span className="relative z-10 font-black italic tracking-[0.4em] text-xl">IGNITE ENGINE</span>
                  <div className="absolute inset-0 bg-m-red translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </motion.div>
            )}

            {/* 2. REGISTRATION */}
            {isIgnited && !userProfile && (
              <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-m-carbon/95 border-l-4 border-m-red p-10 backdrop-blur-3xl max-w-lg mx-auto pointer-events-auto shadow-2xl">
                <h2 className="text-m-red font-black text-lg tracking-widest mb-2">NEW_DRIVER_DETECTED</h2>
                <form onSubmit={onRegister} className="space-y-6">
                  <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="PILOT_ID..." className="w-full bg-transparent border-b border-white/10 py-3 outline-none text-sm tracking-[0.2em] focus:border-m-light-blue transition-all" />
                  <input type="password" maxLength={4} value={regCode} onChange={(e) => setRegCode(e.target.value)} placeholder="ENGINE_CODE (4-DIGIT)..." className="w-full bg-transparent border-b border-white/10 py-3 outline-none text-sm tracking-[0.2em] focus:border-m-red transition-all" />
                  <button className="w-full bg-m-red text-white font-black py-4 text-xs tracking-[0.3em] hover:bg-white hover:text-m-red transition-all italic">SAVE_PROTOCOL</button>
                </form>
              </motion.div>
            )}

            {/* 3. LOGIN */}
            {isIgnited && userProfile && !isLoggedIn && (
              <motion.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-m-carbon/95 border-l-4 border-m-light-blue p-10 backdrop-blur-3xl max-w-md mx-auto pointer-events-auto shadow-2xl">
                <h2 className={`font-black text-lg tracking-widest mb-2 ${authError ? 'text-m-red' : 'text-m-light-blue'}`}>
                  {authError ? 'CODE_REJECTED' : 'VERIFY_KEY_CODE'}
                </h2>
                <form onSubmit={onVerifyCode} className="space-y-6">
                  <input type="password" maxLength={4} autoFocus value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className={`w-full bg-transparent border-b py-3 outline-none text-center text-3xl tracking-[1em] ${authError ? 'border-m-red' : 'border-m-light-blue'}`} />
                  <button className="w-full bg-m-light-blue text-m-carbon font-black py-4 text-xs tracking-[0.3em] hover:bg-white transition-all italic">PRIME_ENGINE</button>
                </form>
              </motion.div>
            )}

            {/* 4. FULL HUD DASHBOARD */}
            {isIgnited && isLoggedIn && (
              <div className="w-full h-full flex justify-between items-center pointer-events-none">
                
                {/* LEFT WING (Interactive) */}
                <motion.div 
                  initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} 
                  className="w-72 bg-m-carbon/60 border-r border-white/10 p-6 backdrop-blur-xl pointer-events-auto self-center shadow-2xl"
                >
                  <p className="text-[9px] text-m-light-blue tracking-[0.3em] mb-6 font-bold">GARAGE_BAYS</p>
                  <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
                    {folders.map(folder => (
                      <div key={folder.id} onClick={() => setActiveFolder(folder.id)} className={`group flex items-center justify-between px-4 py-3 cursor-pointer border-l-2 transition-all ${activeFolder === folder.id ? 'border-m-red bg-m-red/10 text-white' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}>
                        <span className="text-[11px] font-black tracking-widest">{folder.name}</span>
                        {folder.id !== 'default' && (
                          <button onClick={(e) => deleteFolder(e, folder.id)} className="text-[10px] text-white/0 group-hover:text-m-red transition-all font-bold">DECOM</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="ADD_BAY..." className="bg-transparent border-b border-white/10 text-[10px] outline-none w-full uppercase" />
                    <button onClick={addFolder} className="text-m-light-blue font-black">+</button>
                  </div>
                </motion.div>

                {/* MIDDLE WING (Transparent to clicks) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center pointer-events-none select-none">
                   <div className="relative w-52 h-52 flex items-center justify-center border-4 border-white/5 rounded-full backdrop-blur-md bg-m-carbon/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="104" cy="104" r="96" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <motion.circle 
                          cx="104" cy="104" r="96" fill="transparent" 
                          stroke={speed > 280 ? "#e7222e" : "#81c4ff"} 
                          strokeWidth="8" strokeDasharray="603"
                          initial={{ strokeDashoffset: 603 }}
                          animate={{ strokeDashoffset: 603 - (603 * (speed / 310)) }}
                          transition={{ type: "spring", stiffness: 40, damping: 12 }}
                        />
                      </svg>
                      <div className="text-center z-10">
                        <p className="text-[9px] text-white/40 font-black tracking-[0.3em] mb-1">TOP SPEED</p>
                        <h3 className="text-6xl font-black italic tracking-tighter leading-none">{speed}</h3>
                        <p className="text-[10px] text-m-light-blue font-black mt-2 tracking-widest">KM / H</p>
                      </div>
                   </div>
                </motion.div>

                {/* RIGHT WING (Interactive) */}
                <motion.div 
                  initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} 
                  className="w-[450px] flex flex-col pointer-events-auto self-center"
                >
                  <div className="bg-m-carbon/80 border border-white/10 p-6 backdrop-blur-xl mb-6 relative">
                    <div className="w-full h-1 bg-white/5 mb-4">
                      <div className={`h-full transition-all duration-150 ${rpmLevel > 85 ? 'bg-m-red shadow-[0_0_10px_red]' : 'bg-m-light-blue'}`} style={{ width: `${rpmLevel}%` }} />
                    </div>
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} placeholder="NEW_OBJECTIVE..." className="w-full bg-transparent border-l-2 border-m-red pl-4 py-2 outline-none font-black italic tracking-widest text-xl mb-4" />
                    <button onClick={addTask} className="w-full bg-white text-m-carbon py-3 font-black text-[10px] tracking-[0.2em] hover:bg-m-red hover:text-white transition-all italic uppercase">EXECUTE</button>
                  </div>

                  <div className="bg-m-carbon/40 border border-white/5 p-4 backdrop-blur-md h-[40vh] overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                      {currentTasks.map((task) => (
                        <motion.div key={task.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} className={`flex items-center justify-between p-4 border-b border-white/5 cursor-pointer transition-all ${task.completed ? 'opacity-30 grayscale' : 'hover:bg-white/5'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 border ${task.completed ? 'bg-m-red shadow-[0_0_8px_red]' : 'border-m-light-blue'} flex items-center justify-center`}>{task.completed && '✓'}</div>
                            <span className={`text-xs font-black tracking-widest ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(t => t.id !== task.id)) }} className="text-white/20 hover:text-m-red text-[9px] font-bold">TERMINATE</button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between text-[9px] text-white/20 tracking-[0.5em] font-bold italic border-t border-white/5 pt-4 pointer-events-auto">
          <span>ACTIVE_BAYS: {folders.length}</span>
          <button onClick={() => setIsLoggedIn(false)} className="hover:text-m-red transition-colors">
            {isLoggedIn ? `SESSION: ${userProfile?.name}` : "SESSION_LOCKED"}
          </button>
          <div className="flex items-center gap-4">
             <span className="text-m-light-blue">MISSION_TASKS: {tasks.length}</span>
             <div className="w-24 h-1 bg-white/5"><motion.div className="h-full bg-m-red" animate={{ width: `${(completedCount/totalCount)*100}%` }} /></div>
          </div>
        </div>
      </div>
    </main>
  );
}