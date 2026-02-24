export const BASE_THE_CRAG_URL = 'https://www.thecrag.com';

export const FRENCH_SYSTEM_GRADE_REGEX = /^[1-9][abc][+]?$/;
export const FRENCH_SYSTEM_DEFAULT_MIN_GRADE = '1a';
export const FRENCH_SYSTEM_DEFAULT_MAX_GRADE = '9c';

export const UIAA_SYSTEM_GRADE_REGEX = /^(1[0-2]|[1-9])[+-]?$/;
export const UIAA_SYSTEM_DEFAULT_MIN_GRADE = '1-';
export const UIAA_SYSTEM_DEFAULT_MAX_GRADE = '12+';

export enum LABELS {
    AREAS_SEARCH_PAGE = 'AREAS_SEARCH_PAGE',
    AREA_PAGE = 'AREA_PAGE',
    FILTERED_ROUTES_PAGE = 'FILTERED_ROUTES_PAGE',
}

export enum RouteStyle {
    BOULDER = 'boulder',
    TRAD = 'trad',
    SPORT = 'sport',
}

export enum RouteSetting {
    NATURAL = 'natural',
    ARTIFICIAL = 'artificial',
}

export enum RouteLength {
    LENGTH_0_5 = '0+5',
    LENGTH_5_10 = '5+10',
    LENGTH_10_20 = '10+20',
    LENGTH_20_45 = '20+45',
    LENGTH_45_100 = '45+100',
    LENGTH_100_1000 = '100+1000',
}

export enum RouteGradingSystem {
    FRENCH = 'FR',
    UIAA = 'UIAA',
}
