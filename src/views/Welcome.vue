<template>
    <section class="horizCentre" v-if="!emergencyReset">
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

        <ButtonPrim value="Next" testid="WelcomeContinue" @click="firstLaunchNext()"/>
    </section>

    <section class="horizCentre" v-if="emergencyReset">
        <div style="width: 80%;">
            <h1>Sorry, there has been a problem.</h1>
        </div>
        <p>
            The application stores all your preferences locally within your phones storage, 
            our safety system has been able to detect a problem with your data.
        </p>
        <br/>
        <p>
            This might be due to your data being corrupted or any other unknown reason.
        </p>
        <br>
        <p>
            Your safety is incredibly important to Bolus Calculator.
        </p>
        <br>
        <p>
             This is why it was decided to reset the application and now we ask you to re-enter your preferences.
        </p>
        <ButtonPrim value="Enter Preferences" @click="firstLaunchNext()"/>
    </section>
</template>

<script>
import ButtonPrim from "../components/Buttons/Primary.vue";
export default {
    mounted() {
            this.emitter.emit("override-navigation", {path:'/Welcome', icon:"normal"});
    },
    data() {
        return {
            emergencyReset: window.localStorage.getItem("emergency-reset") // If there has been a major error this will be true.
        }
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