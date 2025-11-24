import axios from 'axios';
import { ref } from 'vue';

export function useApi(baseURL = '/api') {
  const loading = ref(false);
  const error = ref(null);

  async function request(method, url, data = null, opts = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios({ method, url: baseURL + url, data, withCredentials: true, ...opts });
      return res.data;
    } catch (err) {
      error.value = err.response && err.response.data ? err.response.data : err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, request, get: (u, o)=>request('get', u, null, o), post: (u,d,o)=>request('post', u, d, o), put:(u,d,o)=>request('put', u, d, o), del:(u,o)=>request('delete', u, null, o) };
}
