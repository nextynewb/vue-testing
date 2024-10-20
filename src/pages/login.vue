<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="username">Username:</label>
                <input type="text" v-model="username" id="username" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" id="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const username = ref('');
        const password = ref('');
        const router = useRouter();

        const handleLogin = () => {
            // Handle login logic here
            console.log('Username:', username.value);
            console.log('Password:', password.value);

            const formData = new FormData();
            formData.append('username', username.value);
            formData.append('password', password.value);

            axios.post('http://api.tayar.pro/login', formData)
                .then(response => {
                    console.log('Login successful:', response.data);
                    localStorage.setItem('jwt', response.data.access_token);
                    router.push('/products');
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    alert('Login failed. Please try again.');
                });
        };

        return {
            username,
            password,
            handleLogin
        };
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-container h2 {
    text-align: center;
}

.login-container div {
    margin-bottom: 15px;
}

.login-container label {
    display: block;
    margin-bottom: 5px;
}

.login-container input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.login-container button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login-container button:hover {
    background-color: #0056b3;
}
</style>