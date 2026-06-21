import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navega e espera a rede acalmar (evita flakiness logo no carregamento)
    async navigate(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    // Só clica se o elemento estiver realmente visível
    async click(selector: string) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.click(selector);
    }

    // Só digita se o elemento estiver visível
    async fill(selector: string, text: string) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.fill(selector, text);
    }
}