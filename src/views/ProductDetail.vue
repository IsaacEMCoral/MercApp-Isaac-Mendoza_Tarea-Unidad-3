<template>
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <img :src="product.imageUrl || '/placeholder.png'" alt="" />
    <p>{{ product.description }}</p>
    <p>Precio: \${{ product.price.toFixed(2) }}</p>
    <p>Stock: {{ product.stock }}</p>
    <button @click="addToCart">Añadir al carrito</button>
  </div>
  <div v-else>Producto no encontrado</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { useCart } from '@/composables/useCart';

export default {
  props: ['id'],
  setup(props) {
    const { getProduct } = useProducts();
    const product = ref(null);
    const cart = useCart();

    onMounted(async () => {
      try {
        product.value = await getProduct(props.id);
      } catch (e) {
        product.value = null;
      }
    });

    function addToCart() {
      if (product.value) cart.add(product.value, 1);
    }

    return { product, addToCart };
  }
};
</script>
