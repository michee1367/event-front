<script setup>
import { getNormalNameField, getNormalNameTable } from "@/tools/ressources";
const props = defineProps({
  fields: Object,
  resource: Object,
  modelValue: Object,
  rels:Object,
  enums:Object
})
const emit = defineEmits(["update:modelValue"])

import Litepicker from '@/components/Litepicker.vue'

const onInput = (key, value) => {
    console.log(value)
  emit("update:modelValue", { ...props.modelValue, [key]: value })
}
const onInputDate = (key, value) => {
    console.log(value)
    //modelValue[key] = value
  emit("update:modelValue", { ...props.modelValue, [key]: value })
}
  const getNormalNameFieldLocal = (resource, field) => {
    return getNormalNameField(resource, field)
  }
  const  getNormalNameTableLocal = (resource) => {
    return getNormalNameTable(resource)
  }
</script>

<template>
  <div>
    <div v-for="(type, key) in fields" :key="key" class="mb-3">

        <label class="form-check" v-if="type.includes('BOOL')">
            <input type="checkbox" class="form-check-input" :value="modelValue[key] || false" @checked="onInput(key, !modelValue[key])"/>
            <span class="form-check-label">{{ getNormalNameFieldLocal(resource, key) }}</span>
        </label>
        <label class="block font-semibold mb-1" v-else>
        {{ rels[key]? getNormalNameTableLocal(rels[key].resource)  : getNormalNameFieldLocal(resource, key) }}
        </label>
        <select 
            class="form-select" v-if="rels[key]"  
            :value="modelValue[key] || null" @select="onInput(key, $event.target.value)">
            <option :value="value?.id" v-for="(value, index) in rels[key].options" :key="index">
                {{ value?.app_value || value?.id }}
            </option>
        </select>
        <select 
            class="form-select" v-else-if="enums[key]"  
            :value="modelValue[key] || null" @select="onInput(key, $event.target.value)">
            <option :value="value?.name" v-for="(value, index) in enums[key]" :key="index">
                {{ value?.value }}
            </option>
        </select>

        <ClientOnly 
            v-else-if="type.includes('DATE')" 
            fallback-tag="div" fallback="Loading data...">
            <Litepicker
                :singleMode="true"
                :value="modelValue[key] || null" @update:value="onInputDate(key, $event)"
            />
        </ClientOnly>
        
        
        <input
            v-else-if="!type.includes('BOOL')"
            class="border px-3 py-2 rounded w-full"
            :type="type.includes('INT') ? 'number' : 'text'"
            :value="modelValue[key] || ''"
            @input="onInput(key, $event.target.value)"
        />

    </div>
  </div>
</template>