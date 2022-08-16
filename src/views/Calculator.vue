<template>
    <section id="calculator" class="horizCentre">
        <h1>Bolus Calculator</h1>
        <div style="width: 90%;">
            <Option>
                <InputArea>
                    <InputButton icon="fas fa-minus" @touchstart.prevent="changeCarbohydratesByStep(false)" @touchend="incrementCancel = true" />
                    <!-- inputmode="decimal" -->
                    <Input :value="values.carbohydrates" @new-data="carbohydrates => values.carbohydrates = parseFloat(carbohydrates)" type="number" placeholder="0" step="0.5"/>
                    <InputLabel single="true" value="Carbohydrates"/>
                    <InputButton icon="fas fa-plus" @touchstart.prevent="changeCarbohydratesByStep(true)" @touchend="incrementCancel = true" />
                    <InputButton icon="fas fa-pizza-slice" @click="panels.hotshots = true;"/>
                </InputArea>
                <InputError v-if="errors.carbohydrates" :value="errors.carbohydrates" />
            </Option>

            <Option>
                <InputArea>
                    <Input @new-data="bloodGlucose => values.bloodGlucose = parseFloat(bloodGlucose)" type="number" placeholder="0.00" step="0.1"/>
                    <InputLabel single="true" value="Blood Sugar / Glucose"/>
                    <InputButton :value="
                        values.bloodSystem
                    " @click="
                        this.$router.push('/settings/CorrectionSettings');
                        this.emitter.emit('override-navigation', {path:'/', icon:'return'});
                    "/>
                </InputArea>
            </Option>
        </div>

        <BtnSecondary @click="panels.moreOptions = true;">
            More Options
        </BtnSecondary>

        <!-- If modifiers are enabled. -->
        <div style="width: 40%; margin-top: 20px;" v-if="selectedModiferNames"> 
            <p style="text-align: center;">
                Selected Modifiers:
                <span style="color: var(--action-colour);">{{ selectedModiferNames }}</span>
            </p>
        </div>

        <div style="width: 90%;" class="horizCentre">
            <BtnPrimary @click="runCalculations()" value="Calculate Dosage" />
        </div>

        <h1>{{values.units}} Units</h1>
    </section>

    <transition name="slide">
        <Panel v-if="panels.moreOptions">
            <MoreOptionsPanel @update="modifierList => modifiers = modifierList" :modifierList="modifiers" @close="panels.moreOptions = false;" />
        </Panel>
    </transition>

    <transition name="slide">
        <Panel v-if="panels.warning"> 
            <!-- Room for expansion for more warnings in the future. -->
            <WarningPanelHypo @close="panels.warning = false;" />
        </Panel>
    </transition>

    <transition name="slide">
        <Panel v-if="panels.hotshots">
            <HotshotsPanel @updateCarbs="carbs => {panels.hotshots = false; values.carbohydrates ? values.carbohydrates += carbs : values.carbohydrates = carbs}" />
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
    import MoreOptionsPanel from '../components/Panels/Calculator/MoreOptionsPanel.vue';
    import WarningPanelHypo from '../components/Panels/Calculator/Warnings/Hypo.vue';
    import HotshotsPanel from '../components/Panels/Calculator/Hotshots.vue';

    import { getModifiers } from "../logic/modifiers";
    import { calculate } from "../logic/calculator";
    import { addEntry } from '../logic/diary';
    import secureStorage from "../logic/secureStorage";

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
            MoreOptionsPanel,
            WarningPanelHypo,
            HotshotsPanel
        },
        mounted() {
            this.emitter.emit('override-navigation', {path:null, icon:'normal'}); // Turn off navigation override.
        },
        data() {
            return {
                panels: {
                    moreOptions: false,
                    warning: false,
                    hotshots: false,
                },
                values: {
                    units: "0.00", // String on purpose so I can do zeros after zeros.,
                    carbohydrates: 0,
                    bloodGlucose: 0,
                    bloodSystem: secureStorage.retrieve.bloodSugarUnit()              
                },
                errors: {
                    carbohydrates: ""
                },
                incrementCancel: false,
                modifiers: getModifiers()
            }
        },
        computed: {
            selectedModiferNames() { // Create a csv list for a paragraph showing selected modifiers.
                return this.modifiers.filter(modifier => modifier.checked) // Get selected modifiers
                 .map(modifier => modifier.name) // Return modifier names.
                 .join(', '); // Create CSV
            }
        },
        methods: {
            runCalculations() {
                this.errors = {}; // clear any errors.

                if(this.values.carbohydrates >= this.$safety.carbohydratesGuidance.max) 
                    this.errors.carbohydrates = "This seems like a large number of carbohydrates, are you sure this is correct?";

                // Hardcoded hypo level right now.
                if(this.values.bloodGlucose && this.values.bloodGlucose < 4.0 && !window.localStorage.getItem('app_warning_hypo_never_show'))
                    this.panels.warning = true;

                const selectedModifiers = this.modifiers.filter(modifier => modifier.checked);

                this.values.units = calculate({
                    carbohydrates: this.values.carbohydrates,
                    bloodGlucose: this.values.bloodGlucose,
                    modifiers: selectedModifiers
                });

                // Add entry to the diary.
                addEntry({
                    carbohydrates: this.values.carbohydrates,
                    bloodGlucose: this.values.bloodGlucose,
                    units: this.values.units,
                    modifiers: selectedModifiers,
                    ratio: secureStorage.retrieve.carbRatio()
                });
            },
            /**
             * Method to increase/decrease the amount of carbohydrates based on how long the + or - button is held down for.
             */
            changeCarbohydratesByStep(addition) { // True = + amt of carbs or False = - amt of carbs
                let increment = addition ? 5 : -5;
                let ticks = 0; // The amt of ticks passed in the interval.

                const interval = setInterval(() => {
                    ticks++; // Next tick.

                    // Longer pressed the bigger the increment or decrement.
                    switch (ticks) { 
                        case 5: // If 5th tick and so on.
                            increment = addition ? 10 : -10;
                            break;
                        case 10:
                            increment = addition ? 20 : -20;
                            break;
                        case 15:
                            increment = addition ? 40 : -40;
                            break;
                        default:
                            break;
                    }

                    this.values.carbohydrates += increment; // set new value.

                    if(this.incrementCancel) {
                        clearInterval(interval); // stop increase.
                        this.incrementCancel = false; // Allow the buttons to be held again.
                    }
                }, 200);
            }
        },
    }
</script>

<style>
    .selectedModifier {
        color: var(--action-colour);
    }
</style>