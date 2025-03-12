import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import EventPage from '../views/EventPage.vue';
import LoginPage from '../views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/events', component: EventPage , meta: {requiresAuth: true}},
  { path: '/login', component: LoginPage }
  ,{path: '/signup', component: SignupPage}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Check if token exists
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        // If the user is not logged in, redirect to login page
        next({ name: 'LoginPage' });
      } else {
        next(); // Proceed to the requested route
      }
    } else {
      next(); // Always allow navigation if the route does not require authentication
    }
  });
export default router;
