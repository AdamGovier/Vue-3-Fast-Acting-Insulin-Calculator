<template>
    <label class="inputLabel noselect" :class="{single}">{{ value }}</label>
</template>

<script>
export default {
    props: ['value', 'single'] // add single if label is not partnered with anything as this pushes it from the side of the InputArea.
}
</script>

<style>
    .inputLabel {
        display: flex;
        align-items: center;
        
        font-family: 'Montserrat', sans-serif;
        font-weight: lighter;
        font-size: 85%;
        padding: 3% 0;
    }

    .single {
        margin-right: 10px;
    }
</style>