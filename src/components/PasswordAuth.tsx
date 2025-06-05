import { useState } from 'react';

interface PasswordAuthProps {
  onAuthenticated: () => void;
}

export default function PasswordAuth({ onAuthenticated }: PasswordAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    
    if (password === correctPassword) {
      // Store authentication in session storage
      sessionStorage.setItem('isAuthenticated', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 theme-transition"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold theme-transition" style={{ color: 'var(--color-text)' }}>
            Web Search Agent
          </h2>
          <p className="mt-2 text-center text-sm theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
            Please enter the password to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 transition-all duration-200 theme-transition"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: error ? 'var(--color-error)' : 'var(--color-input-border)',
                  borderWidth: '1px',
                  color: error ? 'var(--color-error)' : 'var(--color-text)',
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-input-focus)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-input-focus)';
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-input-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-center theme-transition" style={{ color: 'var(--color-error)' }}>
              Incorrect password. Please try again.
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 theme-transition"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverse)',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px var(--color-primary)';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 