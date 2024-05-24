import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { InjectionKey } from 'vue'
import axios from 'axios'

export type Pairs = 'BTCUSDT' | 'BNBBTC' | 'ETHBTC'

export interface State {
  currencyPair: Pairs
  bids: string[][]
  asks: string[][]
  lastUpdateId: number | null
}

interface OrderBook {
  bids: string[][]
  asks: string[][]
}

interface DepthUpdate {
  e: string
  E: number
  s: string
  U: number
  u: number
  b: string[][]
  a: string[][]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    currencyPair: 'BTCUSDT',
    bids: [],
    asks: [],
    lastUpdateId: null
  },
  mutations: {
    SET_ORDER_BOOK(state: State, { bids, asks }: OrderBook) {
      state.bids = bids
      state.asks = asks
    },
    SET_CURRENCY_PAIR(state: State, pair: Pairs) {
      state.currencyPair = pair
    },
    SET_LAST_UPDATE_ID(state: State, lastUpdateId: number) {
      state.lastUpdateId = lastUpdateId
    },
    UPDATE_BIDS(state: State, bids: string[][]) {
      bids.forEach(([price, quantity]) => {
        const index = state.bids.findIndex((bid) => bid[0] === price)
        if (quantity === '0') {
          if (index !== -1) state.bids.splice(index, 1)
        } else {
          if (index === -1) state.bids.push([price, quantity])
          else state.bids[index][1] = quantity
        }
      })
      state.bids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])) // Sort bids descending
    },
    UPDATE_ASKS(state: State, asks: string[][]) {
      asks.forEach(([price, quantity]) => {
        const index = state.asks.findIndex((ask) => ask[0] === price)
        if (quantity === '0') {
          if (index !== -1) state.asks.splice(index, 1)
        } else {
          if (index === -1) state.asks.push([price, quantity])
          else state.asks[index][1] = quantity
        }
      })
      state.asks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])) // Sort asks ascending
    }
  },
  actions: {
    async updateCurrencyPair({ commit, dispatch }, pair: Pairs) {
      commit('SET_CURRENCY_PAIR', pair)
      await dispatch('fetchOrderBookSnapshot')
      dispatch('connectWebSocket')
    },
    async fetchOrderBookSnapshot({ commit, state }) {
      try {
        const response = await axios.get(
          `/api/api/v3/depth?symbol=${state.currencyPair}&limit=1000`
        )
        const { lastUpdateId, bids, asks } = response.data
        commit('SET_LAST_UPDATE_ID', lastUpdateId)
        commit('SET_ORDER_BOOK', { bids, asks })
      } catch (error) {
        console.error('Failed to fetch order book snapshot', error)
      }
    },
    connectWebSocket({ commit, state, dispatch }) {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${state.currencyPair.toLowerCase()}@depth`
      )
      const buffer: DepthUpdate[] = []

      ws.onmessage = (event) => {
        const data: DepthUpdate = JSON.parse(event.data)
        buffer.push(data)
        dispatch('processBufferedEvents', buffer)
      }

      ws.onclose = () => {
        console.log('WebSocket closed. Reconnecting...')
        dispatch('connectWebSocket')
      }
    },
    processBufferedEvents({ state, commit }, buffer: DepthUpdate[]) {
      while (buffer.length > 0) {
        const data = buffer.shift()!
        if (data.u <= state.lastUpdateId) {
          continue
        }
        if (data.U <= state.lastUpdateId + 1 && data.u >= state.lastUpdateId + 1) {
          commit('UPDATE_BIDS', data.b)
          commit('UPDATE_ASKS', data.a)
          commit('SET_LAST_UPDATE_ID', data.u)
        }
      }
    }
  }
})

export function useStore() {
  return baseUseStore(key)
}
