import { writable } from 'svelte/store';

// Function to create a persisted store that syncs with localStorage
function loaderStore() {
	const { subscribe, set } = writable(false);

	return {
		show: (value: boolean = false) => {
			set(value);
		},
		subscribe
	};
}

export const loader = loaderStore();
