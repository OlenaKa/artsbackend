import { Request, Response } from 'express';
import {
  fetchPromoSolutionProducts,
  fetchPromoSolutionProduct,
} from '../services/promoSolutionService';

/**
 * Pure helper: extract a unique list of category names from products array.
 */

/**
 * Get all products from PromoSolution
 */
export const getPromoSolutionProducts = async (_req: Request, res: Response) => {
  try {
    const products = await fetchPromoSolutionProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error in getPromoSolutionProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products from PromoSolution',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get a specific product by ID from PromoSolution
 */
export const getPromoSolutionProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await fetchPromoSolutionProduct(id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error in getPromoSolutionProductById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product from PromoSolution',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
