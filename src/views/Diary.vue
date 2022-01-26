<template>
    <section>   
        <div class="menu-item">
            <i class="fas fa-arrow-circle-left"></i>
            <p>26/01/2022</p>
            <i class="far fa-calendar-alt"></i>
            <i class="fas fa-arrow-circle-right"></i>
        </div>

        <fieldset style="margin: 2.5%; margin-top: 20px;"> 
            <legend style="padding: 0 10px;">Average 11.0 mmol/L</legend>
            <!--Arguably should not use a fieldset outside of a form but the css for a fake fieldset is ugly https://stackoverflow.com/questions/2213881/is-it-possible-to-achieve-a-fieldset-like-effect-without-using-the-fieldset-->
            <DiaryBlock />
        </fieldset>
    </section>
</template>

<style scoped>
    .menu-item {
        padding: 5% 0;
    }
</style>

<script>
import DiaryBlock from "../components/Diary/DiaryBlock.vue";
import MenuItem from "../components/menu/MenuItem.vue";

export default {
    components: {
        DiaryBlock,
        MenuItem
    }
}
</script>