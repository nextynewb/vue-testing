<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>


    <v-main>
        <v-container class="mt-5">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="productImageUrl" alt="Product Image"></v-img>
                </v-col>
                <v-col cols="12" md="6">
                    <h1>{{ productName }}</h1>
                    <p>Price: MYR{{ productPrice }}</p>
                    <p>Category: {{ productCategory }}</p>
                    <p>Stock Quantity: {{ stockQuantity }}</p>

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

    <v-snackbar v-model="snackbar" :timeout=3000 top right color="green">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';


import axios from 'axios';
export default {
    name: 'Product',
    setup() {
        const route = useRoute();
        const productId = ref(null);
        const productName = ref(null);
        const productPrice = ref(null);
        const productImageUrl = ref(null);
        const productCategory = ref(null);
        const stockQuantity = ref(null);
        const quantity = ref(1);
        const snackbar = ref(false);
        const snackbarMessage = ref('');


        const cartCount = ref(0);
        const carts = ref([]);
        const isLoggedIn = ref(true);


        const getProductById = async (id) => {
            try {
                const response = await axios.get(`http://api.tayar.pro/products/${id}`);
                console.log('Product:', response.data);
                productName.value = response.data.product_name;
                productPrice.value = response.data.price;
                productImageUrl.value = response.data.image_url;
                productCategory.value = response.data.category;
                stockQuantity.value = response.data.stock_quantity;

            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const addToCart = async () => {

            const token = localStorage.getItem('jwt');
            if (!token) {
                alert('You need to be logged in to add items to the cart.');
                return;
            }

            axios.post('http://api.tayar.pro/add_product_to_cart', {
                product_id: parseInt(productId.value),
                quantity: quantity.value
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then(response => {
                    cartCount.value = response.data.carts.length;
                    carts.value = response.data.carts;
                    snackbarMessage.value = 'Product successfully added to cart';
                    snackbar.value = true;
                })
                .catch(error => {
                    console.error('Error adding product to cart:', error.response ? error.response.data : error);
                });

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
            if (route && route.params) {
                productId.value = route.params.productId;
                console.log('Product ID: ', route.params.productId);
                getProductById(route.params.productId);
                getCartItems();
            } else {
                console.error('Route params are not available');
            }
        });

        return {
            productId,
            productName,
            productPrice,
            productImageUrl,
            productCategory,
            stockQuantity,
            isLoggedIn,
            quantity,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            cartCount,
            carts,
            snackbar,
            snackbarMessage
        };
    }
};
</script>

<style scoped>
/* Your component styles here */
</style>
