<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">
          {{ isEdit ? '編輯訂閱' : '新增訂閱' }}
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                名稱 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Emoji <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.emoji"
                type="text"
                required
                maxlength="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                金額 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                幣別 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.currency"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TWD">TWD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                週期類型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.cycleType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">每週</option>
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                週期間隔 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.cycleInterval"
                type="number"
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                首扣日期 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.anchorDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                狀態 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">啟用</option>
                <option value="paused">暫停</option>
                <option value="canceled">已取消</option>
                <option value="trial">試用中</option>
              </select>
            </div>
          </div>
          
          <div v-if="form.cycleType === 'monthly'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              少天月份策略
            </label>
            <select
              v-model="form.carryStrategy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="end_of_month">向前至月底</option>
              <option value="skip">跳過該月</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              服務網址
            </label>
            <input
              v-model="form.vendorUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              付款方式
            </label>
            <input
              v-model="form.paymentMethod"
              type="text"
              placeholder="例：信用卡、PayPal"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              標籤
            </label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="用逗號分隔，例：影音,娛樂"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              顏色
            </label>
            <input
              v-model="form.color"
              type="color"
              class="w-full h-10 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              備註
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-4 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              {{ isEdit ? '更新' : '新增' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  subscription: Object
})

const emit = defineEmits(['save', 'close'])

const isEdit = computed(() => !!props.subscription)

const form = ref({
  name: '',
  emoji: '',
  amount: 0,
  currency: 'TWD',
  cycleType: 'monthly',
  cycleInterval: 1,
  anchorDate: new Date().toISOString().split('T')[0],
  carryStrategy: 'end_of_month',
  status: 'active',
  vendorUrl: '',
  paymentMethod: '',
  notes: '',
  color: '#FF0000',
  tags: []
})

const tagsInput = ref('')

watch(() => props.subscription, (subscription) => {
  if (subscription) {
    form.value = { ...subscription }
    tagsInput.value = subscription.tags ? subscription.tags.join(', ') : ''
  }
}, { immediate: true })

const handleSubmit = () => {
  const subscription = {
    ...form.value,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
  }
  emit('save', subscription)
  emit('close')
}
</script>