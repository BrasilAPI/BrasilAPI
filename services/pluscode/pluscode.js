import axios from 'axios';
import {OpenLocationCode} from 'open-location-code';

async function getAddress(lat, lon) {
    const { data } = await axios({
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`,
        method: 'get',
    });

    return {
        road: data.address.road,
        suburb: data.address.suburb,
        city: data.address.city,
        country: data.address.country,
        state: data.address.state,
    }
}

const getLocation = async(plusCode) => {
    const openLocationCode = new OpenLocationCode()
    const codeArea = openLocationCode.decode(plusCode);
    const location = {
        latitude: codeArea.latitudeCenter,
        longitude: codeArea.longitudeCenter,
    }
    const address = await getAddress(codeArea.latitudeCenter, codeArea.longitudeCenter); 
    
    return {
        location,
        address,
    }
}

export default getLocation;