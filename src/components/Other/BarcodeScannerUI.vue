<template>
    <Teleport to="body">
        <div @click="this.$emit('close')" style="width: 100%; position: fixed; top: 0; padding-top: env(safe-area-inset-top); background-color: var(--secondary-bg-colour);"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Cancel" icon="far fa-trash-alt" slimline="true" /> 
        </div>
        <div class="fullPage" style="display: flex; align-items: center; justify-content: center;">
            <div id="scanner">

            </div>
        </div>
        <div class="fullPage" style="display: flex; align-items: flex-end; justify-content: center;">
            <div class="infoHolder">
                <h2 style="margin-block-end: 0; padding: 4vh 0;">Point your camera at a barcode.</h2>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
    #scanner {
        width: 80vw;
        height: 15vh;

        border: 3px solid var(--action-colour);
    }

    .infoHolder {
        background-color: var(--secondary-bg-colour);
        width: 100%; text-align: 
        center;
    }
</style>

<script>
import MenuItem from "../menu/MenuItem.vue";

export default {
    components: {
        MenuItem
    }
}
</script>