<template>
    <section class="horizCentre">
        <h1 style="margin-block-end: 20px;">Dose Settings</h1>
        
        <div style="width: 90%; margin-top: 20px;">
            <Option title="Insulin To Carb Ratio">
                <InputError :value="errors.carbRatio" v-if="errors.carbRatio" />
                <InputArea>
                    <Input :value="carbRatio" @new-data="ratio => carbRatio = ratio" type="number" placeholder="8" step="0.1"/>
                    <InputLabel single="true" :value="'(1:' + (carbRatio ? carbRatio : '?') + ')'"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How many carbohydrates per 1 unit of fast acting insulin.
                    </template>
                    <template v-slot:important>
                        Example: 1:10 meaning 1 unit of insulin per 10 grams of carbohydrates.
                    </template>
                </OptionLabel>
            </Option>

            
            <div class="horizCentre" style="margin-top: 20px;">
                <BtnPrimary :value="carbRatio ? 'Save' : 'Missing Values'" :disabled="!carbRatio" @click="saveDose()"/>
            </div>
        </div>
    </section>
</template>

<script>
import Option from '../../components/Options/Option.vue';
import InputArea from '../../components/Options/InputArea.vue';
import Input from '../../components/Options/Input.vue';
import InputLabel from '../../components/Options/InputLabel.vue';
import InputButton from '../../components/Options/InputButton.vue';
import OptionLabel from '../../components/Options/OptionLabel.vue';
import InputError from '../../components/Options/InputError.vue';

import BtnPrimary from '../../components/Buttons/Primary.vue';

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputError,
        BtnPrimary
    },
    data() {
        return {
            carbRatio:null,
            errors: {
                carbRatio: null
            }
        }
    },
    mounted() {
        const storage = window.localStorage;
        
        this.carbRatio = storage.getItem("app_carb_ratio");
    },
    methods: {
        saveDose() {
            const storage = window.localStorage;

            //Safety Checks
            let error = false;

            if(this.carbRatio <= this.$safety.carbRatio.min || this.carbRatio >= this.$safety.carbRatio.max) {
                this.errors.carbRatio = "* Value is not within the expected range.";
                error = true;
            }

            if(error) return;

            storage.setItem("app_carb_ratio", this.carbRatio);

            if(!storage.getItem('app_launched_before')) {
                this.emitter.emit("override-navigation", {path:'/settings/DoseSettings', icon:"return"});
                this.$router.push('/settings/CorrectionSettings');
            } else {
                this.$router.push('/settings');
            }
        }
    }
}
</script>