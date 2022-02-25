<template>
    <Teleport to="body">
        <h5 style="color: red;">Test</h5>
        <div style="height: 100vh; width: 100%; position: fixed; top: 0; left: 0; display: flex; align-items: center; justify-content: center;">
            <div id="scanner">

            </div>
        </div>

    </Teleport>
</template>

<style scoped>
    #scanner {
        width: 80vw;
        height: 20vh;

        border: 3px solid grey;
    }
</style>
