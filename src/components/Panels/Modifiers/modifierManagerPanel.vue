<template>
    <section class="horizCentre modifierManager">
        <div @click="deleteMod()" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Remove Modifier" icon="far fa-trash-alt" slimline="true" /> 
        </div>

        <div style="width: 90%; margin-top: 40px;">
            <Option title="Modifier Name">
                <InputArea>
                    <Input :value="this.values.modifierName" @new-data="modifierName => values.modifierName = modifierName"  type="text" placeholder="Label e.g. Exercise" />
                </InputArea>
                <InputError v-if="errors.modifierName" :value="errors.modifierName" />
            </Option>

            <Option title="Percentage">
                <InputArea>
                    <Input :value="this.values.percentage" @new-data="percentage => values.percentage = percentage" type="number" placeholder="e.g. 10" />
                    <InputLabel single="true" value="%"/>
                </InputArea>
                <InputError v-if="errors.percentage" :value="errors.percentage" />
                <OptionLabel>
                    <template v-slot:content>
                        How much should the modifier alter your total dosage by?
                    </template>
                </OptionLabel>
            </Option>
            
            <!-- Key for rerendering the option. -->
            <Option centre="true" :key="values.percentage"> 
                <InputCheckboxRadio @selected="
                    selected => selected === `Add ${values.percentage ? values.percentage : 0}%` ? values.addition = true : values.addition = false
                " button="true" :checkboxes="[
                    {
                        name: `Add ${values.percentage ? values.percentage : 0}%`,
                        checked: values.addition
                    },
                    {
                        name: `Deduct ${values.percentage ? values.percentage : 0}%`,
                        checked: !values.addition
                    }
                ]" />
            </Option>

            <div class="horizCentre" style="margin-top: 20px;">
                <InputCheckbox @handleClick="scheduled = !scheduled" :checkbox="{name:'Schedule Automatically', checked:scheduled}"/>

                <ModifierScheduler :selected="values.scheduler" @updated="scheduler => values.scheduler = scheduler" v-if="scheduled" />

                <BtnPrimary @click="save();" value="Save" />
            </div>
            

        </div>
    </section>
</template>

<style>
    .modifierManager .optionBox:nth-child(3) {
        margin: 10px;
    }
</style>

<script>
import MenuItem from "../../menu/MenuItem.vue";

import Option from '../../Options/Option.vue';
import InputArea from '../../Options/InputArea.vue';
import InputLabel from '../../Options/InputLabel.vue';
import Input from '../../Options/Input.vue';
import InputError from '../../Options/InputError.vue';
import OptionLabel from '../../Options/OptionLabel.vue';
import InputCheckboxRadio from '../../Options/InputCheckboxRadio.vue';
import InputCheckbox from '../../Options/InputCheckbox.vue';
import BtnPrimary from '../../Buttons/Primary.vue';

import ModifierScheduler from '../../Other/ModifierScheduler.vue';

import { v4 as uuidv4 } from 'uuid';

export default {
    components: {
        MenuItem,
        Option,
        InputArea,
        InputLabel,
        Input,
        InputError,
        OptionLabel,
        InputCheckboxRadio,
        InputCheckbox,
        BtnPrimary,
        ModifierScheduler
    },
    props: ['edit'],
    data() {
        return {
            scheduled: false,
            values: {
                modifierName: null,
                percentage: null,
                addition: false, // Addition=true to add percentage to dose or =false to deduct
                scheduler: false
            },
            errors: {}
        }
    },
    updated() {
        if(!this.scheduled) this.values.scheduler = false;
    },
    mounted() {
        if(this.edit) {
            const modifier = JSON.parse(window.localStorage.getItem('app_modifiers_json'))
                .filter(modifier => modifier.id === this.edit)[0]; // retrieve modifier to edit from local storage.

            // Assign the modifier to the input fields.
            this.values.modifierName = modifier.name;
            this.values.percentage = modifier.percentage;
            this.values.addition = modifier.addition;
            
            this.values.scheduler = modifier.scheduler;
            if(this.values.scheduler) this.scheduled = true;
        }
    },
    methods: {
        save() {
            if(!this.values.modifierName) return this.errors.modifierName = "You must specify a modifier name.";
            if(!this.values.percentage) return this.errors.percentage = "You must specify a modification amount.";
            if(this.values.percentage <= 0) return this.errors.percentage = "Your modification amount must be greater than zero.";

            const storage = window.localStorage;
            
            let modifiers = [];
            if(storage.getItem('app_modifiers_json')) {
                modifiers = JSON.parse(storage.getItem('app_modifiers_json')); // If previous modifiers exist in the localStorage set the modifiers to them.
            }

            if(this.edit) {
                modifiers = modifiers.filter(modifier => modifier.id !== this.edit); // If edit is on delete the modifier in question then below create a new one with new values.
            }
            
            modifiers.push({ 
                name: this.values.modifierName,
                percentage: parseFloat(this.values.percentage),
                addition: this.values.addition,
                scheduler: this.values.scheduler,
                id: uuidv4() // Used to identify the modifier for purposes such as editing them and using them.
            })

            storage.setItem('app_modifiers_json', JSON.stringify(modifiers)); // Write the modifiers to the localStorage.
            this.$emit('close'); // Close the panel.
        },
        deleteMod() {
            if(this.edit) {
                // May use my own UI component for the confirm in the future for more functionality such as exit without saving.
                const confirmed = confirm('Are you sure that you wish to delete this modifier?');
                if(confirmed) { // If they confirmed that they want to delete the modifier. 
                    const storage = window.localStorage;

                    let modifiers = [];
                    if(storage.getItem('app_modifiers_json')) {
                        modifiers = JSON.parse(storage.getItem('app_modifiers_json'));
                    }

                    modifiers = modifiers.filter(modifier => modifier.id !== this.edit); // delete modifier.

                    storage.setItem('app_modifiers_json', JSON.stringify(modifiers));

                    this.$emit('close');
                }
                return; // Finish executing this function.
            }

            this.$emit('close'); // Close window if not editing a modifier.
        }
    }
}
</script>