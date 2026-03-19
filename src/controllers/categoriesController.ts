import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { fetchPromoSolutionProducts } from '../services/promoSolutionService';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories');

    // Fetch PromoSolution categories
    let promoCategories: string[] = [];
    try {
      const products = await fetchPromoSolutionProducts();
      const categoriesSet = new Set<string>();

      if (Array.isArray(products)) {
        products.forEach((product: Record<string, unknown>) => {
          const category =
            product.category || product.Category || product.categoryName || product.CategoryName;
          if (category && typeof category === 'string') {
            categoriesSet.add(category);
          }
        });
      }

      promoCategories = Array.from(categoriesSet).sort();
    } catch (error) {
      console.warn('Warning: Could not fetch PromoSolution categories:', error);
    }

    // Build category structure with subcategories
    const categoriesWithSubcategories = rows.map((category: RowDataPacket) => {
      const cat = category as { id: number; name: string; parent_id: number | null };

      // If this is "Promo materijal", add PromoSolution categories as subcategories
      if (cat.name === 'Promo materijal' && promoCategories.length > 0) {
        return {
          ...cat,
          subcategories: promoCategories.map((name) => ({
            name,
            parent_id: cat.id,
          })),
        };
      }

      return category;
    });

    res.status(200).json({
      success: true,
      data: categoriesWithSubcategories,
      count: categoriesWithSubcategories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Sync PromoSolution categories as subcategories under "Promo materijal"
 */
export const syncPromoCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = getPool();

    // Get PromoSolution products
    const products = await fetchPromoSolutionProducts();

    // Extract unique categories
    const categoriesSet = new Set<string>();
    if (Array.isArray(products)) {
      products.forEach((product: Record<string, unknown>) => {
        const category =
          product.category || product.Category || product.categoryName || product.CategoryName;
        if (category && typeof category === 'string') {
          categoriesSet.add(category);
        }
      });
    }

    const promoCategories = Array.from(categoriesSet).sort();

    // Find or create parent category "Promo materijal"
    const [parentRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM categories WHERE name = ? LIMIT 1',
      ['Promo materijal']
    );

    let parentId: number;

    if (parentRows.length > 0) {
      parentId = (parentRows[0] as { id: number }).id;
    } else {
      // Create parent category
      const [insertResult] = await pool.query(
        'INSERT INTO categories (name, parent_id) VALUES (?, NULL)',
        ['Promo materijal']
      );
      parentId = (insertResult as { insertId: number }).insertId;
    }

    // Delete existing subcategories under "Promo materijal"
    await pool.query('DELETE FROM categories WHERE parent_id = ?', [parentId]);

    // Insert new subcategories
    let insertCount = 0;
    for (const categoryName of promoCategories) {
      try {
        await pool.query('INSERT INTO categories (name, parent_id) VALUES (?, ?)', [
          categoryName,
          parentId,
        ]);
        insertCount++;
      } catch (error) {
        console.warn(`Failed to insert category "${categoryName}":`, error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'PromoSolution categories synced successfully',
      data: {
        parentCategory: 'Promo materijal',
        parentId,
        subcategoriesCount: insertCount,
        categories: promoCategories,
      },
    });
  } catch (error) {
    console.error('Error syncing PromoSolution categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync PromoSolution categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
