<template>
    <div class="hotshot">
        <div class="head">
            <p v-if="!hotshot.selected">{{ hotshot.carbs }}g of Carbs</p>
            <p v-if="hotshot.selected">{{ roundPointFive(hotshot.carbs * hotshot.selected)}}g {{ hotshot.selected }}x</p>
        </div>
        <div class="thumbnail" :style="`background-image: url('${hotshot.img ?? 'https://content.storefront7.co.za/common/images/no-image.png'}');`">
            <span style="border-radius: 0 5px 0 0;">{{ hotshot.name }}</span>
            <span style="border-radius: 5px 0 0 0;">{{ hotshot.weight }}g</span>
        </div>
        <!-- <div class="name">
            <p>Slice of Pizza</p>
        </div> -->
        <button v-if="!disableEdit && !hotshot.selected" @click="this.$emit('edit', hotshot);" class="hotshotBtn edit">
            <i class="far fa-edit"></i>
            Edit
        </button>

        <button v-if="hotshot.selected" @click="this.$emit('deduct')" class="hotshotBtn edit">
            <i class="fas fa-minus"></i>
            Subtract
        </button>

        <button class="hotshotBtn add" @click="this.$emit('add', hotshot)">
            <i class="fas fa-plus"></i>
            Add
        </button>
    </div>
</template>

<script>
export default {
    props:['hotshot', 'disableEdit'],
    methods: {
        roundPointFive(num) {
            return Math.round(num*2)/2;
        }
    },
}
</script>

<style>
    .hotshot {
        flex: 1;
        margin: 2%;
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
        background-image: url('https://www.thepackagingcompany.us/knowledge-sharing/wp-content/uploads/sites/2/2021/04/Supplies-for-Selling-Pizza-by-the-Slice.jpg');
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

    .hotshot .name {
        background-color: var(--tertiary-colour);

        text-align: center;
        padding: 10%;
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