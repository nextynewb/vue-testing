<template>
  <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
  </AppHeader>


  <section class="slideShow">
    <v-carousel>
      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>
      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>
      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
    </v-carousel>
  </section>

</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const cartCount = ref(0);
    const isLoggedIn = ref(true);
    const carts = ref([])

    const getCartItems = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        isLoggedIn.value = false;
      }
      try {
        const response = await axios.post('http://api.tayar.pro/cart', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        carts.value = response.data;
        cartCount.value = response.data.length;
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    onMounted(() => {
      getCartItems();
    });

    return {
      cartCount,
      carts,
      isLoggedIn,
    };
  },
};

</script>
