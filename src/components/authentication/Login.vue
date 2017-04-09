<template>
    <div class="authenticationContainer">
        <div  v-if="createNewAccount" class="authType">
            <h2>Create an Account:</h2>
        </div>
        <div v-else class="authType">
            <h2>Log In:</h2>
        </div>
        <div class="loginBox">
            <div>
                <label for="username">Username:</label><br />
                <input type="text" v-model="username" id="username" />
            </div>
            <div>
                <label for="password">Password:</label><br />
                <input type="password" v-model="password" id="password" />
            </div>

            <div v-if="createNewAccount" class="buttonDiv">
                <button @click="createAccount()" >Create Account</button>
            </div>
            <div v-else class="buttonDiv">
                <button @click="login()">Log In</button>
            </div>
        </div>
        <div class="toggleBox">
            <div v-if="createNewAccount">
                Already have an account? <a href="#" @click="toggleNewAccount">Log In</a>.
            </div>
            <div v-else>
                Don't have an account yet? <a href="#" @click="toggleNewAccount">Create An Account</a>.
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
                        this.username = '';
                        this.password = '';
                    }
                }, 
                (response) => {
                    console.log("Error: Couldn't log in user.");
                }
            )
        },
    }, 
    created() {
    }
}
</script>

<style scoped>
    .authenticationContainer {
        width: 500px;
        margin: 0 auto;  
    }

    .authType h2 {
        text-align: center;
    }

    .loginBox {
        background: #FFF;
        padding: 20px;
        border: 1px solid #EEE;
        border-radius: 3px;   
    }

    .toggleBox {
        border: 1px solid #CCC;
        background: inherit;
        padding: 10px;
        margin-top: 20px;
        border-radius: 3px
    }
    input {
        padding: 5px 5px;
        margin: 5px 0 20px 0;
        width: 100%;
        box-sizing: border-box;
    }
    label {
        font-weight: bold;
        font-size: 14px;
    }
    button {
        background: linear-gradient(#00CC00, #00AA00);
        color: #FFF;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid #DDD;
        padding: 10px 5px;
        width: 100%;
        border-radius: 5px;
        cursor: pointer;
    }
    .buttonDiv { 
        text-align: center;
    }
</style>
