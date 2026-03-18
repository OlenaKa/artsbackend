/**
 * PromoSolution API Service
 * Handles fetching products and data from PromoSolution API
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PROMO_BASE_URL = process.env.PROMO_BASE_URL; 
axios.defaults.baseURL = PROMO_BASE_URL;

const LOGIN = process.env.PUBLIK_LOGIN; 
const PASSWORD = process.env.PUBLIK_PASS;

/**
 * Get access token from PromoSolution API
 */
const getToken = async (): Promise<string> => {
  try {
    const result = await axios.post(
      '/Token',
      `grant_type=password&username=${LOGIN}&password=${PASSWORD}&`
    );
    return result.data.access_token;
  } catch (error) {
    console.error('Error getting PromoSolution token:', error);
    throw error;
  }
};

/**
 * Token management object
 */
const token = {
  set(accessToken: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

/**
 * Fetch products from PromoSolution API
 */
export const fetchPromoSolutionProducts = async () => {
  try {
    const newToken = await getToken();
    token.set(newToken);
    const result = await axios.get('/sr-Latin-CS/api/Product');
    return result.data;
  } catch (error) {
    console.error('Error fetching from PromoSolution API:', error);
    throw error;
  }
};

/**
 * Fetch specific product data from PromoSolution
 */
export const fetchPromoSolutionProduct = async (productId: string) => {
  try {
    const products = (await fetchPromoSolutionProducts()) as Array<Record<string, unknown>>;
    const product = products.find((item) => {
      const idCandidates = [item.id, item.productId, item.ProductId, item.ID].filter(
        (value) => value !== undefined && value !== null
      );
      return idCandidates.some((value) => String(value) === productId);
    });

    return product ?? null;
  } catch (error) {
    console.error('Error fetching product from PromoSolution API:', error);
    throw error;
  }
};
