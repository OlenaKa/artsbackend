import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getPvcNalepnicePrices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>(
      'SELECT * FROM pvc_nalepnice_prices ORDER BY min_surface_m2 ASC'
    );

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching pvc nalepnice prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pvc nalepnice prices',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};