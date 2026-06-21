import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/support/apiHelper';

test.describe('Suíte de Testes de API - JSONPlaceholder', () => {
    let api: ApiHelper;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('Deve listar posts com sucesso (Status 200) e validar contrato', async () => {
        const response = await api.getPosts();
        
        // 1. Validação de Status Code solicitada no Testes_JCG.pdf
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // 2. Validação de contrato (garantindo que voltou um Array e que o primeiro item tem a estrutura correta)
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody[0]).toHaveProperty('userId');
        expect(responseBody[0]).toHaveProperty('id');
        expect(responseBody[0]).toHaveProperty('title');
        expect(responseBody[0]).toHaveProperty('body');
        
        console.log(`Sucesso! Total de posts retornados: ${responseBody.length}`);
    });
});