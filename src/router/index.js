import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const ProductDetail = () => import('../views/ProductDetail.vue');
const Cart = () => import('../views/Cart.vue');
const About = () => import('../views/About.vue');
const NotFound = () => import('../views/NotFound.vue');
const ProductForm = () => import('../views/ProductForm.vue');

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/product/new', name: 'product-new', component: ProductForm },
  { path: '/product/:id', name: 'product-detail', component: ProductDetail, props: true },
  { path: '/product/:id/edit', name: 'product-edit', component: ProductForm, props: true },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/about', name: 'about', component: About },
  { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
