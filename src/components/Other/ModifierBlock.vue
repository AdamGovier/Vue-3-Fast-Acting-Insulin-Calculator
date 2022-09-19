<template>
    <div>
        <div v-if="!custom" class="mod-container" :class="{active:active}">
                <p>{{ value }}</p>
                <span  style="text-align: right;">
                    {{ scheduled }}
                    {{symbol}}{{percentage}}%
                    <i style="margin: 0 0 0 8px; color: var(--action-colour);" v-if="clock" class="far fa-clock"></i>
                </span>
        </div>
        <div v-if="custom" class="mod-container" :class="{active:active}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {                                                               // Reuse same styling for another purpose via the use of a slot.
    props: ['value', 'scheduled', 'percentage', 'addition', 'active', 'clock', 'custom'],
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
    width: 100%;

    border-radius: 4px;

}

.mod-container.active {
    background-color: var(--action-colour);
}

.mod-container * {
    margin: 0 14px;
}
</style>

