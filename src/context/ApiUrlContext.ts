import { createContext, useContext } from 'react'
import { SEARCH_API_URL } from '@/config'

export const ApiUrlContext = createContext(SEARCH_API_URL)
export const useApiUrl = () => useContext(ApiUrlContext)
