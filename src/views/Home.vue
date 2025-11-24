<template>
  <div>
    <h1>Catálogo</h1>

    <div class="controls">
      <input v-model="q" placeholder="Buscar por nombre o descripción" />
      <select v-model="category">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
      </select>
      <button @click="refresh">Buscar</button>
    </div>

    <div v-if="loading">Cargando productos…</div>
    <div v-else>
      <div v-if="visible.length === 0">No hay productos</div>
      <div class="grid">
        <ProductCard v-for="p in visible" :key="p._id" :product="p" @added-to-cart="onAdd" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { useProducts } from '@/composables/useProducts';
import { useCart } from '@/composables/useCart';

export default {
  components: { ProductCard },
  setup() {
    const { products, categories, loading, fetchProducts, fetchCategories } = useProducts();
    const cart = useCart();
    const q = ref('');
    const category = ref('');

    onMounted(async () => {
      await fetchCategories();
      await fetchProducts();
    });

    const visible = computed(() => {
      const list = products.value || [];
      const term = q.value.trim().toLowerCase();
      return list.filter(p => {
        if (category.value && p.categoryId && p.categoryId._id !== category.value) return false;
        if (!term) return true;
        return (p.name && p.name.toLowerCase().includes(term)) || (p.description && p.description.toLowerCase().includes(term));
      });
    });

    function onAdd(product) {
      cart.add(product, 1);
    }

    async function refresh() {
      await fetchProducts({ q: q.value, category: category.value });
    }

    return { products, categories, loading, q, category, visible, onAdd, refresh };
  }
}
</script>
