<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Continue" icon="fas fa-calculator" slimline="true" /> 
        </div>

        <span class="itemHeader">Modifiers</span>
        <div class="modifierHolder">
            <ModiferBlock value="Exercise" percentage="10" :addition="false" />
            <ModiferBlock value="Tesco" percentage="25" :addition="false" active="true" />
        </div>

        <span class="itemHeader">Scheduled Modifiers</span>
        <div class="modifierHolder">
            <ModiferBlock value="Exercise" scheduled="10:00 - 17:30" percentage="10" :addition="false" />
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
    }
</style>

<script>
import MenuItem from "../../menu/MenuItem.vue";
import ModiferBlock from '../../Other/ModifierBlock.vue';

export default {
    components: {
        MenuItem,
        ModiferBlock
    }
}
</script>