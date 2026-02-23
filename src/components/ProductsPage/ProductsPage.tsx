import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { ProductsToolbar } from './ProductsToolbar'
import { ProductsFilter } from './ProductsFilter'
import { ProductsTable } from './ProductsTable'
import { ProductFormModal } from './ProductFormModal'
import { DeleteProductDialog } from './DeleteProductDialog'
import { useProductsContext } from '../../contexts/ProductsContext'
import { useAuth } from '../../contexts/AuthContext'
import type { ProductFilters as ProductFiltersType } from '../../types'
import type { ProductFormData } from './ProductFormModal'
import { toProductRows, filterProducts, sortProductsForTable } from '../../utils/products'
import * as productsApi from '../../api/products'

const INITIAL_FILTERS: ProductFiltersType = {
  search: '',
  categoryId: null,
}

export function ProductsPage() {
  const navigate = useNavigate()
  const { getAccessToken } = useAuth()
  const {
    products,
    categoryOptions,
    categoryById,
    loading,
    error,
    refetchProducts,
  } = useProductsContext()

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ProductFiltersType>(INITIAL_FILTERS)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const filtered = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )
  const rows = useMemo(
    () => sortProductsForTable(toProductRows(filtered, categoryById)),
    [filtered, categoryById]
  )

  const productToDelete = useMemo(
    () => (deleteId ? products.find((p) => p.id === deleteId) ?? null : null),
    [products, deleteId]
  )

  const handleApplyFilter = () => setFilterOpen(false)
  const handleResetFilter = () => setFilters(INITIAL_FILTERS)
  const handleAddProduct = () => setCreateOpen(true)
  const handleEdit = (id: string) => navigate(`/products/${id}`)
  const handleDelete = (id: string) => setDeleteId(id)

  const handleSaveCreate = useCallback(
    async (data: ProductFormData) => {
      const token = getAccessToken()
      if (!token) return
      setActionLoading(true)
      try {
        const body = productsApi.toCreateUpdateBodyFromSimple({
          ...data,
          oldPrice: data.oldPrice,
          currency: data.currency,
          categories: data.categories,
          shortDescription: data.shortDescription,
          stock: data.stock,
          order: data.order,
          isActive: data.isActive,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
          isOnSale: data.isOnSale,
          variants: data.variants,
          attributes: data.attributes,
        })
        await productsApi.createProduct(body, token)
        await refetchProducts()
        setCreateOpen(false)
      } finally {
        setActionLoading(false)
      }
    },
    [getAccessToken, refetchProducts]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return
    const token = getAccessToken()
    if (!token) return
    setActionLoading(true)
    try {
      await productsApi.deleteProduct(deleteId, token)
      await refetchProducts()
      setDeleteId(null)
    } finally {
        setActionLoading(false)
    }
  }, [deleteId, getAccessToken, refetchProducts])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <>
      <ProductsToolbar
        onAddProduct={handleAddProduct}
        onToggleFilter={() => setFilterOpen((prev) => !prev)}
        filterOpen={filterOpen}
      />
      <ProductsFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        categoryOptions={categoryOptions}
      />
      <ProductsTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
      <ProductFormModal
        open={createOpen}
        product={null}
        categoryOptions={categoryOptions}
        onClose={() => setCreateOpen(false)}
        onSave={handleSaveCreate}
        loading={actionLoading}
      />
      <DeleteProductDialog
        open={deleteId != null}
        productName={productToDelete?.name ?? ''}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </>
  )
}
