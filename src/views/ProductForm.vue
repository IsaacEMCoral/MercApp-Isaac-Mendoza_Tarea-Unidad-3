<template>
  <div>
    <h1>{{ isEdit ? 'Editar' : 'Crear' }} producto</h1>
    <form @submit.prevent="submit">
      <input v-model="form.name" placeholder="Nombre" required />
      <input type="number" v-model.number="form.price" step="0.01" min="0" required />
      <select v-model="form.categoryId" required>
        <option value="">Seleccione</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
      </select>
      <input type="number" v-model.number="form.stock" min="0" />
      <input v-model="form.imageUrl" placeholder="URL imagen" />
      <textarea v-model="form.description" placeholder="Descripción"></textarea>
      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const { createProduct, updateProduct, fetchCategories, getProduct } = useProducts();
    const router = useRouter();
    const route = useRoute();
    const isEdit = !!route.params.id;
    const form = ref({ name:'', price:0, categoryId:'', stock:0, description:'', imageUrl:'' });
    const categories = ref([]);

    onMounted(async () => {
      categories.value = await fetchCategories();
      if (isEdit) {
        const p = await getProduct(route.params.id);
        Object.assign(form.value, p);
      }
    });

    async function submit() {
      // validación simple
      if (!form.value.name || form.value.price <= 0 || !form.value.categoryId) {
        return alert('Nombre, precio (>0) y categoría obligatorios');
      }
      try {
        if (isEdit) await updateProduct(route.params.id, form.value);
        else await createProduct(form.value);
        router.push('/');
      } catch (err) {
        alert('Error guardando producto');
      }
    }

    return { form, categories, submit, isEdit };
  }
}
</script>
