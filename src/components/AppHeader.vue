<template>
    <v-app-bar app dense color="white" flat>
        <!-- Logo -->

        <v-toolbar-title class="text-uppercase red--text" style="font-size: 1.5rem;">
            <span class="font-weight-bold" @click="$router.push('/')">TayarPro</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Navigation Links Centered -->
        <v-row justify="center" class="d-flex" style="margin-left: -100px;">
            <v-btn class="text-capitalize" style="font-size: 1rem;" @click="$router.push('/products')">
                Products
            </v-btn>
            <v-btn class="text-capitalize" style="font-size: 1rem;" @click="$router.push('/services')">
                Services
            </v-btn>
            <v-btn class="text-capitalize" style="font-size: 1rem;" @click="$router.push('/orders')">
                Orders
            </v-btn>
        </v-row>

        <v-spacer></v-spacer>

        <div v-if="isLoggedIn">
            <v-menu offset-y max-width="300">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-badge :content="cartCount" color="red" overlap>
                            <v-icon color="red" size="24px">mdi-cart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                </template>
                <!-- Cart dropdown content -->
                <v-card>
                    <v-list>
                        <v-list-item v-for="item in carts" :key="item.id">

                            <v-list-item v-if="item.product" :prepend-avatar="item.product.image_url">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.product.product_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Price (RM {{ item.product.price }})
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        Quantity (x{{ item.quantity }})
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item v-else-if="item.service" :prepend-avatar="item.service.image_url">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.service.service_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Price (RM {{ item.service_pricing.price }})
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        Quantity (x{{ item.quantity }})
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-divider class="mt-2"></v-divider>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item class="mx-auto text-center">
                            <v-btn block color="red" class="w-100" @click="$router.push('/carts')">
                                Check All Item in Carts
                            </v-btn>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>


            <v-btn icon>
                <v-icon color="red" size="24px">mdi-account-circle-outline</v-icon>
            </v-btn>

            <v-btn text>
                Hello, Rahman Rom
            </v-btn>
        </div>

        <div v-else>
            <v-btn text @click="$router.push('/login')">Login / Register</v-btn>
        </div>


    </v-app-bar>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    props: {
        cartCount: {
            type: Number,
        },
        carts: {
            type: Array,
        },
        isLoggedIn: {
            type: Boolean,
        },
    },
    setup(props) {
        return {
        };

    }
};
</script>