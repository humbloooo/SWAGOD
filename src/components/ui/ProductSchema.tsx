import { Product } from "@/lib/types";

export default function ProductSchema({ product }: { product: Product }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": "Premium SWAGOD streetwear.",
        "brand": {
            "@type": "Brand",
            "name": "SWAGOD"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://swagod.co.za/product/${product.id}`,
            "priceCurrency": "ZAR",
            "price": product.price,
            "availability": product.sizes && product.sizes.length > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
