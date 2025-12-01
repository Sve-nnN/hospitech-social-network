import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { t, lang } from '$lib/i18n';
import Layout from '../../routes/+layout.svelte';

describe('Internacionalización y selector de idioma', () => {
	it('muestra el selector de idioma', () => {
		const { getByRole } = render(Layout, { props: { children: () => '' } });
		const selector = getByRole('combobox');
		expect(selector).toBeInTheDocument();
	});

	it('cambia a inglés al seleccionar English', async () => {
		const { getByRole } = render(Layout, { props: { children: () => '' } });
		const selector = getByRole('combobox');
		await fireEvent.change(selector, { target: { value: 'en' } });
		expect(get(lang)).toBe('en');
	});

	it('persiste el idioma seleccionado en localStorage', async () => {
		const { getByRole } = render(Layout, { props: { children: () => '' } });
		const selector = getByRole('combobox');
		await fireEvent.change(selector, { target: { value: 'en' } });
		expect(localStorage.getItem('lang')).toBe('en');
	});

	it('restaura el idioma desde localStorage al recargar', () => {
		localStorage.setItem('lang', 'en');
		const { getByRole } = render(Layout, { props: { children: () => '' } });
		const selector = getByRole('combobox');
		expect(selector.value).toBe('en');
		expect(get(lang)).toBe('en');
	});
});
