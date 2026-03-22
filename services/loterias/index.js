import axios from 'axios';
import NotFoundError from '@/errors/NotFoundError';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';

const API_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';
const DEFAULT_TIMEOUT = 10000;

// Supported lotteries
const VALID_LOTTERIES = new Set([
  'megasena',
  'quina',
  'lotofacil',
  'lotomania',
  'timemania',
  'duplasena',
  'federal',
  'diadesorte',
  'supersete',
]);

/**
 * Validates if the lottery type is supported
 * @param {string} lottery - Lottery name
 * @returns {boolean}
 */
function isValidLottery(lottery) {
  return VALID_LOTTERIES.has(lottery.toLowerCase());
}

/**
 * Fetches the latest result of a lottery
 * @param {string} lottery - Lottery name
 * @returns {Promise<Object>}
 */
export async function getLastResult(lottery) {
  const lotteryLower = lottery.toLowerCase();

  if (!isValidLottery(lotteryLower)) {
    throw new BadRequestError({
      message: `Invalid lottery type. Available types: ${Array.from(
        VALID_LOTTERIES
      ).join(', ')}`,
      type: 'lottery_error',
      name: 'INVALID_LOTTERY_TYPE',
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${lotteryLower}`, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!response.data?.numero) {
      throw new NotFoundError({
        message: 'Result not found',
        type: 'lottery_error',
        name: 'RESULT_NOT_FOUND',
      });
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError({
        message: 'Result not found',
        type: 'lottery_error',
        name: 'RESULT_NOT_FOUND',
      });
    }

    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalError({
      message: `Error fetching result: ${error.message}`,
      type: 'lottery_error',
    });
  }
}

/**
 * Fetches result for a specific draw
 * @param {string} lottery - Lottery name
 * @param {string|number} drawNumber - Draw number
 * @returns {Promise<Object>}
 */
export async function getResultByDraw(lottery, drawNumber) {
  const lotteryLower = lottery.toLowerCase();

  if (!isValidLottery(lotteryLower)) {
    throw new BadRequestError({
      message: `Invalid lottery type. Available types: ${Array.from(
        VALID_LOTTERIES
      ).join(', ')}`,
      type: 'lottery_error',
      name: 'INVALID_LOTTERY_TYPE',
    });
  }

  const drawNum = Number(drawNumber);

  if (!drawNum || drawNum <= 0 || !Number.isInteger(drawNum)) {
    throw new BadRequestError({
      message: 'Draw number must be a positive integer',
      type: 'lottery_error',
      name: 'INVALID_DRAW_NUMBER',
    });
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${lotteryLower}/${drawNum}`,
      {
        timeout: DEFAULT_TIMEOUT,
      }
    );

    if (!response.data?.numero) {
      throw new NotFoundError({
        message: `Draw ${drawNum} not found for lottery ${lottery}`,
        type: 'lottery_error',
        name: 'DRAW_NOT_FOUND',
      });
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError({
        message: `Draw ${drawNum} not found for lottery ${lottery}`,
        type: 'lottery_error',
        name: 'DRAW_NOT_FOUND',
      });
    }

    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalError({
      message: `Error fetching result: ${error.message}`,
      type: 'lottery_error',
    });
  }
}

/**
 * Helper to fetch draw result without throwing errors
 * @param {number} drawNumber - Draw number
 * @returns {Promise<Object|null>}
 */
async function fetchDrawSilently(drawNumber) {
  try {
    return await getResultByDraw('megasena', drawNumber);
  } catch {
    return null;
  }
}

/**
 * Extracts date parts from DD/MM/YYYY format
 * @param {string} dateStr - Date string in DD/MM/YYYY format
 * @returns {Object} Object with day, month, year properties
 */
function parseDateParts(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return { day, month, year: Number(year) };
}

/**
 * Checks if a draw is from December 31st
 * @param {Object} draw - Draw result object
 * @param {number} targetYear - Target year to match
 * @returns {boolean}
 */
function isNewYearDrawForYear(draw, targetYear) {
  const dateParts = parseDateParts(draw.dataApuracao);
  return (
    dateParts.month === '12' &&
    dateParts.day === '31' &&
    dateParts.year === targetYear
  );
}

/**
 * Determines how many draws to skip based on draw year
 * @param {number} drawYear - Year of the draw
 * @param {number} targetYear - Target year we're looking for
 * @returns {Object} Object with drawsToSkip and attemptsToIncrement
 */
function calculateDrawStep(drawYear, targetYear) {
  // Far ahead of target year - skip multiple draws
  if (drawYear > targetYear + 1) {
    return { drawsToSkip: 50, attemptsIncrement: 10 };
  }
  // Close to target year - search sequentially
  return { drawsToSkip: 1, attemptsIncrement: 1 };
}

/**
 * Processes a single draw and determines next action
 * @param {Object} draw - Draw result or null
 * @param {number} targetYear - Target year
 * @returns {Object} Object with action and data for next iteration
 */
function processDrawResult(draw, targetYear) {
  // No data available - move to next draw
  if (!draw?.dataApuracao) {
    return { action: 'next', drawsToSkip: 1, attemptsIncrement: 1 };
  }

  // Check if this is the New Year's draw we're looking for
  if (isNewYearDrawForYear(draw, targetYear)) {
    return { action: 'found', draw };
  }

  const dateParts = parseDateParts(draw.dataApuracao);

  // Draw year is before target - stop searching
  if (dateParts.year < targetYear) {
    return { action: 'stop' };
  }

  // Determine how many draws to skip based on year difference
  const { drawsToSkip, attemptsIncrement } = calculateDrawStep(
    dateParts.year,
    targetYear
  );

  return { action: 'next', drawsToSkip, attemptsIncrement };
}

/**
 * Searches backwards through draws to find New Year's draw
 * @param {number} targetYear - Target year
 * @param {number} startDraw - Starting draw number
 * @returns {Promise<Object>}
 */
async function findNewYearDrawBackwards(targetYear, startDraw) {
  const MAX_ATTEMPTS = 150; // Covers ~1 year of draws (~2 per week)
  let drawNumber = startDraw;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS && drawNumber > 0) {
    // eslint-disable-next-line no-await-in-loop
    const draw = await fetchDrawSilently(drawNumber);
    const result = processDrawResult(draw, targetYear);

    if (result.action === 'found') {
      return result.draw;
    }

    if (result.action === 'stop') {
      break;
    }

    drawNumber -= result.drawsToSkip;
    attempts += result.attemptsIncrement;
  }

  throw new NotFoundError({
    message: `New Year's draw for ${targetYear} not found`,
    type: 'lottery_error',
    name: 'NEW_YEAR_DRAW_NOT_FOUND',
  });
}

/**
 * Searches for New Year's draw (Mega da Virada) for a specific year
 * The Mega da Virada is always drawn on December 31st
 * @param {number} year - Year to fetch New Year's draw for
 * @returns {Promise<Object>}
 */
export async function getNewYearDraw(year) {
  const yearNumber = Number(year);

  if (
    !year ||
    !Number.isInteger(yearNumber) ||
    yearNumber < 1996 ||
    yearNumber > new Date().getFullYear() + 1
  ) {
    throw new BadRequestError({
      message: 'Invalid year. Please provide a valid year starting from 1996.',
      type: 'lottery_error',
      name: 'INVALID_YEAR',
    });
  }

  try {
    // Start by fetching the last result
    const lastResult = await getLastResult('megasena');

    // Check if it's the New Year's draw for the target year
    if (
      lastResult.dataApuracao &&
      isNewYearDrawForYear(lastResult, yearNumber)
    ) {
      return lastResult;
    }

    // Search backwards from the last draw
    return await findNewYearDrawBackwards(yearNumber, lastResult.numero);
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalError({
      message: `Error fetching New Year's draw: ${error.message}`,
      type: 'lottery_error',
    });
  }
}
