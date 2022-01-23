<template>
    <section class="horizCentre">
        <div @click="deleteMod()" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Remove Modifier" icon="far fa-trash-alt" slimline="true" /> 
        </div>

        <div style="width: 90%; margin-top: 40px;">
            <Option title="Modifier Name">
                <InputArea>
                    <Input :value="this.values.modifierName" @new-data="modifierName => values.modifierName = modifierName"  type="text" placeholder="Label e.g. Exercise" />
                    <InputLabel single="true" value="Units"/>
                </InputArea>
            </Option>

            <Option title="Percentage">
                <InputArea>
                    <Input :value="this.values.percentage" @new-data="percentage => values.percentage = percentage" type="number" placeholder="e.g. 10" />
                    <InputLabel single="true" value="%"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        How much should the modifier alter your total dosage by?
                    </template>
                </OptionLabel>
            </Option>
            
            <!-- Key for rerendering the option. -->
            <Option title="Blood Sugar Unit" centre="true"  :key="values.percentage"> 
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

                <BtnPrimary @click="save();" value="Save" />
            </div>

        </div>
    </section>
</template>

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
        BtnPrimary
    },
    props: ['edit'],
    data() {
        return {
            scheduled: false,
            values: {
                modifierName: null,
                percentage: null,
                addition: false // Addition=true to add percentage to dose or =false to deduct
            }
        }
    },
    mounted() {
        if(this.edit) {
            const modifier = JSON.parse(window.localStorage.getItem('app_modifiers_json'))
                .filter(modifier => modifier.id === this.edit)[0]; // retrieve modifier to edit from local storage.

            // Assign the modifier to the input fields.
            this.values.modifierName = modifier.name;
            this.values.percentage = modifier.percentage;
            this.values.addition = modifier.addition;
        }
    },
    methods: {
        save() {
            // Need to add in the else condition for this, right now it does nothing when you have missing inputs.
            if(this.values.modifierName && this.values.percentage && this.values.percentage > 0) { // Simple validation plan to expand this.
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
                    percentage: this.values.percentage,
                    addition: this.values.addition,
                    id: uuidv4() // Used to identify the modifier for purposes such as editing them and using them.
                })

                storage.setItem('app_modifiers_json', JSON.stringify(modifiers)); // Write the modifiers to the localStorage.
                this.$emit('close'); // Close the panel.
            }
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

                    modifiers = modifiers.filter(modifier => modifier.id !== this.edit);

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