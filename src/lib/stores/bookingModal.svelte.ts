class BookingModalState {
	isOpen = $state(false);

	open = () => {
		this.isOpen = true;
	};

	close = () => {
		this.isOpen = false;
	};
}

export const bookingModal = new BookingModalState();
