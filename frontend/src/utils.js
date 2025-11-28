export const API_BASE_URL = 'http://localhost:4000/api'

export const STORAGE_KEYS = {
  CURRENT_USER: 'petcare_current_user',
  TOKEN: 'petcare_auth_token',
}

export function getCategoryLabel(key) {
  switch (key) {
    case 'food':
      return 'Thức ăn'
    case 'litter':
      return 'Cát vệ sinh'
    case 'cage':
      return 'Chuồng / balo'
    case 'toy':
      return 'Đồ chơi / phụ kiện'
    default:
      return 'Khác'
  }
}

export function formatCurrency(value) {
  if (!value && value !== 0) return ''
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

function buildHeaders(isJson = true) {
  const headers = {}
  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
  } catch {
    // ignore
  }
  return headers
}

export async function apiGet(path) {
  const res = await fetch(API_BASE_URL + path, {
    headers: buildHeaders(false),
  })
  if (!res.ok) {
    throw new Error('Lỗi khi gọi API: ' + res.status)
  }
  return res.json()
}

export async function apiPost(path, data) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Lỗi khi gọi API')
  }
  return res.json()
}

export async function apiPut(path, data) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Lỗi khi gọi API')
  }
  return res.json()
}

export async function apiPatch(path, data) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'PATCH',
    headers: buildHeaders(true),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Lỗi khi gọi API')
  }
  return res.json()
}

export async function apiDelete(path) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'DELETE',
    headers: buildHeaders(false),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Lỗi khi gọi API')
  }
  return res.json()
}