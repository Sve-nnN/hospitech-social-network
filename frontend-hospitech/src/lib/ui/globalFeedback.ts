/**
 * @fileoverview Global feedback utilities for loading states and error messages
 * @author Juan Carlos Angulo
 * @module globalFeedback
 */

import { writable } from 'svelte/store';

/**
 * Store for global loading state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const globalLoading = writable(false);

/**
 * Store for global error messages
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
 * Displays a global error message
 * @param {string} message - The error message to display
 * @returns {void}
 */
export function showError(message) {
    globalError.set(message);
    setTimeout(() => globalError.set(''), 5000);
}
