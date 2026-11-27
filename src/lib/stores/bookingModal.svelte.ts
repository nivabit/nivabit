import { goto } from '$app/navigation';
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
		void goto(targetUrl, { state: { showBookingModal: true }, shallow: true });
	};

	openFromUrl = (cleanUrl: string) => {
		if (!browser) return;
		this.#pushed = false;
		void goto(cleanUrl, {
			state: { showBookingModal: true },
			shallow: true,
			replace: true
		});
	};

	close = () => {
		if (!browser || !this.isOpen) return;
		if (this.#pushed) {
			this.#pushed = false;
			history.back();
		} else {
			void goto(window.location.href, {
				state: { showBookingModal: false },
				shallow: true,
				replace: true
			});
		}
	};
}

export const bookingModal = new BookingModalState();
