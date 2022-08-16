<template>
    <header>
        <!-- See <script> for :title explanation -->
        <MenuItem 
            :title="title" icon="fas fa-calculator" slimline="true"
        />
    </header>
</template>

<style scoped>
    header {
        width: 100%;
    }
</style>

<script>
import MenuItem from "@/components/menu/MenuItem.vue";

export default {
    props: ['carbohydrates'],
    components: {
        MenuItem
    },
    computed: {
        // Render the text displaying amount of carbs but if no carbs provided just show continuing.
        title() {
            if(this.carbohydrates) return `Continue (${this.carbohydrates}g of Carbs)`;

            return 'Continue';
        }
    }
}
</script>