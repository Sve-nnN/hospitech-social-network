// Cliente HTTP base (ejemplo)
export const httpClient = {
	get: async (url: string) => {
		const res = await fetch(url);
		if (!res.ok) throw new Error('Error en GET');
		return await res.json();
	},
	post: async (url: string, body: any) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) throw new Error('Error en POST');
		return await res.json();
	}
};
