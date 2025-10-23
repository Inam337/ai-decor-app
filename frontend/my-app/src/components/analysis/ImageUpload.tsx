interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ImageUpload({ 
  onImageUpload, 
  onDrop, 
  onDragOver, 
  fileInputRef 
}: ImageUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Space</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Upload a photo of your space to get started with AI analysis
      </p>
      
      <div className="max-w-2xl mx-auto">
        <div
          className="border-3 border-dashed border-gray-300 rounded-3xl p-12 text-center transition-all duration-300 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 font-medium text-lg mb-2">Drop your room photo here</p>
              <p className="text-gray-500 mb-6">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                Choose Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
