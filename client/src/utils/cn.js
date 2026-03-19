/**
 * @file cn.js
 * @description Utility function for merging Tailwind CSS class names.
 *              Combines clsx and tailwind-merge to handle conditional classes
 *              and resolve Tailwind conflicts correctly.
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
