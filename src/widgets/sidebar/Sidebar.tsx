import {
  User,
  Briefcase,
  BookOpen,
  Menu,
  X,
  Terminal,
  Github,
  Rss,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/shared/providers/ThemeProvider';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile: boolean;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  isMobile,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  const navItems = [
    { id: 'about', label: '소개', icon: User },
    { id: 'projects', label: '프로젝트', icon: Briefcase },
    { id: 'study', label: '활동', icon: BookOpen },
  ];
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'Blog', href: '#', icon: Rss },
  ];

  const expanded = !isMobile ? isOpen || isHovered : isOpen;

  if (isMobile) {
    return (
      <>
        <div className='w-full glass rounded-2xl p-4 flex justify-between items-center z-50'>
          <div className='flex items-center gap-3'>
            <div
              className='w-10 h-10 rounded-full p-[2px]'
              style={{
                background: `linear-gradient(135deg, ${theme.avatarFrom}, ${theme.avatarTo})`,
                boxShadow: `0 0 16px ${theme.avatarGlow}`,
              }}
            >
              <div
                className='w-full h-full rounded-full flex items-center justify-center'
                style={{ background: theme.avatarInner }}
              >
                <Terminal className='w-5 h-5 text-white/80' />
              </div>
            </div>
            <span className='font-semibold tracking-wide'>포트폴리오</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors'
          >
            {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='absolute top-24 left-4 right-4 glass-strong rounded-2xl p-4 z-50 flex flex-col gap-2'
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon
                      className='w-5 h-5'
                      style={{ color: isActive ? theme.iconActive : undefined }}
                    />
                    <span className='font-medium'>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      className='glass rounded-3xl h-full flex flex-col py-8 px-4 relative z-20 shrink-0'
      initial={{ width: '80px' }}
      animate={{ width: expanded ? '200px' : '76px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar / Logo */}
      <div className='flex items-center gap-3 px-1 mb-10 overflow-hidden whitespace-nowrap'>
        <div
          className='w-11 h-11 shrink-0 rounded-full p-[2px] transition-all duration-500'
          style={{
            background: `linear-gradient(135deg, ${theme.avatarFrom}, ${theme.avatarTo})`,
            boxShadow: `0 0 20px ${theme.avatarGlow}`,
          }}
        >
          <div
            className='w-full h-full rounded-full flex items-center justify-center'
            style={{ background: theme.avatarInner }}
          >
            <Terminal className='w-5 h-5 text-white/80' />
          </div>
        </div>
        <motion.div
          animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -8 }}
          transition={{ duration: 0.2 }}
          className='flex flex-col min-w-0'
        >
          <span className='font-bold text-base tracking-wide gradient-text truncate'>
            Minda
          </span>
          <span className='text-[10px] text-white/40 uppercase tracking-[0.12em]'>
            Frontend Engineer
          </span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className='flex flex-col gap-2 flex-1'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isActive
                  ? 'bg-white/12 text-white border border-white/15'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId='activeTab'
                  className='absolute inset-0 rounded-2xl z-0'
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 100%)`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className='relative z-10 flex items-center gap-3'>
                <Icon
                  className='w-5 h-5 shrink-0 transition-all duration-300 group-hover:scale-110'
                  style={{
                    color: isActive ? theme.iconActive : undefined,
                    filter: isActive
                      ? `drop-shadow(0 0 7px ${theme.iconActive}cc)`
                      : undefined,
                  }}
                />
                <motion.span
                  animate={{ opacity: expanded ? 1 : 0 }}
                  className='font-medium text-sm'
                >
                  {item.label}
                </motion.span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Social Links */}
      <div className='mt-2 mb-3'>
        <div
          className={`flex ${expanded ? 'gap-2 justify-start px-1' : 'flex-col items-center gap-2'}`}
        >
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                title={item.label}
                aria-label={item.label}
                className={`group rounded-xl transition-all duration-200 text-white/55 hover:text-white hover:bg-white/8 ${
                  expanded
                    ? 'w-9 h-9 inline-flex items-center justify-center'
                    : 'w-8 h-8 inline-flex items-center justify-center'
                }`}
              >
                <Icon className='w-4 h-4 transition-transform duration-200 group-hover:scale-110' />
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        className='mt-4 px-1 text-[10px] text-white/20 text-center whitespace-nowrap overflow-hidden tracking-wider'
      >
        © 2026 Minda Portfolio
      </motion.div>
    </motion.aside>
  );
}
