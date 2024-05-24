<template>
  <v-container>
    <v-select :items="[100, 500, 1000]" v-model="rowCount" label="Количество элементов"></v-select>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="bids"
          :items-per-page="rowCount"
          class="elevation-1"
        ></v-data-table>
      </v-col>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="asks"
          :items-per-page="rowCount"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'

// const rowCountOptions = [100, 500, 1000]

const rowCount = ref<number>(100)
const headers = ref([
  { text: 'Price', value: 'price' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Total', value: 'total' }
])

const store = useStore()

const bids = store.state.bids
const asks = store.state.asks

// const updateRowCount = () => {
//   store.dispatch('updateRowCount', rowCount.value)
// }
</script>

<style scoped></style>
