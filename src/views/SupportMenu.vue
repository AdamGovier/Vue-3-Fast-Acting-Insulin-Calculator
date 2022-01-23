<template>
    <section>
        <MenuItem title="Tutorials" icon="fab fa-youtube" location=""/>
        <MenuItem title="Contact" icon="far fa-envelope" location=""/>
        <MenuItem title="Legal" icon="fas fa-balance-scale-right" location="/support/Legal"/>
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