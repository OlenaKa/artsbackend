import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { fetchPromoSolutionCategories } from '../services/promoSolutionService';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories');

    const baseCategories = rows as Array<Record<string, unknown>>;
    let mergedCategories: Array<Record<string, unknown>> = [...baseCategories];

    // Fetch PromoSolution categories and append them as child categories of Promo materijal.
    try {
      const remoteCategories = await fetchPromoSolutionCategories();
      const categoriesSet = new Set<string>();

      if (Array.isArray(remoteCategories)) {
        remoteCategories.forEach((categoryItem: Record<string, unknown>) => {
          const categoryName =
            categoryItem.title ||
            categoryItem.Title ||
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

      const promoCategoryNames = Array.from(categoriesSet).sort((a, b) => a.localeCompare(b));
      const promoParent = baseCategories.find((row) => {
        const title = typeof row.title === 'string' ? row.title : '';
        const name = typeof row.name === 'string' ? row.name : '';
        const component = typeof row.component === 'string' ? row.component : '';

        return (
          title === 'Promo materijal' ||
          title === 'Promo Material' ||
          name === 'Promo materijal' ||
          name === 'Promo Material' ||
          component === 'PromoMaterijal'
        );
      });

      if (promoParent && typeof promoParent.id === 'number' && promoCategoryNames.length > 0) {
        const maxId = baseCategories.reduce((max, row) => {
          const id = typeof row.id === 'number' ? row.id : 0;
          return id > max ? id : max;
        }, 0);

        const promoChildren = promoCategoryNames.map((title, index) => {
          const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          return {
            id: maxId + index + 1,
            title,
            slug,
            parent_id: promoParent.id,
            component: 'PromoMaterijalItem',
            image_src: promoParent.image_src ?? null,
            sort_order: index + 1,
            is_visible: 1,
            created_at: null,
            updated_at: null,
            source: 'promosolution',
          };
        });

        mergedCategories = [...baseCategories, ...promoChildren];
      }
    } catch (error) {
      console.warn('Warning: Could not fetch PromoSolution categories:', error);
    }

    res.status(200).json({
      success: true,
      data: mergedCategories,
      count: mergedCategories.length,
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
