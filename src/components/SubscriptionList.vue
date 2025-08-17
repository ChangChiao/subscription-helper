<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">訂閱清單</h2>
    
    <div v-if="subscriptions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      尚無訂閱項目
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="subscription in subscriptions"
        :key="subscription.id"
        class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div class="flex items-center gap-4">
          <span class="text-2xl">{{ subscription.emoji }}</span>
          <div>
            <h3 class="font-medium text-gray-800 dark:text-gray-100">{{ subscription.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ getCycleText(subscription) }} · NT$ {{ subscription.amount }}
              <span
                v-if="subscription.status !== 'active'"
                class="ml-2 px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(subscription.status)"
              >
                {{ getStatusText(subscription.status) }}
              </span>
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="$emit('edit', subscription)"
            class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="confirmDelete(subscription)"
            class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  subscriptions: Array
})

const emit = defineEmits(['edit', 'delete'])

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

const getStatusClass = (status) => {
  const classes = {
    paused: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
    trial: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    paused: '暫停中',
    canceled: '已取消',
    trial: '試用中'
  }
  return texts[status] || status
}

const confirmDelete = (subscription) => {
  if (confirm(`確定要刪除「${subscription.name}」嗎？`)) {
    emit('delete', subscription.id)
  }
}
</script>