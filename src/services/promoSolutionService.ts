/**
 * PromoSolution API Service
 * Handles fetching products and data from PromoSolution API
 */

const API_BASE_URL = 'https://apiv1.promosolution.services';
const LOGIN = 'artsdesign3';
const PASSWORD = 'fe88Ib-ogathus-O5edr';

/**
 * Create Basic Auth header
 */
const createAuthHeader = (): string => {
  const credentials = `${LOGIN}:${PASSWORD}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  return `Basic ${encodedCredentials}`;
};

/**
 * Fetch products from PromoSolution API
 */
export const fetchPromoSolutionProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-p-products`, {
      method: 'GET',
      headers: {
        Authorization: createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PromoSolution API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_BASE_URL}/get-p-products?id=${productId}`, {
      method: 'GET',
      headers: {
        Authorization: createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PromoSolution API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product from PromoSolution API:', error);
    throw error;
  }
};
