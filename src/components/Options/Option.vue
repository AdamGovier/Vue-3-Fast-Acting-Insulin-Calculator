<template>
    <div class="optionBox" :class="{horizCentre:centre}">
        <div v-if="title" class="optionTitle noselect">
            <h4 class="noselect">{{ title }}</h4>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>

</template>

<script>
export default {
    props: ['title', 'centre'],
}
</script>

<style>
    .optionBox:not(:first-child) {
        margin-top: 30px;
    }

    .optionTitle h4 {
        font-family: 'Montserrat', sans-serif;

        margin-bottom: 12px;

        font-size: 17px;
        font-weight: 300;
        
    }
</style>