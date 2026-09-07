const authTokenKey = 'taskly.authToken'

export function getAuthToken(): string | null {
  return localStorage.getItem(authTokenKey)
}

export function storeAuthToken(token: string): void {
  localStorage.setItem(authTokenKey, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(authTokenKey)
}
