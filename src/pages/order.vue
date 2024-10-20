<template>
    <AppHeader :cartCount="cartCount" :carts="carts" :isLoggedIn="isLoggedIn">
    </AppHeader>

    <v-main>
        <v-container v-if="order">
            <p style="font-size: 30px; font-weight: bold;">ORDER ID: {{ order.order_id }}</p>
            <v-row>
                <v-col cols="6">
                    <p>Order Date: {{ order.created_at }}</p>

                </v-col>

                <v-col cols="6" class="text-right">
                    <p>Order Status:
                        <v-chip v-if="order.status == 'Pending'" class="status-chip" color="orange">{{ order.status
                            }}</v-chip>
                        <v-chip v-else-if="order.status == 'Paid'" class="status-chip" color="green">{{ order.status
                            }}</v-chip>
                        <v-chip v-else-if="order.status == 'Cancelled'" class="status-chip" color="red">{{ order.status
                            }}</v-chip>
                    </p>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" v-for="item in orderItems">

                    <v-card outlined v-if="item.product">
                        <v-row no-gutters>
                            <v-col cols="3">
                                <v-img :src="item.product.image_url" aspect-ratio="1"></v-img>
                            </v-col>
                            <v-col cols="9">
                                <v-card-title>
                                    {{ item.product.product_name }}
                                </v-card-title>
                                <v-card-text>
                                    <div>x {{ item.quantity }}</div>
                                    <v-chip outlined small color="green">Tyre</v-chip>
                                </v-card-text>
                                <v-row justify="end" class="ma-2">
                                    <v-col cols="auto">
                                        <p class="text-price">{{ formatCurrency(item.product.price) }}</p>
                                    </v-col>
                                </v-row>

                            </v-col>
                        </v-row>
                    </v-card>


                    <v-card outlined v-else-if="item.service">
                        <v-row no-gutters>
                            <v-col cols="3">
                                <v-img :src="item.service.image_url" aspect-ratio="1"></v-img>
                            </v-col>
                            <v-col cols="9">
                                <v-card-title>
                                    {{ item.service.service_name }}
                                </v-card-title>
                                <v-card-subtitle>Variation:
                                    <span v-if="item.service_pricing.rim_size">Rim Size: {{
                                        item.service_pricing.rim_size
                                        }}</span>
                                    <span v-if="item.service_pricing.vehicle_type">Vehicle Type ({{
                                        item.service_pricing.vehicle_type
                                        }})</span>
                                </v-card-subtitle>
                                <v-card-text>
                                    <div>x {{ item.quantity }}</div>
                                    <v-chip outlined small color="orange">Servicing</v-chip>
                                </v-card-text>
                                <v-row justify="end" class="ma-2">
                                    <v-col cols="auto">
                                        <span class="text-price"> {{ formatCurrency(item.service_pricing.price)
                                            }}</span>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <section class="mt-5">


                <h3 class="mb-4">Appointments</h3>


                <!-- Appointment Cards -->

                <v-alert v-if="appointments.length > 0" type="warning">
                    You have schedule {{ appointments.length }} appointment(s) for this order.
                </v-alert>

                <v-table v-if="appointments.length > 0">
                    <thead>
                        <tr>
                            <th class="text-left">Date</th>
                            <th class="text-left">Time</th>
                            <th class="text-left">Branch</th>
                            <th class="text-left">Service</th>
                            <th class="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="appointment in appointments">
                            <td>{{ appointment.appointment_date }}</td>
                            <td>{{ appointment.appointment_time }}</td>
                            <td>{{ appointment.branch }}</td>
                            <td>{{ appointment.title }}</td>
                            <td>
                                <v-chip v-if="appointment.status == 'Waiting'" color="orange">{{ appointment.status
                                    }}</v-chip>

                                <v-chip v-else-if="appointment.status == 'Cancelled'" color="red">{{ appointment.status
                                    }}</v-chip>

                                <v-chip v-if="appointment.status == 'Completed'" color="green">{{ appointment.status
                                    }}</v-chip>
                            </td>
                        </tr>

                    </tbody>
                </v-table>


            </section>

            <v-row class="my-4">
                <v-col cols="12">
                    <v-divider></v-divider>
                    <v-row justify="space-between" class="py-4">
                        <v-col cols="6">
                            <strong>Order Total:</strong> {{ formatCurrency(order.total) }}
                        </v-col>

                        <v-col cols="6" class="text-right">
                            <v-btn v-if="order.status == 'Pending'" color="orange" large
                                @click="paymentComplete(orderId)">Pay
                                Now</v-btn>
                            <v-btn v-else-if="order.status == 'Paid'" color="green" @click="redirectInvoice">Get
                                Invoice</v-btn>
                            <v-btn v-else-if="order.status == 'Cancelled'" color="red">{{ order.status }}</v-btn>

                        </v-col>

                        <v-col cols="6" class="text-right">
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-container>

    </v-main>

</template>



<style scoped>
.status-chip {
    font-weight: bold;
}

.original-price {
    text-decoration: line-through;
    color: grey;
}

.text-price {
    font-size: 1.25rem;
    font-weight: bold;
}

.text-right {
    text-align: right;
}
</style>



<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const orderId = ref(null);
        const orderDetail = ref(null);
        const route = useRoute();
        const router = useRouter();
        const order = ref(null);
        const orderItems = ref([]);
        const appointments = ref([]);
        const isLoggedIn = ref(true);
        const carts = ref([]);
        const cartCount = ref(null);

        const getOrderById = async (id) => {
            console.log('Order ID:', id);
            const token = localStorage.getItem('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.post('http://api.tayar.pro/order', {
                    order_id: id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                order.value = response.data;
                orderItems.value = response.data.order_items;
                console.log('Order:', response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const getAppointments = async (orderId) => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.post('http://api.tayar.pro/appointments', {
                    order_id: orderId
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                appointments.value = response.data;
                console.log('Appointments:', response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };


        const paymentComplete = (orderId) => {
            alert(`Payment complete for order ID: ${orderId}`);

            const token = localStorage.getItem('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            axios.post('http://api.tayar.pro/payment', {
                order_id: orderId,
                payment_method: 'Credit Card'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Payment complete:', response.data);
                    router.push('/orders');
                })
                .catch(error => {
                    console.error('Error completing payment:', error);
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


        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-MY', {
                style: 'currency',
                currency: 'MYR'
            }).format(value);
        };

        const redirectInvoice = () => {
            window.open(`/invoice/${orderId.value}`, '_blank');
        }


        onMounted(() => {
            if (route && route.params && route.params.orderId) {
                const id = parseInt(route.params.orderId);
                orderId.value = id;
                getOrderById(id);
                getAppointments(id);
                getCartItems();
            }
        });

        return {
            orderId,
            orderDetail,
            order,
            getOrderById,
            orderItems,
            appointments,
            formatCurrency,
            paymentComplete,
            isLoggedIn,
            carts,
            cartCount,
            redirectInvoice

        };
    }
};
</script>