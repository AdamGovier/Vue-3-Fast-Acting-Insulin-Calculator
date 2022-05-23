<template>
    <div style="width: 90%;" class="horizCentre">
        <Option title="Insulin To Carb Ratio (Default)">
            <InputError />
            <InputArea>
                <Input placeholder="8" step="0.1"/>
                <InputLabel single="true" :value="'(1:' + '?' + ')'"/>
                <InputButton icon="fas fa-clock" @click="this.$emit('showScheduler')" />
            </InputArea>
            <OptionLabel>
                <template v-slot:content>
                    If no dose setting is specified for the current time then the calculator will will use the above value.
                </template>
            </OptionLabel>
        </Option>

        <ButtonSecondary style="width: 90%;" @click="panels.schedulerPanel = true;">
            Add a timed carb ratio.
        </ButtonSecondary>

        <transition name="slide">
            <Panel v-if="panels.schedulerPanel">
                <SchedulerPanel @close="panels.schedulerPanel = false;" />
            </Panel>
        </transition>
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
import ButtonSecondary from '../Buttons/Secondary.vue';

import Panel from '../Panels/Panel.vue';
import SchedulerPanel from '../Panels/DoseSettings/DoseScheduler.vue';

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputError,
        ButtonSecondary,
        Panel,
        SchedulerPanel
    },
    data() {
        return {
            panels: {
                schedulerPanel: false
            }
        }
    },
}
</script>