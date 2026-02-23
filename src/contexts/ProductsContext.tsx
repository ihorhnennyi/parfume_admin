import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import type { Product } from '../types'
import { categoryFromBackend } from '../types'
import { productFromBackend } from '../types'
import * as categoriesApi from '../api/categories'
import * as productsApi from '../api/products'

interface ProductsContextValue {
  products: Product[]
  categoryOptions: { id: string; name: string }[]
  categoryById: Map<string, string>
  loading: boolean
  error: string | null
  refetchProducts: () => Promise<void>
  refetchCategories: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchCategories = useCallback(async () => {
    try {
      const list = await categoriesApi.getCategories(true)
      const options = list.map((c) => ({
        id: c._id ?? c.id ?? '',
        name: categoryFromBackend(c).name,
      })).filter((o) => o.id)
      setCategoryOptions(options)
    } catch {
      setCategoryOptions([])
    }
  }, [])

  const refetchProducts = useCallback(async () => {
    setError(null)
    try {
      const list = await productsApi.getProducts(true)
      setProducts(list.map(productFromBackend))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить товары')
      setProducts([])
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      categoriesApi.getCategories(true),
      productsApi.getProducts(true),
    ])
      .then(([catList, prodList]) => {
        if (cancelled) return
        setCategoryOptions(
          catList.map((c) => ({
            id: c._id ?? c.id ?? '',
            name: categoryFromBackend(c).name,
          })).filter((o) => o.id),
        )
        setProducts(prodList.map(productFromBackend))
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Ошибка загрузки')
          setProducts([])
          setCategoryOptions([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categoryById = useMemo(
    () => new Map(categoryOptions.map((c) => [c.id, c.name])),
    [categoryOptions],
  )

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      categoryOptions,
      categoryById,
      loading,
      error,
      refetchProducts,
      refetchCategories,
    }),
    [products, categoryOptions, categoryById, loading, error, refetchProducts, refetchCategories],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProductsContext must be used within ProductsProvider')
  return ctx
}
