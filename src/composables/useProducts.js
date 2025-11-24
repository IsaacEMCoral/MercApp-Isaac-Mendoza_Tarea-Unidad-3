import { ref } from 'vue';
import { useApi } from './useApi';

export function useProducts() {
  const { loading, error, get, post, put, del } = useApi('/api');
  const products = ref([]);
  const categories = ref([]);

  async function fetchProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = '/products' + (qs ? '?' + qs : '');
    const data = await get(url);
    products.value = data;
    return data;
  }

  async function fetchCategories() {
    const data = await get('/categories');
    categories.value = data;
    return data;
  }

  async function getProduct(id) {
    return await get(`/products/${id}`);
  }

  async function createProduct(payload) {
    return await post('/products', payload);
  }

  async function updateProduct(id, payload) {
    return await put(`/products/${id}`, payload);
  }

  async function deleteProduct(id) {
    return await del(`/products/${id}`);
  }

  return { products, categories, loading, error, fetchProducts, fetchCategories, getProduct, createProduct, updateProduct, deleteProduct };
}
