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

        <fieldset id="doseSchedulerPreview">
            <legend style="padding: 0 10px;">Scheduled</legend>

            <SchedulerBlock v-for="entry in scheduled" @click="editScheduled = entry.uuidv4; panels.schedulerPanel = true;" :entry="entry" />

            <button style="width: 90%;" @click="panels.schedulerPanel = true;">
                Add another scheduled carb ratio.
            </button>
        </fieldset>

        <transition name="slide">
            <Panel v-if="panels.schedulerPanel">
                <SchedulerPanel :editID="editScheduled" @close="closeSchedulerPanel()" />
            </Panel>
        </transition>
    </div>
</template>

<style>
    #doseSchedulerPreview {
        width:100%; 
        border-width: 0.5px; 
        border-radius: 10px;
        padding: 10px 0;
        border-color: var(--tertiary-colour);
        border-style: solid;
        margin-top: 40px; 
        display: flex; 
        flex-direction: column; 
        align-items: center;
    }

    #doseSchedulerPreview > button {
        background-color: var(--main-bg-colour);
        
        color: var(--text-colour-main);
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;

        margin-top: 10px;
        padding: 20px;

        border: none;
        border-bottom: 1.5px solid var(--action-colour);
        border-radius: 4px;

        display: flex;
        justify-content: space-around;
    }
</style>

<script>
import Option from '../Options/Option.vue';
import InputArea from '../Options/InputArea.vue';
import Input from '../Options/Input.vue';
import InputLabel from '../Options/InputLabel.vue';
import InputButton from '../Options/InputButton.vue';
import OptionLabel from '../Options/OptionLabel.vue';
import InputError from '../Options/InputError.vue';
import ButtonSecondary from '../Buttons/Secondary.vue';
import ModifierBlock from "../Other/ModifierBlock.vue";

import Panel from '../Panels/Panel.vue';
import SchedulerPanel from '../Panels/DoseSettings/DoseScheduler.vue';

import SchedulerBlock from "./SchedulerBlock.vue";

import secureStorage from "../../logic/secureStorage.js";

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
        SchedulerPanel,
        ModifierBlock,
        SchedulerBlock
    },
    data() {
        return {
            panels: {
                schedulerPanel: false,
            },
            editScheduled: null,
            scheduled: secureStorage.retrieve.carbRatioScheduled()
        }
    },
    methods: {
        closeSchedulerPanel() {
            this.panels.schedulerPanel = false; 
            this.editScheduled = null;
            this.scheduled = secureStorage.retrieve.carbRatioScheduled();
        }
    }
}
</script>