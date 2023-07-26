<template>
    <div class="hotshot">
        <div class="head">
            <p v-if="!selected">{{ hotshot.carbs }}g of Carbs</p>
            <p v-if="selected">{{ roundPointFive(hotshot.carbs * selected) }}g {{ selected }}x</p>
        </div>

        <div class="thumbnail" :style="`background-image: url('${hotshot.img ?? require('@/assets/images/hotshots/no-image.webp')}');`">
            <span style="border-radius: 0 5px 0 0; max-width: 52.5%;">{{ hotshot.name }}</span>
            <!-- Weight + Unit: i.e, 56g. -->
            <span style="border-radius: 5px 0 0 0; text-align: right;">
                <div v-if="hotshot.weightUnit !== null">{{ hotshot.weight }} {{weightUnit}}</div>
                <div v-else>{{ hotshot.weight }}</div>
            </span>
        </div>

        <button v-if="editEnabled && !selected" @click="this.$emit('edit', hotshot);" class="hotshotBtn edit">
            <i class="far fa-edit"></i>
            Edit
        </button>

        <button v-if="selected" class="hotshotBtn edit" @click="this.$emit('deductHotshot')">
            <i class="fas fa-minus"></i>
            Subtract
        </button>

        <button class="hotshotBtn add" @click="this.$emit('selectHotshot')">
            <i class="fas fa-plus"></i>
            Add
        </button>
    </div>
</template>

<style>
    .hotshot {
        margin-bottom: var(--margin-sm);
    }

    .hotshot .head {
        background-color: var(--main-bg-colour);
        text-align: center;
        padding: 5%;
        border-radius: 20px 20px 0 0;
    }   

    .hotshot .thumbnail {
        width: 100%;
        height: 230px;

        background-size: cover;
        background-position: 50%;

        display: flex;
        align-items: flex-end;
        justify-content: space-between;
    }

    .hotshot .thumbnail span {
        background-color: rgba(0, 0, 0, 0.8);
        padding: 2% 3%;
    }

    .hotshot .hotshotBtn {
        width: 100%;
        color: var(--text-colour-main);
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        
        padding: 10px;
        border: none;
        border-radius: 3px;
    }
    .hotshot .hotshotBtn.edit {
        background-color: var(--main-bg-colour);
    }
    .hotshot .hotshotBtn.add {
        background-color: var(--action-colour);
        border-radius: 0 0 25px 25px;
    }
</style>

<script>
import {roundPointFive} from "@/logic/utilities";

export default {
    props: ['hotshot', 'selected', 'editEnabled'],
    methods: {
        roundPointFive
    },
    computed: {
        weightUnit() {
            const unitId = this.hotshot.weightUnit;
            return this.$weight_units.find(unit => unit.unitId === unitId).shorthand;
        }
    }
}
</script>
