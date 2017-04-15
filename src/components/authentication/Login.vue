<template>
    <div class="authenticationContainer" :class="{isLoading: isLoading}">
        <div  v-if="createNewAccount" class="authType">
            <h2>Create an Account:</h2>
        </div>
        <div v-else class="authType">
            <h2>Log In:</h2>
        </div>
        <div class="loginBox">
            <div>
                <label for="email">Email:</label><br />
                <input type="text" v-model="email" id="email" />
            </div>
            <div v-if="createNewAccount">
                <div>
                    <label for="fname">First Name: </label><br />
                    <input type="text" v-model="firstName" id="fname" />
                </div>
                <div>
                    <label for="lname">Last Name: </label><br />
                    <input type="text" v-model="lastName" id="lname" />
                </div>
            </div>
            <div>
                <label for="password">Password:</label><br />
                <input type="password" v-model="password" id="password" @keyup.enter="validateAndSend" />
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
            email: '',
            password: '',
            isLoading: false,
            firstName: '',
            lastName: '',
        }
    },
    methods: {
        toggleNewAccount(event) {
            event.preventDefault;
            this.createNewAccount = !this.createNewAccount;
        },
        createAccount() {
            this.$http.post(Consts.BASE_API_URL + "/" + Consts.USERS_ENDPOINT, 
                {email: this.email, 
                 password: this.password, 
                 first_name: this.firstName,
                 last_name: this.lastName }).then(
                    (response) => {
                        this.login();
                    }, 
                    (response) => {
                        console.log("Error: Couldn't create user.")
                    }
            );
        },
        validateAndSend() {
            if (this.email && this.password) {
                this.login();
            }
        },
        login() {
            this.isLoading = true;
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.LOGIN_ENDPOINT,
                method: 'GET',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.email + ":" + this.password)
                }
            }
            this.$http(options).then(
                (response) => {
                    var token = response.body.token;
                    if (token) {
                        EventBus.$emit(Consts.EVENT_SESSION_CREATED, {
                            token: token,
                            fname: response.body.first_name, 
                            lname: response.body.last_name,
                            uid: response.body.id});
                        this.email = '';
                        this.password = '';
                        console.log(response.body);
                    }
                    this.isLoading=false;
                }, 
                (response) => {
                    this.isLoading=false
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
    .isLoading button {
        background: rgba(0, 170, 0, 0.7);
        cursor: default;
    }
</style>
