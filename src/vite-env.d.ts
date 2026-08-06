/// <reference types="vite/client" />

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize: (configuration: { client_id: string; callback: (response: GoogleCredentialResponse) => void | Promise<void> }) => void
  renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void
}

interface Window {
  google?: { accounts: { id: GoogleAccountsId } }
}
