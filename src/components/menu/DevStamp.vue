<template>
        <div class="horizCentre">
            <a class="dev-stamp-link" :href="this.$authorLink"><h4 class="dev-stamp">{{this.$author.toUpperCase()}}</h4></a>
        </div>
</template>

<script>
</script>

<style>
    .dev-stamp {
        color: var(--tertiary-colour);
        
        font-family: 'Ubuntu', sans-serif;
        letter-spacing: 5px;
    }

    .dev-stamp-link {
        margin-top: 28%;
        text-decoration: none;
    }
</style>