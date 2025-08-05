class UserAPI {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.apiPath = '/api/users';
    }

    async makeRequest(url, options = {}) {
        try {
            // Add auth token if available
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                headers,
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.error?.message || 'Request failed',
                    errors: data.error?.errors || null
                };
            }

            return data;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: 'Network error or server unavailable',
                errors: null
            };
        }
    }

    async checkHealth() {
        const response = await this.makeRequest(`${this.baseURL}/health`);
        return response.data;
    }

    async getAllUsers() {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}`);
        return response.data;
    }

    async getUserById(id) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/${id}`);
        return response.data;
    }

    async createUser(userData) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return response.data;
    }

    async updateUser(id, userData) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        return response.data;
    }

    async deleteUser(id) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/${id}`, {
            method: 'DELETE'
        });
        return response.data;
    }
}