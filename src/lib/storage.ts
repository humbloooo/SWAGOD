export async function uploadImage(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        return data.url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
