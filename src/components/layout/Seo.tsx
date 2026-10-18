import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  keywords?: string[];
  schemaData?: object | object[];
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export default function Seo({ 
  title, 
  description, 
  canonical, 
  ogType = 'website', 
  ogImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', 
  publishedTime,
  modifiedTime,
  authorName = 'Nayem Hasan (wondercave.nayem.net)',
  keywords = [
    'cybersecurity training',
    'web application security',
    'penetration testing sandbox',
    'OWASP Top 10 vulnerabilities',
    'SQL injection labs',
    'cross-site scripting prevention',
    'server-side request forgery',
    'Nayem Hasan',
    'WonderCave',
    'wondercave.nayem.net'
  ],
  schemaData,
  breadcrumbs
}: SeoProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wondercave.nayem.net';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentUrl = canonical || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://wondercave.nayem.net');

  const displayTitle = title.includes('WonderCave') ? title : `${title} — WonderCave`;

  // Standard Organization & WebSite JSON-LD
  const baseSchemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WonderCave",
      "alternateName": "WonderCave Security",
      "url": "https://wondercave.nayem.net",
      "description": "Commercial-grade technology solutions and cybersecurity training portal for WonderCave. Created by Nayem Hasan.",
      "publisher": {
        "@type": "Organization",
        "name": "WonderCave",
        "url": "https://wondercave.nayem.net",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
        },
        "founder": {
          "@type": "Person",
          "name": "Nayem Hasan",
          "url": "https://wondercave.nayem.net",
          "jobTitle": "Lead Cybersecurity Architect & Founder"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/posts?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WonderCave",
      "url": "https://wondercave.nayem.net",
      "founder": {
        "@type": "Person",
        "name": "Nayem Hasan",
        "url": "https://wondercave.nayem.net"
      },
      "sameAs": [
        "https://wondercave.nayem.net",
        "https://twitter.com/wondercave",
        "https://github.com/wondercave"
      ]
    }
  ];

  // Breadcrumbs Schema if provided or path exists
  if (breadcrumbs && breadcrumbs.length > 0) {
    baseSchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((bc, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": bc.name,
        "item": bc.item.startsWith('http') ? bc.item : `${siteUrl}${bc.item}`
      }))
    });
  } else if (pathname && pathname !== '/') {
    const parts = pathname.split('/').filter(Boolean);
    const generatedBreadcrumbs = [
      { name: "Home", item: siteUrl }
    ];
    let cumulative = '';
    parts.forEach(p => {
      cumulative += `/${p}`;
      generatedBreadcrumbs.push({
        name: p.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        item: `${siteUrl}${cumulative}`
      });
    });
    baseSchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": generatedBreadcrumbs.map((bc, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": bc.name,
        "item": bc.item
      }))
    });
  }

  // Article / Educational WebPage Schema
  if (ogType === 'article') {
    baseSchemas.push({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": title,
      "description": description,
      "image": ogImage,
      "datePublished": publishedTime || "2026-01-01T00:00:00Z",
      "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": authorName,
        "url": "https://wondercave.nayem.net"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WonderCave",
        "url": "https://wondercave.nayem.net",
        "founder": {
          "@type": "Person",
          "name": "Nayem Hasan"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      }
    });
  }

  // Additional custom schema
  if (schemaData) {
    if (Array.isArray(schemaData)) {
      baseSchemas.push(...schemaData);
    } else {
      baseSchemas.push(schemaData);
    }
  }

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="title" content={displayTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={currentUrl} />

      {/* Author & Attribution Metadata (site made by nayem.net) */}
      <meta name="author" content={authorName} />
      <meta name="creator" content="Nayem Hasan" />
      <meta name="publisher" content="WonderCave (wondercave.nayem.net)" />
      <meta name="copyright" content="WonderCave by Nayem Hasan (wondercave.nayem.net)" />
      <meta name="application-name" content="WonderCave" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="WonderCave" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content="https://wondercave.nayem.net" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wondercave" />
      <meta name="twitter:creator" content="@nayem" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {baseSchemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
