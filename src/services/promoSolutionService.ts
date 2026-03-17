/**
 * PromoSolution API Service
 * Handles fetching products and data from PromoSolution API
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://apiv1.promosolution.services';
const API_APP_PATH = '/get-p-products';
const TOKEN_URL = `${API_BASE_URL}/token`;
const LOGIN = 'artsdesign3';
const PASSWORD = 'fe88Ib-ogathus-O5edr';

/**
 * Create URL-encoded credentials for OAuth password grant
 */
const createTokenRequestBody = (): URLSearchParams => {
  return new URLSearchParams({
    grant_type: 'password',
    username: LOGIN,
    password: PASSWORD,
  });
};

const getAccessToken = async (): Promise<string> => {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: createTokenRequestBody().toString(),
  });

  if (!tokenResponse.ok) {
    throw new Error(
      `PromoSolution token error: ${tokenResponse.status} ${tokenResponse.statusText}`
    );
  }

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error('PromoSolution token response did not include access_token');
  }

  return tokenData.access_token;
};

const parseJsonResponse = async (response: {
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}) => {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  // Prevent HTML login pages from being parsed as JSON.
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON but received content-type: ${contentType || 'unknown'}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    throw new Error('PromoSolution returned invalid JSON content');
  }
};

/**
 * Fetch products from PromoSolution API
 */
export const fetchPromoSolutionProducts = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${API_APP_PATH}/api/Product`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PromoSolution API error: ${response.status} ${response.statusText}`);
    }

    const data = await parseJsonResponse(response);
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
