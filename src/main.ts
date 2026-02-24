import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';

import { BASE_THE_CRAG_URL, LABELS } from './constants.js';
import { router } from './routes.js';
import type { ActorInput, AreasSearchUserData } from './types.js';
import { validateGradeSystemAndGradesInput } from './utils/index.js';

log.info('Starting the actor.');
await Actor.init();

const input = (await Actor.getInput<ActorInput>())!;

const { areaQuery, maxRequestsPerCrawl, gradingSystem, routeStyle, routeLength, routeSetting } = input;
const { minDifficulty, maxDifficulty } = gradingSystem
    ? await validateGradeSystemAndGradesInput(gradingSystem, input?.minDifficulty, input?.maxDifficulty)
    : { minDifficulty: '', maxDifficulty: '' };

log.info('Received input --- ', input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestsPerCrawl,
});

const userData: AreasSearchUserData = {
    minDifficulty,
    maxDifficulty,
    gradingSystem,
    routeStyle,
    routeLength,
    routeSetting,
};

await crawler.addRequests([
    {
        url: `${BASE_THE_CRAG_URL}/en/climbing/europe/areas/search/${areaQuery}/?sortby=kudos,desc`,
        label: LABELS.AREAS_SEARCH_PAGE,
        userData,
    },
]);
await crawler.run();

log.info('Exiting the actor.');
await Actor.exit();
