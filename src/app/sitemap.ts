import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ana sayfa
  const baseUrl = 'https://marjangems.vercel.app'
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    // Taş sayfalarını al
    const { data: stones } = await supabase
      .from('stones')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    if (stones) {
      const stoneUrls: MetadataRoute.Sitemap = stones.map((stone) => ({
        url: `${baseUrl}/stone/${stone.id}`,
        lastModified: new Date(stone.updated_at || stone.id),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

      routes.push(...stoneUrls)
    }
  } catch (error) {
    console.error('Error fetching stones for sitemap:', error)
  }

  return routes
} 