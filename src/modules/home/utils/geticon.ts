import images from "../../../assets"
import localize from "../../../localization/translations"

export const getWeatherIconAndText = (category: string, weatherType: string) => {
    const obj = {
        image: "",
        text: ""
    }
    switch (`${category}-${weatherType}`) {

        // weatherCondition
        case 'rain-normal':
            obj.image = images.weather_cloudy_white
            obj.text = localize.forecast.rainNormal
            break;
        case 'rain-light_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainLight
            break;
        case 'rain-light_or_moderate_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainLightModerate
            break;
        case 'rain-moderate_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainModerate
            break;
        case 'rain-fairly_heavy_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainFairlyHeavy
            break;
        case 'rain-heavy_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainHeavy
            break;
        case 'rain-very_heavy_rain':
            obj.image = images.weather_cloudy_rain_white
            obj.text = localize.forecast.rainVeryHeavy
            break;
        case 'rain-evening_night_thundershower':
            obj.image = images.weather_thunderstorm_white
            obj.text = localize.forecast.rainNightThunderstorm
            break;
        case 'rain-morning_thundershower':
            obj.image = images.weather_thunderstorm_white
            obj.text = localize.forecast.rainMorningThunderstorm
            break;

            // gustyWind
        case 'wind-thundershowerWind':
            obj.image = images.weather_wind_white
            obj.text = localize.forecast.windThunderShower
            break;
        case 'wind-gustyWind':
            obj.image = images.weather_wind_white
            obj.text = localize.forecast.windGusty
            break;
        case 'wind-general':
            obj.image = images.weather_wind_white
            obj.text = localize.forecast.windGeneral
            break;

            // SEA SECTION
        case 'sea-slight':
            obj.image = images.weather_wave_white
            obj.text = localize.forecast.seaSlight
            break;
        case 'sea-moderate':
            obj.image = images.weather_wave_white
            obj.text = localize.forecast.seaModerate
            break;
        case 'sea-fairly_rough':
            obj.image = images.weather_wave_white
            obj.text = localize.forecast.seaFairlyRough
            break;
        case 'sea-rough':
            obj.image = images.weather_wave_white
            obj.text = localize.forecast.seaRough
            break;
        case 'sea-very_rough':
            obj.image = images.weather_wave_white
            obj.text = localize.forecast.seaVeryRough
            break;
    }
    return obj
}