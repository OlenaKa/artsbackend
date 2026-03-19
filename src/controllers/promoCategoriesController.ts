import { Request, Response } from 'express';
import { fetchPromoSolutionCategories } from '../services/promoSolutionService';

/**
 * Get all categories from PromoSolution API
 */
export const getPromoSolutionCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await fetchPromoSolutionCategories();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in getPromoSolutionCategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories from PromoSolution',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
