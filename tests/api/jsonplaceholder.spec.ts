import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/support/apiHelper';

test.describe('Suíte de Testes de API - JSONPlaceholder', () => {
    let api: ApiHelper;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    // CENÁRIO 1 E 2 (Unidos pela eficiência de tráfego)
    test('Deve listar posts com sucesso (Status 200) e validar contrato', async () => {
        const response = await api.getPosts();
        expect(response.status()).toBe(200); // Requisito de sucesso 200 do Testes_JCG.pdf[cite: 1]

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody[0]).toHaveProperty('userId');
        expect(responseBody[0]).toHaveProperty('id');
        expect(responseBody[0]).toHaveProperty('title');
        expect(responseBody[0]).toHaveProperty('body');
    });

    // CENÁRIOS 3, 4, 5 e 6 (Unidos pelo ciclo de vida sequencial do dado)
    test('Deve executar o fluxo dinâmico completo de CRUD (Criação -> Leitura -> Alteração -> Remoção)', async () => {
        const newPost = { title: 'QA Sênior', body: 'Desafio Técnico', userId: 1 };
        const postResponse = await api.createPost(newPost);
        expect(postResponse.status()).toBe(201); 

        const targetId = 1;

        const getResponse = await api.getPostById(targetId);
        expect(getResponse.status()).toBe(200);

        const updatedPost = { id: targetId, title: 'QA Sênior - Atualizado', body: 'Novo escopo', userId: 1 };
        const putResponse = await api.updatePost(targetId, updatedPost);
        expect(putResponse.status()).toBe(200);

        const deleteResponse = await api.deletePost(targetId);
        expect(deleteResponse.status()).toBe(200);
    });

    // --- CENÁRIOS NEGATIVOS (Desmembrados com base na sua excelente crítica de QA) ---

    test('Deve simular e validar o status code de erro 401 (Unauthorized)', async () => {
        const response = await api.getSimulatedError(401);
        expect(response.status()).toBe(401); // Requisito de erro 401 do Testes_JCG.pdf[cite: 1]
    });

    test('Deve simular e validar o status code de erro 403 (Forbidden)', async () => {
        const response = await api.getSimulatedError(403);
        expect(response.status()).toBe(403); // Requisito de erro 403 do Testes_JCG.pdf[cite: 1]
    });

    test('Deve simular e validar o status code de erro 409 (Conflict)', async () => {
        const response = await api.getSimulatedError(409);
        expect(response.status()).toBe(409); // Requisito de erro 409 do Testes_JCG.pdf[cite: 1]
    });
});