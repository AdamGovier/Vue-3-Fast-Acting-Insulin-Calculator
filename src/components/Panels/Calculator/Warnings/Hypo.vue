<template>
    <section class="horizCentre" id="hypoPanel">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Continue" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <PanelHeader>
            You're experiencing hypoglycaemia.
            <p style="color: var(--action-colour); font-size: 18px; margin-top: 15px; width: 100%;">( Low Blood Sugar )</p>
        </PanelHeader>

        <p>
            Addapted from the <a class="text-link" href="https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/">NHS</a> - 
            <!-- Additional source: https://www.mkuh.nhs.uk/patient-information-leaflet/treatment-for-mild-hypoglycaemia -->
        </p>
        <br/>
        <p>
            1.) <strong>Have a sugary drink or snack</strong> (10-15g's of fast acting glucose) – like a small glass of fizzy drink (not a diet variety),  4 to 5 jelly babies or 3 to 6 glucose tablets.
        </p>
        <br/>
        <p>
            2.) <strong>Test your blood sugar after 10 minutes</strong> – if it's improved and you feel better, move on to step 3. If there's little or no change, treat again with a sugary drink or snack and take another reading after 10 to 15 minutes.
        </p>
        <br/>
        <p>
            3.) <strong>Have a snack</strong> that contains 10-15g's of slow-release carbohydrate, such as a slice of bread or toast, a couple of biscuits, or a glass of cows' milk.
        </p>

        <BtnPrimary value="Remind me to test again in 10 minutes." @click="remindMe();" />

        <BtnSecondary @click="neverShowAgain();">
            Never show again.
        </BtnSecondary>

        <div id="documentEndSpread"></div>
    </section>
</template>

<style scoped> 
    p {
        text-align: center;
        width: 85%;
    }

    #hypoPanel button.primary {
        margin-top: 40px;
        margin-bottom: 20px;
    }

    #hypoPanel button.secondary {
        width: 70%;
        margin-top: 0;
    }

    .pannelHeader {
        margin-block-start: 35px;
        margin-block-end: 25px;
    }

    #documentEndSpread {
        margin-top: 40px;
    }
</style>

<script>
import MenuItem from "../../../menu/MenuItem.vue";
import PanelHeader from "../../Components/PanelHeader.vue";
import BtnSecondary from "../../../Buttons/Secondary.vue";
import BtnPrimary from "../../../Buttons/Primary.vue";

// https://blog.logrocket.com/building-cross-platform-apps-with-capacitor-and-vue-js/ Amazing guide this is highly recomended for using plugins.
import { Plugins } from "@capacitor/core";


export default {
    components: {
        MenuItem,
        PanelHeader,
        BtnSecondary,
        BtnPrimary
    },
    methods: {
        async remindMe() {
            const { LocalNotifications } = Plugins;
            const permStatus = await LocalNotifications.requestPermissions();

            if (permStatus.display === "granted") {
                await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Testing",
                        body: "1 2",
                        id: 1,
                        schedule: { at: new Date(Date.now() + 2000) },
                        actionTypeId: "",
                        extra: null,
                        sound: "alarm.wav",
                        ongoing: true
                    }
                ]
                });
            } else {
                alert("You will not be notified, missing permissions.");
            }
            this.$emit('close');

        },
        neverShowAgain() {
            window.localStorage.setItem('app_warning_hypo_never_show', true);
            this.$emit('close');
        }
    }
}
</script>