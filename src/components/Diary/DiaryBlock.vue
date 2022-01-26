<template>
    <div class="diaryHolder goodBG">
        <h5>11.0</h5>
        <span>
            <p>
                3.75U <i class="fas fa-syringe"></i> 
            </p>
            mmol/L
        </span>
        <h4>15:10</h4>
    </div>
</template>

<script>
export default {
    props: ['type']    
}
</script>

<style>
    .diaryHolder {
        padding: 12.5px 11.25px;
        margin: 2%;
        display: flex;
    }

    .diaryHolder h5 {
        font-weight: lighter;
        font-size: 28px;
    }

    .diaryHolder h4 {
        font-size: 28px;
        margin-left: auto;
    }

    .diaryHolder p {
        font-size:12px;
    }

    .diaryHolder span {
        margin-left: 6px;
    }

    .diaryHolder.goodBG {
        background-color: olivedrab;
    }

    .diaryHolder.hypoBG {
        background-color: darkred;
    }

    .diaryHolder.hyperBG {
        background-color: darkorange;
    }
</style>