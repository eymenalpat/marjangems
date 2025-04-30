'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stones, setStones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchStones();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  };

  const fetchStones = async () => {
    try {
      const { data, error } = await supabase
        .from('stones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStones(data || []);
    } catch (error) {
      console.error('Error fetching stones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Marjan Gems Admin</h1>
          <div className="space-x-4">
            <Link
              href="/admin/stones/new"
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Yeni Taş Ekle
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Taşlar</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">İsim</th>
                    <th className="p-4">Tip</th>
                    <th className="p-4">Karat</th>
                    <th className="p-4">Fiyat</th>
                    <th className="p-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {stones.map((stone) => (
                    <tr key={stone.id} className="border-t border-gray-700">
                      <td className="p-4">{stone.name}</td>
                      <td className="p-4">{stone.type}</td>
                      <td className="p-4">{stone.carat}</td>
                      <td className="p-4">{stone.price.toLocaleString('tr-TR')} TL</td>
                      <td className="p-4">
                        <div className="space-x-2">
                          <Link
                            href={`/admin/stones/${stone.id}/edit`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Düzenle
                          </Link>
                          <button
                            onClick={async () => {
                              if (confirm('Bu taşı silmek istediğinizden emin misiniz?')) {
                                const { error } = await supabase
                                  .from('stones')
                                  .delete()
                                  .eq('id', stone.id);
                                if (!error) {
                                  fetchStones();
                                }
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 