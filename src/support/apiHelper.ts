import { APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env';

export class ApiHelper {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getPosts() {
        return await this.request.get(`${ENV.BASE_URL_API}/posts`);
    }

    async getPostById(id: number) {
        return await this.request.get(`${ENV.BASE_URL_API}/posts/${id}`);
    }

    async createPost(payload: object) {
        return await this.request.post(`${ENV.BASE_URL_API}/posts`, {
            data: payload
        });
    }

    async updatePost(id: number, payload: object) {
        return await this.request.put(`${ENV.BASE_URL_API}/posts/${id}`, {
            data: payload
        });
    }

    async deletePost(id: number) {
        return await this.request.delete(`${ENV.BASE_URL_API}/posts/${id}`);
    }

    async getSimulatedError(statusCode: number) {
        return await this.request.get(`${ENV.MOCK_URL_ERRORS}/${statusCode}`);
    }
}