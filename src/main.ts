import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';

import { BASE_THE_CRAG_URL, Routes } from './constants.js';
import { router } from './routes.js';
import type { ActorInput } from './types.js';

log.info('Starting the actor.')
await Actor.init();

const input = await Actor.getInput<ActorInput>();

if (!input) {
    log.error('Received invalid user input, cannot proceed');
    throw new Error('Received invalid input.');
}

const { areaQuery, maxRequestsPerCrawl } = input;

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestsPerCrawl,
});

await crawler.addRequests([{
    url: `${BASE_THE_CRAG_URL}/en/climbing/europe/search?S=${areaQuery}`,
    label: Routes.SEARCH_PAGE,
}])
await crawler.run();

log.info('Exiting the actor.')
await Actor.exit();
