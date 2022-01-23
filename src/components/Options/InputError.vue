<template>
    <p class="inputError">{{ value }}</p>
</template>

<script>
export default {
    props:['value']
}
</script>

<style>
.inputError {
    color: red; 
    margin: 10px 0;
}
</style>