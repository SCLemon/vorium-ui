<template>
    <div class="v-checkbox-group" :style="{ width, gap }">
        <slot></slot>
    </div>
</template>

<script>
import { ref, provide, useModel, computed } from 'vue';

export default {
    name: 'VCheckBoxGroup',

    emits: ['update:modelValue'],

    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        width: {
            type: String,
            default: '100%'
        },
        gap: {
            type: String,
            default: '15px'
        },

        // min, max 數量包含 Disabled = true 但被選中的選項
        min: {
            type: Number,
            default: undefined
        },

        max: { // 若 max 限制，則 selectAll 只選前 max 項
            type: Number,
            default: undefined
        }
    },

    setup(props, context) {

        const model = useModel(props, 'modelValue', context.emit);
        
        // 收集 slot 下的 options
        const optionValues = ref([]);

        const register = (option) => {

            const exists = optionValues.value.find(
                item => item.value === option.value
            );

            if(!exists){
                optionValues.value.push(option);
            }

        };

        const unregister = (option) => {

            const index = optionValues.value.findIndex(
                item => item.value === option.value
            );

            if(index > -1){
                optionValues.value.splice(index, 1);
            }

            model.value = model.value.filter(
                value => value !== option.value
            );

        };


        // for VCheckBoxOption used
        const toggle = (option) => {

            if(option?.disabled){
                return;
            }

            const arr = [...model.value];

            const index = arr.indexOf(option.value);

            if (index > -1) {
                if (props.min !== undefined && arr.length <= props.min) {
                    return;
                }
                arr.splice(index, 1);
            }
            else {
                if (props.max !== undefined && arr.length >= props.max) {
                    return;
                }
                arr.push(option.value);
            }

            model.value = arr;
        };

        provide('VCheckBoxGroup', { model, toggle, register, unregister, max: computed(() => props.max) });


        // for user used
        const clearAll = () => {

            model.value = model.value.filter(value => {

                const option = optionValues.value.find(
                    item => item.value === value
                );

                return option?.disabled;
            });
            
        };

        const selectAll = () => {
            
            const values = new Set(model.value);

            optionValues.value.forEach(item => {

                if(item.disabled){
                    return;
                }

                if(props.max !== undefined && values.size >= props.max){
                    return;
                }

                values.add(item.value);

            });

            model.value = [...values];

        };

        context.expose({ clearAll, selectAll });

        return {
            model, toggle
        };
    },
}
</script>

<style>
.v-checkbox-group{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>