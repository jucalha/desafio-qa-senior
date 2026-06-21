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

    test('Deve executar o fluxo dinâmico completo de CRUD (Criação -> Leitura -> Alteração -> Remoção)', async () => {
        // 1. CRIAÇÃO (POST)
        const newPost = { title: 'QA Sênior', body: 'Desafio Técnico', userId: 1 };
        const postResponse = await api.createPost(newPost);
        expect(postResponse.status()).toBe(201); // A validação de Sucesso de criação
        const createdBody = await postResponse.json();
        expect(createdBody.title).toBe(newPost.title);
        console.log(`[POST] Post simulado com sucesso. ID retornado: ${createdBody.id}`);

        /* 
           ADAPTAÇÃO TÉCNICA (Conforme diretriz do Testes_JCG.pdf):
           Como a JSONPlaceholder é uma API pública de fake-data, o ID gerado acima (101) não persiste.
           Para garantir a estabilidade do teste E2E de CRUD, daremos sequência na esteira
           utilizando um ID fixo pré-existente na base deles (ID: 1).
        */
        const targetId = 1;

        // 2. LEITURA / VALIDAÇÃO (GET)
        const getResponse = await api.getPostById(targetId);
        expect(getResponse.status()).toBe(200);
        console.log(`[GET] Leitura do Post ${targetId} validada com sucesso.`);

        // 3. ALTERAÇÃO (PUT)
        const updatedPost = { id: targetId, title: 'QA Sênior - Atualizado', body: 'Novo escopo', userId: 1 };
        const putResponse = await api.updatePost(targetId, updatedPost);
        expect(putResponse.status()).toBe(200);
        const putBody = await putResponse.json();
        expect(putBody.title).toBe(updatedPost.title);
        console.log(`[PUT] Post ${targetId} alterado para: "${putBody.title}"`);

        // 4. REMOÇÃO (DELETE)
        const deleteResponse = await api.deletePost(targetId);
        expect(deleteResponse.status()).toBe(200);
        console.log(`[DELETE] Post ${targetId} removido com sucesso do sistema.`);
    });

    test('Deve simular e validar os status code de erro (401, 403 e 409)', async () => {
        /* 
           ADAPTAÇÃO TÉCNICA (Conforme diretriz do Testes_JCG.pdf):
           A API JSONPlaceholder não emite erros de autorização ou conflito por ser um sandbox aberto.
           Utilizamos o serviço auxiliar httpstat.us para garantir a validação de status code de erros exigida.
        */
        
        // 1. Validação do Erro 401 (Unauthorized)
        const response401 = await api.getSimulatedError(401);
        expect(response401.status()).toBe(401); // Validação de erro 401 solicitada no Testes_JCG.pdf
        console.log('[401] Erro de Não Autorizado validado com sucesso.');

        // 2. Validação do Erro 403 (Forbidden)
        const response403 = await api.getSimulatedError(403);
        expect(response403.status()).toBe(403); // Validação de erro 403 solicitada no Testes_JCG.pdf
        console.log('[403] Erro de Acesso Proibido validado com sucesso.');

        // 3. Validação do Erro 409 (Conflict)
        const response409 = await api.getSimulatedError(409);
        expect(response409.status()).toBe(409); // Validação de erro 409 solicitada no Testes_JCG.pdf
        console.log('[409] Erro de Conflito validado com sucesso.');
    });

});