import {
  memo,
  useCallback,
  useEffect,
  useState,
  type FC,
  type HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";
import {
  GoogleMap,
  GoogleMapProps,
  useJsApiLoader,
} from "@react-google-maps/api";

export type MapProps = {
  boundType?: "country" | "street_address";
} & HTMLAttributes<HTMLDivElement> &
  GoogleMapProps;

const usa = {
  lat: 44.182205,
  lng: -84.506836,
};

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

const getCountryGeometry = async (
  location: google.maps.LatLng | google.maps.LatLngLiteral,
  boundType: "country" | "street_address" = "street_address"
) =>
  new Promise<google.maps.GeocoderGeometry | undefined>((resolve, reject) => {
    new google.maps.Geocoder().geocode({ location }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        const res = results.find((r) => r.types.includes(boundType));

        resolve(res?.geometry);
      } else {
        reject(new Error("Geocoding failed"));
      }
    });
  });

const MapComponent: FC<MapProps> = ({
  mapContainerStyle = { height: "100%", width: "100%" },
  boundType = "country",
  center = usa,
  className,
  children,
  ...props
}) => {
  const [map, setMap] = useState<google.maps.Map>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
  });

  const onLoad = useCallback((m: google.maps.Map) => {
    setMap(m);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(undefined);
  }, []);

  useEffect(() => {
    if (map) {
      const updateBounds = async (): Promise<void> => {
        const geometry = await getCountryGeometry(center, boundType);
        if (geometry?.bounds) {
          map.fitBounds(geometry.bounds);
        }
      };

      updateBounds();
    }
  }, [map, boundType, center]);

  return (
    <div
      className={cn(
        "aspect-square w-full xl:aspect-auto bg-gray-500",
        className
      )}
    >
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          {...props}
        >
          {children}
        </GoogleMap>
      )}
    </div>
  );
};

export const Map = memo(MapComponent);

Map.displayName = "Map";
