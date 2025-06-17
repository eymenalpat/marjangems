'use client';

import { useState, useEffect, useMemo } from 'react';
import { stones as defaultStones } from '../data/stones';
import { Stone } from '../types/stone';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [stones, setStones] = useState<Stone[]>(defaultStones);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minCarat, setMinCarat] = useState<number>(0);
  const [maxCarat, setMaxCarat] = useState<number>(10);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  useEffect(() => {
    fetchStones();
  }, []);

  const fetchStones = async () => {
    try {
      const { data, error } = await supabase
        .from('stones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setStones(data);
      }
    } catch (error) {
      console.error('Error fetching stones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme seçeneklerini dinamik olarak oluştur
  const filterOptions = useMemo(() => {
    const filteredStones = stones.filter(stone => 
      selectedCategory === 'all' || stone.type === selectedCategory
    );

    const colors = Array.from(new Set(filteredStones.map(stone => stone.color)));
    const origins = Array.from(new Set(filteredStones.map(stone => stone.origin)));

    return { colors, origins };
  }, [selectedCategory]);

  const filteredStones = stones.filter((stone) => {
    const categoryMatch = selectedCategory === 'all' || stone.type === selectedCategory;
    const caratMatch = stone.carat >= minCarat && stone.carat <= maxCarat;
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(stone.color);
    const originMatch = selectedOrigins.length === 0 || selectedOrigins.includes(stone.origin);

    return categoryMatch && caratMatch && colorMatch && originMatch;
  });

  // Kategori değiştiğinde diğer filtreleri sıfırla
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedColors([]);
    setSelectedOrigins([]);
  };

  // Checkbox değişikliklerini yönet
  const handleCheckboxChange = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Değerli Taşlar Koleksiyonu",
            "description": "Elmas, yakut, safir, zümrüt gibi değerli taşların satışı",
            "numberOfItems": filteredStones.length,
            "itemListElement": filteredStones.map((stone, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": stone.name,
                "description": stone.description,
                "category": stone.type,
                "brand": {
                  "@type": "Brand",
                  "name": "Marjan Gems"
                },
                "offers": {
                  "@type": "Offer",
                  "price": stone.price,
                  "priceCurrency": "TRY",
                  "availability": "https://schema.org/InStock"
                },
                "image": stone.image_url || getStoneImage(stone.type),
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
              }
            }))
          })
        }}
      />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <header>
            <h1 className="text-4xl font-bold text-center mb-8">Değerli Taşlar Koleksiyonu</h1>
            <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
              Elmas, yakut, safir, zümrüt gibi değerli taşların en kaliteli örneklerini keşfedin. 
              Her taş özenle seçilmiş ve sertifikalıdır.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sol Sidebar - Kategoriler ve Filtreler */}
            <aside className="md:col-span-1 space-y-6">
              {/* Kategoriler */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
                <nav aria-label="Taş kategorileri">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                      aria-pressed={selectedCategory === 'all'}
                    >
                      Tüm Taşlar
                    </button>
                    <button
                      onClick={() => handleCategoryChange('Yakut')}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedCategory === 'Yakut'
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                      aria-pressed={selectedCategory === 'Yakut'}
                    >
                      Yakut
                    </button>
                    <button
                      onClick={() => handleCategoryChange('Safir')}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedCategory === 'Safir'
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                      aria-pressed={selectedCategory === 'Safir'}
                    >
                      Safir
                    </button>
                    <button
                      onClick={() => handleCategoryChange('Zümrüt')}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedCategory === 'Zümrüt'
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                      aria-pressed={selectedCategory === 'Zümrüt'}
                    >
                      Zümrüt
                    </button>
                  </div>
                </nav>
              </section>

              {/* Karat Filtresi */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Karat Filtresi</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="minCarat" className="block text-sm font-medium mb-2">
                      Minimum Karat
                    </label>
                    <input
                      id="minCarat"
                      type="number"
                      className="w-full bg-gray-700 rounded-md p-2"
                      value={minCarat}
                      onChange={(e) => setMinCarat(Number(e.target.value))}
                      min="0"
                      step="0.1"
                      aria-describedby="minCaratHelp"
                    />
                    <div id="minCaratHelp" className="text-sm text-gray-400 mt-1">
                      Minimum karat değerini girin
                    </div>
                  </div>
                  <div>
                    <label htmlFor="maxCarat" className="block text-sm font-medium mb-2">
                      Maksimum Karat
                    </label>
                    <input
                      id="maxCarat"
                      type="number"
                      className="w-full bg-gray-700 rounded-md p-2"
                      value={maxCarat}
                      onChange={(e) => setMaxCarat(Number(e.target.value))}
                      min="0"
                      step="0.1"
                      aria-describedby="maxCaratHelp"
                    />
                    <div id="maxCaratHelp" className="text-sm text-gray-400 mt-1">
                      Maksimum karat değerini girin
                    </div>
                  </div>
                </form>
              </section>

              {/* Renk Filtresi */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Renk Filtresi</h2>
                <fieldset className="space-y-2 max-h-48 overflow-y-auto">
                  <legend className="sr-only">Renk seçenekleri</legend>
                  {filterOptions.colors.map((color) => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleCheckboxChange(color, selectedColors, setSelectedColors)}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-600 bg-gray-700"
                        aria-label={`${color} rengini seç`}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </fieldset>
              </section>

              {/* Menşei Filtresi */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Menşei Filtresi</h2>
                <fieldset className="space-y-2 max-h-48 overflow-y-auto">
                  <legend className="sr-only">Menşei seçenekleri</legend>
                  {filterOptions.origins.map((origin) => (
                    <label key={origin} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(origin)}
                        onChange={() => handleCheckboxChange(origin, selectedOrigins, setSelectedOrigins)}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-600 bg-gray-700"
                        aria-label={`${origin} menşeini seç`}
                      />
                      <span>{origin}</span>
                    </label>
                  ))}
                </fieldset>
              </section>
            </aside>

            {/* Sağ Taraf - Taş Listesi */}
            <section className="md:col-span-3" aria-label="Taş listesi">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-lg">Taşlar yükleniyor...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStones.map((stone) => (
                    <article key={stone.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <Link href={`/stone/${stone.id}`} className="block">
                        <div className="relative h-48">
                          <Image
                            src={stone.image_url || getStoneImage(stone.type)}
                            alt={`${stone.name} - ${stone.type} taşı`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            priority={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{stone.type}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{stone.name}</h3>
                          <dl className="space-y-2 text-gray-300">
                            <div>
                              <dt className="inline font-medium">Karat:</dt>
                              <dd className="inline ml-1">{stone.carat}</dd>
                            </div>
                            <div>
                              <dt className="inline font-medium">Renk:</dt>
                              <dd className="inline ml-1">{stone.color}</dd>
                            </div>
                            <div>
                              <dt className="inline font-medium">Menşei:</dt>
                              <dd className="inline ml-1">{stone.origin}</dd>
                            </div>
                            <div>
                              <dt className="inline font-medium">Berraklık:</dt>
                              <dd className="inline ml-1">{stone.clarity}</dd>
                            </div>
                            <div>
                              <dt className="text-lg font-semibold text-emerald-400">
                                {stone.price.toLocaleString('tr-TR')} TL
                              </dt>
                            </div>
                          </dl>
                          <p className="mt-4 text-gray-400 line-clamp-3">{stone.description}</p>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              )}
              
              {!loading && filteredStones.length === 0 && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">Sonuç bulunamadı</h2>
                  <p className="text-gray-400">Seçtiğiniz kriterlere uygun taş bulunamadı.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
