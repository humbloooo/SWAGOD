"use client";

import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/storage";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "uploads" }: ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = async (file: File) => {
        setIsLoading(true);
        try {
            // Create a unique path: folder/timestamp_filename
            const path = `${folder}/${Date.now()}_${file.name}`;
            const url = await uploadImage(file, path);
            onChange(url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    if (value) {
        return (
            <div className="relative aspect-square w-full max-w-[200px] border border-gray-200 rounded-lg overflow-hidden group">
                <Image src={value} alt="Uploaded" fill className="object-cover" />
                <button
                    onClick={() => onChange("")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`
                relative w-full max-w-[400px] h-[200px] 
                border-2 border-dashed rounded-lg flex flex-col items-center justify-center 
                transition-colors cursor-pointer
                ${isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-black"}
                ${isLoading ? "opacity-50 pointer-events-none" : ""}
            `}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {isLoading ? (
                <Loader2 className="animate-spin text-gray-500" size={32} />
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <Upload className="mb-2" size={32} />
                    <p className="font-mono text-sm uppercase font-bold">Drag & Drop or Click</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                </div>
            )}
        </div>
    );
}
