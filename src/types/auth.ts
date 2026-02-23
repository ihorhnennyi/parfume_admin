/** Данные формы логина (значения полей) */
export interface LoginFormData {
  email: string
  password: string
}

/** Учётные данные для отправки на сервер */
export interface LoginCredentials {
  email: string
  password: string
}

/** Ошибки валидации по полям формы */
export interface LoginFormErrors {
  email?: string
  password?: string
}

/** Результат отправки логина (для будущего API) */
export interface LoginResult {
  success: boolean
  message?: string
}
