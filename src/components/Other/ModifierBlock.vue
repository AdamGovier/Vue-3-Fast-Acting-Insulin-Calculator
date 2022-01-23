<template>
    <div class="mod-container">
            <p>{{ value }}</p>
            <p>{{symbol}} {{percentage}}%</p>
            <i v-if="scheduled" class="far fa-clock"></i>
    </div>
</template>

<script>
export default {
    props: ['value', 'scheduled', 'percentage', 'addition'],
    computed: {
        symbol() { // Choose which operator to render to the modifier block.
            return this.addition ? '+' : '-';
        }
    }
}
</script>

<style>
.mod-container:first-child {
    margin-top: 30px;
}

.mod-container {
    background-color: var(--main-bg-colour);

    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;

    font-size: 18px;
    text-overflow: ellipsis;

    padding: 3% 0;
    margin: 10px 0;
    width: 96%;

    border-radius: 4px;

}

.mod-container * {
    margin: 0 18px;
}
</style>

