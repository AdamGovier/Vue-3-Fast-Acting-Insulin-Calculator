<template>
    <section>
        <MenuItem title="Calculator" icon="fas fa-calculator" location="/"/>
        <MenuItem title="Diary" icon="fas fa-chart-bar" location="/Diary"/>
        <MenuItem title="Settings" icon="fas fa-sliders-h" location="/Settings"/>
        <MenuItem title="Support" icon="far fa-question-circle" location="/Support"/>
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