import { describe, expect, it } from 'vitest';

import {
    RouteGradingSystem,
    RouteLength,
    RouteSetting,
    RouteStyle,
} from '../../src/constants.js';
import { constructFilteredRoutesUrl } from '../../src/utils/url-utils.js';

const BASE_AREA_URL = 'https://www.thecrag.com/en/climbing/europe/some-area';

describe('constructFilteredRoutesUrl', () => {
    describe('no filters', () => {
        it('returns base URL with /routes and no extra segments when no filters are set', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes`);
        });
    });

    describe('grade filters', () => {
        it('appends grade segment for French grading system', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '5a',
                maxDifficulty: '7c',
                gradingSystem: RouteGradingSystem.FRENCH,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-grade/FR:5a:7c`);
        });

        it('appends grade segment for UIAA grading system', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '5',
                maxDifficulty: '8+',
                gradingSystem: RouteGradingSystem.UIAA,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-grade/UIAA:5:8+`);
        });

        it('omits grade segment when gradingSystem is undefined', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '5a',
                maxDifficulty: '7c',
                gradingSystem: undefined,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes`);
        });
    });

    describe('route style filter', () => {
        it('appends style segment for boulder', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeStyle: RouteStyle.BOULDER,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-gear-style/boulder`);
        });

        it('appends style segment for sport', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeStyle: RouteStyle.SPORT,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-gear-style/sport`);
        });

        it('appends style segment for trad', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeStyle: RouteStyle.TRAD,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-gear-style/trad`);
        });

        it('omits style segment when routeStyle is undefined', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes`);
        });
    });

    describe('route setting filter', () => {
        it('appends setting segment for natural', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeSetting: RouteSetting.NATURAL,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/in-setting/natural`);
        });

        it('appends setting segment for artificial', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeSetting: RouteSetting.ARTIFICIAL,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/in-setting/artificial`);
        });
    });

    describe('route length filter', () => {
        it('appends length segment', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '',
                maxDifficulty: '',
                routeLength: RouteLength.LENGTH_10_20,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/length-between/10+20`);
        });
    });

    describe('combined filters', () => {
        it('combines all filters in the correct order: grade → style → setting → length', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '5a',
                maxDifficulty: '7c',
                gradingSystem: RouteGradingSystem.FRENCH,
                routeStyle: RouteStyle.SPORT,
                routeSetting: RouteSetting.NATURAL,
                routeLength: RouteLength.LENGTH_20_45,
            });
            expect(result).toBe(
                `${BASE_AREA_URL}/routes/with-grade/FR:5a:7c/with-gear-style/sport/in-setting/natural/length-between/20+45`,
            );
        });

        it('combines grade and style when setting and length are omitted', () => {
            const result = constructFilteredRoutesUrl(BASE_AREA_URL, {
                minDifficulty: '6a',
                maxDifficulty: '8b',
                gradingSystem: RouteGradingSystem.FRENCH,
                routeStyle: RouteStyle.BOULDER,
            });
            expect(result).toBe(`${BASE_AREA_URL}/routes/with-grade/FR:6a:8b/with-gear-style/boulder`);
        });
    });
});
