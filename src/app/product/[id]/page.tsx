import { getProducts } from "@/lib/db";
import ProductClient from "./ProductClient";
import { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const products = await getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
        return {
            title: "Product Not Found | SWAGOD",
        };
    }

    return {
        title: `${product.title} | SWAGOD ARCHIVE`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.image, ...(product.images || [])],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;

    return <ProductClient id={id} />;
}
