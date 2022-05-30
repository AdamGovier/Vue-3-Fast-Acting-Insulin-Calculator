<template>
        <div style="width: 90%;">
            <Option title="Insulin To Carb Ratio">
                <InputError />
                <InputArea>
                <Input :value="carbRatio" @new-data="ratio => {carbRatio = ratio; this.$emit('updateCarbRatio', ratio)}" type="number" placeholder="8" step="0.1"/>
                <InputLabel single="true" :value="'(1:' + (carbRatio || '?') + ')'"/>
                    <InputButton icon="fas fa-clock" @click="this.$emit('showScheduler')" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How many carbohydrates per 1 unit of fast acting insulin.
                    </template>
                    <template v-slot:important>
                        Example: 1:10 meaning 1 unit of insulin per 10 grams of carbohydrates.
                        <br/> <br/>
                        Tap the clock to schedule different carb ratios for certain hours of the day.
                    </template>
                </OptionLabel>
            </Option>
        </div>
</template>

<script>
import Option from '../Options/Option.vue';
import InputArea from '../Options/InputArea.vue';
import Input from '../Options/Input.vue';
import InputLabel from '../Options/InputLabel.vue';
import InputButton from '../Options/InputButton.vue';
import OptionLabel from '../Options/OptionLabel.vue';
import InputError from '../Options/InputError.vue';

import secureStorage from '../../logic/secureStorage.js';

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputError
    },
    data() {
        return {
            carbRatio: secureStorage.retrieve.carbRatio(true)
        }
    },
}
</script>