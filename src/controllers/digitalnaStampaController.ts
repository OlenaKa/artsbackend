import { Request, Response } from 'express';
import getPool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getDigitalnaStampaPricing = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>(
      'SELECT * FROM digitalna_stampa_pricing WHERE is_active = 1 ORDER BY id ASC'
    );

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching digitalna stampa pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch digitalna stampa pricing',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};