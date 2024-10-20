<template>
    <v-container>
        <!-- Invoice Header -->
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-title class="text-h5">
                        Invoice - Order #{{ order?.order_id }}
                    </v-card-title>
                    <v-card-subtitle>
                        Date: {{ new Date(order?.created_at).toLocaleDateString() }}
                    </v-card-subtitle>
                    <v-card-text>
                        <div>Customer: {{ order?.user.first_name }} {{ order?.user.last_name }}</div>
                        <div>Email: {{ order?.user.email }}</div>
                        <div>Address: {{ order?.user.address }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Items List -->
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-title class="text-h6">Order Items</v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th v-for="header in itemHeaders" :key="header.value">{{ header.text }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in orderItems" :key="item.id">
                                    <td>
                                        {{ index + 1 }}
                                    </td>
                                    <td>{{ item.product ? item.product.product_name : item.service ?
                                        item.service.service_name : '' }}</td>

                                    <td>
                                        {{ item.product ? formatCurrency(item.product.price) : item.service ?
                                            formatCurrency(item.service_pricing.price) : ''
                                        }}
                                    </td>

                                    <td>{{ item.quantity }}</td>
                                    <td>{{ formatCurrency(item.price) }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Invoice Total Section -->
        <v-row>
            <v-col cols="12" class="text-right">
                <v-card outlined>
                    <v-card-text>
                        <v-row justify="end">
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="6" class="text-right">Total Price:</v-col>
                                    <v-col cols="6"> {{ formatCurrency(subtotal) }}</v-col>
                                </v-row>

                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Print -->

        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn color="red" id="btnPrint" @click="printInvoice">Print Invoice</v-btn>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const invoices = ref([]);
        const router = useRouter();
        const route = useRoute();
        const order = ref(null);
        const orderItems = ref([]);
        const appointments = ref([]);

        const subtotal = ref(0);
        const tax = ref(0);
        const total = ref(0);

        const itemHeaders = [
            { text: '#', value: 'no' },
            { text: 'Item', value: 'name' },
            { text: 'Price', value: 'price' },
            { text: 'Quantity', value: 'quantity' },
            { text: 'Subtotal', value: 'subtotal' }
        ];


        const calculateTotals = () => {
            subtotal.value = orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
            tax.value = (subtotal.value * 0.06).toFixed(2);
            total.value = (parseFloat(subtotal.value) + parseFloat(tax.value)).toFixed(2);
        };

        const getOrderById = async (id) => {
            console.log('Order ID:', id);
            const token = localStorage.getItem('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.post('http://api.tayar.pro/invoice', { order_id: id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                order.value = response.data;
                orderItems.value = response.data.order_items;
                console.log('Order:', response.data);
                calculateTotals(); // Recalculate totals after fetching order items
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
                const response = await axios.post('http://api.tayar.pro/appointments', { order_id: orderId }, {
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

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-MY', {
                style: 'currency',
                currency: 'MYR'
            }).format(value);
        };

        const printInvoice = () => {

            window.print();
        };


        onMounted(() => {
            if (route && route.params && route.params.orderId) {
                const orderId = parseInt(route.params.orderId);
                getOrderById(orderId);
                getAppointments(orderId);
                document.title = `Invoice - Order #${orderId}`;
            } else {
                console.error('Route params are not available');
            }
        });

        return {
            invoices,
            order,
            orderItems,
            appointments,
            subtotal,
            tax,
            total,
            itemHeaders,
            getOrderById,
            getAppointments,
            formatCurrency,
            printInvoice
        };
    }
};
</script>

<style scoped>
.text-right {
    text-align: right;
}

.font-weight-bold {
    font-weight: bold;
}

@media print {
    #btnPrint {
        display: none;
    }

    body * {
        visibility: hidden;
    }

    #invoice-content,
    #invoice-content * {
        visibility: visible;
    }

    #invoice-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
}
</style>
