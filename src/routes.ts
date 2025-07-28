import { Actor, log } from 'apify';
import { createCheerioRouter } from 'crawlee';

import { BASE_THE_CRAG_URL, LABELS } from './constants.js';
import type { AreasSearchUserData, RouteData } from './types.js';
import { constructFilteredRoutesUrl } from './utils/index.js';

export const router = createCheerioRouter();

router.addHandler<AreasSearchUserData>(LABELS.AREAS_SEARCH_PAGE, async ({ $, crawler, request }) => {
    const climbingAreaEl = $('a.card-crag');
    const mostRelevantClimbingAreaUrl = climbingAreaEl.first().attr('href') || '';

    await crawler.addRequests([
        {
            url: constructFilteredRoutesUrl(
                new URL(mostRelevantClimbingAreaUrl, BASE_THE_CRAG_URL).href,
                request.userData,
            ),
            label: LABELS.FILTERED_ROUTES_PAGE,
        },
    ]);
});

router.addHandler(LABELS.FILTERED_ROUTES_PAGE, async ({ $, crawler, request }) => {
    const currentPageNumber = $('div.pagination li.active').first().text().trim();

    log.info(`[${request.label}]: Processing page --- ${currentPageNumber || 1} - ${request.url}`);

    const routesEl = $('tr[id][data-nid][data-nodename]');

    log.info(
        `[${request.label}]: Found ${routesEl.length} routes on page --- ${currentPageNumber || 1} - ${request.url}`,
    );

    const routesData: RouteData[] = [];
    for (const route of routesEl) {
        const routeEl = $(route);

        const routeLinkEl = routeEl.find('td.rt_name > span.route > a');

        const title = routeLinkEl.text().trim();
        const location =
            routeLinkEl
                .attr('title')
                ?.trim()
                .replace(/\u203A/g, '>')
                .replace(/\u00a0/g, ' ') || '';
        const routeUrl = `${BASE_THE_CRAG_URL}${routeLinkEl.attr('href')}`;
        const difficulty = routeEl.find('td').first().text().trim();
        const type = routeEl.find('span.tags').text().trim();
        const description = routeEl.find('td.rt_name > div.markdown > p').text().trim();

        routesData.push({
            title,
            location,
            routeUrl,
            difficulty,
            type,
            description,
        });
    }

    await Actor.pushData<RouteData[]>(routesData);

    const nextButtonEl = $('div.pagination li.next a');

    if (nextButtonEl && nextButtonEl.attr('href')) {
        const nextPageUrl = nextButtonEl.attr('href') || '';

        await crawler.addRequests([
            {
                url: new URL(nextPageUrl, BASE_THE_CRAG_URL).href,
                label: LABELS.FILTERED_ROUTES_PAGE,
            },
        ]);
    }
});
