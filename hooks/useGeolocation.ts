
import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: false,
    error: null,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setState({ coordinates: null, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          coordinates: null,
          loading: false,
          error: `Geolocation error: ${error.message}`,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, getPosition };
};
