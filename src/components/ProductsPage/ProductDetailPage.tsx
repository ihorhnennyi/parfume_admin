import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Switch,
  FormControlLabel,
  Snackbar,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ArrowBack as BackIcon } from '@mui/icons-material'
import { FormField } from '../FormField'
import { TranslationFields } from '../TranslationFields'
import { ProductImageList } from './ProductImageList'
import { getUploadUrl } from '../../config/env'
import { useProductsContext } from '../../contexts/ProductsContext'
import { useAuth } from '../../contexts/AuthContext'
import * as productsApi from '../../api/products'
import { productFromBackend } from '../../types'
import type {
  Product,
  ProductBackend,
  ProductVariantBackend,
  ProductAttributeBackend,
  ProductPriceBackend,
} from '../../types'
import type { Translation } from '../../types/category'

const emptyTranslation = (): Translation => ({ ua: '', ru: '', en: '' })
const emptyPrice = (): ProductPriceBackend => ({ current: 0, currency: 'UAH' })

const DEFAULT_VARIANT_NAMES: Translation[] = [
  { ua: '10 мл', ru: '10 мл', en: '10 ml' },
  { ua: '50 мл', ru: '50 мл', en: '50 ml' },
  { ua: '100 мл', ru: '100 мл', en: '100 ml' },
]

function emptyVariant(index: number = 0): ProductVariantBackend {
  const defaultName = DEFAULT_VARIANT_NAMES[index] ?? emptyTranslation()
  return {
    name: defaultName,
    price: emptyPrice(),
    sku: '',
    stock: 0,
    isActive: true,
  }
}

function emptyAttribute(): ProductAttributeBackend {
  return {
    name: emptyTranslation(),
    value: emptyTranslation(),
    unit: '',
  }
}

function productToFormState(b: ProductBackend | null): {
  name: Translation
  description: Translation
  shortDescription: Translation
  price: ProductPriceBackend
  categoryId: string | null
  categories: string[]
  variants: ProductVariantBackend[]
  attributes: ProductAttributeBackend[]
  sku: string
  stock: number
  order: number
  isActive: boolean
  isNew: boolean
  isFeatured: boolean
  isOnSale: boolean
  metaTitle: Translation
  metaDescription: Translation
  metaKeywords: Translation
} | null {
  if (!b) return null
  return {
    name: b.name ?? emptyTranslation(),
    description: b.description ?? emptyTranslation(),
    shortDescription: b.shortDescription ?? emptyTranslation(),
    price: b.price
      ? {
          current: b.price.current ?? 0,
          old: b.price.old,
          currency: b.price.currency ?? 'UAH',
        }
      : emptyPrice(),
    categoryId:
      b.category == null
        ? null
        : typeof b.category === 'string'
          ? b.category
          : (b.category as { _id: string })._id ?? null,
    categories: Array.isArray(b.categories)
      ? b.categories.map((c: unknown) =>
          typeof c === 'string' ? c : (c as { _id?: string })?._id ?? '',
        ).filter(Boolean)
      : [],
    variants: Array.isArray(b.variants)
      ? b.variants.map((v: ProductVariantBackend) => ({
          ...v,
          isActive: v.isActive ?? true,
        }))
      : [],
    attributes: Array.isArray(b.attributes) ? b.attributes : [],
    sku: b.sku ?? '',
    stock: b.stock ?? 0,
    order: b.order ?? 0,
    isActive: b.isActive ?? true,
    isNew: b.isNew ?? false,
    isFeatured: b.isFeatured ?? false,
    isOnSale: b.isOnSale ?? false,
    metaTitle: b.metaTitle ?? emptyTranslation(),
    metaDescription: b.metaDescription ?? emptyTranslation(),
    metaKeywords: b.metaKeywords ?? emptyTranslation(),
  }
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAccessToken } = useAuth()
  const { products, categoryOptions, refetchProducts } = useProductsContext()

  const productFromList = id ? products.find((p) => p.id === id) ?? null : null
  const [product, setProduct] = useState<Product | null>(productFromList)
  const [loading, setLoading] = useState(!productFromList && !!id)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null)
  const [variantUploadError, setVariantUploadError] = useState<string | null>(null)
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const variantImageInputRef = useRef<HTMLInputElement>(null)
  const pendingVariantIndexRef = useRef<number | null>(null)

  const [name, setName] = useState<Translation>(emptyTranslation())
  const [description, setDescription] = useState<Translation>(emptyTranslation())
  const [shortDescription, setShortDescription] = useState<Translation>(emptyTranslation())
  const [price, setPrice] = useState<ProductPriceBackend>(emptyPrice())
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [variants, setVariants] = useState<ProductVariantBackend[]>([])
  const [attributes, setAttributes] = useState<ProductAttributeBackend[]>([])
  const [sku, setSku] = useState('')
  const [stock, setStock] = useState(0)
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isNew, setIsNew] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isOnSale, setIsOnSale] = useState(false)
  const [metaTitle, setMetaTitle] = useState<Translation>(emptyTranslation())
  const [metaDescription, setMetaDescription] = useState<Translation>(emptyTranslation())
  const [metaKeywords, setMetaKeywords] = useState<Translation>(emptyTranslation())

  const loadProduct = useCallback(async (productId: string) => {
    setLoading(true)
    try {
      const data = await productsApi.getProduct(productId)
      const p = data ? productFromBackend(data) : null
      setProduct(p)
      setImages(data?.images?.map((img) => img.url) ?? [])
      const form = productToFormState(data ?? null)
      if (form) {
        setName(form.name)
        setDescription(form.description)
        setShortDescription(form.shortDescription)
        setPrice(form.price)
        setCategoryId(form.categoryId)
        setCategories(form.categories)
        setVariants(
          form.variants.length > 0
            ? form.variants
            : [emptyVariant(0), emptyVariant(1), emptyVariant(2)],
        )
        setAttributes(form.attributes)
        setSku(form.sku)
        setStock(form.stock)
        setOrder(form.order)
        setIsActive(form.isActive)
        setIsNew(form.isNew)
        setIsFeatured(form.isFeatured)
        setIsOnSale(form.isOnSale)
        setMetaTitle(form.metaTitle)
        setMetaDescription(form.metaDescription)
        setMetaKeywords(form.metaKeywords)
      }
    } catch {
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (productFromList && id) {
      void loadProduct(id)
    } else if (id) {
      void loadProduct(id)
    }
  }, [id, loadProduct])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const token = getAccessToken()
    if (!token) return
    setSaving(true)
    try {
      const payload = productsApi.toCreateUpdateBodyWithTranslations({
        name,
        description: description.ua || description.ru || description.en ? description : null,
        shortDescription:
          shortDescription.ua || shortDescription.ru || shortDescription.en
            ? shortDescription
            : null,
        categoryId,
        categories,
        price,
        variants: variants.length ? variants : undefined,
        attributes: attributes.length ? attributes : undefined,
        sku: sku.trim() || null,
        stock,
        order,
        isActive,
        isNew,
        isFeatured,
        isOnSale,
        metaTitle: metaTitle.ua || metaTitle.ru || metaTitle.en ? metaTitle : null,
        metaDescription:
          metaDescription.ua || metaDescription.ru || metaDescription.en
            ? metaDescription
            : null,
        metaKeywords:
          metaKeywords.ua || metaKeywords.ru || metaKeywords.en ? metaKeywords : null,
      })
      await productsApi.updateProduct(id, payload, token)
      await refetchProducts()
      const updated = await productsApi.getProduct(id)
      if (updated) {
        setProduct(productFromBackend(updated))
        setImages(updated.images?.map((img) => img.url) ?? [])
        const form = productToFormState(updated)
        if (form) {
          setName(form.name)
          setDescription(form.description)
          setShortDescription(form.shortDescription)
          setPrice(form.price)
          setCategoryId(form.categoryId)
          setCategories(form.categories)
          setVariants(form.variants)
          setAttributes(form.attributes)
          setSku(form.sku)
          setStock(form.stock)
          setOrder(form.order)
          setIsActive(form.isActive)
          setIsNew(form.isNew)
          setIsFeatured(form.isFeatured)
          setIsOnSale(form.isOnSale)
          setMetaTitle(form.metaTitle)
          setMetaDescription(form.metaDescription)
          setMetaKeywords(form.metaKeywords)
        }
      }
      setSaveSuccessOpen(true)
    } finally {
      setSaving(false)
    }
  }

  const handleAddImages = async (files: FileList | null) => {
    if (!id || !files?.length) return
    const token = getAccessToken()
    if (!token) return
    setUploadingImages(true)
    try {
      await productsApi.addProductImages(id, Array.from(files), token)
      const updated = await productsApi.getProduct(id)
      if (updated) setImages(updated.images?.map((img) => img.url) ?? [])
      await refetchProducts()
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRemoveImage = async (index: number) => {
    if (!id) return
    const token = getAccessToken()
    if (!token) return
    setImageError(null)
    const previousImages = images
    setImages((prev) => prev.filter((_, i) => i !== index))
    try {
      await productsApi.deleteProductImage(id, index, token)
      await refetchProducts()
    } catch (e) {
      setImages(previousImages)
      setImageError(e instanceof Error ? e.message : 'Не вдалося видалити фото')
    }
  }

  const syncVariantsFromProduct = useCallback((updated: ProductBackend) => {
    if (Array.isArray(updated.variants)) {
      setVariants(updated.variants)
    }
  }, [])

  const handleVariantImageUpload = useCallback(
    async (variantIndex: number, file: File) => {
      if (!id) return
      setVariantUploadError(null)
      if (!file?.type?.startsWith('image/')) {
        setVariantUploadError('Выберите файл изображения (JPEG, PNG, GIF, WebP)')
        return
      }
      const token = getAccessToken()
      if (!token) {
        setVariantUploadError('Нужна авторизация')
        return
      }
      setUploadingVariantIndex(variantIndex)
      try {
        // Сначала сохраняем варианты на сервер (если в БД их ещё нет — иначе "Variant index out of range")
        await productsApi.updateProduct(id, { variants }, token)
        const updated = await productsApi.uploadVariantImage(id, variantIndex, file, token)
        syncVariantsFromProduct(updated)
        await refetchProducts()
      } catch (e) {
        setVariantUploadError(e instanceof Error ? e.message : 'Не удалось загрузить картинку')
      } finally {
        setUploadingVariantIndex(null)
        if (variantImageInputRef.current) variantImageInputRef.current.value = ''
      }
    },
    [id, getAccessToken, refetchProducts, syncVariantsFromProduct, variants],
  )

  const handleVariantImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      const idx = pendingVariantIndexRef.current
      e.target.value = ''
      pendingVariantIndexRef.current = null
      if (file && idx !== null && id) {
        void handleVariantImageUpload(idx, file)
      }
    },
    [id, handleVariantImageUpload],
  )

  const handleVariantImageRemove = useCallback(
    async (variantIndex: number) => {
      if (!id) return
      const token = getAccessToken()
      if (!token) return
      setVariantUploadError(null)
      const prevVariants = variants
      setVariants((prev) =>
        prev.map((v, i) =>
          i === variantIndex ? { ...v, image: undefined } : v,
        ),
      )
      try {
        await productsApi.updateProduct(id, { variants: prevVariants }, token)
        await productsApi.deleteVariantImage(id, variantIndex, token)
        const updated = await productsApi.getProduct(id)
        if (updated) syncVariantsFromProduct(updated)
        await refetchProducts()
      } catch (e) {
        setVariants(prevVariants)
        setVariantUploadError(
          e instanceof Error ? e.message : 'Не вдалося видалити фото варіанта',
        )
      }
    },
    [id, getAccessToken, refetchProducts, syncVariantsFromProduct, variants],
  )

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant(prev.length)])
  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index))
  const updateVariant = (index: number, v: ProductVariantBackend) =>
    setVariants((prev) => prev.map((x, i) => (i === index ? v : x)))

  const addAttribute = () => setAttributes((prev) => [...prev, emptyAttribute()])
  const removeAttribute = (index: number) =>
    setAttributes((prev) => prev.filter((_, i) => i !== index))
  const updateAttribute = (index: number, a: ProductAttributeBackend) =>
    setAttributes((prev) => prev.map((x, i) => (i === index ? a : x)))

  if (!id) {
    navigate('/products', { replace: true })
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return (
      <Container maxWidth="md">
        <Typography color="text.secondary">Товар не найден.</Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          К списку товаров
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/products')}
        sx={{ mb: 2 }}
      >
        К списку товаров
      </Button>

      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Редактирование товара
      </Typography>

      <Box component="form" onSubmit={handleSave}>
        <Grid container spacing={2}>
          {/* Блок 1: Название, категории и цена — один блок */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Название, категории и цена (UA / RU / EN)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TranslationFields label="Название" value={name} onChange={setName} />
                <FormField
                  label="Категория"
                  select
                  value={categoryId ?? ''}
                  onChange={(e) =>
                    setCategoryId((e.target as HTMLInputElement).value || null)
                  }
                >
                  <MenuItem value="">Без категории</MenuItem>
                  {categoryOptions.map(({ id: cId, name: n }) => (
                    <MenuItem key={cId} value={cId}>
                      {n}
                    </MenuItem>
                  ))}
                </FormField>
                <TranslationFields
                  label="Описание"
                  value={description}
                  onChange={setDescription}
                  multiline
                  rows={3}
                />
                <TranslationFields
                  label="Краткое описание"
                  value={shortDescription}
                  onChange={setShortDescription}
                  multiline
                  rows={2}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <FormField
                    label="Цена, текущая"
                    type="number"
                    value={price.current === 0 ? '' : price.current}
                    onChange={(e) =>
                      setPrice((p) => ({
                        ...p,
                        current: Number((e.target as HTMLInputElement).value) || 0,
                      }))
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ minWidth: 140 }}
                  />
                  <FormField
                    label="Старая цена (перечёркнутая)"
                    type="number"
                    value={price.old ?? ''}
                    onChange={(e) => {
                      const v = (e.target as HTMLInputElement).value
                      setPrice((p) => ({
                        ...p,
                        old: v === '' ? undefined : Number(v) || 0,
                      }))
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Необязательно"
                    sx={{ minWidth: 140 }}
                  />
                  <FormField
                    label="Валюта"
                    value={price.currency ?? 'UAH'}
                    onChange={(e) =>
                      setPrice((p) => ({ ...p, currency: (e.target as HTMLInputElement).value }))
                    }
                    sx={{ minWidth: 100 }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Блок 2: Варианты (милитраж) */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Варианты (милитраж / объём) — цена под каждый вариант
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {variantUploadError && (
                <Typography variant="body2" color="error" sx={{ mb: 0.5 }}>
                  {variantUploadError}
                </Typography>
              )}
              {variants.map((v, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Вариант {idx + 1}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeVariant(idx)}
                      color="error"
                      aria-label="Удалить вариант"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TranslationFields
                      label="Название варианта (напр. 50 мл, 100 мл)"
                      value={v.name}
                      onChange={(name) => updateVariant(idx, { ...v, name })}
                    />
                    <FormField
                      label="Цена"
                      type="number"
                      value={v.price?.current ?? ''}
                      onChange={(e) =>
                        updateVariant(idx, {
                          ...v,
                          price: {
                            ...v.price,
                            current: Number((e.target as HTMLInputElement).value) || 0,
                            currency: v.price?.currency ?? 'UAH',
                          },
                        })
                      }
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                    />
                    <FormField
                      label="SKU варианта"
                      value={v.sku ?? ''}
                      onChange={(e) => updateVariant(idx, { ...v, sku: (e.target as HTMLInputElement).value })}
                      size="small"
                    />
                    <FormField
                      label="Остаток"
                      type="number"
                      value={v.stock ?? ''}
                      onChange={(e) =>
                        updateVariant(idx, {
                          ...v,
                          stock: Number((e.target as HTMLInputElement).value) || 0,
                        })
                      }
                      inputProps={{ min: 0 }}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={v.isActive ?? true}
                          onChange={(e) =>
                            updateVariant(idx, { ...v, isActive: e.target.checked })
                          }
                        />
                      }
                      label="Активен"
                    />
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Изображение варианта (напр. для каждого милитража — своя картинка)
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {v.image ? (
                          <Box
                            sx={{
                              position: 'relative',
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: 1,
                              borderColor: 'divider',
                              bgcolor: 'action.hover',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              component="img"
                              src={getUploadUrl(v.image)}
                              alt=""
                              sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'action.hover' },
                              }}
                              onClick={() => void handleVariantImageRemove(idx)}
                              aria-label="Удалить изображение варианта"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              border: '1px dashed',
                              borderColor: 'divider',
                              bgcolor: 'action.hover',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Нет фото
                            </Typography>
                          </Box>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddPhotoAlternateIcon />}
                          disabled={uploadingVariantIndex === idx}
                          onClick={() => {
                            pendingVariantIndexRef.current = idx
                            variantImageInputRef.current?.click()
                          }}
                        >
                          {uploadingVariantIndex === idx ? 'Загрузка…' : 'Загрузить картинку'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
              <input
                ref={variantImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleVariantImageFileChange}
                style={{ display: 'none' }}
              />
              <Button startIcon={<AddIcon />} onClick={addVariant} variant="outlined" size="small">
                Добавить вариант
              </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Блок 3: Атрибуты */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Атрибуты (параметры товара)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {attributes.map((a, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Атрибут {idx + 1}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeAttribute(idx)}
                      color="error"
                      aria-label="Удалить атрибут"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TranslationFields
                      label="Название атрибута"
                      value={a.name}
                      onChange={(name) => updateAttribute(idx, { ...a, name })}
                    />
                    <TranslationFields
                      label="Значение"
                      value={a.value}
                      onChange={(value) => updateAttribute(idx, { ...a, value })}
                    />
                    <FormField
                      label="Единица измерения"
                      value={a.unit ?? ''}
                      onChange={(e) =>
                        updateAttribute(idx, { ...a, unit: (e.target as HTMLInputElement).value })
                      }
                      placeholder="мл, г, шт."
                      size="small"
                    />
                  </Box>
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={addAttribute} variant="outlined" size="small">
                Добавить атрибут
              </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Блок 4: Прочее и флаги */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Прочее и флаги
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormField
                label="Артикул (SKU)"
                value={sku}
                onChange={(e) => setSku((e.target as HTMLInputElement).value)}
                placeholder="Необязательно"
              />
              <FormField
                label="Остаток (основной)"
                type="number"
                value={stock === 0 ? '' : stock}
                onChange={(e) => setStock(Number((e.target as HTMLInputElement).value) || 0)}
                inputProps={{ min: 0 }}
              />
              <FormField
                label="Порядок сортировки"
                type="number"
                value={order === 0 ? '' : order}
                onChange={(e) => setOrder(Number((e.target as HTMLInputElement).value) || 0)}
                inputProps={{ min: 0 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel
                  control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                  label="Активен"
                />
                <FormControlLabel
                  control={<Switch checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />}
                  label="Новый"
                />
                <FormControlLabel
                  control={
                    <Switch checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  }
                  label="Рекомендуемый"
                />
                <FormControlLabel
                  control={<Switch checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />}
                  label="Распродажа"
                />
              </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Блок 5: SEO */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                SEO (meta)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TranslationFields label="Meta title" value={metaTitle} onChange={setMetaTitle} />
                <TranslationFields
                  label="Meta description"
                  value={metaDescription}
                  onChange={setMetaDescription}
                  multiline
                  rows={2}
                />
                <TranslationFields label="Meta keywords" value={metaKeywords} onChange={setMetaKeywords} />
              </Box>
            </Paper>
          </Grid>

          {/* Блок 6: Изображения */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Изображения товара
              </Typography>
              <ProductImageList
                images={images}
                onAddFiles={(files) => void handleAddImages(files)}
                onRemove={handleRemoveImage}
                uploadLoading={uploadingImages}
              />
            </Paper>
          </Grid>

          {/* Кнопки */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Сохранение…' : 'Сохранить'}
              </Button>
              <Button type="button" onClick={() => navigate('/products')} disabled={saving}>
                Отмена
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={saveSuccessOpen}
        autoHideDuration={3000}
        onClose={() => setSaveSuccessOpen(false)}
        message="Сохранено"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
      <Snackbar
        open={!!imageError}
        autoHideDuration={5000}
        onClose={() => setImageError(null)}
        message={imageError ?? ''}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{ sx: { bgcolor: 'error.main', color: 'error.contrastText' } }}
      />
    </Container>
  )
}
