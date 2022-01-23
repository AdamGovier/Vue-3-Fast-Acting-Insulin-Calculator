<template>
    <button class="inputButton" type="button">{{ value }}</button>
</template>

<script>
export default {
    props: ['value']
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