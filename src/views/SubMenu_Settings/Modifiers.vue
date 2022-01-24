<template>
    <section class="horizCentre">
        <PannelHeader>
            Modifier Settings
        </PannelHeader>

        <p>
            Modifiers allow you to adapt your bolus dosage to different occasions. You can click any of your modifiers to edit them. 
        </p>
        
        <div class="horizCentre" style="margin-top: 20px">
            <ModifierBlock v-for="modifier in modifiers" @click="edit = modifier.id; panels.modifierManager = true;" :value="modifier.name" :percentage="modifier.percentage" :addition="modifier.addition" :clock="modifier.scheduler" />
        </div>

        <BtnSecondary @click="panels.modifierManager = true;">
                <i class="fas fa-plus" style="color: var(--action-colour);"></i>
                <p>New Modifier</p>
        </BtnSecondary>

        <transition name="slide">
            <Panel v-if="panels.modifierManager">
                <ModifierManagerPanel :edit="edit" @close="panels.modifierManager = false; edit = null; updateModifiers();" />
            </Panel>
        </transition>

    </section>
    
</template>

<script>
import PannelHeader from '../../components/Panels/Components/PanelHeader.vue';
import BtnSecondary from '../../components/Buttons/Secondary.vue';
import ModifierBlock from '../../components/Other/ModifierBlock.vue';
import Panel from '../../components/Panels/Panel.vue';
import ModifierManagerPanel from '../../components/Panels/Modifiers/modifierManagerPanel.vue';

import { getModifiers } from "../../logic/modifiers";


export default {
    components: {
        PannelHeader,
        BtnSecondary,
        ModifierBlock,
        Panel,
        ModifierManagerPanel
    },
    data() {
        return {
            panels: {
                modifierManager: false
            },
            edit: null,
            modifiers: getModifiers()
        }
    },
    methods: {
        updateModifiers() {
            this.modifiers = getModifiers();
        }
    }
}
</script>

<style scoped>
    p {
        width: 90%;
        text-align: center;
    }

    div {
        width: 85%;
    }
</style>