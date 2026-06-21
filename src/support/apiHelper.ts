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

    async createPost(payload: object) {
        return await this.request.post(`${ENV.BASE_URL_API}/posts`, {
            data: payload
        });
    }
}