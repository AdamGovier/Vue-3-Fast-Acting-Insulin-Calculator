<template>
    <section class="Panel">
        <slot></slot>
    </section>
</template>

<style>
    section.Panel {
        height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: var(--secondary-bg-colour);
        overflow-y: scroll;
    }
</style>

<script>
export default {
    emits: ['close'],
    // Scroll lock broken, on the todo list.
    mounted() { // Prevents scrolling behind the panel.
        this.emitter.emit("lock-scroll", true);
    },
    unmounted() {
        this.emitter.emit("lock-scroll", false);
    }
}
</script>