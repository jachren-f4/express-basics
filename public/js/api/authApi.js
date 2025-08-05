class AuthAPI {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.apiPath = '/api/auth';
    }

    async makeRequest(url, options = {}) {
        try {
            // Add auth token if available
            const token = this.getToken();
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

    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    removeToken() {
        localStorage.removeItem('authToken');
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            // Basic token validation (check if it's expired)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            this.removeToken();
            return false;
        }
    }

    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.id,
                email: payload.email,
                name: payload.name
            };
        } catch {
            this.removeToken();
            return null;
        }
    }

    async register(userData) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/register`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response.data;
    }

    async login(email, password) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response.data;
    }

    async logout() {
        try {
            await this.makeRequest(`${this.baseURL}${this.apiPath}/logout`, {
                method: 'POST'
            });
        } catch (error) {
            // Continue with logout even if server request fails
        } finally {
            this.removeToken();
        }
    }

    async getProfile() {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/profile`);
        return response.data;
    }

    async updateProfile(userData) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/profile`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        return response.data;
    }

    async changePassword(currentPassword, newPassword, confirmNewPassword) {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/change-password`, {
            method: 'POST',
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmNewPassword
            })
        });
        return response.data;
    }

    async deleteAccount() {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/account`, {
            method: 'DELETE'
        });
        
        this.removeToken();
        return response.data;
    }

    async refreshToken() {
        const response = await this.makeRequest(`${this.baseURL}${this.apiPath}/refresh-token`, {
            method: 'POST'
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response.data;
    }
}