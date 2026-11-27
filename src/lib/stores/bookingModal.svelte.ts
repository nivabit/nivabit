import { pushState, replaceState } from '$app/navigation';
import { browser } from '$app/env';
import { page } from '$app/state';

class BookingModalState {
	#pushed = false;

	get isOpen() {
		return Boolean(page.state.showBookingModal);
	}

	open = (url?: unknown) => {
		if (!browser || this.isOpen) return;
		const targetUrl = typeof url === 'string' && url.length > 0 ? url : '/book';
		this.#pushed = true;
		pushState(targetUrl, { showBookingModal: true });
	};

	openFromUrl = (cleanUrl: string) => {
		if (!browser) return;
		this.#pushed = false;
		replaceState(cleanUrl, { showBookingModal: true });
	};

	close = () => {
		if (!browser || !this.isOpen) return;
		if (this.#pushed) {
			this.#pushed = false;
			history.back();
		} else {
			replaceState(window.location.href, { showBookingModal: false });
		}
	};
}

export const bookingModal = new BookingModalState();
