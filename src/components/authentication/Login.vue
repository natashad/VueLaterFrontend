<template>
    <div class="loginBox" v-if="!loggedIn">
        <div  v-if="createNewAccount">
            Create an Account:
        </div>
        <div v-else>
            Log In:
        </div>

        <div>
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" />
        </div>

        <div v-if="createNewAccount">
            <button @click="createAccount()" >Create Account</button>
        </div>
        <div v-else>
            <button @click="login()">Log In</button>
        </div>

        <div class="toggleBox">
            <div v-if="createNewAccount">
                Already have an account? <a href="#" @click="toggleNewAccount">Log in</a>.
            </div>
            <div v-else>
                Don't have an account yet? <a href="#" @click="toggleNewAccount">Create one</a>.
            </div>
        </div>

    </div>
</template>

<script>
import {EventBus} from '../../main.js';
import Consts from '../../constants.js';


export default {
    data() {
        return {
            createNewAccount: false,
            loggedIn: false,            
            username: '',
            password: '',
        }
    },
    methods: {
        toggleNewAccount(event) {
            event.preventDefault;
            this.createNewAccount = !this.createNewAccount;
        },
        createAccount() {
            this.$http.post(Consts.BASE_API_URL + "/" + Consts.USERS_ENDPOINT, 
                {username: this.username, password: this.password}).then(
                    (response) => {
                        this.login();
                    }, 
                    (response) => {
                        console.log("Error: Couldn't create user.")
                    }
            );
        },
        login() {
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.LOGIN_ENDPOINT,
                method: 'GET',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.username + ":" + this.password)
                }
            }
            this.$http(options).then(
                (response) => {
                    var token = response.body.token;
                    if (token) {
                        EventBus.$emit('sessionCreated', {token: token, username: this.username});
                        this.loggedIn = true;
                    }
                }, 
                (response) => {
                    console.log("Error: Couldn't log in user.");
                }
            )
        },
    }, 
    created() {
        EventBus.$on('sessionDestroyed', () => {
            this.loggedIn = false;
            this.username = '';
            this.password = '';
        })
    }
}
</script>

<style>
    .loginBox {
        background: #EEE;
        padding: 20px;
        border: 1px solid black;
        border-radius: 3px        
    }

    .toggleBox {
        border: 1px solid black;
        background: #CCC;
        padding: 10px;
        margin-top: 20px;
        border-radius: 3px
    }
</style>
