<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>


    <v-main>
        <v-container>

            <v-row v-for="order in orders" :key="order.order_id">

                <v-col cols="12">
                    <v-card @click="redirectPage(order.order_id)">
                        <v-row>
                            <v-col cols="8">
                                <v-card-title>Order #{{ order.order_id }}</v-card-title>
                                <v-card-subtitle>{{ order.created_at }}</v-card-subtitle>
                                <v-card-text> Total: RM{{ order.total }}</v-card-text>
                            </v-col>

                            <v-col cols="4">
                                <v-card-actions>
                                    <p v-if="order.status == 'Pending'" class="text-orange">{{ order.status }}</p>
                                    <p v-else-if="order.status == 'Cancelled'" class="text-red">{{ order.status }}</p>
                                    <p v-else-if="order.status == 'Paid'" class="text-green">{{ order.status }}</p>
                                </v-card-actions>
                            </v-col>
                        </v-row>


                    </v-card>

                </v-col>

            </v-row>
            <v-row>
            </v-row>
        </v-container>
    </v-main>

</template>

<script>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
    setup() {


        const orders = ref([]);
        const router = useRouter();
        const isLoggedIn = ref(true);
        const carts = ref([]);
        const cartCount = ref(null);

        const getOrders = async () => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            axios.post('http://api.tayar.pro/orders', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                orders.value = response.data;
                console.log('Orders:', response.data);
            }).catch(error => {
                console.error('Error fetching orders:', error);
            });

        };

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

        const redirectPage = (orderId) => {
            console.log('Redirecting to order:', orderId);
            router.push(`/order/${orderId}`);
        }

        onMounted(() => {
            getOrders();
            getCartItems();
        });
        return {
            orders,
            redirectPage,
            isLoggedIn,
            carts,
            cartCount
        }
    }

}

</script>
