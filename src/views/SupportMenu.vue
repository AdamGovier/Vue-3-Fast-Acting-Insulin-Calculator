<template>
    <section>
        <MenuItem title="Tutorials" icon="fab fa-youtube" location="/support/Tutorials"/>
        <MenuItem title="Contact" icon="far fa-envelope" location="/support/Contact"/>
        <MenuItem title="Legal" icon="fas fa-balance-scale-right" location="/support/Legal"/>
        <MenuItem title="My Data" icon="fas fa-database" location="/support/Data"/>
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