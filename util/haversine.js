const EARTH_RADIUS_IN_METERS = 6371000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Distância de grande círculo entre dois pontos, em metros.
 */
export default function haversine(origin, destination) {
  const deltaLatitude = toRadians(destination.latitude - origin.latitude);
  const deltaLongitude = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(origin.latitude)) *
      Math.cos(toRadians(destination.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;

  return EARTH_RADIUS_IN_METERS * 2 * Math.asin(Math.sqrt(a));
}
