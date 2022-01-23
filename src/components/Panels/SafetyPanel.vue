// Obselete as right now.
<template>
    <section class="horizCentre">
        <PannelHeader>
            <span style="font-size: 50px; font-weight: bold;">ATTENTION !</span>
        </PannelHeader>

        <p >
            Your safety is Bolus Calc's top priority.<br/>
            There is reason to believe that you have entered a invalid value.
        </p>
        <p style="border-top: 1px solid gray; margin-top: 20px;" v-for="error in errors">
            <br/>
            "{{error.name}}"<br/>
            had the value of {{error.value}}.<br/><br/>
            {{ error.expected }}.
        </p>


        <div class="buttonHolder">
            <BtnPrimary value="Edit Values" @click="this.$emit('edit');" />
            <BtnPrimary override="true" @click="this.$emit('continue');" value="I understand, I wish to use these values anyway"  />
        </div>
    </section>
</template>

<script>
import PannelHeader from './Components/PanelHeader.vue';
import BtnPrimary from '../Buttons/Primary.vue';

export default {
    props:['errors'],
    components: {
        PannelHeader,
        BtnPrimary
    }
}
</script>

<style scoped>
    .buttonHolder {
        margin-top: 40px;
    }
    .buttonHolder > button {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        margin: 20px 0 !important;
    }

    p {
        width: 90%;
    }

</style>