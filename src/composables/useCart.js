import { ref, computed, watch } from 'vue';

const LS_KEY = 'mercapp_cart_v1';

export function useCart() {
  const items = ref(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));

  watch(items, (val) => {
    localStorage.setItem(LS_KEY, JSON.stringify(val));
  }, { deep: true });

  function add(product, qty = 1) {
    const idx = items.value.findIndex(i => i.product._id === product._id);
    if (idx >= 0) items.value[idx].quantity += qty;
    else items.value.push({ product, quantity: qty });
  }

  function remove(productId) {
    items.value = items.value.filter(i => i.product._id !== productId);
  }

  function setQty(productId, qty) {
    const it = items.value.find(i => i.product._id === productId);
    if (!it) return;
    it.quantity = Math.max(0, qty);
    if (it.quantity === 0) remove(productId);
  }

  function clear() { items.value = []; }

  const total = computed(() => items.value.reduce((s, it) => s + (it.product.price * it.quantity), 0));

  return { items, add, remove, setQty, clear, total };
}
