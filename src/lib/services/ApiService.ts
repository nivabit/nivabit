
export class ApiService {
    baseUrl: string;
    token?: string;
  
    constructor(baseUrl: string, token?: string) {
      this.baseUrl = baseUrl;
      this.token = token;
    }
  
    setToken(token: string) {
      this.token = token;
    }
  
    private headers(auth: boolean): HeadersInit {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (auth && this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }
      return headers;
    }
  
    async get(endpoint: string, auth = false) {
      return this.request(endpoint, { method: "GET" }, auth);
    }
  
    async post(endpoint: string, body: any, auth = false) {
      return this.request(endpoint, { method: "POST", body: JSON.stringify(body) }, auth);
    }
  
    async put(endpoint: string, body: any, auth = false) {
      return this.request(endpoint, { method: "PUT", body: JSON.stringify(body) }, auth);
    }
  
    async patch(endpoint: string, body: any, auth = false) {
      return this.request(endpoint, { method: "PATCH", body: JSON.stringify(body) }, auth);
    }
  
    async delete(endpoint: string, auth = false) {
      return this.request(endpoint, { method: "DELETE" }, auth);
    }
  
    private async request(endpoint: string, options: RequestInit, auth: boolean) {
      try {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: this.headers(auth),
        });
  
        const data = await res.json().catch(() => ({}));
  
        if (!res.ok) {
          throw new Error(data.message || data.error || "Request failed");
        }
  
        return data;
      } catch (err: any) {
        throw new Error(err.message || "Network error");
      }
    }
  }
  