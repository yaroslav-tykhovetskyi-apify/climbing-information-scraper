import type { RouteGradingSystem, RouteLength, RouteSetting, RouteStyle } from '../constants.js';
import type { AreasSearchUserData } from '../types.js';

const constructGradesFilters = (
    gradingSystem: RouteGradingSystem | undefined,
    minDifficulty: string,
    maxDifficulty: string,
): string => {
    return gradingSystem ? `/with-grade/${gradingSystem}:${minDifficulty}:${maxDifficulty}` : '';
};

const constructRouteStyleFilters = (routeStyle?: RouteStyle): string => {
    return routeStyle ? `/with-gear-style/${routeStyle}` : '';
};

const constructRouteLengthFilters = (routeLength?: RouteLength): string => {
    return routeLength ? `/length-between/${routeLength}` : '';
};

const constructRouteSettingFilters = (routeSetting?: RouteSetting): string => {
    return routeSetting ? `/in-setting/${routeSetting}` : '';
};

export const constructFilteredRoutesUrl = (
    baseMostRelevantAreaUrl: string,
    searchPageUserData: AreasSearchUserData,
): string => {
    const { minDifficulty, maxDifficulty, gradingSystem, routeStyle, routeSetting, routeLength } = searchPageUserData;

    return `${baseMostRelevantAreaUrl}/routes${constructGradesFilters(gradingSystem, minDifficulty, maxDifficulty)}${constructRouteStyleFilters(routeStyle)}${constructRouteSettingFilters(routeSetting)}${constructRouteLengthFilters(routeLength)}`;
};
