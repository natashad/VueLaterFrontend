<template>
    <div>
        <div class="shareBar">
            <button class="formTrigger" @click="isSendNag=true">Nag a Friend</button>
        </div>
        <div v-if="isSendNag">
            <div class="modalMask" @click="isSendNag=false">
                <div class="modal" @click.stop>
                    <h2>Nag a Friend</h2>
                    <div>
                        <label for="sendTo">Send to:</label><br />
                        <input id="sendTo" type="text" v-model="recipient"/>
                    </div>
                    <div>
                        <label for="url">URL:</label><br />
                        <input id="url" type="text" v-model="url"/>
                    </div>
                    <div>
                        <label for="type">Type (Optional):</label><br />
                        <select v-model="type" id="type">
                            <option v-for="option in typeOptions" v-bind:value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="duration">Duration (Optional):</label><br />
                        <select v-model="duration" id="duration">
                            <option v-for="option in durationOptions" v-bind:value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="notes">Notes (Optional):</label><br />
                        <textarea id="notes" v-model="notes" rows="5"></textarea>
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
import {EventBus} from '../main.js';

export default {
    data() {
        return {
            isSendNag: false,
            recipient: '',
            url: '',
            type: 'watch',
            duration: 'medium',
            notes: '',
            typeOptions: [
                {text: 'Watch', value: 'watch'},
                {text: 'Read', value: 'read'},
                {text: 'Listen', value: 'listen'}                
            ],
            durationOptions: [
                {text: 'Short', value: 'short'},
                {text: 'Medium', value: 'medium'},
                {text: 'Long', value: 'long'}                
            ],
        }
    },
    props: {
        sessionInfo: Object
    },
    methods: {
        send() {
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.ITEMS_ENDPOINT,
                method: 'POST',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.sessionInfo.token + ":unused")
                },
                body: {owner: this.recipient, 
                        url: this.url,
                        type: this.type,
                        duration: this.duration,
                        note: this.notes}
            }
            this.$http(options).then((response) => {
                this.close();
                EventBus.$emit(Consts.EVENT_ITEM_CREATED)
            }, response => {
                console.log("Error: coudn't send item");

                if (response.status == 401) {
                    EventBus.$emit(Consts.EVENT_SESSION_DESTROYED);
                }
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

    .modal input, .modal textarea, .modal select {
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