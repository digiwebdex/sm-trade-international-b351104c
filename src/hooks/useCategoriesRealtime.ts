import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * No-op hook — Realtime is not available in self-hosted VPS mode.
 * Kept for compatibility; category changes reflect on next page load
 * or when the admin panel saves and invalidates queries.
 */
export function useCategoriesRealtime() {
  // No-op: realtime not available in self-hosted mode
}
