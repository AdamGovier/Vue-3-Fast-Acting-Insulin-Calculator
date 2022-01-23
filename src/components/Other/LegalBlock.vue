<template>
    <div class="legal-block">
        <slot></slot>
    </div>
</template>

<style>
.legal-block {
    background-color: white;
    color: black;
    padding: 4% 3%;
    width: 90%;
}

.legal-block p {
    font-family: Georgia, 'Times New Roman', Times, serif;
}
</style>