/**
 * @file useAuth.js
 * @description Re-exports the useAuth hook from AuthContext for convenient imports.
 *              Components import from hooks/ instead of context/ for cleaner DX.
 */
export { useAuth } from '@/context/AuthContext'
