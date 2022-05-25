import { METHODS, client, headerConfig } from '../../shared/utilities/network-communication/rest-client';
import { GET_FORECAST } from '../../../configs';

export const getWeatherForcastService = async (lat: string, lon: string) => {
    const PARMS = "lat/" + lat + "/lon/" + lon
    return await client.API(METHODS.GET, GET_FORECAST + PARMS, {}, headerConfig);
};