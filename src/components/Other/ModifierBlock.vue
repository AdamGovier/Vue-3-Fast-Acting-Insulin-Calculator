<template>
    <div class="mod-container" :class="{active:active}">
            <p>{{ value }}</p>
            <span  style="text-align: right;">
                {{ scheduled }}
                {{symbol}}{{percentage}}%
                <i style="margin: 0 0 0 8px; color: var(--action-colour);" v-if="clock" class="far fa-clock"></i>
            </span>

    </div>
</template>

<script>
export default {
    props: ['value', 'scheduled', 'percentage', 'addition', 'active', 'clock'],
    computed: {
        symbol() { // Choose which operator to render to the modifier block.
            return this.addition ? '+' : '-';
        }
    }
}
</script>

<style>

.mod-container {
    background-color: var(--main-bg-colour);

    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 18px;
    text-overflow: ellipsis;

    padding: 3% 0;
    margin: 10px 0;
    width: 96%;

    border-radius: 4px;

}

.mod-container.active {
    background-color: var(--action-colour);
}

.mod-container * {
    margin: 0 14px;
}
</style>

