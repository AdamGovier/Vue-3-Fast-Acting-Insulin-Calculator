<template>
    <section class="horizCentre">
        <div @click="this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem title="Cancel" icon="far fa-trash-alt" slimline="true" /> 
        </div>
        <div id="thumb">
            <i class="far fa-images"></i>
        </div>
        
        
        <div style="width: 95%; margin-top: 20px;">
            <Option title="Hotshot Name">
                <InputArea>
                    <Input type="text" placeholder="e.g. Pizza"/>
                </InputArea>
            </Option>

            <Option title="Carbohydrates">
                <InputArea>
                    <Input type="number" placeholder="0"/>
                    <InputLabel value="g" single="true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Number of carbohydrates per weight of portion specified below or per whole item.
                    </template>
                </OptionLabel>
            </Option>

            
            <Option title="Weight">
                <InputArea>
                    <Input type="number" placeholder="0"/>
                    <InputLabel value="g" single="true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Portion weight.
                    </template>
                </OptionLabel>
            </Option>
        </div>
    </section>
</template>

<style scoped>
    #thumb {
        width: 100%;
        height: 200px;

        background-size: cover;
        background-image: url('https://www.thepackagingcompany.us/knowledge-sharing/wp-content/uploads/sites/2/2021/04/Supplies-for-Selling-Pizza-by-the-Slice.jpg');
    }

    #thumb i {
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0, 0.5);

        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 35px;
    }
</style>

<script>
import MenuItem from "../../../menu/MenuItem.vue";


import Option from "../../../Options/Option.vue";
import InputArea from "../../../Options/InputArea.vue";
import Input from "../../../Options/Input.vue";
import InputLabel from "../../../Options/InputLabel.vue";
import OptionLabel from "../../../Options/OptionLabel.vue";

export default {
    components: {
        MenuItem,
        Option,
        InputArea,
        Input,
        InputLabel,
        OptionLabel
    }
}
</script>