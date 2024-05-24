<template>
  <v-container>
    <v-select
      :items="currencyPairs"
      v-model="selectedPair"
      label="Выберите валютную пару"
      @change="updatePair"
    ></v-select>
    <v-list>
      <v-list-item v-for="(log, index) in changeLog" :key="index">
        {{ log }}
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from '@/store'

const currencyPairs = ['BTCUSDT', 'BNBBTC', 'ETHBTC']
const selectedPair = ref('BTCUSDT')
const changeLog = ref<string[]>([])

const store = useStore()

const updatePair = () => {
  store.dispatch('updateCurrencyPair', selectedPair.value)
  const timestamp = new Date().toLocaleString()
  changeLog.value.push(`Пара изменена на ${selectedPair.value} в ${timestamp}`)
}

watch(selectedPair, updatePair)
</script>
