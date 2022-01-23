<template>
    <div class="InputCheckBoxButton">
        <label @click="this.$emit('handleClick', checkbox.name)">
            <input type="checkbox" @click.prevent="" :checked="checkbox.checked">
            <span>{{ checkbox.name }}</span>
        </label>
    </div>
</template>

<script>
export default {
    props:['checkbox']
}
</script>

<style>
    /* https://jsfiddle.net/zAFND/4 */

    .InputCheckBoxButton {
        margin:4px;
        border-radius:4px;
        overflow:auto;
        display: flex;
        width: 100%;
    }

    .InputCheckBoxButton label {
        background-color:var(--tertiary-colour);

        width: 120px;
        height: 6vh;
        margin: 10px;
        border-radius: 3.5px;
        
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .InputCheckBoxButton label input {
        position:absolute;
        top:-20px;
    }

    .InputCheckBoxButton input:checked + span {
        background-color: var(--action-colour);
        color: var(--text-colour-main);
        display: flex;
        justify-content: center;
        align-items: center;
        
        height: 6vh;
        width: 120px;
        border-radius: 3.5px;
    }
</style>