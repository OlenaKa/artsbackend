import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getStikeriPricing = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM stikeri_pricing');

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching stikeri pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stikeri pricing',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};