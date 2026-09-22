import { Coordinates } from '../types/navigation.types';

/**
 * Encodes an array of coordinate objects into an encoded polyline string.
 */
export const encodePolyline = (points: Coordinates[]): string => {
  let encoded = '';
  let prevLat = 0;
  let prevLng = 0;

  for (const point of points) {
    const lat = Math.round(point.latitude * 1e5);
    const lng = Math.round(point.longitude * 1e5);

    encoded += encodeValue(lat - prevLat);
    encoded += encodeValue(lng - prevLng);

    prevLat = lat;
    prevLng = lng;
  }

  return encoded;
};

function encodeValue(val: number): string {
  let num = val < 0 ? ~(val << 1) : val << 1;
  let chunk = '';

  while (num >= 0x20) {
    chunk += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }

  chunk += String.fromCharCode(num + 63);
  return chunk;
}

/**
 * Calculates straight line haversine distance in kilometers.
 */
export const calculateHaversineKm = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};
