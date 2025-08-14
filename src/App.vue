<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">訂閱管理助手</h1>
      
      <div class="flex gap-4 mb-6">
        <button
          @click="showAddModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新增訂閱
        </button>
        <button
          @click="showListView = !showListView"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
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
import { useSubscriptions } from './composables/useSubscriptions'

const showAddModal = ref(false)
const showListView = ref(false)
const editingSubscription = ref(null)

const { subscriptions, loadSubscriptions, saveSubscription, deleteSubscription } = useSubscriptions()

onMounted(() => {
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