import { Product, TourEvent } from "./types";

export type { Product };

export const PRODUCTS: Product[] = [
    {
        id: "1",
        title: "GIRL / SHIRT / 01",
        price: 45.00,
        image: "/assets/Clothes/girl wearing swagod shirt.jpg",
        category: "female",
        subCategory: "shirts",
        description: "Heavyweight cotton tee with brutalist print. Oversized fit.",
    },
    {
        id: "2",
        title: "GIRL / CUP / 01",
        price: 25.00,
        image: "/assets/People/girl holding swagod cup.jpg",
        category: "merch",
        subCategory: "accessories",
        description: "Ceramic mug with SWAGOD logo. Matte finish.",
    },
    {
        id: "3",
        title: "GUY / SHIRT / 01",
        price: 45.00,
        image: "/assets/Clothes/guy wearing swagod shirt.jpg",
        category: "male",
        subCategory: "shirts",
        description: "Men's heavyweight tee. Boxy fit. 100% cotton.",
    },
    {
        id: "4",
        title: "GIRL / SHIRT / 02",
        price: 45.00,
        image: "/assets/Clothes/girl wearing swagod shirt11.jpg",
        category: "female",
        subCategory: "shirts",
        description: "Variant 02 of our signature tee collection.",
    },
    {
        id: "5",
        title: "GIRL / CUP / 02",
        price: 25.00,
        image: "/assets/People/girl holding swagod cup11.jpg",
        category: "merch",
        subCategory: "accessories",
        description: "Limited edition cup design.",
    },
    {
        id: "6",
        title: "GIRL / SHIRT / 03",
        price: 45.00,
        image: "/assets/Clothes/girl wearing swagod shirt111.jpg",
        category: "female",
        subCategory: "shirts",
        description: "The classic logo tee in a new cut.",
    },
    {
        id: "7",
        title: "GIRL / SHIRT / 04",
        price: 45.00,
        image: "/assets/Clothes/girl wearing swagod shirt1111.jpg",
        category: "female",
        subCategory: "shirts",
        description: "Extended graphics on back.",
    },
];

export const TOURS: TourEvent[] = [
    { id: "t1", date: "2026-06-12", city: "Cape Town", venue: "The Gallery", soldOut: false },
    { id: "t2", date: "2026-07-20", city: "Johannesburg", venue: "Sector 7", soldOut: true },
    { id: "t3", date: "2026-08-15", city: "London", venue: "Dystopia Hall", ticketLink: "#" }
];

export const GALLERIES: Product[] = [
    { id: "a1", title: "PROTOTYPE-01", price: 120, image: "/assets/Clothes/guy wearing swagod shirt.jpg", category: "merch", description: "The first transmission." }
];
