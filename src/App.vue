<template>
  <ActionBar />
  <main :class="{lockScroll}">
      <router-view/>
  </main>
</template>

<style>
@import './assets/css/global.css';
</style>

<script>
// Components
import ActionBar from './components/root/ActionBar.vue';

export default {
  components: {
    ActionBar
  },
  data() {
    return {
      lockScroll: false
    }
  },
  mounted() {
    const storage = window.localStorage;

    // If first launch
    if(!storage.getItem('app_launched_before')) {
      this.$router.push('/Welcome');
    } else {
      if(storage.getItem('app_tos_version') < this.$tos_version) {
        this.emitter.emit("override-navigation", {path:'/support/Legal', icon:"warning"});
        this.$router.push('/support/Legal');
      }
    }

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