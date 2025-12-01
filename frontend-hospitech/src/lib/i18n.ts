import es from '../messages/es.json';
import en from '../messages/en.json';
import { writable, derived } from 'svelte/store';

export const availableLangs = ['es', 'en'];
export const lang = writable('es');

const dict = { es, en };

export const t = derived([lang], ([$lang]) => {
	return (key, vars = {}) => {
		let str = dict[$lang][key] || key;
		Object.entries(vars).forEach(([k, v]) => {
			str = str.replace(`{${k}}`, v);
		});
		return str;
	};
});
