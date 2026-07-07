import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";

function ChangeView({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 17);
    }
  }, [position, map]);

  return null;
}

function LocationMarker({
  position,
  setPosition,
  onLocationChange,
}) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
      onLocationChange?.(
        e.latlng.lat,
        e.latlng.lng
    );
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={{
        dragend(e) {
            const marker = e.target.getLatLng();

            setPosition({
                lat: marker.lat,
                lng: marker.lng,
            });

            onLocationChange?.(
                marker.lat,
                marker.lng
            );
        }
      }}
    />
  );
}

export default function MapPicker({
    position,
    setPosition,
    onLocationChange,
}) {
  return (
    <MapContainer
      center={
        position
          ? [position.lat, position.lng]
          : [10.3157, 123.8854]
      }
      zoom={15}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "18px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeView position={position} />

      <LocationMarker
        position={position}
        setPosition={setPosition}
        onLocationChange={onLocationChange}
    />
    </MapContainer>
  );
}