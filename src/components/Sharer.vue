<template>
    <div>
        <div class="shareBar">
            <button class="formTrigger" @click="isSendNag=true">Send a Nag</button>
        </div>
        <div v-if="isSendNag">
            <div class="modalMask" @click="isSendNag=false">
                <div class="modal" @click.stop>
                    <h2>Send a Nag</h2>
                    <div>
                        <label for="sendTo">Send to:</label><br />
                        <input if="sendTo" type="text" v-model="recipient"/>
                    </div>
                    <div>
                        <label for="url">URL:</label><br />
                        <input if="url" type="text" v-model="url"/>
                    </div>
                    <div>
                        <label for="title">Title (Optional):</label><br />
                        <input if="title" type="text" v-model="title"/>
                    </div>
                    <div>
                        <label for="desc">Description (Optional):</label><br />
                        <textarea id="desc" v-model="desc" rows="5"></textarea>
                    </div>
                    <button class="formTrigger" @click="send">
                        Send
                    </button>
                </div>
            </div>
            
        </div>
            
    </div>
</template>

<script>
import Consts from '../constants.js';

export default {
    data() {
        return {
            isSendNag: false,
            recipient: '',
            url: '',
            title: '',
            desc: '',
        }
    },
    props: {
        sessionInfo: Object
    },
    methods: {
        send() {
            console.log("SENDING");
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.ITEMS_ENDPOINT,
                method: 'POST',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.sessionInfo.token + ":unused")
                },
                body: {owner: this.recipient, url: this.url}
            }
            this.$http(options).then((response) => {
                this.close();
                //TODO: update the client if the event belongs to them.
            }, response => {
                console.log("Error: coudn't send item");
            });
        },
        close() {
            this.isSendNag = false;
            this.recipient = '';
            this.url = '';
            this.title = '';
            this.desc = '';
        }
    },
}
</script>

<style>
    .shareBar {
        background: #EEE;
        padding: 20px;
        text-align: center;
    }
    button.formTrigger {
        background: linear-gradient(#FF6A80, #e55f73);
        padding: 10px;
        border-radius: 5px;
        font-size: 15px;
        cursor: pointer;
        color: white;
        border: 1px solid #DDD;
    }
    .modalMask {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 10;
        top: 0;
        background: rgba(0,0,0,0.8);
        cursor: pointer;
    }
    .modal {
        width: 600px;
        border: 1px solid black;
        z-index: 11;
        margin: 0 auto;
        background: white;
        cursor: default;
        margin-top: 20px;
        padding: 20px;
        border-radius: 5px;
    }

    .modal h2 {
        text-align: center;
    }

    .modal label {
        font-size: 14px;
        font-weight: bold;
    }

    .modal input, .modal textarea {
        width: 100%;
        margin: 10px 0 20px 0;
        font-size: 15px;
        padding: 5px;
        box-sizing: border-box;
    }
    
    .modal button {
        width: 100%;
    }

</style>