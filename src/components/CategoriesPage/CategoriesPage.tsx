import { useState, useMemo, useEffect, useCallback } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { CategoriesToolbar } from './CategoriesToolbar'
import { CategoriesFilter } from './CategoriesFilter'
import { CategoriesTable } from './CategoriesTable'
import { CategoryFormModal } from './CategoryFormModal'
import { DeleteCategoryDialog } from './DeleteCategoryDialog'
import type { Category, CategoryFilters as CategoryFiltersType } from '../../types'
import { categoryFromBackend } from '../../types'
import { toCategoryRows, filterCategories, sortCategoriesForTable } from '../../utils/categories'
import { useAuth } from '../../contexts/AuthContext'
import * as categoriesApi from '../../api/categories'

const INITIAL_FILTERS: CategoryFiltersType = {
  search: '',
  parentId: null,
}

export function CategoriesPage() {
  const { getAccessToken } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<CategoryFiltersType>(INITIAL_FILTERS)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await categoriesApi.getCategories(true)
      setCategories(list.map(categoryFromBackend))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить категории')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const filtered = useMemo(
    () => filterCategories(categories, filters),
    [categories, filters]
  )
  const rows = useMemo(
    () => sortCategoriesForTable(toCategoryRows(filtered)),
    [filtered]
  )

  const parentOptions = useMemo(
    () =>
      categories.filter((c) => c.parentId === null).map(({ id, name }) => ({ id, name })),
    [categories]
  )

  const categoryToEdit = useMemo(
    () => (editId ? categories.find((c) => c.id === editId) ?? null : null),
    [categories, editId]
  )

  const categoryToDelete = useMemo(
    () => (deleteId ? categories.find((c) => c.id === deleteId) ?? null : null),
    [categories, deleteId]
  )

  const handleApplyFilter = () => setFilterOpen(false)
  const handleResetFilter = () => setFilters(INITIAL_FILTERS)
  const handleAddCategory = () => setCreateOpen(true)
  const handleEdit = (id: string) => setEditId(id)
  const handleDelete = (id: string) => setDeleteId(id)

  const handleSaveEdit = useCallback(
    async (data: { name: string; parentId: string | null }) => {
      if (!editId) return
      const token = getAccessToken()
      if (!token) return
      setActionLoading(true)
      try {
        await categoriesApi.updateCategory(editId, data, token)
        await loadCategories()
        setEditId(null)
      } catch (e) {
        throw e
      } finally {
        setActionLoading(false)
      }
    },
    [editId, getAccessToken, loadCategories]
  )

  const handleSaveCreate = useCallback(
    async (data: { name: string; parentId: string | null }) => {
      const token = getAccessToken()
      if (!token) return
      setActionLoading(true)
      try {
        await categoriesApi.createCategory(data, token)
        await loadCategories()
        setCreateOpen(false)
      } catch (e) {
        throw e
      } finally {
        setActionLoading(false)
      }
    },
    [getAccessToken, loadCategories]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return
    const token = getAccessToken()
    if (!token) return
    setActionLoading(true)
    try {
      await categoriesApi.deleteCategory(deleteId, token)
      await loadCategories()
      setDeleteId(null)
    } catch (e) {
      throw e
    } finally {
      setActionLoading(false)
    }
  }, [deleteId, getAccessToken, loadCategories])

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
      <CategoriesToolbar
        onAddCategory={handleAddCategory}
        onToggleFilter={() => setFilterOpen((prev) => !prev)}
        filterOpen={filterOpen}
      />
      <CategoriesFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        parentOptions={parentOptions}
      />
      <CategoriesTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CategoryFormModal
        open={editId != null}
        category={categoryToEdit}
        parentOptions={parentOptions}
        onClose={() => setEditId(null)}
        onSave={handleSaveEdit}
        loading={actionLoading}
      />
      <CategoryFormModal
        open={createOpen}
        category={null}
        parentOptions={parentOptions}
        onClose={() => setCreateOpen(false)}
        onSave={handleSaveCreate}
        loading={actionLoading}
      />
      <DeleteCategoryDialog
        open={deleteId != null}
        categoryName={categoryToDelete?.name ?? ''}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </>
  )
}
