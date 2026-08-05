import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { GlowButton } from './GlowButton'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-highlight mb-1">{title}</h3>
          <p className="text-sm text-glass-dim">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <GlowButton variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </GlowButton>
          <GlowButton variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </GlowButton>
        </div>
      </div>
    </Modal>
  )
}
