import { PASSWORD_MIN_LENGTH } from './validation'

/** Сообщения валидации формы логина */
export const LOGIN_VALIDATION_MESSAGES = {
  emailRequired: 'Введите email',
  emailInvalid: 'Некорректный формат email',
  passwordRequired: 'Введите пароль',
  passwordTooShort: `Минимум ${PASSWORD_MIN_LENGTH} символов`,
} as const
