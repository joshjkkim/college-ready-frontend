import React from "react";
import { Helmet } from "react-helmet";

const SEO = () => (
  <Helmet>
    {/* Page Title & Meta Description */}
    <title>
      College Ready - The Ultimate College Organizer & Application Tracker
    </title>
    <meta
      name="description"
      content="College Ready is your one-stop platform to organize college information, track application deadlines, explore majors, and get inspired by essay examples. Perfect for high school students preparing for college applications."
    />
    <link rel="canonical" href="https://www.collegeready.me/" />
    {/* Open Graph / Facebook Meta Tags */}
    <meta property="og:title" content="College Ready - The Ultimate College Organizer & Application Tracker" />
    <meta
      property="og:description"
      content="Discover College Ready – a comprehensive platform that helps you organize college information, manage deadlines, and plan your college applications effectively."
    />
    <meta property="og:url" content="https://www.collegeready.me/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://www.collegeready.me/og-image.jpg" />

    {/* Twitter Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="College Ready - The Ultimate College Organizer & Application Tracker" />
    <meta
      name="twitter:description"
      content="College Ready helps high school students organize college info, track deadlines, and discover majors with ease."
    />
    <meta name="twitter:image" content="https://www.collegeready.me/og-image.jpg" />

    {/* Structured Data using JSON-LD */}
    <script type="application/ld+json">
      {`
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "College Ready",
        "url": "https://www.collegeready.me/",
        "image": "https://www.collegeready.me/icon.png",
        "description": "College Ready is an all-in-one college organizer and application tracker designed to help high school students prepare for college by managing deadlines, exploring majors, and accessing essay examples.",
        "applicationCategory": "EducationApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Joshua Kim"
        }
      }
      `}
    </script>
  </Helmet>
);

export default SEO;
