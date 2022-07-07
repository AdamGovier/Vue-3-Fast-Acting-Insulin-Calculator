<template>
    <input :data-testid="testid" class="inputbox" ref="inputbox" :value="value ? value : ''" @keyup="this.$emit('new-data', this.$refs.inputbox.value);" @change="this.$emit('data-changed', this.$refs.inputbox.value)" :type="type" :placeholder="placeholder" :step="step" :disabled="disabled ?? false">
</template>

<script>
export default {
    props: ['type', 'placeholder', 'step', 'value', 'disabled', 'testid']
}
</script>

<style>
    .inputbox {
        background-color: var(--tertiary-colour);
        color: var(--text-colour-main);
        border-radius: 100px;
        height: 40px;
        padding: 0 10px;
        width: 0;
        display: inline-block;
        border: none;
        flex-grow: 1;
    }

    .inputbox:focus {
        outline: none;
    }
</style>