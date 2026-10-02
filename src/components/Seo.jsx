import { Helmet } from "react-helmet-async";

const SITE_NAME = "Travelion Adventures";
const DEFAULT_TITLE = "Travelion Adventures — Himalayan Treks & Tours in Nepal";
const DEFAULT_DESCRIPTION =
    "Curated Himalayan treks, tours, and adventures in Nepal. Small groups, expert local guides, and unforgettable journeys from Everest Base Camp to Annapurna.";
const DEFAULT_IMAGE =
    "https://res.cloudinary.com/travellion/image/upload/v1/trektravel/og-default.jpg";
const SITE_URL = "https://travelionadventures.com";

export default function Seo({
    title,
    description,
    image,
    url,
    type = "website",
    noindex = false,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const metaImage = image || DEFAULT_IMAGE;
    const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* OpenGraph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Canonical */}
            <link rel="canonical" href={metaUrl} />
        </Helmet>
    );
}