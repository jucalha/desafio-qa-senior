import { APIRequestContext } from '@playwright/test';

export class ApiHelper {
    readonly request: APIRequestContext;
    readonly baseUrl: string;
    readonly mockUrl: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseUrl = process.env.BASE_URL_API || 'https://jsonplaceholder.typicode.com';
        this.mockUrl = process.env.MOCK_URL_ERRORS || 'https://postman-echo.com/status';
    }

    async getPosts() {
        return await this.request.get(`${this.baseUrl}/posts`);
    }

    async createPost(payload: object) {
        return await this.request.post(`${this.baseUrl}/posts`, {
            data: payload,
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
    }

    async updatePost(id: number, payload: object) {
        return await this.request.put(`${this.baseUrl}/posts/${id}`, {
            data: payload,
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
    }

    async deletePost(id: number) {
        return await this.request.delete(`${this.baseUrl}/posts/${id}`);
    }

    async getSimulatedError(statusCode: number) {
        return await this.request.get(`${this.mockUrl}/${statusCode}`);
    }
}