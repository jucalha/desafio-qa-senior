import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';
import { InventoryPage } from '../../src/pages/inventoryPage';
import { ENV } from '../../src/config/env';
import * as testData from '../../src/data/testData.json';

test.describe('Suíte de Testes de UI - SauceDemo', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
    });

    test('Deve realizar o fluxo de compra completo com dados parametrizados do JSON', async ({ page }) => {
        // 1. Acesso e Login (.env)
        await loginPage.accessSystem();
        await loginPage.performLogin(ENV.USER_UI, ENV.PASSWORD_UI);

        // 2. Validação visual/funcional de carregamento da página (testData.json)
        const pageTitle = await inventoryPage.getPageTitle();
        expect(pageTitle).toBe(testData.ui.expectedInventoryTitle);

        // 3. Adiciona produto parametrizado ao carrinho
        await inventoryPage.addProductToCart(testData.ui.targetProductName);

        // 4. Validação de regra de negócio: Carrinho deve ter 1 item
        const count = await inventoryPage.getCartItemCount();
        expect(count).toBe('1');

        console.log(`Sucesso! Produto "${testData.ui.targetProductName}" adicionado ao carrinho validado.`);
    });
});