/**
 * @fileoverview Global feedback utilities for loading states and error messages
 * @author Juan Carlos Angulo
 * @module globalFeedback
 */

import { writable } from 'svelte/store';
import { toast } from "svelte-sonner";

/**
 * Store for global loading state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const globalLoading = writable(false);

/**
 * Store for global error messages (deprecated in favor of Sonner)
 * @type {import('svelte/store').Writable<string>}
 */
export const globalError = writable('');

/**
 * Shows the global loading indicator
 * @returns {void}
 */
export function showLoading() {
    globalLoading.set(true);
}

/**
 * Hides the global loading indicator
 * @returns {void}
 */
export function hideLoading() {
    globalLoading.set(false);
}

/**
 * Displays a global error message using Sonner
 * @param {string} message - The error message to display
 * @returns {void}
 */
export function showError(message: string) {
    // globalError.set(message);
    toast.error(message);
}

/**
 * Displays a global success message using Sonner
 * @param {string} message - The success message to display
 * @returns {void}
 */
export function showSuccess(message: string) {
    toast.success(message);
}
