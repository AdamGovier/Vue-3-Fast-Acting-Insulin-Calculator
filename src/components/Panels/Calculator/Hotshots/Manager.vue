<template>
    <section class="horizCentre">
        <div @click="hotshot ? deleteHotshot() : this.$emit('close')" style="width: 100%;"> 
            <!-- Can't attach click event to the MenuItem directly. -->
            <MenuItem :title="hotshot ? 'Delete' : 'Cancel'" icon="far fa-trash-alt" slimline="true" /> 
        </div>
        <div ref="thumb" id="thumb" @click="selectOrTakePhoto();">
            <i class="far fa-images"></i>
        </div>
        
        
        <div style="width: 95%; margin-top: 20px;">
            <Option title="Hotshot Name">
                <InputArea>
                    <Input type="text" :value="values.name" @new-data="hotshotName => values.name = hotshotName" placeholder="e.g. Pizza"/>
                </InputArea>
                <InputError v-if="errors.hotshotName" :value="errors.hotshotName" />
            </Option>

            <Option title="Carbohydrates">
                <InputArea>
                    <Input type="number" :value="values.carbohydrates" @new-data="carbohydrates => values.carbohydrates = carbohydrates" placeholder="0"/>
                    <InputLabel value="g" single="true" />
                </InputArea>
                <InputError v-if="errors.carbohydrates" :value="errors.carbohydrates" />
                <OptionLabel>
                    <template v-slot:content>
                        Number of carbohydrates per weight of portion specified below or per whole item.
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Weight">
                <InputArea>
                    <Input :value="values.weight" @new-data="weight => values.weight = weight" type="number" placeholder="0"/>
                    <InputLabel value="g" single="true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Portion weight.
                    </template>
                    <template v-slot:important>
                        This field is optional.
                    </template>
                </OptionLabel>
            </Option>

            <Option title="Barcode" v-if="barcode">
                <InputArea>
                    <Input :value="barcode" @new-data="barcodeNum => barcode = barcodeNum" type="number" placeholder="0"/>
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Allow this item to be selected by scanning this barcode number.
                    </template>
                    <template v-slot:important>
                        This field is optional.
                    </template>
                </OptionLabel>
            </Option>
        </div>

        <BtnPrimary value="Save Hotshot" @click="save();" />
    </section>
</template>

<style scoped>
    #thumb {
        width: 100%;
        height: 17.5vh;

        background-size: cover;
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
import InputError from "../../../Options/InputError.vue";

import BtnPrimary from "../../../Buttons/Primary.vue";

import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType } from '@capacitor/camera';

export default {
    components: {
        MenuItem,
        Option,
        InputArea,
        Input,
        InputLabel,
        OptionLabel,
        BtnPrimary,
        InputError
    },
    props: ['hotshot', 'barcode'],
    data() {
        return {
            values: {
                name: null,
                carbohydrates: null,
                weight: null,
                img: null
            },
            errors: {
                hotshotName: null,
                carbohydrates: null
            }
        }
    },
    mounted() {
        if(!this.hotshot) return;
        this.values.name = this.hotshot.name;
        this.values.carbohydrates = this.hotshot.carbs;
        this.values.weight = this.hotshot.weight;
    },
    methods: {
        save() {
            this.errors = {}; // clear errors.
            if(!this.values.name) return this.errors.hotshotName = "You must specify a hotshot name.";
            if(!this.values.carbohydrates) return this.errors.carbohydrates = "You must specify an amount of carbohydrates.";

            const storage = window.localStorage;

            let hotshots = [];
            if(storage.getItem("app_local_hotshots")) hotshots = JSON.parse(storage.getItem("app_local_hotshots"));

            if(this.hotshot) { // If edit, remove original hotshot from array.
                hotshots = hotshots.filter(hotshot => hotshot.id !== this.hotshot.id)
            }

            hotshots.push({
                id: this.hotshot ? this.hotshot.id : uuidv4(),
                name: this.values.name,
                carbs: this.values.carbohydrates,
                weight: this.values.weight,
                img: this.values.img,
                barcode: this.barcode
            });

            storage.setItem("app_local_hotshots", JSON.stringify(hotshots));
            this.$emit('close');
        },
        deleteHotshot() {
            const confirm = window.confirm("Are you sure you want to delete this hotshot?");
            if(!confirm) return;

            const storage = window.localStorage;
            let hotshots = JSON.parse(storage.getItem("app_local_hotshots"));
            hotshots = hotshots.filter(hotshot => hotshot.id !== this.hotshot.id); // Filter out the hotshot
            storage.setItem("app_local_hotshots", JSON.stringify(hotshots));
            this.$emit('close');
        },
        async selectOrTakePhoto() {
            try {
                const image = await Camera.getPhoto({ // https://capacitorjs.com/docs/apis/camera#imageoptions
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.Uri
                });

                const imageUrl = image.webPath; // get src
                this.$refs.thumb.style.backgroundImage = `url('${imageUrl}')`; // set preview
                this.values.img = imageUrl; // set image path in the hotshot values.
            } catch (e) {
                // User most likely has exited camera app.
            }
        }
    }
}
</script>