<template>
    <v-main>
        <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
        </AppHeader>

        <v-container class="mt-5">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="serviceImageUrl" alt="Service Image"></v-img>
                </v-col>
                <v-col cols="12" md="6">
                    <h1>{{ serviceName }}</h1>
                    <p>Description: {{ serviceDescription }}</p>

                    <div v-if="servicePricing.length">
                        <h2>Pricing</h2>
                        <v-radio-group v-model="selectedPricing">
                            <v-radio v-for="price in servicePricing" :key="price.service_pricing_id"
                                :label="price.description" :value="price.service_pricing_id"></v-radio>
                        </v-radio-group>
                    </div>
                    <div class="d-flex align-center">
                        <span class="mr-2"></span>
                        <v-btn icon @click="decreaseQuantity" :disabled="quantity === 0">
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <v-text-field v-model="quantity" type="number" class="mx-2"
                            style="width: 50px; text-align: center;" readonly hide-details></v-text-field>
                        <v-btn icon @click="increaseQuantity">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>

                        <v-btn color="red" @click="addToCart">
                            Add to Cart
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    name: 'Service',
    setup() {
        const route = useRoute();
        const serviceId = ref(null);
        const serviceName = ref(null);
        const isLoggedIn = ref(true);
        const servicePricing = ref([]);
        const serviceImageUrl = ref(null);
        const serviceDescription = ref(null);
        const stockQuantity = ref(null); // Define stockQuantity
        const quantity = ref(1); // Define quantity
        const selectedPricing = ref(null);
        const cartCount = ref(0);
        const carts = ref([]); // Define carts

        const getServiceById = async (serviceID) => {
            try {
                const response = await axios.get(`http://api.tayar.pro/services/${serviceID}`);
                serviceName.value = response.data.service_name;
                serviceImageUrl.value = response.data.image_url;
                servicePricing.value = response.data.pricing.map(price => ({
                    ...price,
                    description: `${price.vehicle_type}${price.rim_size ? ' - ' + price.rim_size : ''} - MYR ${price.price}`
                }));
                serviceDescription.value = response.data.description;
                stockQuantity.value = response.data.stock_quantity; // Set stockQuantity
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        const increaseQuantity = () => {
            quantity.value++;
        };

        const decreaseQuantity = () => {
            if (quantity.value > 1) {
                quantity.value--;
            }
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

        const addToCart = () => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                alert('You need to be logged in to add items to the cart.');
                return;
            }
            console.log("serviceId", serviceId.value);
            console.log("quantity", quantity.value);
            console.log("selectedPricing", selectedPricing.value);

            axios.post('http://api.tayar.pro/add_service_to_cart', {
                service_id: parseInt(serviceId.value),
                quantity: parseInt(quantity.value),
                service_pricing_id: parseInt(selectedPricing.value)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Service added to cart:', response.data);
                    cartCount.value = response.data.carts.length; // Update cartCount based on response
                    carts.value = response.data.carts; // Update carts based on response
                })
                .catch(error => {
                    console.error('Error adding service to cart:', error);
                });
        };

        onMounted(() => {
            serviceId.value = route.params.serviceId;
            if (serviceId.value) {
                getServiceById(serviceId.value);
                getCartItems();
            }
        });

        return {
            serviceId,
            serviceName,
            servicePricing,
            serviceImageUrl,
            serviceDescription,
            stockQuantity,
            quantity,
            increaseQuantity,
            decreaseQuantity,
            addToCart,
            selectedPricing,
            cartCount,
            carts,
            isLoggedIn
        };
    }
};
</script>