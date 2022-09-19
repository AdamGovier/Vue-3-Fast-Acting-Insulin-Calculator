<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Continue" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <span class="itemHeader">Modifiers</span>
        <div class="modifierHolder">
            <!-- https://www.yorkhospitals.nhs.uk/seecmsfile/?id=5394 -->
            <ModiferBlock :custom="true" @click="panels.ketones = true;" :active="sickDayRules.units">
                <p>Ketones</p>
                <p v-if="sickDayRules.units"> ( {{sickDayRules.units}}U ) </p>
                <h4>Sick Day Rules</h4>
            </ModiferBlock>
            <h4 style="color: var(--action-colour); margin-left: 10px; width: 100%;">If you are feeling unwell, you can use the above button to assist in lowering your ketones.</h4>
            <div v-for="modifier in modifiers">
                <ModiferBlock v-if="!modifier.today" @click="modifier.checked = !modifier.checked" :active="modifier.checked" :value="modifier.name" :percentage="modifier.percentage" :addition="modifier.addition" />
            </div>
        </div>

        <span class="itemHeader">Todays Scheduled Modifiers</span>
        <p v-if="!todaysModifiers.length" style="margin-top: var(--margin-sm); color: gray;">Nothing scheduled for today.</p>
        <div class="modifierHolder">
            <div v-for="modifier in todaysModifiers">
                <ModiferBlock @click="modifier.checked = !modifier.checked" :active="modifier.checked" :value="modifier.name" :percentage="modifier.percentage" :addition="modifier.addition" :scheduled="`[ ${modifier.scheduler.timeStart_hhmm} - ${modifier.scheduler.timeEnd_hhmm} ]`" />
            </div>
        </div>

        <!-- Window to the sick day rules panel. -->
        <transition name="slide">
            <Panel v-if="panels.ketones" >
                <Ketones 
                    @updated="output => 
                    { sickDayRules = output; this.$emit('sicknessUpdate', output) }" 
                    @close="panels.ketones = false" 
                    :extraDose="sickDayRules.units"
                    :inputKetones="sickDayRules.ketones"
                    :inputTotalDailyDose="sickDayRules.totalDailyDose"/>
            </Panel>
        </transition>
    </section>
</template>

<style>
    .itemHeader {
        margin-top: 40px;
        font-size: 20px;
    }

    .modifierHolder {
        width: 90%;
        margin-top: 12.5px;
    }

    .modifierHolder .mod-container {
        margin: 15px 0;
    }
</style>

<script>
import MenuItem from "../../menu/MenuItem.vue";
import ModiferBlock from '../../Other/ModifierBlock.vue';
import Panel from "../Panel.vue";
import Ketones from "./Ketones.vue";

export default {
    components: {
        MenuItem,
        ModiferBlock,
        Panel,
        Ketones
    },
    props: ['modifierList', 'inputSickDayRules'],
    data() {
        return {
            useModifiers: {},
            modifiers: [],
            sickDayRules: this.inputSickDayRules,
            panels: {
                ketones: false
            }
        }
    },
    computed: {
        todaysModifiers() {
            return this.modifiers.filter(m => m.today);
        }
    },
    mounted() {
        this.modifiers = this.modifierList;
    },
    updated() {
        this.$emit('update', this.modifiers)
    }
}
</script>