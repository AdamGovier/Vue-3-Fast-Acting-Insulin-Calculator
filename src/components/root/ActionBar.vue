<template>
  <nav>
    <router-link :to="path">
        <img :src="iconRendered" id="navLogo">
    </router-link>
  </nav>
</template>

<style>
    nav {
        display:flex;
        justify-content: space-evenly;
        align-items: center;
        height: var(--actionBarHeight);
        margin: var(--margin) var(--margin);
        background-color: var(--secondary-bg-colour);
    }
    #navLogo {
        width: calc(var(--actionBarHeight) / 1.3);
        padding: 5%;
    }

</style>

<script>
export default {
    data() {
        return {
            override: null,
            icon: "normal"
        }
    },
    computed: {
        path() {
            if(this.override) {
                return this.override; // Return overrided path.
            }

            if(this.$route.path === "/") {this.icon = "normal"; return "/Menu";} // If on calculator go to menu
            
            this.icon = "return"; // All paths below are backward navigation paths.

            if(this.$route.path.split("/").length > 2) { // This means that it is inside a sub directory. /settings/about returns 3 however /settings returns 2.
                return `/${this.$route.path.split("/")[1]}`; // returns settings
            }
            if(this.$route.path === "/Menu") { // If on the menu go home
                return "/";
            }
            return "/Menu"; // No other path found go to the menu.
        },
        iconRendered() {
            switch (this.icon) {
                case "normal":
                    return  require("../../assets/images/icons/logo.png");
                case "return":
                    return require("../../assets/images/icons/return.png");
                 case "warning":
                    return require("../../assets/images/icons/warning.png");          
                default:
                    break;
            }
        }
    },
    mounted() {
        this.emitter.on("override-navigation", navigation => {
            this.override = navigation.path;
            this.icon = navigation.icon;
        });
    }
}
</script>