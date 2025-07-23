export interface ActorInput {
    areaQuery: string;
    maxRequestsPerCrawl: number;
}

export interface RouteData {
    title: string;
    difficulty: string;
    type: string;
    description: string;
    location: string;
}

export interface AreaPageData {
    location: string[];
}