<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>

    <v-main>
        <v-container>
            <h3 class="text-center">Carts</h3>
            <v-row>
                <v-col v-for="cart in carts" :key="cart.id" cols="12" md="12">
                    <v-card class="pa-4 d-flex justify-space-between">

                        <!-- Left Section: Image and Product/Service Info -->
                        <v-row>
                            <v-col cols="2">
                                <div v-if="cart.product_id">
                                    <v-img :src="cart.product.image_url" alt="Product Image" height="150px"
                                        width="150px" />
                                </div>

                                <div v-else-if="cart.service_id">
                                    <v-img :src="cart.service.image_url" alt="Service Image" height="150px"
                                        width="150px" />
                                </div>
                            </v-col>

                            <!-- Middle Section: Product/Service Name and Details -->
                            <v-col cols="8">
                                <v-card-title class="pa-0">
                                    <p v-if="cart.product_id">{{ cart.product.product_name }}</p>
                                    <p v-else-if="cart.service_id">{{ cart.service.service_name }}</p>
                                    <p>{{ cart.quantity }}</p>
                                </v-card-title>

                                <!-- Variations -->
                                <v-row v-if="cart.service_id">
                                    <v-col cols="12">
                                        <v-select v-if="cart.product_id" :items="cart.product.variations"
                                            label="Variations" v-model="cart.selectedVariation" class="mt-2"></v-select>

                                        <p v-if="cart.service_pricing.rim_size">
                                            <strong>Rim Size:</strong> {{ cart.service_pricing.rim_size }}
                                        </p>
                                        <p v-else-if="cart.service_pricing.vehicle_type">
                                            <strong>Vehicle Type:</strong> {{ cart.service_pricing.vehicle_type }}
                                        </p>
                                    </v-col>
                                </v-row>

                                <!-- Price and Discount -->
                                <v-row>
                                    <v-col cols="12">
                                        <p>
                                            <strong>RM 200</strong>
                                        </p>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- Right Section: Actions (Quantity, Delete, etc.) -->
                            <v-col cols="2">

                                <!-- Delete and Find Similar -->
                                <v-row class="mt-2">
                                    <v-btn text @click="removeFromCart(cart.id)">
                                        Delete
                                    </v-btn>
                                </v-row>

                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <v-col cols="12" class="text-right">
                    <v-btn color="red" @click="checkoutNow">
                        Checkout Now
                    </v-btn>
                </v-col>



            </v-row>
        </v-container>
    </v-main>
</template>

<script>

import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const carts = ref([]);
        const router = useRouter();
        const cartCount = ref(null);
        const isLoggedIn = ref(true);

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

        const checkoutNow = () => {
            router.push('/checkout');
        };

        const redirectCart = (cartId) => {
            router.push(`/cart/${cartId}`);
        };

        onMounted(() => {
            getCartItems();
        });

        return {
            carts,
            redirectCart,
            checkoutNow,
            cartCount,
            isLoggedIn
        };
    }
};



</script>