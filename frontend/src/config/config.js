const API_BASE_URL = 'http://localhost:8000/api';

export const config = {
  API_BASE_URL,
  endpoints: {
    products: `${API_BASE_URL}/products`,
    orders: `${API_BASE_URL}/order`,
    auth: `${API_BASE_URL}/auth`,
    carts: `${API_BASE_URL}/carts`,
    cartAdd: `${API_BASE_URL}/carts/add`,
    cartReduce: `${API_BASE_URL}/carts/reduce`,
    cartRemove: `${API_BASE_URL}/carts/remove`
  }
};

export default config;
