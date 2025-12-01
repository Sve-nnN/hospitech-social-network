import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { t, lang } from '$lib/i18n';
import Layout from '../../routes/+layout.svelte';

describe('Internacionalización y selector de idioma', () => {
	it('muestra textos en español por defecto', () => {
		const { getByText } = render(Layout);
		expect(getByText('Feed de Posts')).toBeInTheDocument();
		expect(getByText('Cerrar sesión')).toBeInTheDocument();
	});

	it('cambia a inglés al seleccionar English', async () => {
		const { getByLabelText, getByText } = render(Layout);
		const selector = getByLabelText(/idioma|language/i);
		await fireEvent.change(selector, { target: { value: 'en' } });
		expect(getByText('Posts Feed')).toBeInTheDocument();
		expect(getByText('Logout')).toBeInTheDocument();
		expect(get(lang)).toBe('en');
	});

	it('persiste el idioma seleccionado en localStorage', async () => {
		const { getByLabelText } = render(Layout);
		const selector = getByLabelText(/idioma|language/i);
		await fireEvent.change(selector, { target: { value: 'en' } });
		expect(localStorage.getItem('lang')).toBe('en');
	});

	it('restaura el idioma desde localStorage al recargar', () => {
		localStorage.setItem('lang', 'en');
		const { getByText } = render(Layout);
		expect(getByText('Posts Feed')).toBeInTheDocument();
		expect(get(lang)).toBe('en');
	});
});
