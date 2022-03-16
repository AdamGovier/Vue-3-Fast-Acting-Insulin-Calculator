<template>
    <button class="inputButton noselect" type="button">
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
    height: 50px;

    background-color: rgba(0, 0, 0, 0);
    color: var(--action-colour);
    font-size: 1.15em;

    border: none;
    border-radius: 4px;
}
</style>