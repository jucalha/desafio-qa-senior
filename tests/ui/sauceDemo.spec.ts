import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';
import { InventoryPage } from '../../src/pages/inventoryPage';
import testData from '../../src/data/testData.json';

test.describe('Suíte de Testes de UI - SauceDemo', () => {

  const PASSWORD = process.env.PASSWORD_UI || 'secret_sauce';

  test('Validar o login com credenciais válidas e efetuar logout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Dado que o usuário efetua login com credenciais válidas', async () => {
      await loginPage.accessSystem();
      await loginPage.performLogin(testData.usuarios.valido, PASSWORD);
    });

    await test.step('Então o sistema deve exibir a vitrine de produtos', async () => {
      await expect(page.locator('.title')).toHaveText('Products');
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    await test.step('Quando o usuário solicita o logout pelo menu principal', async () => {
      await page.locator('#react-burger-menu-btn').click();
      await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' }); 
      await page.locator('#logout_sidebar_link').click();
    });

    await test.step('Então ele deve ser redirecionado de volta para a tela de login', async () => {
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });

  test('Validar o bloqueio de acesso para um usuário suspenso', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Dado que um usuário bloqueado tenta acessar o sistema', async () => {
      await loginPage.accessSystem();
      await loginPage.performLogin(testData.usuarios.bloqueado, PASSWORD);
    });

    await test.step('Então o sistema deve exibir a mensagem de erro de conta bloqueada', async () => {
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(testData.mensagens.erroBloqueado);
    });
  });

  test('Validar o fluxo de compra completo (E2E) com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Dado que o usuário efetua login com credenciais válidas', async () => {
      await loginPage.accessSystem();
      await loginPage.performLogin(testData.usuarios.valido, PASSWORD);
    });

    await test.step('Quando ele adiciona o produto parametrizado ao carrinho', async () => {
      await inventoryPage.adicionarProdutoAoCarrinho(testData.produtos.mochila);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    await test.step('E preenche os dados de entrega no checkout', async () => {
      await inventoryPage.iniciarCheckout();
      await inventoryPage.preencherDadosDeEntrega(
        testData.checkout.nome,
        testData.checkout.sobrenome,
        testData.checkout.cep
      );
    });

    await test.step('Então o sistema deve processar a compra e exibir a mensagem de sucesso', async () => {
      await inventoryPage.finalizarCompra();
      await expect(inventoryPage.completeHeader).toBeVisible();
      await expect(inventoryPage.completeHeader).toHaveText(testData.mensagens.sucessoCompra);
    });
  });

});