<template>
    <!-- If Anchor -->
    <router-link v-if="location" :to="location"> 
        <MenuItemInner :title="title" :icon="icon" :slimline="slimline" />
    </router-link>

    <!-- If Button -->
    <MenuItemInner v-else :title="title" :icon="icon" :slimline="slimline" />

</template>

<script>
import MenuItemInner from './MenuItem/MenuItemInner.vue';
export default {
    props: ['title', 'icon', 'location', 'slimline'],
    components: {
        MenuItemInner
    }
}
</script>

<style scoped>
    a {
        color: inherit;
        text-decoration: none;
    }
</style>