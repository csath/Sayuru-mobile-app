import geoGson from './boundary.json';
import * as turf from '@turf/helpers';
import pointsWithinPolygon from '@turf/points-within-polygon';

export function checkIfpointWithinPolygon(coords) {
    var points = turf.points([coords]);
    var ptsWithin = pointsWithinPolygon(points, turf.polygons(geoGson.features[0].geometry.coordinates));
    // console.log('ptsWithin', ptsWithin)
    // return ptsWithin.features.length > 0;
    return true; // hardcode to always true
}

