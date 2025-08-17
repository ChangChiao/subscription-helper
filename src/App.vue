<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">訂閱管理助手</h1>
        <DarkModeToggle />
      </div>
      
      <div class="flex gap-4 mb-6">
        <button
          @click="showAddModal = true"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新增訂閱
        </button>
        <button
          @click="showListView = !showListView"
          class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
        >
          {{ showListView ? '月曆視圖' : '列表視圖' }}
        </button>
      </div>

      <CalendarView v-if="!showListView" :subscriptions="subscriptions" />
      <SubscriptionList
        v-else
        :subscriptions="subscriptions"
        @edit="editSubscription"
        @delete="deleteSubscription"
      />
    </div>

    <SubscriptionModal
      v-if="showAddModal || editingSubscription"
      :subscription="editingSubscription"
      @save="saveSubscription"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalendarView from './components/CalendarView.vue'
import SubscriptionList from './components/SubscriptionList.vue'
import SubscriptionModal from './components/SubscriptionModal.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { useSubscriptions } from './composables/useSubscriptions'
import { useDarkMode } from './composables/useDarkMode'

const showAddModal = ref(false)
const showListView = ref(false)
const editingSubscription = ref(null)

const { subscriptions, loadSubscriptions, saveSubscription, deleteSubscription } = useSubscriptions()
const { loadDarkMode } = useDarkMode()

onMounted(() => {
  loadDarkMode()
  loadSubscriptions()
})

const editSubscription = (subscription) => {
  editingSubscription.value = subscription
}

const closeModal = () => {
  showAddModal.value = false
  editingSubscription.value = null
}
</script>