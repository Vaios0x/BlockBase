/**
 * SEO optimization utilities for BlockBase
 * Advanced SEO management and optimization
 */

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SEOOptimizer {
  private static instance: SEOOptimizer
  private baseUrl: string
  private defaultImage: string

  constructor(baseUrl: string = 'https://blockbase.app', defaultImage: string = '/og-image.jpg') {
    this.baseUrl = baseUrl
    this.defaultImage = defaultImage
  }

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer()
    }
    return SEOOptimizer.instance
  }

  // Generate meta tags
  generateMetaTags(data: SEOData): Record<string, string> {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section,
      tags
    } = data

    const metaTags: Record<string, string> = {
      title: `${title} | BlockBase`,
      description,
      keywords: keywords.join(', '),
      'og:title': title,
      'og:description': description,
      'og:type': type,
      'og:url': url || this.baseUrl,
      'og:image': image || this.defaultImage,
      'og:site_name': 'BlockBase',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || this.defaultImage,
      'robots': 'index, follow',
      'canonical': url || this.baseUrl
    }

    if (publishedTime) {
      metaTags['article:published_time'] = publishedTime
    }

    if (modifiedTime) {
      metaTags['article:modified_time'] = modifiedTime
    }

    if (author) {
      metaTags['article:author'] = author
    }

    if (section) {
      metaTags['article:section'] = section
    }

    if (tags) {
      metaTags['article:tag'] = tags.join(', ')
    }

    return metaTags
  }

  // Generate structured data for properties
  generatePropertyStructuredData(property: any): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstate',
      name: property.name,
      description: property.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location,
        addressCountry: 'US'
      },
      geo: property.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng
      } : undefined,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.area,
        unitCode: 'MTK'
      },
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      amenityFeature: property.amenities?.map((amenity: string) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity
      })),
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'ETH',
        availability: property.isRented ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
      }
    }
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Generate organization structured data
  generateOrganizationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BlockBase',
      description: 'Decentralized property rental platform on blockchain',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/blockbase',
        'https://github.com/Vaios0x/BlockBase'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@blockbase.app'
      }
    }
  }

  // Generate sitemap data
  generateSitemapData(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`

    return sitemap
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Block common bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`
  }

  // Optimize images for SEO
  optimizeImageForSEO(imageUrl: string, alt: string, width?: number, height?: number): string {
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('f', 'auto')
    params.set('q', 'auto')

    return `${imageUrl}?${params.toString()}`
  }

  // Generate meta description
  generateMetaDescription(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text
    
    const truncated = text.substring(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  // Generate title tag
  generateTitleTag(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title
    
    const truncated = title.substring(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  // Check SEO score
  checkSEOScore(data: SEOData): { score: number; issues: string[] } {
    const issues: string[] = []
    let score = 100

    // Title length check
    if (data.title.length < 30) {
      issues.push('Title is too short (minimum 30 characters)')
      score -= 10
    } else if (data.title.length > 60) {
      issues.push('Title is too long (maximum 60 characters)')
      score -= 5
    }

    // Description length check
    if (data.description.length < 120) {
      issues.push('Description is too short (minimum 120 characters)')
      score -= 10
    } else if (data.description.length > 160) {
      issues.push('Description is too long (maximum 160 characters)')
      score -= 5
    }

    // Keywords check
    if (!data.keywords || data.keywords.length === 0) {
      issues.push('No keywords provided')
      score -= 15
    } else if (data.keywords.length > 10) {
      issues.push('Too many keywords (maximum 10 recommended)')
      score -= 5
    }

    // Image check
    if (!data.image) {
      issues.push('No image provided for social sharing')
      score -= 10
    }

    // URL check
    if (!data.url) {
      issues.push('No canonical URL provided')
      score -= 5
    }

    return { score: Math.max(0, score), issues }
  }
}

// Export singleton instance
export const seoOptimizer = SEOOptimizer.getInstance()

// React hook for SEO
export function useSEO(data: SEOData) {
  const metaTags = seoOptimizer.generateMetaTags(data)
  const seoScore = seoOptimizer.checkSEOScore(data)

  return {
    metaTags,
    seoScore,
    updateTitle: (title: string) => {
      document.title = seoOptimizer.generateTitleTag(title)
    },
    updateDescription: (description: string) => {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', seoOptimizer.generateMetaDescription(description))
      }
    }
  }
}
