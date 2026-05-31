'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const MOCK_USERS = [
  { name: 'Hamdi', email: 'sokare5564@nuitx.com' },
  { name: 'Hadeer', email: 'hadeer@ew-tc.com' },
  { name: 'Bakr', email: 'bakr@ew-tc.com' },
  { name: 'Asmaa', email: 'asmaa@ew-tc.com' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const user = MOCK_USERS.find((u) => u.email === selectedUser);
    if (!user) {
      setError('Please select a user');
      setLoading(false);
      return;
    }

    try {
      await login(user.email, pin);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid PIN or login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            EW-TC Team ACTV
          </h1>
          <p className="text-slate-600">Campaign Operations Hub</p>
        </div>

        <div className="space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Your Account
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => {
                    setSelectedUser(user.email);
                    setPin('');
                    setError('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedUser === user.email
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-600 truncate">
                    {user.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PIN Input */}
          {selectedUser && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Enter Your 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="0000"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setError('');
                }}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedUser || pin.length < 4 || loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              !selectedUser || pin.length < 4 || loading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            PINs are available from an administrator only.
          </p>
        </div>
      </div>
    </div>
  );
}
