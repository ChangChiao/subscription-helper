import { ref } from 'vue'

export function useSubscriptions() {
  const subscriptions = ref([])
  const charges = ref([])

  const loadSubscriptions = () => {
    const stored = localStorage.getItem('subscriptions')
    if (stored) {
      subscriptions.value = JSON.parse(stored)
    }
    generateCharges()
  }

  const saveSubscription = (subscription) => {
    if (subscription.id) {
      const index = subscriptions.value.findIndex(s => s.id === subscription.id)
      if (index !== -1) {
        subscriptions.value[index] = subscription
      }
    } else {
      subscription.id = `sub_${Date.now()}`
      subscriptions.value.push(subscription)
    }
    
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions.value))
    generateCharges()
  }

  const deleteSubscription = (id) => {
    subscriptions.value = subscriptions.value.filter(s => s.id !== id)
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions.value))
    generateCharges()
  }

  const generateCharges = () => {
    const newCharges = []
    const today = new Date()
    const nextTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, 0)
    
    subscriptions.value.forEach(sub => {
      if (sub.status !== 'active' && sub.status !== 'trial') return
      
      const anchorDate = new Date(sub.anchorDate)
      let currentDate = new Date(anchorDate)
      
      while (currentDate <= nextTwoMonths) {
        if (currentDate >= today) {
          newCharges.push({
            subscriptionId: sub.id,
            subscription: sub,
            chargeDate: currentDate.toISOString().split('T')[0],
            amount: sub.amount,
            currency: sub.currency,
            status: 'projected'
          })
        }
        
        if (sub.cycleType === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7 * sub.cycleInterval)
        } else if (sub.cycleType === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + sub.cycleInterval)
          if (sub.carryStrategy === 'end_of_month' && currentDate.getDate() !== anchorDate.getDate()) {
            currentDate.setDate(0)
          }
        } else if (sub.cycleType === 'yearly') {
          currentDate.setFullYear(currentDate.getFullYear() + sub.cycleInterval)
        }
      }
    })
    
    charges.value = newCharges
    localStorage.setItem('charges', JSON.stringify(newCharges))
  }

  return {
    subscriptions,
    charges,
    loadSubscriptions,
    saveSubscription,
    deleteSubscription
  }
}