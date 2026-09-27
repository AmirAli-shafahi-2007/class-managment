import { Helmet } from "react-helmet-async";

export default function SEOHead({ title, description, keywords, ogImage, canonical }) {
  const siteName = "سیستم مدیریت آموزشی";
  const baseUrl = "https://your-site.com";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical || baseUrl} />
      <html lang="fa" dir="rtl" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || `${baseUrl}/og-image.png`} />
      <meta property="og:url" content={canonical || baseUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fa_IR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${baseUrl}/og-image.png`} />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0f172a" />
    </Helmet>
  );
}