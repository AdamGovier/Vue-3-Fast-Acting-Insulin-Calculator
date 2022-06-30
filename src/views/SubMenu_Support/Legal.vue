<template>
    <section class="horizCentre">
        <div class="tos-announcement" v-if="acceptedTOS && acceptedTosVersion < currentTosVersion">
            <h4>Our Terms and Conditions and Privacy Policy have updated.</h4>
            <br/>
            <p>Please accept the new Terms & Conditions below.</p>
        </div>

        <PannelHeader>
            Things to Note
        </PannelHeader>

        <LegalBlock>
            <p>
                Bolus Calculator was made by a diabetic not a medical professional, Bolus Calculator is not commercial e.g. 
                it does not make any revenue and is self-funded, All outputted data should be cross checked to make sure it is accurate.
            </p>
            <br/>
            <p>
                <strong>
                    We highly reccomended you check with your Doctor before making any medical decisions with the data outputted from this application.
                </strong>
            </p>
        </LegalBlock>

        <PannelHeader>
            Terms and Conditions
        </PannelHeader>

        <LegalBlock>
            <p>
                <strong>1.) Agreement to Terms</strong>
            </p>
            <br/>
            <p>
                <strong>1.1</strong> 
                These Terms and Conditions constitute a legally binding agreement made between you, wether personally or on behalf of an entity, and Adam Govier. Concerning your access to and use of Adam Govier's Bolus Calc/Bolus Calculator.
            </p>
            <br>
            <p>
                <strong>1.2</strong> 
                We may make changes to these Terms and Conditions and any time. 
            </p>
            <br/>
            <p>
                <strong>1.3</strong> 
                Bolus Calc is directed to people residing in the United Kingdom however not limited to the United Kingdom.
            </p>
            <br/>
            <p>
                <strong>1.4</strong> 
                If you are younger than 18 you must have permission from your parents/gaurdians to use this app.
            </p>
            <br/>
            <p>
                <strong>1.5</strong> 
                You are aware that you are fully responsible for what you do with any outputted data and I can not take legal action for any incorrect data.
            </p>
            <br/>
            <p>
                <strong>1.6</strong> 
                This is not medical advice use outputted data at your own risk.   
            </p>
         </LegalBlock>

        <h1 style="margin-top: 40px;">Privacy Policy</h1>
        <LegalBlock>
            <p>This privacy policy was last modified on the 30th of June 2022</p>
            <br/>
            <p>
                <strong>1.1</strong>
                Adam Govier's Bolus Calculator by default only stores data locally on the users hardware however the user can upload media and nutritional information about food products if the user has chosen to opt in.
            </p>
            <br/>
            <p>
                <strong>1.2</strong>
                Adam Govier's Bolus Calculator does not store any personally identifiable information with the exception of the possibility of meta-data (Location tags etc.) stored alongside media content (Images).
            </p>
        </LegalBlock>

        <h1 style="margin-top: 40px;">Licensing</h1>
        <LegalBlock>
            <p>
                <strong>Open Food Facts</strong>
            </p>
            <br/>
            <p>
                The hotshots tab uses "Open Food Facts" as one of it's data sources to retrieve nutritional information & media about food products. 
                <br/><br/>
                The data is available under the licence Open Database License and the photos are licensed under the licence Creative Commons Attribution Share-Alike. The brands quoted are the property of their respective owners.
            </p>
        </LegalBlock>

        <ButtonPrim value="Accept" @click="acceptTerms()" v-if="!acceptedTOS || acceptedTosVersion < currentTosVersion" />
        <ButtonPrim :value="`Accepted ${getAcceptedDateString}`" v-else disabled="true" />
    </section>
</template>

<script>
import LegalBlock from '../../components/Other/LegalBlock.vue';
import ButtonPrim from '../../components/Buttons/Primary.vue';
import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';

export default {
    components: {
        LegalBlock,
        ButtonPrim,
        PannelHeader
    },
    data() {
        return {
            currentTosVersion: this.$tos_version,
            acceptedTOS: false,
            acceptedTosVersion: null,
            acceptedDate: null
        }
    },
    mounted() { // Initialise the data 
        const storage = window.localStorage;

        if(storage.getItem('app_tos_accepted')) {
            this.acceptedTOS = true;
            this.acceptedTosVersion = storage.getItem('app_tos_version');
            this.acceptedDate = new Date(storage.getItem('app_tos_date'));

            if(!storage.getItem('app_launched_before')) {
                // If the user has accepted an exits the app for example when they re-open it they will be stuck on this page if it wasn't for this due to the menu button navigating back to the welcome page pre-setup/first launch.
                this.emitter.emit("override-navigation", {path:'/Welcome', icon:"return"});
                this.navigateToNextSetup();
            }
        }
    },
    computed: {
        getAcceptedDateString() { // Shows in the disabled accepted button.
            return this.acceptedDate.toLocaleString('default', { month: 'short' }) + " " + this.acceptedDate.getFullYear();
        }
    },
    methods: {
        acceptTerms() {
            this.acceptedDate = new Date();
            this.acceptedTOS = true;
            this.acceptedTosVersion = this.currentTosVersion;

            const storage = window.localStorage;
            storage.setItem("app_tos_accepted", true);
            storage.setItem("app_tos_version", this.acceptedTosVersion);
            storage.setItem("app_tos_date", this.acceptedDate);

            if(!storage.getItem('app_launched_before')) {
                this.emitter.emit("override-navigation", {path:'/support/Legal', icon:"return"});
                this.navigateToNextSetup();
            } else {
                this.emitter.emit("override-navigation", {path:null, icon:"normal"});
                this.$router.push('/');
            }
        },
        navigateToNextSetup() {
            this.$router.push('/settings/DoseSettings');
        }
    },
}
</script>

<style>
.tos-announcement {
    border: 2px dashed var(--action-colour);
    text-align: center; 

    width: 90%; 
    margin: 20px 0; 
    padding: 5% 2%;
}

.tos-announcement h4 {
    color: var(--action-colour); 

    font-size: 20px; 
    margin-block-end:0;
}
</style>