import tzlookup from 'tz-lookup';
import fetchGeocoordinateFromBrazilLocation from './fetchGeocoordinateFromBrazilLocation';

async function fetchTimezoneNameFromBrazilLocation({
  coordinates,
  state,
  city,
}) {
  if (coordinates?.latitude && coordinates?.longitude) {
    return tzlookup(coordinates.latitude, coordinates.longitude);
  }

  if (state && city) {
    const location = await fetchGeocoordinateFromBrazilLocation({
      state,
      city,
    });

    if (location?.coordinates?.latitude && location?.coordinates?.longitude) {
      return tzlookup(
        location.coordinates.latitude,
        location.coordinates.longitude
      );
    }
  }

  return null;
}

export default fetchTimezoneNameFromBrazilLocation;
