<template>
  <div class="card">
    <img :src="product.imageUrl || '/placeholder.png'" alt="" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.categoryId?.name || '' }}</p>
    <p>\${{ product.price.toFixed(2) }}</p>
    <button @click="$emit('added-to-cart', product)">Añadir</button>
    <router-link :to="{ name: 'product-detail', params: { id: product._id } }">Ver</router-link>
  </div>
</template>

<script>
export default { props: { product: { type: Object, required: true } } };
</script>
