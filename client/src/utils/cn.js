/**
 * @file cn.js
 * @description Utility to merge Tailwind CSS class names safely.
 *              Combines clsx and tailwind-merge to avoid class conflicts.
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
