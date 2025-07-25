import type { RouteGradingSystem, RouteLength, RouteSetting, RouteStyle } from "./constants.js";

export interface ActorInput {
    areaQuery: string;
    routeStyle?: RouteStyle;
    routeSetting?: RouteSetting;
    routeLength?: RouteLength;
    gradingSystem?: RouteGradingSystem;
    minDifficulty?: string;
    maxDifficulty?: string;
    maxRequestsPerCrawl: number;
}

export interface AreasSearchUserData {
    minDifficulty: string;
    maxDifficulty: string;
    gradingSystem?: RouteGradingSystem;
    routeStyle?: RouteStyle;
    routeSetting?: RouteSetting;
    routeLength?: RouteLength
}

export interface RouteData {
    title: string;
    difficulty: string;
    type: string;
    description: string;
    location: string;
    routeUrl: string;
}