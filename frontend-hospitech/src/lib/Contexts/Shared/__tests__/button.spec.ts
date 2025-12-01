import { describe, it, expect } from 'vitest';
import { Button } from '../UI/Button';

describe('Button', () => {
	it('renderiza el label correctamente', () => {
		const html = Button({ label: 'Click me' });
		expect(html).toBe('<button>Click me</button>');
	});
});
