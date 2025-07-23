import { Actor, log } from 'apify'
import { createCheerioRouter } from "crawlee";

import { BASE_THE_CRAG_URL, Routes } from "./constants.js";
import type { AreaPageData, RouteData } from './types.js';

export const router = createCheerioRouter();

router.addHandler(Routes.SEARCH_PAGE, async ({ $, crawler }) => {
    const climbingAreas = $('a.card-crag');

    log.info(`Found ${climbingAreas.length} climbing areas during initial search`);

    for (const climbingArea of climbingAreas) {
        const areaUrl = $(climbingArea).attr('href');

        await crawler.addRequests([{
            url: `${BASE_THE_CRAG_URL}${areaUrl}`,
            label: Routes.AREA_PAGE,
            userData: {
                location: []
            }
        }])
    }
})

router.addHandler<AreaPageData>(Routes.AREA_PAGE, async ({ $, request, crawler }) => {
    const { location: previousLocation } = request.userData;
    const areaPageTitle = $('div.regions__title .heading__t').text().trim();

    const currentLocation = [...previousLocation, areaPageTitle];

    const routes = $('div.route:not(div.route.header)');
    log.info(`Found ${routes.length} climbing routes during area search`);

    const routesData: RouteData[] = [];

    for (const route of routes) {
        // We might go further here to each route's page, but for now, info from area/cliff page is enough
        const routeEl = $(route);

        const title = routeEl.find('div.title > span.name').text().trim();
        const difficulty = routeEl.find('div.title > span.r-grade').text().trim();
        const type = routeEl.find('div.title > span.flags').text().trim();
        const description = routeEl.find('div.desc').text().trim();
        const location = currentLocation.join(' > ');

        routesData.push({
            title,
            difficulty,
            type,
            description,
            location
        })
    }

    await Actor.pushData<RouteData>(routesData);

    const areas = $('div[class="area"]');
    log.info(`Found ${areas.length} climbing areas during area search`);

    for (const area of areas) {
        const areaUrl = $(area).find('div.name > a').attr('href');

        await crawler.addRequests([{
            url: `${BASE_THE_CRAG_URL}${areaUrl}`,
            label: Routes.AREA_PAGE,
            userData: { location: currentLocation },
        }]);
    }
})