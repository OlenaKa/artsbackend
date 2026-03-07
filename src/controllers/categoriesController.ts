import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';

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
