<template>
    <section>
        <MenuItem title="Dose Settings" icon="fas fa-syringe" location="/settings/DoseSettings"/>
        <MenuItem title="Correction Settings" icon="fas fa-sliders-h" location="/settings/CorrectionSettings"/>
        <MenuItem title="Modifiers" icon="fas fa-percentage" location="/settings/Modifiers"/>
        <DevStamp />
    </section>
</template>

<script>
import MenuItem from '../components/menu/MenuItem.vue';
import DevStamp from '../components/menu/DevStamp.vue';

export default {
    components: {
        MenuItem, 
        DevStamp
    }
}
</script>