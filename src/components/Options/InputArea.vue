<template>
    <div class="inputArea">
        <slot></slot>
    </div>
</template>

<style>
.inputArea {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    border-radius: 5.5px;
    border: 1.5px solid white;

    background-color: var(--tertiary-colour);
}
</style>