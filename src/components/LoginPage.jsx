import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Terminal, Shield, Cpu, Lock, ChevronRight } from 'lucide-react';
import loginBg from '../assets/login-bg.png';
import projectLogo from '../assets/project-logo.png';

const GlitchText = ({ text }) => {
  return (
    <div className='relative inline-block group'>
      <span className='relative z-10'>{text}</span>
      <span className='absolute top-0 left-0 -z-10 w-full h-full text-[#00f3ff] opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]'>{text}</span>
      <span className='absolute top-0 left-0 -z-10 w-full h-full text-[#ff00ff] opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]'>{text}</span>
    </div>
  );
};

export default function LoginPage({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bootSequence, setBootSequence] = useState([]);
  const [username, setUsername] = useState('GUEST_USER');

  useEffect(() => {
    const sequence = [
      'INITIALIZING SECURE CONNECTION...',
      'ESTABLISHING ENCRYPTED TUNNEL...',
      'VERIFYING BIOMETRICS...',
      'ACCESS GRANTED.'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setBootSequence(prev => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className='min-h-screen w-full bg-black text-[#00f3ff] font-mono flex items-center justify-center relative overflow-hidden cyber-grid crt'>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className='absolute top-10 left-10 opacity-30 hidden md:block z-10'>
        <div className='border-l-2 border-[#00f3ff] pl-4 space-y-2'>
          <p>SYS.STATUS: <span className='text-[#00ff41]'>ONLINE</span></p>
          <p>NET.LATENCY: 24ms</p>
          <p>ENCRYPTION: AES-4096</p>
        </div>
      </div>

      <div className='absolute bottom-10 right-10 opacity-30 hidden md:block text-right'>
        <div className='border-r-2 border-[#00f3ff] pr-4 space-y-2'>
          <p>SECTOR: 7G</p>
          <p>NODE: ALPHA-1</p>
          <p>USER: ANONYMOUS</p>
        </div>
      </div>

      {/* Login Terminal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 w-full max-w-md'
      >
        {/* Terminal Header */}
        <div className='bg-[#00f3ff]/10 border border-[#00f3ff] border-b-0 p-2 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Terminal size={16} />
            <span className='text-xs font-bold tracking-widest'>SECURE_LOGIN_TERMINAL_V2.0</span>
          </div>
          <div className='flex gap-1'>
            <div className='w-3 h-3 bg-[#00f3ff] rounded-full opacity-50'></div>
            <div className='w-3 h-3 bg-[#00f3ff] rounded-full opacity-50'></div>
            <div className='w-3 h-3 bg-[#ff0000] rounded-full opacity-50'></div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className='bg-black/90 border border-[#00f3ff] p-8 shadow-[0_0_30px_rgba(0,243,255,0.15)] backdrop-blur-sm relative'>

          {/* Corner Accents */}
          <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff] -mt-1 -ml-1'></div>
          <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff] -mt-1 -mr-1'></div>
          <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff] -mb-1 -ml-1'></div>
          <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff] -mb-1 -mr-1'></div>

          <div className='flex flex-col items-center mb-8'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className='mb-4 relative'
            >
              <div className='absolute inset-0 bg-[#00f3ff] blur-xl opacity-20 rounded-full'></div>
              <img src={projectLogo} alt="Logo" className="w-16 h-16 relative z-10 object-contain drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            </motion.div>
            <h1 className='text-3xl font-bold tracking-tighter glow-text-blue mb-2'>
              <GlitchText text='QUERY_WIZARD' />
            </h1>
            <p className='text-[#00f3ff]/60 text-xs tracking-widest'>DATABASE INFILTRATION PROTOCOL</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div className='group'>
                <label className='text-xs text-[#00f3ff]/70 mb-1 block ml-1'>USERNAME_</label>
                <div className='relative flex items-center'>
                  <div className='absolute left-3 text-[#00f3ff]/50'>
                    <Shield size={16} />
                  </div>
                  <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-none py-3 pl-10 pr-4 text-[#00f3ff] placeholder-[#00f3ff]/30 focus:outline-none focus:border-[#00f3ff] focus:bg-[#00f3ff]/10 transition-all font-mono'
                    placeholder='ENTER_ID'
                  />
                </div>
              </div>

              <div className='group'>
                <label className='text-xs text-[#00f3ff]/70 mb-1 block ml-1'>PASSWORD_</label>
                <div className='relative flex items-center'>
                  <div className='absolute left-3 text-[#00f3ff]/50'>
                    <Lock size={16} />
                  </div>
                  <input
                    type='password'
                    defaultValue='password'
                    className='w-full bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-none py-3 pl-10 pr-4 text-[#00f3ff] placeholder-[#00f3ff]/30 focus:outline-none focus:border-[#00f3ff] focus:bg-[#00f3ff]/10 transition-all font-mono'
                    placeholder='ENTER_KEY'
                  />
                </div>
              </div>
            </div>

            <div className='h-20 overflow-hidden text-xs text-[#00ff41] font-mono p-2 bg-black/50 border border-[#00ff41]/20'>
              {bootSequence.map((line, i) => (
                <div key={i} className='opacity-80'>&gt; {line}</div>
              ))}
              {isLoading && <div className='animate-pulse'>&gt; DECRYPTING KEY...</div>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 243, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className='w-full bg-[#00f3ff]/10 border border-[#00f3ff] text-[#00f3ff] font-bold py-3 uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden'
            >
              <span className='relative z-10 flex items-center gap-2'>
                {isLoading ? 'ACCESSING...' : 'INITIATE_LINK'}
                {!isLoading && <ChevronRight size={16} className='group-hover:translate-x-1 transition-transform' />}
              </span>
              <div className='absolute inset-0 bg-[#00f3ff] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-10'></div>
            </motion.button>
          </form>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-[10px] text-[#00f3ff]/40'>
            UNAUTHORIZED ACCESS IS A FEDERAL CRIME.
            <br />
            IP ADDRESS LOGGED: 192.168.0.1
          </p>
        </div>
      </motion.div>
    </div>
  );
}
