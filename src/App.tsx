import { Map, MapProps } from "@/components/map";
import { Marker } from "@react-google-maps/api";
import { useState } from "react";

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function App() {
  const [mapProps, setMapProps] = useState<MapProps>();

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) =>
        setMapProps((prev) => ({
          ...prev,
          center: { lat, lng },
          boundType: "country",
        })),

      console.error,
      options
    );
  };

  return (
    <div className="flex flex-row h-screen">
      <Map {...mapProps} className="flex grow">
        {mapProps?.center && <Marker position={mapProps.center} />}
      </Map>

      <div>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          Get
        </button>
      </div>
    </div>
  );
}

export default App;
