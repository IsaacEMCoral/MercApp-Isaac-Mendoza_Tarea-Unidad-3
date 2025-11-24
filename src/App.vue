<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      <template #fallback>
        <div class="loading">Cargando…</div>
      </template>
    </Suspense>
  </router-view>
</template>
