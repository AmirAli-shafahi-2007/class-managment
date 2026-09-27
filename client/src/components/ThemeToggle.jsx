import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: 40, height: 40, borderRadius: 13,
        border: '1.5px solid rgba(139,92,246,0.2)',
        background: theme === 'dark' ? 'rgba(139,92,246,0.08)' : 'rgba(251,191,36,0.1)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.2rem',
        transition: 'all 0.3s',
        flexShrink: 0,
      }}
      title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}