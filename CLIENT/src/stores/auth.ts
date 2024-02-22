import { defineStore } from 'pinia'
import { useApi,useApiPrivate } from '../composables/useApi'
export interface User {
  _id: string
  userName: string
  email: string
  firstName: string
  lastName: string
}

export interface State {
  user: User
  access_token: string
}

export interface Login {
  email: string
  password: string
}

export interface Register {
  email: string
  userName: string
  password: string
  firstName: string
  lastName: string
  passwordConfirm: string
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      user: {} as User,
      access_token: '' as string
    }
  },
  getters: {
    userDetail: (state: State) => state.user,
    isAuthenticated: (state: State) => (state.user?._id ? true : false)
  },
  actions: {
    async attempt() {
      try {
        await this.refresh()
        await this.getUser()
      } catch (err) {
        return err
      }
      return
    },
    async login(payload: Login) {
      try {
        const { data } = await useApi().post('/routes/api/login', payload)
        this.access_token = data.access_token
        await this.getUser();
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async register(payload: Register) {
      try {
        const { data } = await useApi().post('/routes/api/register', payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async logout() {
      try {
        const { data } = await useApiPrivate().post('/routes/api/logout')
        this.access_token = ''
        this.user = {} as User
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async getUser() {
      try {
        const { data } = await useApiPrivate().get('/routes/api/user')
        this.user = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async refresh() {
      try {
        const { data } = await useApi().post('/routes/api/refresh')

        this.access_token = data.access_token
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
