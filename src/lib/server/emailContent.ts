import type { contactType } from './email';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
	name: 'Name',
	services: 'Services',
	email: 'Email',
	subject: 'Subject',
	message: 'Message'
};

export const generateEmailContent = (data: contactType) => {
	const stringData = Object.entries(data).reduce(
		(str, [key, val]) => (str += `${CONTACT_MESSAGE_FIELDS[key] ?? key}: \n${val} \n\n`),
		''
	);

	const htmlData = Object.entries(data).reduce((str, [key, val]) => {
		return (str += `<h3 class="form-heading" align="left">${CONTACT_MESSAGE_FIELDS[key]}</h3><p class="form-answer" align="left">${key === 'services' ? val.toString() : val}</p>`);
	}, '');

	return {
		text: stringData,
		html: `<!DOCTYPE html><html> ... your full HTML template with ${htmlData} ... </html>`
	};
};
