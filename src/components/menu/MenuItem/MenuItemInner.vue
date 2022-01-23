<template>
    <div class="menu-item" :class="{slimline:slimline}">
        <!-- Font Aweseome Icon to be passed as prop "icon" -->
        <h5><i :class="icon"></i> <span>{{ title }}</span></h5>
    </div>
</template>

<script>
export default {
    props: ['title', 'icon', 'slimline'], // Slimline is just a thinner version of the MenuItem
}
</script>

<style>
    .menu-item:first-child {
        border-top: solid 2px var(--tertiary-colour);
    }

    .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-around;

        width: 100%;
        padding: 7.5% 0;

        font-family: 'Montserrat', sans-serif;
        background-color: var(--secondary-bg-colour);
        border-bottom: solid 2px var(--tertiary-colour);
    }

    .menu-item h5 {
        font-size: 17px;
    }

    .menu-item h5 i {
        margin: 0 4px;
        color: var(--action-colour)
    }

    .menu-item.slimline {
        padding: 3.75% 0;
    }

    .menu-item.slimline h5 {
        font-size: 15px;
    }

    .menu-item.slimline h5 {
        font-size: 17px;
    }
</style>