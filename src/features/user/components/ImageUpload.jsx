import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }

      const newImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      onImagesChange([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5242880, // 5MB
    multiple: true,
  });

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-brand-green bg-brand-green/5"
            : "border-gray-300 hover:border-brand-green hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-brand-green" />
          </div>
          {isDragActive ? (
            <p className="text-brand-green font-medium">
              Drop the images here...
            </p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Upload up to {maxImages} images (JPEG, PNG, WebP - Max 5MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Previews */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />

                {/* Cover Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-brand-green text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Cover
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {images.length} / {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
