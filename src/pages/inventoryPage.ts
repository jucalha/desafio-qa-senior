import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {
    private readonly title = '.title';
    private readonly shoppingCartBadge = '.shopping_cart_badge';

    constructor(page: Page) {
        super(page);
    }

    async getPageTitle() {
        await this.page.waitForSelector(this.title, { state: 'visible' });
        return await this.page.textContent(this.title);
    }

    async addProductToCart(productName: string) {
        // Encontra o botão de adicionar ao carrinho dinamicamente pelo nome do produto
        const addToCartBtn = `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button`;
        await this.click(addToCartBtn);
    }

    async getCartItemCount() {
        await this.page.waitForSelector(this.shoppingCartBadge, { state: 'visible' });
        return await this.page.textContent(this.shoppingCartBadge);
    }
}