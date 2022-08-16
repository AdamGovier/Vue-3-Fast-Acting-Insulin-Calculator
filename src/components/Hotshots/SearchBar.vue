<template>
    <div id="SearchBar" data-testid="Hotshots_SearchBar">
        <Option>
            <InputArea>
                <Input @finished="input => this.$emit('search', input)" type="text" placeholder="Search.."  />
                
                <InputButton @click="this.$emit('scanBarcode');" icon="fas fa-camera" />
            </InputArea>
            <OptionLabel>
                <template v-slot:content>
                    Welcome to Hotshots! This area allows you to record repeative carbohydrate counts.
                </template>
            </OptionLabel>
        </Option>
    </div>
</template>

<style scoped>
    #SearchBar {
        width: 95%; 
        margin-top: var(--margin-sm);
    }
</style>

<script>
// Components
import Option from "@/components/Options/Option.vue";
import InputArea from "@/components/Options/InputArea.vue";
import Input from "@/components/Options/Input.vue";
import InputButton from "@/components/Options/InputButton.vue";
import OptionLabel from "@/components/Options/OptionLabel.vue";

export default {
    components: {
        Option,
        InputArea,
        Input,
        InputButton,
        OptionLabel
    }
}
</script>