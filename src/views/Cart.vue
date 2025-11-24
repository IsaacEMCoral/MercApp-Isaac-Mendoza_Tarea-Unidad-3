<template>
  <div>
    <h1>Carrito</h1>
    <div v-if="items.length === 0">Carrito vacío</div>
    <div v-else>
      <div v-for="it in items" :key="it.product._id">
        <strong>{{ it.product.name }}</strong>
        <input type="number" v-model.number="it.quantity" @change="updateQty(it)" min="0" />
        <button @click="remove(it.product._id)">Quitar</button>
      </div>
      <div>Total: \${{ total.toFixed(2) }}</div>
      <button @click="clear">Vaciar</button>
    </div>
  </div>
</template>

<script>
import { useCart } from '@/composables/useCart';
export default {
  setup() {
    const { items, remove, setQty, clear, total } = useCart();
    function updateQty(it) { setQty(it.product._id, it.quantity); }
    return { items, remove, setQty, clear, total, updateQty };
  }
}
</script>
