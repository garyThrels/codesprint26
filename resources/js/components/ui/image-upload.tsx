import * as React from "react";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string | string[] | null;
    onChange: (value: File | File[] | null) => void;
    multiple?: boolean;
    className?: string;
    onRemove?: (url: string) => void;
    maxSize?: number; // in MB
    maxFiles?: number;
}

export function ImageUpload({ 
    value, 
    onChange, 
    multiple = false, 
    className,
    onRemove,
    maxSize = 2,
    maxFiles = 4
}: ImageUploadProps) {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Clean up object URLs to avoid memory leaks
    React.useEffect(() => {
        return () => {
            filePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [filePreviews]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        
        // Validation
        const existingUrlsCount = Array.isArray(value) ? value.length : (value ? 1 : 0);
        if (multiple && existingUrlsCount + selectedFiles.length + fileArray.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} images allowed.`);
            return;
        }

        const validFiles: File[] = [];
        for (const file of fileArray) {
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max size is ${maxSize}MB.`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));

        if (multiple) {
            const updatedFiles = [...selectedFiles, ...validFiles];
            const updatedPreviews = [...filePreviews, ...newPreviews];
            setSelectedFiles(updatedFiles);
            setFilePreviews(updatedPreviews);
            onChange(updatedFiles);
        } else {
            filePreviews.forEach(url => URL.revokeObjectURL(url));
            setSelectedFiles(validFiles);
            setFilePreviews(newPreviews);
            onChange(validFiles[0]);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = [...selectedFiles];
        const updatedPreviews = [...filePreviews];
        
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        
        setSelectedFiles(updatedFiles);
        setFilePreviews(updatedPreviews);
        
        if (multiple) {
            onChange(updatedFiles);
        } else {
            onChange(null);
        }
    };

    const existingUrls = React.useMemo(() => {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    }, [value]);

    return (
        <div className={cn("grid gap-4", className)}>
            <div className="flex flex-wrap gap-4">
                {/* Existing Images */}
                {existingUrls.map((url, index) => (
                    <div key={`existing-${index}`} className="relative aspect-square w-24 overflow-hidden rounded-md border bg-muted group">
                        <img 
                            src={url} 
                            alt="Existing" 
                            className="h-full w-full object-cover"
                        />
                        {onRemove && (
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90 flex justify-center items-center"
                            >
                                <X className="h-3 w-3 text-white stroke-2" />
                            </button>
                        )}
                    </div>
                ))}

                {/* New Previews */}
                {filePreviews.map((url, index) => (
                    <div key={`new-${index}`} className="relative aspect-square w-24 overflow-hidden rounded-md border bg-muted ring-2 ring-primary/20">
                        <img 
                            src={url} 
                            alt="New preview" 
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90 flex justify-center items-center"
                        >
                            <X className="h-3 w-3 text-white stroke-2" />
                        </button>
                    </div>
                ))}
                
                {(multiple || (existingUrls.length === 0 && filePreviews.length === 0)) && (
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
