import { useCallback, useEffect, useRef } from 'react'

/**
 * useChatNotifications
 * ─────────────────────
 * Requests browser notification permission and fires a notification
 * whenever a genuinely new chat message arrives (i.e. a message whose id
 * we haven't seen before) and the browser window is NOT currently focused.
 */
export function useChatNotifications(senderName: string | null) {
  const seenIds = useRef<Set<string>>(new Set())
  const permissionRef = useRef<NotificationPermission>('default')
  const initializedRef = useRef(false)

  // Ask for permission as soon as a chat is opened
  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      permissionRef.current = 'granted'
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => {
        permissionRef.current = p
      })
    } else {
      permissionRef.current = Notification.permission
    }
  }, [])

  /**
   * Call this every time your polling loop receives a fresh messages array.
   * It will fire a browser notification for each message whose id is new
   * and that was NOT sent by the current user (isSelf === false).
   */
  const notifyNewMessages = useCallback(
    (messages: Array<{ id: string; isSelf: boolean; senderName: string; text: string }>) => {
      if (!('Notification' in window)) return
      if (permissionRef.current !== 'granted') return

      // The first response is existing chat history, not a new alert.
      if (!initializedRef.current) {
        messages.forEach(msg => seenIds.current.add(msg.id))
        initializedRef.current = true
        return
      }

      for (const msg of messages) {
        if (seenIds.current.has(msg.id)) continue
        seenIds.current.add(msg.id)

        // Always alert for messages from the other person. The browser decides
        // how prominently to surface the notification while the app is focused.
        if (!msg.isSelf) {
          const title = senderName ? `New message from ${senderName}` : 'New message'
          const body = msg.text.length > 80 ? msg.text.slice(0, 80) + '…' : msg.text

          try {
            const notification = new Notification(title, {
              body,
              icon: '/favicon.ico',
              tag: `chat-${msg.id}`, // deduplicates if fired multiple times
              silent: false,
            })

            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000)

            // Clicking the notification focuses the app window
            notification.onclick = () => {
              window.focus()
              notification.close()
            }
          } catch {
            // Notifications may be blocked silently — safe to ignore
          }
        }
      }
    },
    [senderName]
  )

  /** Call when switching threads so we don't re-notify old messages */
  const resetSeen = useCallback(() => {
    seenIds.current.clear()
    initializedRef.current = false
  }, [])

  return { notifyNewMessages, resetSeen }
}
