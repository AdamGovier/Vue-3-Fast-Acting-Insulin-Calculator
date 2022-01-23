<template>
    <button class="secondary" ref="button">
        <div>
            <slot></slot>
        </div>
    </button>
</template>

<style scoped>
    button.secondary {
        background-color: var(--tertiary-colour);

        color: var(--text-colour-main);
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        
        width: 60%;
        margin-top: 30px;
        padding: 10px;

        border: none;
        border-radius: 3px;

        display: flex;
        justify-content: space-around;
    }

    button.secondary div {
        display: flex; 
        justify-content: center; 
        align-items: center; 
        width: 80%;
    }

    button.secondary:active {
        background-color: var(--quaternary-colour);
    }
</style>