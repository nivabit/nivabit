
export type contactType = { name: string, services?: string[], email: string, subject: string, message?: string, company?: string }


export const sendContactForm = async (data: contactType) =>
        fetch("/api/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json", Accept: "application/json" },
        }).then((res) => {
                if (!res.ok) throw new Error("Failed to send message");
                return res;
        });