'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewStone() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    carat: '',
    color: '',
    origin: '',
    clarity: '',
    description: '',
    price: '',
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Önce resmi yükle
      let imageUrl = '';
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('stones')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('stones')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Taş bilgilerini kaydet
      const { error: insertError } = await supabase
        .from('stones')
        .insert([
          {
            name: formData.name,
            type: formData.type,
            carat: parseFloat(formData.carat),
            color: formData.color,
            origin: formData.origin,
            clarity: formData.clarity,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: imageUrl,
          },
        ]);

      if (insertError) throw insertError;

      router.push('/admin/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Yeni Taş Ekle</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Taş Adı</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tip</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            >
              <option value="">Seçiniz</option>
              <option value="Elmas">Elmas</option>
              <option value="Yakut">Yakut</option>
              <option value="Safir">Safir</option>
              <option value="Zümrüt">Zümrüt</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Karat</label>
            <input
              type="number"
              name="carat"
              value={formData.carat}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Renk</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Menşei</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Berraklık</label>
            <input
              type="text"
              name="clarity"
              value={formData.clarity}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fiyat (TL)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Resim</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 