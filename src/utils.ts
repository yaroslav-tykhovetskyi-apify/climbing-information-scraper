import { Actor } from "apify";

import type { RouteStyle } from "./constants.js";
import { FRENCH_SYSTEM_DEFAULT_MIN_GRADE, RouteGradingSystem, UIAA_SYSTEM_DEFAULT_MAX_GRADE, UIAA_SYSTEM_DEFAULT_MIN_GRADE } from "./constants.js";


const validatePairOfGradesUsingRegex = async (value1: string, value2: string, regexp: RegExp) => {
    const validationResult = (value1.length === 0 || regexp.test(value1)) && (value2.length === 0 || regexp.test(value2));

    if (!validationResult) {
        throw await Actor.fail('Received invalid min/max route grade value, please check the input');
    }
}

export const validateGradeSystemAndGradesInput = async (gradingSystem: RouteGradingSystem, minDifficulty: string | undefined, maxDifficulty: string | undefined): Promise<{ minDifficulty: string, maxDifficulty: string }> => {
    const UIAAGradingSystemRegex = /^[1-9][+-]?$/;
    const frenchGradingSystemRegex = /^[1-9][abc][+]?$/

    let minDifficultyOrDefault;
    let maxDifficultyOrDefault;

    switch (gradingSystem) {
        case RouteGradingSystem.FRENCH:
            minDifficultyOrDefault = minDifficulty && minDifficulty.length > 0 ? minDifficulty : FRENCH_SYSTEM_DEFAULT_MIN_GRADE;
            maxDifficultyOrDefault = maxDifficulty && maxDifficulty.length > 0 ? maxDifficulty : FRENCH_SYSTEM_DEFAULT_MIN_GRADE;

            await validatePairOfGradesUsingRegex(minDifficultyOrDefault, maxDifficultyOrDefault, frenchGradingSystemRegex);
            break;
        case RouteGradingSystem.UIAA:
            minDifficultyOrDefault = minDifficulty && minDifficulty.length > 0 ? minDifficulty : UIAA_SYSTEM_DEFAULT_MIN_GRADE;
            maxDifficultyOrDefault = maxDifficulty && maxDifficulty.length > 0 ? maxDifficulty : UIAA_SYSTEM_DEFAULT_MAX_GRADE;

            await validatePairOfGradesUsingRegex(minDifficultyOrDefault, maxDifficultyOrDefault, UIAAGradingSystemRegex);
            break;
        default:
            throw await Actor.fail('Received invalid non-undefined grading system');
    }

    return { minDifficulty: minDifficultyOrDefault, maxDifficulty: maxDifficultyOrDefault };
}

export const constructGradesFilters = (gradingSystem: RouteGradingSystem | undefined, minDifficulty: string, maxDifficulty: string): string => {
    return gradingSystem ? `/with-grade/${gradingSystem}:${minDifficulty}:${maxDifficulty}` : ''
}

export const constructRouteStyleFilters = (routeStyle: RouteStyle | undefined): string => {
    return routeStyle ? `/with-gear-style/${routeStyle}` : ''
}