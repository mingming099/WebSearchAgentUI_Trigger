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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Web Search Agent
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
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
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  error ? 'border-red-300 text-red-900' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">
              Incorrect password. Please try again.
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 