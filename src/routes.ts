import { Actor, log } from 'apify'
import { createCheerioRouter } from "crawlee";

import { BASE_THE_CRAG_URL, Routes } from "./constants.js";
import type { AreasSearchUserData, RouteData } from './types.js';
import { constructFilteredRoutesUrl } from './utils/index.js';

export const router = createCheerioRouter();

router.addHandler<AreasSearchUserData>(Routes.AREAS_SEARCH_PAGE, async ({ $, crawler, request }) => {
    const climbingArea = $('a.card-crag');

    const mostRelevantClimbingAreaUrl = `${BASE_THE_CRAG_URL}${climbingArea.first().attr('href')}`;

    await crawler.addRequests([{
        url: constructFilteredRoutesUrl(mostRelevantClimbingAreaUrl, request.userData),
        label: Routes.FILTERED_ROUTES_PAGE,
    }])
})

router.addHandler(Routes.FILTERED_ROUTES_PAGE, async ({ $, crawler, request }) => {
    const currentPageNumber = $('div.pagination li.active').first().text().trim();

    log.info(`Processing page --- ${currentPageNumber || 1}, url: ${request.url}`);

    const routes = $('tr[id][data-nid][data-nodename]');

    log.info(`Found ${routes.length} routes on page --- ${currentPageNumber || 1}, url: ${request.url}`);

    const routesData: RouteData[] = [];
    for (const route of routes) {
        const routeEl = $(route);

        const routeLinkElement = routeEl.find('td.rt_name > span.route > a');

        const title = routeLinkElement.text().trim();
        const location = routeLinkElement.attr('title')?.trim().replace(/\u203A/g, '>').replace(/\u00a0/g, ' ') || '';
        const routeUrl = `${BASE_THE_CRAG_URL}${routeLinkElement.attr('href')}`;
        const difficulty = routeEl.find('td').first().text().trim();
        const type = routeEl.find('span.tags').text().trim();
        const description = routeEl.find('td.rt_name > div.markdown > p').text().trim();

        routesData.push({
            title,
            location,
            routeUrl,
            difficulty,
            type,
            description
        })
    }

    await Actor.pushData<RouteData[]>(routesData);

    const nextButton = $('div.pagination li.next a');

    if (nextButton && nextButton.attr('href')) {
        const nextPageUrl = nextButton.attr('href');

        await crawler.addRequests([{
            url: `${BASE_THE_CRAG_URL}${nextPageUrl}`,
            label: Routes.FILTERED_ROUTES_PAGE,
        }])
    }
})