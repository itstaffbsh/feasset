<template>
  <div class="relative" ref="container">
    <div 
      class="flex items-center w-full border rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-brand-dark focus-within:border-brand-dark bg-white overflow-hidden cursor-text"
      :class="[error ? 'border-red-500' : 'border-gray-300', disabled ? 'bg-gray-100 cursor-not-allowed' : '']"
      @click="openDropdown"
    >
      <input
        ref="inputRef"
        type="text"
        class="w-full border-none focus:ring-0 sm:text-sm p-3 bg-transparent"
        :class="disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900'"
        v-model="searchQuery"
        :placeholder="placeholder"
        @focus="openDropdown"
        @input="filterOptions"
        :disabled="disabled"
      />
      <div class="px-3 text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
    
    <!-- Validation Message -->
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ errorMessage || 'Input required' }}</p>

    <!-- Dropdown -->
    <div 
      v-if="isOpen && !disabled" 
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <div 
        v-if="filteredOptions.length === 0" 
        class="p-3 text-sm text-gray-500 text-center"
      >
        Tidak ditemukan
      </div>
      <ul v-else class="py-1">
        <li 
          v-for="option in filteredOptions" 
          :key="option[valueKey]"
          @click="selectOption(option)"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-brand-dark hover:text-white transition-colors"
          :class="{'bg-gray-50 font-bold': option[valueKey] === modelValue}"
        >
          {{ option[labelKey] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Pilih...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: 'Bagian ini wajib diisi'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const container = ref(null)
const inputRef = ref(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase().trim()
  return props.options.filter(opt => {
    const label = String(opt[props.labelKey] || '').toLowerCase()
    const code = opt.code ? String(opt.code).toLowerCase() : ''
    const name = opt.name ? String(opt.name).toLowerCase() : ''
    const search = opt.search ? String(opt.search).toLowerCase() : ''
    return label.includes(query) || code.includes(query) || name.includes(query) || search.includes(query)
  })
})

// Sync query with external value changes
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    if (!isOpen.value) searchQuery.value = ''
    return
  }
  const selected = props.options.find(opt => opt[props.valueKey] === newVal)
  if (selected && !isOpen.value) {
    searchQuery.value = selected[props.labelKey]
  }
}, { immediate: true })

// Make sure options load async is respected
watch(() => props.options, () => {
  if (props.modelValue && !isOpen.value) {
    const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue)
    if (selected) {
      searchQuery.value = selected[props.labelKey]
    }
  }
}, { deep: true })

const filterOptions = () => {
  isOpen.value = true
  // If user types, we consider the value "unselected" until they pick one
  if (props.modelValue) {
    emit('update:modelValue', '')
  }
}

const openDropdown = () => {
  if (props.disabled) return
  isOpen.value = true
  if (props.modelValue) {
    // Select all text on focus for easy replacement
    setTimeout(() => {
      inputRef.value?.select()
    }, 10)
  }
}

const selectOption = (option) => {
  searchQuery.value = option[props.labelKey]
  emit('update:modelValue', option[props.valueKey])
  isOpen.value = false
}

// Click outside to close
const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false
    // Restore text if unselected but something was typed, or clear
    if (!props.modelValue) {
      searchQuery.value = ''
    } else {
      const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue)
      if (selected) {
        searchQuery.value = selected[props.labelKey]
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
