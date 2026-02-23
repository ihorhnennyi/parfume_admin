import type { LoginFormData, LoginFormErrors } from '../types'
import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '../constants/validation'
import { LOGIN_VALIDATION_MESSAGES } from '../constants/messages'

/**
 * Проверяет данные формы логина и возвращает объект ошибок по полям.
 * Пустой объект означает отсутствие ошибок.
 */
export function getLoginFormErrors(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {}

  const emailTrimmed = data.email.trim()
  if (!emailTrimmed) {
    errors.email = LOGIN_VALIDATION_MESSAGES.emailRequired
  } else if (!EMAIL_REGEX.test(emailTrimmed)) {
    errors.email = LOGIN_VALIDATION_MESSAGES.emailInvalid
  }

  if (!data.password) {
    errors.password = LOGIN_VALIDATION_MESSAGES.passwordRequired
  } else if (data.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = LOGIN_VALIDATION_MESSAGES.passwordTooShort
  }

  return errors
}

/** Проверяет, есть ли хотя бы одна ошибка валидации */
export function hasLoginFormErrors(errors: LoginFormErrors): boolean {
  return Object.keys(errors).length > 0
}
