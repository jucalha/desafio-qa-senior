import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { ENV } from '../config/env';

export class LoginPage extends BasePage {
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';

    constructor(page: Page) {
        super(page);
    }

    async accessSystem() {
        await this.navigate(ENV.BASE_URL_UI);
    }

    async performLogin(user: string, pass: string) {
        await this.fill(this.usernameInput, user);
        await this.fill(this.passwordInput, pass);
        await this.click(this.loginButton);
    }

    async getErrorMessage() {
        await this.page.waitForSelector(this.errorMessage, { state: 'visible' });
        return await this.page.textContent(this.errorMessage);
    }
}