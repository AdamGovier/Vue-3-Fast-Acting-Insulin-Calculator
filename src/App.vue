<template>
  <div v-if="ui">
    <ActionBar  />
  </div>
  <main :class="{hideUi:!ui, lockScroll}">
      <router-view/>
  </main>

  <DebuggingMenu/>
</template>

<style>
@import './assets/css/global.css';
</style>

<script>
// Components
import ActionBar from './components/root/ActionBar.vue';
// Dev Components
import DebuggingMenu from './components/Other/DebuggingMenu.vue'

export default {
  components: {
    ActionBar,
    DebuggingMenu
  },
  data() {
    return {
      lockScroll: false,
      ui: true, // https://github.com/capacitor-community/barcode-scanner/issues/26
    }
  },
  mounted() {
    const storage = window.localStorage;

    // If first launch
    if(!storage.getItem('app_has_finished_setup')) {
      this.$router.push('/Welcome');
    } else {
      if(storage.getItem('app_tos_version') < this.$tos_version) {
        this.emitter.emit("override-navigation", {path:'/support/Legal', icon:"warning"});
        this.$router.push('/support/Legal');
      }
    }

    this.emitter.on("hide-ui", bool => {  // https://github.com/capacitor-community/barcode-scanner/issues/26
        this.ui = !bool; // ui = !hide-ui value
        bool ? document.body.classList.add("backgroundTransparent") : document.body.classList.remove("backgroundTransparent");
    });

    this.emitter.on("lock-scroll", locked => {
        this.lockScroll = locked;
    });

    this.emitter.on("emergency-reset", () => {
        window.localStorage.clear();
        window.localStorage.setItem("emergency-reset", true);
        this.$router.push('/Welcome');
    });
  },
}
</script>