<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>

    <v-container>
        <v-row>
            <v-col v-for="(product, index) in products" :key="index" cols="12" md="4">
                <v-card class="mx-auto">
                    <v-img :src="product.image_url" alt="Product Image" height="200px" />
                    <v-card-title>{{ product.product_name }}</v-card-title>
                    <v-card-subtitle class="font-weight-bold text-white">
                        RM {{ product.price }}
                    </v-card-subtitle>
                    <v-card-actions>
                        <v-btn @click="redirectProduct(product.product_id)" outlined color="red">View Product</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const products = ref([]);
        const router = useRouter();
        const isLoggedIn = ref(true);
        const carts = ref([]);
        const cartCount = ref(null);

        const getProducts = async () => {
            try {
                const response = await axios.get('http://api.tayar.pro/products');
                products.value = response.data;
                console.log(this.products);
            } catch (error) {
                console.error('Error fetching products:', error);
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

        const redirectProduct = (productId) => {
            router.push(`/product/${productId}`);
        };
        onMounted(() => {
            getProducts();
            getCartItems();
        });

        return {
            products,
            redirectProduct,
            isLoggedIn,
            carts,
            cartCount,
        };
    },
};

</script>