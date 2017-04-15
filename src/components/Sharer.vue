<template>
    <div>
        <div class="shareBar">
            <button class="formTrigger" @click="triggerModal()">Nag a Friend</button>
        </div>
        <div v-if="isSendNag">
            <div class="modalMask" @click="closeModal()">
                <div class="modal" @click.stop @keydown.esc="closeModal()">
                    <span class="close" @click="closeModal()"><i class="fa fa-times" aria-hidden="true"></i></span>
                    <h2>Nag a Friend</h2>
                    <div class="recipientContainer" >
                        <label for="sendTo">Send to:</label><br />
                        <input id="sendTo" type="text" v-model="recipient" 
                                    @focus="openSuggestions()"
                                    @blur="closeSuggestions()"
                                    @keydown.down="focusNextSuggestion()"
                                    @keydown.up.prevent.stop="focusPrevSuggestion()"
                                    @keydown.enter="chooseRecipient()"
                                    @keydown.esc.stop.prevent="closeSuggestionsOrModal()" />
                        <div v-show="suggestionsOpen && suggestions.length > 0" class="autocomplete">
                            <div v-for="(suggestion, index) in suggestions" 
                                    :class="{highlighted: suggestion==selectedSuggestion}"
                                    class="suggestion"
                                    :key="index">
                                    {{suggestion.displayString}}
                            </div>
                        </div>
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
            suggestionsOpen: false,
            selectedSuggestion: null,
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
        sessionInfo: Object,
        friends: Array,
    },
    watch: {
        recipient() {
            this.openSuggestions();
        }
    },
    computed: {
        suggestions() {
            if (!this.recipient.length) return [];
            var suggestions = this.friends.filter((friend) => {
                return friend.email.includes(this.recipient) ||
                        (friend.first_name + " " + friend.last_name).includes(this.recipient)
            }).map(friend => {
                return {
                    email: friend.email,
                    displayString: friend.first_name + " " + friend.last_name + " (" + friend.email + ")"
                };
            });
            if (suggestions.length <= 10) {
                this.selectedSuggestion=suggestions[0];
                return suggestions;
            }
            return [];
        }
    },
    methods: {
        closeSuggestionsOrModal() {
            if (this.suggestionsOpen) {
                this.closeSuggestions();
            } else {
                this.closeModal();
            }
        },
        closeSuggestions() {
            this.selectedSuggestion = null;
            this.suggestionsOpen = false;
        },
        openSuggestions() {
            if(!this.suggestionsOpen) {
                this.suggestionsOpen = true;
                this.selectedSuggestion = this.suggestions[0];
            }
        },
        focusNextSuggestion() {
            if (this.selectedSuggestion == null) {
                this.selectedSuggestion = this.suggestions[0];
            } else {
                var nextIndex = this.suggestions.map(
                    suggestion=> {
                        return suggestion.email;
                    }).indexOf(this.selectedSuggestion.email) + 1;
                if (nextIndex >= 0 && nextIndex < this.suggestions.length) {
                    this.selectedSuggestion = this.suggestions[nextIndex];
                }
            }
        },
        focusPrevSuggestion() {
            if (this.selectedSuggestion != null) {
                var previousIndex = this.suggestions.map(
                    suggestion=> {
                        return suggestion.email;
                    }).indexOf(this.selectedSuggestion.email) - 1;
                if (previousIndex >= 0) {
                    this.selectedSuggestion = this.suggestions[previousIndex];
                }
            }
        },
        chooseRecipient() {
            if (this.selectedSuggestion) {
                this.recipient = this.selectedSuggestion.email;
            }
            this.suggestionsOpen = false;
        },
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
                this.closeModal();
                EventBus.$emit(Consts.EVENT_ITEM_CREATED)
            }, response => {
                console.log("Error: coudn't send item");

                if (response.status == 401) {
                    EventBus.$emit(Consts.EVENT_SESSION_DESTROYED);
                }
            });

            if (!this.friends.filter((friend) => {return friend.email == this.recipient}).length) {
                options.url = Consts.BASE_API_URL + "/" + Consts.FOLLOWING_ENDPOINT;
                options.body = {
                    friendee: this.recipient
                }
            }
            this.$http(options).then((response) => {
                //TODO: do something with this
                EventBus.$emit(Consts.EVENT_FRIEND_CREATED, response);
            }, (response) => {
                console.log("Error: Couldn't create friendship");
            })
        },
        closeModal() {
            this.isSendNag = false;
            this.selectedSuggestion = null;
            this.recipient = '';
            this.url = '';
            this.title = '';
            this.desc = '';
            EventBus.$emit(Consts.EVENT_MODAL_IS_OPEN, false);
        },
        triggerModal() {
            this.isSendNag=true;
            EventBus.$emit(Consts.EVENT_MODAL_IS_OPEN, true);
        },
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
        position: relative;
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

    .recipientContainer {
        position: relative;
        margin-bottom: 20px;
    }

    .recipientContainer input {
        margin-bottom: 0;
    }

    .autocomplete {
        position: absolute;
        background: white;
        width: 100%;
    }

    .autocomplete div.suggestion {
        padding: 5px;
        background: white;
        font-size: 14px;
        text-align: left;
        border: 1px solid #555;
        border-collapse: collapse;
        border-bottom: none;
    }
    .autocomplete div.suggestion.highlighted {
        background: #4da5ff;
        color: white;
    }
    .autocomplete div.suggestion:last-of-type {
        border-bottom: 1px solid #555;
    }
    .modal span.close {
        position: absolute;
        top: 0px;
        right: 0px;
        padding: 20px;
        cursor: pointer;
    }

</style>