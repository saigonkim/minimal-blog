'use client';

import React, { useState } from 'react';

interface LoginFormProps {
  adminPassword?: string;
}

export default function LoginForm({ adminPassword }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 심플한 프론트엔드/쿠키 기반 모크 인증
    if (password === (adminPassword || 'admin123')) {
      document.cookie = `admin_token=${password}; path=/; max-age=86400; SameSite=Strict`;
      window.location.reload();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#18181b] rounded-2xl border border-neutral-800 shadow-md transition-all">
        <div className="flex flex-col gap-2 text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-50">
            가상 관리자 인증
          </h1>
          <p className="text-sm text-neutral-400">
            MinimaLog 글 관리를 위해 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-[#09090b]/50 text-neutral-50 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            인증하기
          </button>
        </form>
        
        <p className="text-center text-xs text-neutral-500 mt-6">
          기본 비밀번호는 `admin123`입니다.
        </p>
      </div>
    </div>
  );
}
