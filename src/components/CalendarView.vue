<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold">
          {{ currentYear }}年 {{ currentMonth }}月
        </h2>
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          @click="goToToday"
          class="text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          回到本月
        </button>
      </div>
      
      <div class="text-right">
        <div class="text-sm text-gray-600">本月總支出</div>
        <div class="text-2xl font-bold text-gray-800">
          NT$ {{ monthlyTotal.toLocaleString() }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-medium text-gray-600 py-2"
      >
        {{ day }}
      </div>
      
      <div
        v-for="(date, index) in calendarDates"
        :key="index"
        class="min-h-[100px] border border-gray-200 p-2 relative"
        :class="{
          'bg-gray-50': !date,
          'bg-blue-50': isToday(date),
          'hover:bg-gray-50': date && !isToday(date),
          'cursor-pointer': date
        }"
        @click="date && showDayDetail(date)"
      >
        <div v-if="date" class="text-sm font-medium mb-1">
          {{ date.getDate() }}
        </div>
        <div v-if="date" class="space-y-1">
          <div
            v-for="sub in getFirstTimeSubscriptionsForDate(date)"
            :key="`first-${sub.id}`"
            class="text-xs flex items-center gap-1 truncate bg-green-100 rounded px-1"
            :title="`首次訂閱 ${sub.name}: NT$ ${sub.amount}`"
          >
            <span>{{ sub.emoji }}</span>
            <span class="truncate">{{ sub.name }}</span>
            <span class="text-green-700 font-semibold">首次</span>
          </div>
          <div
            v-for="charge in getChargesForDate(date)"
            :key="charge.subscriptionId"
            class="text-xs flex items-center gap-1 truncate"
            :title="`${charge.subscription.name}: NT$ ${charge.amount}`"
          >
            <span>{{ charge.subscription.emoji }}</span>
            <span class="truncate">{{ charge.subscription.name }}</span>
            <span class="text-gray-600">${{ charge.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <DayDetailModal
      v-if="selectedDate"
      :date="selectedDate"
      :charges="getChargesForDate(selectedDate)"
      @close="selectedDate = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DayDetailModal from './DayDetailModal.vue'
import { useSubscriptions } from '../composables/useSubscriptions'

const props = defineProps({
  subscriptions: Array
})

const { charges } = useSubscriptions()

const today = new Date()
const currentDate = ref(new Date())
const selectedDate = ref(null)

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const monthlyTotal = computed(() => {
  const monthCharges = charges.value.filter(charge => {
    const chargeDate = new Date(charge.chargeDate)
    return chargeDate.getFullYear() === currentYear.value &&
           chargeDate.getMonth() === currentDate.value.getMonth()
  })
  return monthCharges.reduce((sum, charge) => sum + charge.amount, 0)
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  
  const dates = []
  
  for (let i = 0; i < startDay; i++) {
    dates.push(null)
  }
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day))
  }
  
  while (dates.length < 42) {
    dates.push(null)
  }
  
  return dates
})

const getChargesForDate = (date) => {
  if (!date) return []
  const dateStr = date.toISOString().split('T')[0]
  return charges.value.filter(charge => charge.chargeDate === dateStr)
}

const getFirstTimeSubscriptionsForDate = (date) => {
  if (!date) return []
  const dateStr = date.toISOString().split('T')[0]
  return props.subscriptions.filter(sub => {
    const anchorDate = sub.anchorDate?.split('T')[0]
    return anchorDate === dateStr
  })
}

const isToday = (date) => {
  if (!date) return false
  return date.toDateString() === today.toDateString()
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const showDayDetail = (date) => {
  selectedDate.value = date
}

watch(() => props.subscriptions, () => {
  const { loadSubscriptions } = useSubscriptions()
  loadSubscriptions()
}, { deep: true })
</script>