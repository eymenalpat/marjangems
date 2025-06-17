'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Yükleniyor...</h1>
          </div>
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
            <p className="text-gray-400 mb-4">Aradığınız taş mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStoneImage = (type: string) => {
    switch (type) {
      case 'Yakut':
        return '/images/yakut.png';
      case 'Safir':
        return '/images/safir.png';
      case 'Zümrüt':
        return '/images/zumrut.png';
      default:
        return '/images/default.png';
    }
  };

  return (
    <>
      <Head>
        <title>{`${stone.name} - ${stone.type} Taşı | Marjan Gems`}</title>
        <meta name="description" content={`${stone.name} - ${stone.type} taşı. ${stone.carat} karat, ${stone.color} renk, ${stone.origin} menşeli. ${stone.price.toLocaleString('tr-TR')} TL.`} />
        <meta name="keywords" content={`${stone.name}, ${stone.type}, değerli taş, ${stone.color}, ${stone.origin}, ${stone.carat} karat`} />
        <meta property="og:title" content={`${stone.name} - ${stone.type} Taşı`} />
        <meta property="og:description" content={`${stone.name} - ${stone.type} taşı. ${stone.carat} karat, ${stone.color} renk.`} />
        <meta property="og:image" content={stone.image_url || getStoneImage(stone.type)} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={stone.price.toString()} />
        <meta property="product:price:currency" content="TRY" />
        <link rel="canonical" href={`https://marjangems.vercel.app/stone/${stone.id}`} />
      </Head>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": stone.name,
            "description": stone.description,
            "image": stone.image_url || getStoneImage(stone.type),
            "brand": {
              "@type": "Brand",
              "name": "Marjan Gems"
            },
            "category": stone.type,
            "offers": {
              "@type": "Offer",
              "price": stone.price,
              "priceCurrency": "TRY",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Marjan Gems"
              }
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Karat",
                "value": stone.carat
              },
              {
                "@type": "PropertyValue",
                "name": "Renk",
                "value": stone.color
              },
              {
                "@type": "PropertyValue",
                "name": "Menşei",
                "value": stone.origin
              },
              {
                "@type": "PropertyValue",
                "name": "Berraklık",
                "value": stone.clarity
              }
            ]
          })
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href={`/?category=${stone.type}`} className="text-emerald-400 hover:text-emerald-300">
                  {stone.type}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-300" aria-current="page">
                {stone.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Sol Taraf - Taş Görseli */}
            <section className="relative h-[600px] rounded-lg overflow-hidden">
              <Image
                src={stone.image_url || getStoneImage(stone.type)}
                alt={`${stone.name} - ${stone.type} taşı görseli`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
              />
            </section>

            {/* Sağ Taraf - Taş Detayları */}
            <section className="space-y-8">
              <header>
                <h1 className="text-4xl font-bold mb-2">{stone.name}</h1>
                <p className="text-2xl text-emerald-400">{stone.price.toLocaleString('tr-TR')} TL</p>
              </header>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Taş Özellikleri</h2>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-gray-400 font-medium">Tip</dt>
                      <dd className="text-lg">{stone.type}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Karat</dt>
                      <dd className="text-lg">{stone.carat}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Renk</dt>
                      <dd className="text-lg">{stone.color}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Menşei</dt>
                      <dd className="text-lg">{stone.origin}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Berraklık</dt>
                      <dd className="text-lg">{stone.clarity}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Açıklama</h2>
                  <p className="text-gray-300 leading-relaxed">{stone.description}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-gray-400 font-medium">Telefon</dt>
                      <dd>
                        <a 
                          href="tel:+905555555555" 
                          className="text-emerald-400 hover:text-emerald-300"
                          aria-label="Bizi arayın: +90 555 555 55 55"
                        >
                          +90 555 555 55 55
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">E-posta</dt>
                      <dd>
                        <a 
                          href="mailto:info@marjangems.com" 
                          className="text-emerald-400 hover:text-emerald-300"
                          aria-label="Bize e-posta gönderin: info@marjangems.com"
                        >
                          info@marjangems.com
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Adres</dt>
                      <dd>İstanbul, Türkiye</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 font-medium">Çalışma Saatleri</dt>
                      <dd>Hafta içi 09:00 - 18:00</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Satın Alma</h2>
                  <p className="text-gray-300 mb-4">
                    Bu taşı satın almak veya hakkında daha fazla bilgi almak için bizimle iletişime geçin.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+905555555555"
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-center hover:bg-emerald-700 transition-colors"
                      aria-label="Hemen arayın"
                    >
                      Hemen Ara
                    </a>
                    <a
                      href="mailto:info@marjangems.com"
                      className="bg-gray-700 text-white px-6 py-3 rounded-lg text-center hover:bg-gray-600 transition-colors"
                      aria-label="E-posta gönder"
                    >
                      E-posta Gönder
                    </a>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
} 