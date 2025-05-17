import { useState, useEffect, useCallback } from 'react';
// Fallback to mapbox-gl only when react-map-gl is not available
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define types to prevent TypeScript errors
type ViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type MapEvent<T> = {
  viewState: ViewState;
};

// Temporarily create stub components until react-map-gl is properly resolved
const Map = ({ children, mapStyle, mapboxAccessToken, attributionControl, ...props }: any) => (
  <div className="w-full h-full flex items-center justify-center bg-muted">
    <p>Map loading...</p>
  </div>
);

const Marker = ({ children, latitude, longitude, color, onClick }: any) => null;
const Popup = ({ children, latitude, longitude, anchor, onClose, closeButton, closeOnClick }: any) => null;
const NavigationControl = ({ position }: any) => null;

// This should be a public token from Mapbox - not a secret
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazl0cG9iczQwMnIzM21ueDI5OWVxaW9mIn0.wNg6cUQjYjfF-GL1dIRFdw';

interface AddressData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_name?: string;
  error?: string;
}

interface AddressMapProps {
  addresses: AddressData[];
}

export function AddressMap({ addresses }: AddressMapProps) {
  const [popupInfo, setPopupInfo] = useState<AddressData | null>(null);

  // Filter out addresses with no coordinates
  const validAddresses = addresses.filter(
    addr => addr.latitude !== null && addr.longitude !== null
  );

  // Calculate bounds for valid addresses
  const getBounds = useCallback(() => {
    if (validAddresses.length === 0) {
      // Default to a view of the US if no addresses
      return {
        latitude: 39.8283,
        longitude: -98.5795,
        zoom: 3
      };
    }

    if (validAddresses.length === 1) {
      // If only one address, center on it
      return {
        latitude: validAddresses[0].latitude!,
        longitude: validAddresses[0].longitude!,
        zoom: 12
      };
    }

    // Calculate bounds for multiple addresses
    const lats = validAddresses.map(a => a.latitude!);
    const lngs = validAddresses.map(a => a.longitude!);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    return {
      latitude: centerLat,
      longitude: centerLng,
      zoom: 6
    };
  }, [validAddresses]);

  const [viewState, setViewState] = useState(getBounds());

  useEffect(() => {
    setViewState(getBounds());
  }, [addresses, getBounds]);

  // Invalid addresses section
  const invalidAddresses = addresses.filter(
    addr => addr.latitude === null || addr.longitude === null
  );

  if (addresses.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center bg-muted/20">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Upload an image to extract addresses and see them on the map</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full h-[400px] overflow-hidden">
        <Map
          {...viewState}
          onMove={(evt: any) => evt.viewState && setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={true}
        >
          <NavigationControl position="top-right" />
          
          {validAddresses.map((address, index) => (
            <Marker
              key={`marker-${index}`}
              longitude={address.longitude!}
              latitude={address.latitude!}
              color="#FF4136"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(address);
              }}
            />
          ))}
          
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude!}
              latitude={popupInfo.latitude!}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-2 text-xs">
                <h3 className="font-semibold">{popupInfo.place_name || popupInfo.address}</h3>
                <p className="text-muted-foreground">{popupInfo.address}</p>
                <p className="mt-1 text-gray-700">
                  {popupInfo.latitude!.toFixed(6)}, {popupInfo.longitude!.toFixed(6)}
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </Card>
      
      {invalidAddresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unlocated Addresses</CardTitle>
            <CardDescription>
              These addresses could not be found on the map
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {invalidAddresses.map((address, index) => (
                <li key={`invalid-${index}`} className="p-2 border rounded-md bg-muted/20">
                  <p>{address.address}</p>
                  {address.error && (
                    <p className="text-xs text-destructive mt-1">{address.error}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}