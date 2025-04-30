'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function StoneDetail() {
  const params = useParams();
  const [stone, setStone] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStone();
  }, [params.id]);

  const fetchStone = async () => {
    try {
      const { data, error } = await supabase
        .from('stones')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setStone(data);
    } catch (error) {
      console.error('Error fetching stone:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!stone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Taş bulunamadı</h1>
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">
          ← Ana Sayfaya Dön
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Sol Taraf - Taş Görseli */}
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <Image
              src={stone.image_url || '/diamond.jpg'}
              alt={stone.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Sağ Taraf - Taş Detayları */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{stone.name}</h1>
              <p className="text-2xl text-emerald-400">{stone.price.toLocaleString('tr-TR')} TL</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Taş Özellikleri</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Tip</p>
                    <p>{stone.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Karat</p>
                    <p>{stone.carat}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Renk</p>
                    <p>{stone.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Menşei</p>
                    <p>{stone.origin}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Berraklık</p>
                    <p>{stone.clarity}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Açıklama</h2>
                <p className="text-gray-300">{stone.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">İletişim</h2>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-400">Telefon:</span>{' '}
                    <a href="tel:+905555555555" className="text-emerald-400 hover:text-emerald-300">
                      +90 555 555 55 55
                    </a>
                  </p>
                  <p>
                    <span className="text-gray-400">E-posta:</span>{' '}
                    <a href="mailto:info@marjangems.com" className="text-emerald-400 hover:text-emerald-300">
                      info@marjangems.com
                    </a>
                  </p>
                  <p>
                    <span className="text-gray-400">Adres:</span> İstanbul, Türkiye
                  </p>
                  <p>
                    <span className="text-gray-400">Çalışma Saatleri:</span> Hafta içi 09:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 