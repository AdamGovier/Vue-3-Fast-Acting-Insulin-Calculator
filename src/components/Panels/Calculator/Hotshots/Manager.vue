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

            <Option title="Barcode" v-if="values.barcode">
                <InputArea>
                    <Input :value="values.barcode" @new-data="barcodeNum => values.barcode = barcodeNum" type="text" :disabled="true" />
                </InputArea>
                <OptionLabel>
                    <template v-slot:content>
                        Allows this item to be selected by scanning this barcode number.
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
import InputCheckboxRadio from "../../../Options/InputCheckboxRadio.vue";

import BtnPrimary from "../../../Buttons/Primary.vue";

import { v4 as uuidv4 } from 'uuid';
import yesno from "yesno-dialog";
import axios from 'axios';

import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export default {
    components: {
        MenuItem,
        Option,
        InputArea,
        Input,
        InputLabel,
        OptionLabel,
        InputCheckboxRadio,
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
                img: null,
                imageWebPath: null,
                barcode: null
            },
            errors: {
                hotshotName: null,
                carbohydrates: null
            }
        }
    },
    mounted() {
        // barcode provided from barcode scanner
        if(this.barcode) this.values.barcode = this.barcode;

        // If not in edit mode.
        if(!this.hotshot) return;

        // barcode provided from edit action.
        if(this.hotshot.barcode) this.values.barcode = this.hotshot.barcode;

        this.values.name = this.hotshot.name;
        this.values.carbohydrates = this.hotshot.carbs;
        this.values.weight = this.hotshot.weight;

        // Render preview photo.
        if(this.hotshot.imgFilename) {
            this.loadPreviousPhoto(this.hotshot.imgFilename);
        }
    },
    methods: {
        // If editing hotshot load preview
        async loadPreviousPhoto(img) {
            const photo = await Filesystem.getUri({
                directory: Directory.Data,
                path: img
            });

            this.values.img = img;
            this.values.imageWebPath = Capacitor.convertFileSrc(photo.uri);
            this.$refs.thumb.style.backgroundImage = `url('${this.values.imageWebPath}')`;
        },
        async save() {
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
                barcode: this.values.barcode
            });

            storage.setItem("app_local_hotshots", JSON.stringify(hotshots));
            this.$emit('close');

            // If editing do not reupload to server.
            if(this.hotshot) return;

            const shareConfirmed = await yesno({
                bodyText: "Would you like to share this hotshot with other users?",
                labelYes: "Sure!",
                labelNo: "No"
            });
            
            // If user wishes not to share hotshot.
            if(!shareConfirmed) return;

            const body = new FormData();
            body.append('name', this.values.name);
            body.append('carbohydrates', this.values.carbohydrates);
            body.append('weight', this.values.weight);
            if(this.values.barcode) body.append('barcode', this.values.barcode);
            if(this.values.imageWebPath) {
                const blob = await fetch(this.values.imageWebPath).then(r => r.blob());
                body.append('image', blob, "upload.jpg");``
            }

            axios.post(`${this.$endpoint}api/hotshots/create`, body, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
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
                // https://www.joshmorony.com/using-the-capacitor-filesystem-api-to-store-photos/

                const originalPhoto  = await Camera.getPhoto({ // https://capacitorjs.com/docs/apis/camera#imageoptions
                    allowEditing: false,
                    resultType: CameraResultType.Uri
                });

                this.values.imageWebPath = originalPhoto.webPath;

                const photoInTempStorage = await Filesystem.readFile({ path: originalPhoto.path });

                const fileName = uuidv4() + ".jpeg";

                await Filesystem.writeFile({
                    data: photoInTempStorage.data,
                    path: fileName,
                    directory: Directory.Data
                });

                // This needs to be done on image viewing rather than saving. // the latter results in the filepath changing on iOS after recompile.
                // const finalPhotoUri = await Filesystem.getUri({
                //     directory: Directory.Data,
                //     path: fileName
                // });

                this.$refs.thumb.style.backgroundImage = `url('${originalPhoto.webPath}')`; // set preview // get web path
                this.values.img = fileName; // set filename in the hotshot values.
            } catch (e) {
                // User most likely has exited camera app.
            }
        }
    }
}
</script>