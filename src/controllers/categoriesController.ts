import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { fetchPromoSolutionCategories } from '../services/promoSolutionService';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM categories');

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
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

    // Get PromoSolution categories
    const categories = await fetchPromoSolutionCategories();

    // Extract unique category names
    const categoriesSet = new Set<string>();
    if (Array.isArray(categories)) {
      categories.forEach((categoryItem: Record<string, unknown>) => {
        const categoryName =
          categoryItem.name ||
          categoryItem.Name ||
          categoryItem.category ||
          categoryItem.Category ||
          categoryItem.categoryName ||
          categoryItem.CategoryName;

        if (typeof categoryName === 'string' && categoryName.trim() !== '') {
          categoriesSet.add(categoryName.trim());
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
