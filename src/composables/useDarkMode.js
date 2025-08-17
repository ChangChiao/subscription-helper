import { ref, watchEffect } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  const loadDarkMode = () => {
    const stored = localStorage.getItem('darkMode')
    isDark.value = stored === 'true'
    updateDarkClass()
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', isDark.value.toString())
    updateDarkClass()
  }

  const updateDarkClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  watchEffect(() => {
    updateDarkClass()
  })

  return {
    isDark,
    loadDarkMode,
    toggleDarkMode
  }
}