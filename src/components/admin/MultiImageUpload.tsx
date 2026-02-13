"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { X } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
    values: string[];
    onChange: (urls: string[]) => void;
    folder?: string;
}

export default function MultiImageUpload({ values = [], onChange, folder = "products" }: MultiImageUploadProps) {
    // Helper to add a new image
    const handleAdd = (url: string) => {
        onChange([...values, url]);
    };

    // Helper to remove an image
    const handleRemove = (index: number) => {
        const newValues = [...values];
        newValues.splice(index, 1);
        onChange(newValues);
    };

    return (
        <div className="space-y-4">
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {values.map((url, index) => (
                    <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                        <Image src={url} alt="Product Image" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Uploader for New Images */}
            <div>
                <label className="block text-xs font-mono uppercase mb-2 text-gray-500">
                    Add Image {values.length > 0 ? `(${values.length} uploaded)` : "(Required)"}
                </label>
                <ImageUpload
                    value="" // Always empty to allow new uploads
                    onChange={(url) => {
                        if (url) handleAdd(url);
                    }}
                    folder={folder}
                />
                <p className="text-xs text-gray-400 mt-2">
                    Upload 4 or more images for best results.
                </p>
            </div>
        </div>
    );
}
