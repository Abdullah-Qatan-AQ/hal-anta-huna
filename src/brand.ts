/**
 * هل أنت هنا؟ — Arabic-first visual identity for the engine UI.
 * Keeps the engine API compatible while giving games a polished default shell.
 */
export const BRAND_NAME = 'هل أنت هنا؟';

export function applyBranding (language?: string): void {
	if (typeof document === 'undefined') return;
	const isArabic = language === 'اللغه العربية' || language === 'العربية' || language === 'ar';
	const root = document.documentElement;
	root.setAttribute('lang', isArabic ? 'ar' : (language || 'en'));
	root.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
	root.dataset.brand = 'hal-anta-huna';
	if (!document.title) document.title = BRAND_NAME;
}

export function installBranding (): void {
	if (typeof document === 'undefined') return;
	applyBranding();
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') document.documentElement.classList.toggle('ui-focus-mode');
		if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.metaKey) {
			document.documentElement.classList.toggle('ui-cinematic-mode');
		}
	});
}
