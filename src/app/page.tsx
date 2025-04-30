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
  const [selectedClarity, setSelectedClarity] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minCarat, setMinCarat] = useState<number>(0);
  const [maxCarat, setMaxCarat] = useState<number>(10);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedClarities, setSelectedClarities] = useState<string[]>([]);

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
    const clarities = Array.from(new Set(filteredStones.map(stone => stone.clarity)));

    return { colors, origins, clarities };
  }, [selectedCategory]);

  const filteredStones = stones.filter((stone) => {
    const categoryMatch = selectedCategory === 'all' || stone.type === selectedCategory;
    const caratMatch = stone.carat >= minCarat && stone.carat <= maxCarat;
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(stone.color);
    const originMatch = selectedOrigins.length === 0 || selectedOrigins.includes(stone.origin);
    const clarityMatch = selectedClarities.length === 0 || selectedClarities.includes(stone.clarity);

    return categoryMatch && caratMatch && colorMatch && originMatch && clarityMatch;
  });

  // Kategori değiştiğinde diğer filtreleri sıfırla
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedColors([]);
    setSelectedOrigins([]);
    setSelectedClarities([]);
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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Değerli Taşlar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sol Sidebar - Kategoriler ve Filtreler */}
          <div className="md:col-span-1 space-y-6">
            {/* Kategoriler */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-gray-700'
                  }`}
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
                >
                  Zümrüt
                </button>
              </div>
            </div>

            {/* Karat Filtresi */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Karat Filtresi</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Karat</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 rounded-md p-2"
                    value={minCarat}
                    onChange={(e) => setMinCarat(Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maksimum Karat</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 rounded-md p-2"
                    value={maxCarat}
                    onChange={(e) => setMaxCarat(Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Renk Filtresi */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Renk Filtresi</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.colors.map((color) => (
                  <label key={color} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleCheckboxChange(color, selectedColors, setSelectedColors)}
                      className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-600 bg-gray-700"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Menşei Filtresi */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Menşei Filtresi</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.origins.map((origin) => (
                  <label key={origin} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOrigins.includes(origin)}
                      onChange={() => handleCheckboxChange(origin, selectedOrigins, setSelectedOrigins)}
                      className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-600 bg-gray-700"
                    />
                    <span>{origin}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Berraklık Filtresi */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Berraklık Filtresi</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.clarities.map((clarity) => (
                  <label key={clarity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedClarities.includes(clarity)}
                      onChange={() => handleCheckboxChange(clarity, selectedClarities, setSelectedClarities)}
                      className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-600 bg-gray-700"
                    />
                    <span>{clarity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Taş Listesi */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStones.map((stone) => (
                <Link href={`/stone/${stone.id}`} key={stone.id}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <Image
                        src={getStoneImage(stone.type)}
                        alt={stone.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{stone.type}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{stone.name}</h3>
                      <div className="space-y-2 text-gray-300">
                        <p>Karat: {stone.carat}</p>
                        <p>Renk: {stone.color}</p>
                        <p>Menşei: {stone.origin}</p>
                        <p>Berraklık: {stone.clarity}</p>
                        <p className="text-lg font-semibold text-emerald-400">{stone.price.toLocaleString('tr-TR')} TL</p>
                      </div>
                      <p className="mt-4 text-gray-400">{stone.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
