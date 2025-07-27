import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../utils/types';
import { useEffect } from 'react';

// Fix default marker icon issue in Leaflet + Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();

  useEffect(() => {
    const target = L.latLng(lat, lon);
    map.flyTo(target, 13, {
      animate: true,
      duration: 3.5, // seconds
      easeLinearity: 0.25, // Easing function for the animation
      noMoveStart: false, // Trigger the move start event
    });
  }, [lat, lon, map]);

  return null;
};

const MapWithMarker = ({ location }: { location: Location }) => {
  const position: [number, number] = [location.lat, location.lon];

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          {location.name}, {location.region}, {location.country}
        </Popup>
      </Marker>
      <RecenterMap lat={location.lat} lon={location.lon} />
    </MapContainer>
  );
};

export default MapWithMarker;
