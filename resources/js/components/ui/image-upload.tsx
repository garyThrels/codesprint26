import * as React from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value?: string | string[];
    onChange: (value: File | File[] | null) => void;
    multiple?: boolean;
    className?: string;
    onRemove?: (url: string) => void;
}

export function ImageUpload({ 
    value, 
    onChange, 
    multiple = false, 
    className,
    onRemove 
}: ImageUploadProps) {
    const [previews, setPreviews] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (value) {
            setPreviews(Array.isArray(value) ? value : [value]);
        } else {
            setPreviews([]);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        
        // Update previews for local display
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        if (multiple) {
            setPreviews(prev => [...prev, ...newPreviews]);
            onChange(fileArray);
        } else {
            setPreviews(newPreviews);
            onChange(fileArray[0]);
        }
    };

    const removeImage = (index: number) => {
        const newPreviews = [...previews];
        const removedUrl = newPreviews.splice(index, 1)[0];
        setPreviews(newPreviews);
        
        if (onRemove) {
            onRemove(removedUrl);
        }
        
        // Reset input if all cleared
        if (newPreviews.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("grid gap-4", className)}>
            <div className="flex flex-wrap gap-4">
                {previews.map((url, index) => (
                    <div key={index} className="relative aspect-square w-24 overflow-hidden rounded-md border bg-muted">
                        <img 
                            src={url} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                
                {(multiple || previews.length === 0) && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <Upload className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Upload</span>
                    </button>
                )}
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple={multiple}
                className="hidden"
            />
        </div>
    );
}
