<template>
    <section id="calculator" class="horizCentre">
        <h1>Bolus Calculator</h1>

        <div style="width: 90%;">
            <Option>
                <InputArea>
                    <InputButton icon="fas fa-minus"/>
                    <Input type="number" placeholder="0" step="0.5"/>
                    <InputLabel single="true" value="Carbohydrates"/>
                    <InputButton icon="fas fa-plus"/>
                    <InputButton icon="fas fa-pizza-slice"/>
                </InputArea>
            </Option>

            <Option>
                <InputArea>
                    <Input type="number" placeholder="0.00" step="0.1"/>
                    <InputLabel single="true" value="Blood Sugar / Glucose"/>
                    <InputButton value="mmol/L"/>
                </InputArea>
            </Option>
        </div>

        <BtnSecondary @click="panels.moreOptions = true;">
            More Options
        </BtnSecondary>

        <div style="width: 90%;" class="horizCentre">
            <BtnPrimary value="Calculate Dosage" />
        </div>

        <h1>0.00 Units</h1>
    </section>

    <transition name="slide">
        <Panel v-if="panels.moreOptions">
            <MoreOptions @close="panels.moreOptions = false;" />
        </Panel>
    </transition>
</template>

<script>
    import Option from '../components/Options/Option.vue';
    import InputArea from '../components/Options/InputArea.vue';
    import Input from '../components/Options/Input.vue';
    import InputLabel from '../components/Options/InputLabel.vue';
    import InputButton from '../components/Options/InputButton.vue';
    import OptionLabel from '../components/Options/OptionLabel.vue';
    import InputCheckboxRadio from '../components/Options/InputCheckboxRadio.vue';
    import InputError from '../components/Options/InputError.vue';
    
    import BtnSecondary from '../components/Buttons/Secondary.vue';
    import BtnPrimary from '../components/Buttons/Primary.vue';

    import Panel from '../components/Panels/Panel.vue';
    import MoreOptions from '../components/Panels/Calculator/MoreOptionsPanel.vue';
export default {
    components: {
        Option,
        InputArea,
        Input,
        InputLabel,
        InputButton,
        OptionLabel,
        InputCheckboxRadio,
        InputError,
        BtnSecondary,
        BtnPrimary,
        Panel,
        MoreOptions
    },
    data() {
        return {
            panels: {
                moreOptions: false
            }
        }
    }
}
</script>

<style>
 #calculator {
 }
</style>