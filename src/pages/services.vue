<template>
    <v-main>
        <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
        </AppHeader> <v-container>
            <v-row>
                <v-col v-for="(service, index) in services" :key="index" cols="12" md="4">
                    <v-card class="mx-auto">
                        <v-img :src="service.image_url" alt="service Image" height="200px" />
                        <v-card-title>{{ service.service_name }}</v-card-title>
                        <v-card-subtitle>
                            {{ service.description }}
                        </v-card-subtitle>
                        <v-card-actions>
                            <v-btn @click="redirectService(service.service_id)" outlined color="red">View
                                Service</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>


</template>

<script>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const services = ref([]);
        const router = useRouter();
        const isLoggedIn = ref(true);
        const carts = ref([]);
        const cartCount = ref(null);

        const getServices = async () => {
            try {
                const response = await axios.get('http://api.tayar.pro/services');
                services.value = response.data;
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const redirectService = (serviceId) => {
            router.push(`/service/${serviceId}`);
        };


        const getCartItems = async () => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                isLoggedIn.value = false;
                return;
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
            getServices();
            getCartItems();
        });

        return {
            services,
            redirectService,
            isLoggedIn,
            carts,
            cartCount
        };
    }
}

</script>