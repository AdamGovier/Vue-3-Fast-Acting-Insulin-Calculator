<template>
    <label class="InputCheckbox" @mouseup="this.$emit('handleClick', checkbox.name)">
        {{ checkbox.name }}
        <input type="checkbox" @click.prevent="" :checked="checkbox.checked">
        <span class="checkmark"></span>
    </label>
</template>

<script>
export default {
    props:['checkbox']
}
</script>

<style>
    /*Below modified from w3Schools https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */
    .InputCheckbox {
        position: relative;

        padding-left: 35px;
        margin: 0 15px;
        margin-bottom: 12px;

        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        font-family: 'Montserrat', sans-serif;
        font-size:15px;
    }

    /* Hide the browser's default checkbox */
    .InputCheckbox input {
        opacity: 0;
        cursor: pointer;

        position: absolute;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .InputCheckbox .checkmark {
        position: absolute;
        top: 0;
        left: 0;

        height: 25px;
        width: 25px;

        background-color: var(--tertiary-colour);
    }

    /* When the checkbox is checked, add a blue background */
    .InputCheckbox input:checked ~ .checkmark {
        background-color: var(--action-colour);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .InputCheckbox .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .InputCheckbox input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .InputCheckbox .checkmark:after {
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid var(--text-colour-main);
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    /*End of w3Schools Modified Code*/
</style>