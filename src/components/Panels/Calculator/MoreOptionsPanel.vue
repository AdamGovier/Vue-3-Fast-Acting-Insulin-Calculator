<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Continue" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <span class="itemHeader">Modifiers</span>
        <div class="modifierHolder">
            <div v-for="modifier in modifiers">
                <ModiferBlock v-if="!modifier.today" @click="modifier.checked = !modifier.checked" :active="modifier.checked" :value="modifier.name" :percentage="modifier.percentage" :addition="modifier.addition" />

            </div>
        </div>

        <span class="itemHeader">Todays Scheduled Modifiers</span>
        <div class="modifierHolder">
            <div v-for="modifier in modifiers">
                <ModiferBlock v-if="modifier.today" @click="modifier.checked = !modifier.checked" :active="modifier.checked" :value="modifier.name" :percentage="modifier.percentage" :addition="modifier.addition" :scheduled="`[ ${modifier.scheduler.timeStart_hhmm} - ${modifier.scheduler.timeEnd_hhmm} ]`" />
            </div>
        </div>
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

export default {
    components: {
        MenuItem,
        ModiferBlock
    },
    props: ['modifierList'],
    data() {
        return {
            useModifiers: {},
            modifiers: []
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