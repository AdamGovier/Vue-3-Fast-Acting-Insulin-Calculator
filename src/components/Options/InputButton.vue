<template>
    <button class="inputButton" type="button">
        <span v-if="value">
            {{ value }}
        </span>
        <i v-if="icon" :class="icon"></i>
    </button>
</template>

<script>
export default {
    props: ['value', 'icon']
}
</script>

<style>
.inputButton {
    padding: 0 10px;
    height: 40px;

    background-color: rgba(0, 0, 0, 0);
    color: var(--action-colour);
    font-size: 1em;

    border: none;
    border-radius: 4px;
}
</style>