import type { RouteGradingSystem, RouteStyle } from "./constants.js";

export interface ActorInput {
    areaQuery: string;
    routeStyle: RouteStyle | undefined;
    gradingSystem: RouteGradingSystem | undefined;
    minDifficulty: string;
    maxDifficulty: string;
    maxRequestsPerCrawl: number;
}

export interface AreasSearchPageData {
    minDifficulty: string;
    maxDifficulty: string;
    gradingSystem: RouteGradingSystem | undefined;
    routeStyle: RouteStyle | undefined;
}
export interface RouteData {
    title: string;
    difficulty: string;
    type: string;
    description: string;
    location: string;
    routeUrl: string;
}

// export interface AreaPageData {
//     location: string[];
// }