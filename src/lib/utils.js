import { prisma } from './prisma';

/**
 * Normalizes a given company level into a standard rank (1-10) based on LevelMapping.
 * This is crucial because a 'Senior' at a startup might only be a 'Mid' (rank 4) at Google.
 * By standardizing levels, we ensure accurate cross-company comparisons.
 * 
 * @param {string} companyUuid - The unique identifier of the company.
 * @param {string} levelName - The internal level name (e.g., "L4", "SDE II").
 * @returns {Promise<number|null>} The standard rank (1-10), or null if no mapping exists.
 */
export async function getStandardizedLevel(companyUuid, levelName) {
  try {
    const mapping = await prisma.levelMapping.findUnique({
      where: {
        companyUuid_companyLevel: {
          companyUuid: companyUuid,
          companyLevel: levelName,
        },
      },
    });
    
    return mapping ? mapping.standardRank : null;
  } catch (error) {
    console.error("Error fetching standard level:", error);
    return null;
  }
}
