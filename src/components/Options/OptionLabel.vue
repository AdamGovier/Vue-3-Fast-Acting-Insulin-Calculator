<template>
    <div class="optionLabel">
        <p class="noselect">
            <slot name="content"></slot>
        </p>
        <p class="important noselect" v-if="hasImportant">
            <slot name="important"></slot>
        </p>
    </div>
</template>

<script>
export default {
    props: ['value'],
    computed: {
        hasImportant() { // https://stackoverflow.com/questions/44077277/only-show-slot-if-it-has-content
            return !!this.$slots.important;
        }
    }
}
</script>

<style>
    .optionLabel p {
        margin-top: 10px;

        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 100;
    }

    .optionLabel > p.important {
        margin-top: 10px;
        color:var(--action-colour);
    }
</style>