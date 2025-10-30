'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || t('login.errorGeneric'));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-white">
      {/* Animated gradient background (matches landing) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-indigo-400/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-violet-400/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] bg-purple-400/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-gray-100">
          {/* Brand */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-base font-bold">K</span>
                </div>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Koopi</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="mt-1 text-sm text-gray-600">{t('login.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label={t('login.email')}
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              type="password"
              label={t('login.password')}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <span>{t('login.rememberMe')}</span>
              </label>
              <a href="#" className="text-indigo-600 hover:underline">
                {t('login.forgotPassword')}
              </a>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              {loading ? t('login.signingIn') : t('login.signIn')}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-500">{t('login.orContinueWith')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              className="w-full text-sm"
              onClick={() => handleSocialLogin('google')}
              type="button"
            >
              {t('login.google')}
            </Button>
            <Button 
              variant="secondary" 
              className="w-full text-sm"
              onClick={() => handleSocialLogin('github')}
              type="button"
            >
              {t('login.github')}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t('login.noAccount')} {' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
              {t('login.createOne')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
