
import React, { useEffect, useRef } from 'react';

interface SchoolMapProps {
  lat: number;
  lng: number;
  popupText: string;
}

const SchoolMap: React.FC<SchoolMapProps> = ({ lat, lng, popupText }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).L) return;

    // Safety check: Clean up existing map instance if it exists (handles StrictMode double-mount)
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
    }

    try {
        // Initialize Map
        const map = (window as any).L.map(mapRef.current).setView([lat, lng], 15);

        // Add OpenStreetMap Tile Layer
        (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add Marker
        (window as any).L.marker([lat, lng]).addTo(map)
          .bindPopup(popupText)
          .openPopup();

        mapInstanceRef.current = map;
    } catch (error) {
        console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, popupText]);

  return <div ref={mapRef} className="w-full h-full min-h-[300px] z-0 bg-slate-100 dark:bg-slate-800" />;
};

export default SchoolMap;
