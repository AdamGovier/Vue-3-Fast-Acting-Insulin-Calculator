<template>
    <div >
        <InputCheckbox v-if="cssCheckbox" v-for="checkbox in checkboxesReactive" @handleClick="handleClick" :checkbox="checkbox" />
        <InputCheckboxButton v-if="button" v-for="checkbox in checkboxesReactive" @handleClick="handleClick" :checkbox="checkbox" />
    </div>
</template>

<script>
import InputCheckbox from '../Options/InputCheckbox.vue';
import InputCheckboxButton from '../Options/InputCheckBoxButton.vue';

export default {
    props:['checkboxes', 'select', 'button'],
    components: {
        InputCheckbox,
        InputCheckboxButton
    },  
    data() {
        return {
            checkboxesReactive: []
        }
    },
    mounted() {
        // document.querySelector(`input[checkbox_id="${this.select}"]`).checked = true;
        this.checkboxesReactive = this.checkboxes;
        // this.checkboxesReactive[0].checked = true;
    },
    computed: {
        cssCheckbox() {
            return !this.button; // For a conditional class as do not want to render the InputCheckboxRadio if button is true.
        }
    },
    methods: {
        handleClick(selected) { // This mimics a radio button, I wanted to use checkboxes for design reasons.
            const disableList = this.checkboxesReactive.filter(checkbox => checkbox.name !== selected); // Filter out selected checkboxes. So we can disable the checkboxes which have not been selected.

            disableList.forEach(checkbox => { // Disable them
                checkbox.checked = false;
            });

            this.checkboxesReactive.filter(checkbox => checkbox.name === selected)[0].checked = true; // Enable the intended one.
            this.$emit('selected', selected); // emit to parent with the new selected checkbox
        }   
    },
}
</script>

<style scoped>
    div {
        width: 100%; display: flex;
    }
</style>