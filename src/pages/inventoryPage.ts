import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly checkoutBtn: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueBtn: Locator;
    readonly finishBtn: Locator;
    readonly completeHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
        this.checkoutBtn = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueBtn = page.locator('[data-test="continue"]');
        this.finishBtn = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
    }

    async adicionarProdutoAoCarrinho(idProduto: string) {
        await this.page.locator(`[data-test="add-to-cart-${idProduto}"]`).click();
    }

    async iniciarCheckout() {
        await this.cartLink.click();
        await this.checkoutBtn.click();
    }

    async preencherDadosDeEntrega(nome: string, sobrenome: string, cep: string) {
        await this.firstNameInput.fill(nome);
        await this.lastNameInput.fill(sobrenome);
        await this.postalCodeInput.fill(cep);
        await this.continueBtn.click();
    }

    async finalizarCompra() {
        await this.finishBtn.click();
    }
}