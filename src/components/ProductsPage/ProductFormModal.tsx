import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Paper,
  Box,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { FormField } from '../FormField'
import { TranslationFields } from '../TranslationFields'
import type { Product } from '../../types'
import type {
  ProductVariantBackend,
  ProductAttributeBackend,
  ProductPriceBackend,
} from '../../types'
import type { Translation } from '../../types/category'

const emptyTranslation = (): Translation => ({ ua: '', ru: '', en: '' })
const emptyPrice = (): ProductPriceBackend => ({ current: 0, currency: 'UAH' })

const DEFAULT_VARIANT_NAMES: { ua: string; ru: string; en: string }[] = [
  { ua: '10 мл', ru: '10 мл', en: '10 ml' },
  { ua: '50 мл', ru: '50 мл', en: '50 ml' },
  { ua: '100 мл', ru: '100 мл', en: '100 ml' },
]

function emptyVariant(index: number = 0): ProductVariantBackend {
  const defaultName = DEFAULT_VARIANT_NAMES[index] ?? emptyTranslation()
  return { name: defaultName, price: emptyPrice(), sku: '', stock: 0, isActive: true }
}
function emptyAttribute(): ProductAttributeBackend {
  return { name: emptyTranslation(), value: emptyTranslation(), unit: '' }
}

/** Данные формы создания товара (название/описание — одна строка, при сохранении дублируются в UA/RU/EN) */
export interface ProductFormData {
  name: string
  price: number
  oldPrice?: number
  currency?: string
  categoryId: string | null
  categories?: string[]
  sku: string
  description: string
  shortDescription?: string
  stock?: number
  order?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  variants?: ProductVariantBackend[]
  attributes?: ProductAttributeBackend[]
}

export interface ProductFormModalProps {
  open: boolean
  product: Product | null
  categoryOptions: { id: string; name: string }[]
  onClose: () => void
  onSave: (data: ProductFormData) => void | Promise<void>
  loading?: boolean
}

const defaultForm: ProductFormData = {
  name: '',
  price: 0,
  categoryId: null,
  sku: '',
  description: '',
  shortDescription: '',
  stock: 0,
  order: 0,
  isActive: true,
  isNew: false,
  isFeatured: false,
  isOnSale: false,
  variants: [],
  attributes: [],
}

export function ProductFormModal({
  open,
  product,
  categoryOptions,
  onClose,
  onSave,
  loading = false,
}: ProductFormModalProps) {
  const [name, setName] = useState(defaultForm.name)
  const [price, setPrice] = useState(defaultForm.price)
  const [oldPrice, setOldPrice] = useState<number | ''>('')
  const [currency, setCurrency] = useState('UAH')
  const [categoryId, setCategoryId] = useState<string | null>(defaultForm.categoryId)
  const [sku, setSku] = useState(defaultForm.sku)
  const [description, setDescription] = useState(defaultForm.description)
  const [shortDescription, setShortDescription] = useState(defaultForm.shortDescription ?? '')
  const [stock, setStock] = useState(defaultForm.stock ?? 0)
  const [order, setOrder] = useState(defaultForm.order ?? 0)
  const [isActive, setIsActive] = useState(defaultForm.isActive ?? true)
  const [isNew, setIsNew] = useState(defaultForm.isNew ?? false)
  const [isFeatured, setIsFeatured] = useState(defaultForm.isFeatured ?? false)
  const [isOnSale, setIsOnSale] = useState(defaultForm.isOnSale ?? false)
  const [variants, setVariants] = useState<ProductVariantBackend[]>(defaultForm.variants ?? [])
  const [attributes, setAttributes] = useState<ProductAttributeBackend[]>(
    defaultForm.attributes ?? [],
  )

  useEffect(() => {
    if (open) {
      setName(product?.name ?? '')
      setPrice(product?.price ?? 0)
      setCategoryId(product?.categoryId ?? null)
      setSku(product?.sku ?? '')
      setDescription(product?.description ?? '')
      setShortDescription('')
      setStock(0)
      setOrder(0)
      setIsActive(true)
      setIsNew(false)
      setIsFeatured(false)
      setIsOnSale(false)
      setVariants([emptyVariant(0), emptyVariant(1), emptyVariant(2)])
      setAttributes([])
    }
  }, [open, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    if (price < 0) return
    await Promise.resolve(
      onSave({
        name: trimmedName,
        price: Number(price) || 0,
        oldPrice: oldPrice === '' ? undefined : Number(oldPrice) || 0,
        currency: currency || 'UAH',
        categoryId,
        sku: sku.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim() || undefined,
        stock,
        order,
        isActive,
        isNew,
        isFeatured,
        isOnSale,
        variants: variants.length ? variants : undefined,
        attributes: attributes.length ? attributes : undefined,
      }),
    )
  }

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant(prev.length)])
  const removeVariant = (idx: number) => setVariants((prev) => prev.filter((_, i) => i !== idx))
  const updateVariant = (idx: number, v: ProductVariantBackend) =>
    setVariants((prev) => prev.map((x, i) => (i === idx ? v : x)))

  const addAttribute = () => setAttributes((prev) => [...prev, emptyAttribute()])
  const removeAttribute = (idx: number) =>
    setAttributes((prev) => prev.filter((_, i) => i !== idx))
  const updateAttribute = (idx: number, a: ProductAttributeBackend) =>
    setAttributes((prev) => prev.map((x, i) => (i === idx ? a : x)))

  const isEdit = product != null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
          <FormField
            label="Название (будет сохранено для UA, RU, EN)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название товара"
            required
          />
          <FormField
            label="Цена, текущая"
            type="number"
            value={price === 0 ? '' : price}
            onChange={(e) => setPrice(Number((e.target as HTMLInputElement).value) || 0)}
            placeholder="0"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <FormField
            label="Старая цена (перечёркнутая)"
            type="number"
            value={oldPrice}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value
              setOldPrice(v === '' ? '' : Number(v) || 0)
            }}
            placeholder="Необязательно"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <FormField
            label="Валюта"
            value={currency}
            onChange={(e) => setCurrency((e.target as HTMLInputElement).value)}
          />
          <FormField
            label="Категория"
            select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId((e.target as HTMLInputElement).value || null)}
          >
            <MenuItem value="">Без категории</MenuItem>
            {categoryOptions.map(({ id, name: n }) => (
              <MenuItem key={id} value={id}>
                {n}
              </MenuItem>
            ))}
          </FormField>
          <FormField
            label="Артикул (SKU)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Необязательно"
          />
          <FormField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Необязательно"
            multiline
            rows={3}
          />
          <FormField
            label="Краткое описание"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Необязательно"
            multiline
            rows={2}
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
              control={<Switch checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />}
              label="Рекомендуемый"
            />
            <FormControlLabel
              control={<Switch checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />}
              label="Распродажа"
            />
          </Box>

          <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Варианты (милитраж / объём)</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {variants.map((v, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption">Вариант {idx + 1}</Typography>
                    <IconButton size="small" onClick={() => removeVariant(idx)} color="error">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <TranslationFields
                    label="Название (напр. 50 мл)"
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
                    label="SKU"
                    value={v.sku ?? ''}
                    onChange={(e) => updateVariant(idx, { ...v, sku: (e.target as HTMLInputElement).value })}
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={v.isActive ?? true}
                        onChange={(e) => updateVariant(idx, { ...v, isActive: e.target.checked })}
                      />
                    }
                    label="Активен"
                  />
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={addVariant} variant="outlined" size="small">
                Добавить вариант
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Атрибуты (параметры)</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {attributes.map((a, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption">Атрибут {idx + 1}</Typography>
                    <IconButton size="small" onClick={() => removeAttribute(idx)} color="error">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
                    label="Ед. изм."
                    value={a.unit ?? ''}
                    onChange={(e) =>
                      updateAttribute(idx, { ...a, unit: (e.target as HTMLInputElement).value })
                    }
                    placeholder="мл, г"
                    size="small"
                  />
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={addAttribute} variant="outlined" size="small">
                Добавить атрибут
              </Button>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={!name.trim() || price < 0 || loading}>
            {loading ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
