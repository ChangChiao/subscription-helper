<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ formatDate(date) }} 的訂閱
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="charges.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          當日無扣款項目
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="charge in charges"
            :key="charge.subscriptionId"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ charge.subscription.emoji }}</span>
              <div>
                <div class="font-medium text-gray-800 dark:text-gray-100">{{ charge.subscription.name }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getCycleText(charge.subscription) }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-medium text-gray-800 dark:text-gray-100">
                {{ charge.currency }} {{ charge.amount.toLocaleString() }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ getStatusText(charge.status) }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="charges.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-800 dark:text-gray-100">當日總計</span>
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">
              NT$ {{ dayTotal.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  date: Date,
  charges: Array
})

const emit = defineEmits(['close'])

const dayTotal = computed(() => {
  return props.charges.reduce((sum, charge) => sum + charge.amount, 0)
})

const formatDate = (date) => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const getCycleText = (subscription) => {
  const { cycleType, cycleInterval } = subscription
  if (cycleType === 'weekly') {
    return cycleInterval === 1 ? '每週' : `每 ${cycleInterval} 週`
  } else if (cycleType === 'monthly') {
    return cycleInterval === 1 ? '每月' : `每 ${cycleInterval} 個月`
  } else if (cycleType === 'yearly') {
    return cycleInterval === 1 ? '每年' : `每 ${cycleInterval} 年`
  }
  return ''
}

const getStatusText = (status) => {
  const texts = {
    projected: '預計扣款',
    completed: '已扣款',
    failed: '扣款失敗'
  }
  return texts[status] || status
}
</script>