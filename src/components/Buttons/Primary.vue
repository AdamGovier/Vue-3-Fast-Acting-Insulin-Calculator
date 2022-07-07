<template>
    <button class="primary" ref="button" :data-testid="testid" :class="{override}">{{ value }}</button>
</template>

<style>
    button.primary {
        background-color: var(--action-colour);
        color: var(--text-colour-main);

        font-family: 'Montserrat', sans-serif;
        font-size: 15px;

        padding: 13px;
        width: 80%;
        margin: 30px;

        border: none;
        -webkit-appearance: none;
    }

    button.primary:disabled {
        background-color: var(--quaternary-colour);
    }

    button.primary:active {
        opacity: 0.8;
    }

    .override {
        background-color: darkred !important;
    }
</style>

<script>
export default {
    props: ['value', 'disabled', 'override', 'testid'], // Override just makes it a big red scary button :D
    mounted() {
        this.updateDisabled();
    },
    updated() {
        this.updateDisabled();
    },
    methods: {
        updateDisabled() {
            if(this.disabled) {
                this.$refs.button.setAttribute('disabled', 'true');
            } else {
                this.$refs.button.removeAttribute('disabled');
            }   
        }
    },
}
</script>