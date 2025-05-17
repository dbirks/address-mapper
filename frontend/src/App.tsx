import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { AddressMap } from '@/components/address-map';
import { Toaster } from '@/components/ui/sonner';

interface AddressData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_name?: string;
  error?: string;
}

function App() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadStart = () => {
    setIsLoading(true);
  };

  const handleAddressesExtracted = (results: AddressData[]) => {
    setAddresses(results);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Address Mapper</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a picture of any form containing addresses. We'll extract the addresses and plot them on a map.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageUpload 
              onImageUploaded={handleAddressesExtracted} 
              onUploadStart={handleUploadStart} 
            />
          </div>
          <div>
            <AddressMap addresses={addresses} />
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-xl">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
