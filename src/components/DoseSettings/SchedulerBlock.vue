<template>
    <div class="scheduledBlock">
        <p class="timeRange">
            {{entry.timeStart}} - {{entry.timeEnd}}
        </p>
        <p class="carbRatio">
            1:{{entry.carbRatio}} 
        </p>
    </div>
</template>

<style scoped>
    .scheduledBlock {
        background-color: var(--main-bg-colour);

        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 18px;
        text-overflow: ellipsis;

        padding: 3% 0;
        width: 90%;
        margin: 10px;

        border-radius: 4px;
    }

    .scheduledBlock p {
        margin: 0 15px;
    }

    .scheduledBlock .carbRatio {
        font-size: 30px;
    }
</style>

<script>
export default {
    props: ['entry']
}
</script>