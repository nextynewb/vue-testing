<template>
    <div>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
export default {
    name: 'Logout',
    methods: {
        logout() {
            localStorage.clear();
            // You can also redirect the user to a login page or home page after logout
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
button {
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #d32f2f;
}
</style>