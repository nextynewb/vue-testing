<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>

    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h1 class="text-center">Checkout</h1>
                </v-col>


                <v-col v-if="carts.length > 0" cols="12" md="12">
                    <v-card class="pa-4">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="appointmentDate" label="Select Date" type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="appointmentTime" label="Select Time" type="time"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="selectedLocation"
                                    :items="['Sungai Besi', 'Seri Kembangan', 'Kuchai Lama']"
                                    label="Select Location"></v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-btn color="red" @click="checkoutNow">Checkout Now</v-btn>
                </v-col>

                <v-col v-else cols="12">
                    <p class="text-center">No items in cart</p>
                </v-col>

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

                        </v-row>
                    </v-card>
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
        const selectedLocation = ref(null);
        const appointmentDate = ref(null);
        const appointmentTime = ref(null);
        const isLoggedIn = ref(true);
        const cartCount = ref(null);


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
            console.log(appointmentTime.value);
            try {
                const token = localStorage.getItem('jwt');
                axios.post('http://api.tayar.pro/checkout', {
                    branch: selectedLocation.value,
                    appointment_date: appointmentDate.value,
                    appointment_time: appointmentTime.value
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        console.log('Checkout successful:', response.data);
                        router.push('/orders'); // Redirect to /orders
                    })
                    .catch(error => {
                        console.error('Error checking out:', error);
                    });
            } catch (error) {
                console.error('Error checking out:', error);
            }
        };


        onMounted(() => {
            getCartItems();
        });

        return {
            carts,
            checkoutNow,
            selectedLocation,
            appointmentDate,
            appointmentTime,
            isLoggedIn,
            cartCount
        };
    },
};



</script>