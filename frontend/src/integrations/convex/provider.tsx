import { ConvexProvider, ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

// Connect to self-hosted Convex backend
const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || 'http://127.0.0.1:3210',
)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}

export { convex }
