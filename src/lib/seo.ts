import { Metadata } from "next";

export function constructMetadata({
    title = "SWAGOD | Return to the Future",
    description = "Premium streetwear collections designed for the bleeding edge. Timeless aesthetics, modern reality.",
    image = "/assets/placeholder.png",
    noIndex = false,
    path = ""
}: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    path?: string;
} = {}): Metadata {
    const baseUrl = 'https://swagod.co.za';
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image }]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@swagod"
        },
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `${baseUrl}${path}`,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false
            }
        })
    };
}
