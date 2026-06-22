import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async click(selector: string) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.click(selector);
    }

    async fill(selector: string, text: string) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.fill(selector, text);
    }
}