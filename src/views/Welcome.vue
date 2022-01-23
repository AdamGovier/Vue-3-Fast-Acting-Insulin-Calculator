<template>
    <section class="horizCentre">
        <div style="width: 80%;">
            <h1>Hello!</h1>
        </div>
        <p>
            Welcome to Bolus Calculator, thank you for installing my App.
        </p>
        <br>
        <p>
            Before you can start using the Calculator we need some details from you to configure the Calculator to best fit your needs.
        </p>
        <br/>
        <p>
            Unfortunately the next page isn't so exciting, it is some Terms and Conditions that I need you to read and accept before you can use the Calculator! 
        </p>
        <br/>
        <p>
            Not right now but once you have finished setting up, you can edit any of these preferences at any time using the <strong style="color: var(--action-colour);">menu button</strong> on the top of the page (The Logo).
        </p>

        <ButtonPrim value="Next" @click="firstLaunchNext()"/>
    </section>
</template>

<script>
import ButtonPrim from "../components/Buttons/Primary.vue";
export default {
    mounted() {
            this.emitter.emit("override-navigation", {path:'/Welcome', icon:"return"});
    },
    components: {
        ButtonPrim
    },
    methods: {
        firstLaunchNext() {
            this.emitter.emit("override-navigation", {path:'/Welcome', icon:"return"});
            this.$router.push('/support/Legal')
        }
    }
}
</script>

<style scoped>
    section p {
        width: 80%;
    }
</style>