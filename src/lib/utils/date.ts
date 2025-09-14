

function getDateRanges() {
	const now = new Date();

	// Start of the week (Monday as start)
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay() + 1); // +1 so Monday = start
	startOfWeek.setHours(0, 0, 0, 0);

	// Start of the month
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	return { startOfWeek, startOfMonth };
}

export { getDateRanges };