import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/support/apiHelper';
import testData from '../../src/data/testData.json';

test.describe('Suíte de Testes de API - JSONPlaceholder (CRUD Completo + SOM)', () => {

    let api: ApiHelper;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('GET - Validar a busca pela lista de posts', async () => {
        let response;

        await test.step('Quando realizo uma requisição GET para o endpoint de posts', async () => {
            response = await api.getPosts();
        });

        await test.step('Então o status code retornado deve ser 200 OK', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('E a resposta deve retornar uma lista preenchida', async () => {
            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
        });
    });

    test('POST - Validar a criação de um novo post', async () => {
        let response;
        const payload = testData.api.novoPost;

        await test.step('Quando envio o payload de criação de post via POST', async () => {
            response = await api.createPost(payload);
        });

        await test.step('Então a API deve retornar o status code 201 Created', async () => {
            expect(response.status()).toBe(201);
        });

        await test.step('E a resposta deve espelhar os dados enviados', async () => {
            const body = await response.json();
            expect(body.title).toBe(payload.title);
            expect(body).toHaveProperty('id');
        });
    });

    test('PUT - Validar a atualização de um post existente', async () => {
        let response;
        const payload = testData.api.postAtualizado;

        await test.step(`Quando envio o payload de atualização para o Post ID ${payload.id} via PUT`, async () => {
            response = await api.updatePost(payload.id, payload);
        });

        await test.step('Então a API deve retornar o status code 200 OK', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('E o corpo da resposta deve refletir a alteração do título', async () => {
            const body = await response.json();
            expect(body.title).toBe(payload.title);
            expect(body.id).toBe(payload.id);
        });
    });

    test('DELETE - Validar o comportamento ao deletar um post existente', async () => {
        let response;
        const postIdParaDeletar = 1;

        await test.step(`Quando solicito a exclusão do Post ID ${postIdParaDeletar} via DELETE`, async () => {
            response = await api.deletePost(postIdParaDeletar);
        });

        await test.step('Então a API deve confirmar a exclusão com status 200 OK', async () => {
            expect(response.status()).toBe(200);
        });
    });

    // ====================================================================
    // GERADOR DINÂMICO DE CENÁRIOS DE ERRO 401, 403 e 409
    // ====================================================================
    test.describe('Validação a interceptação de erros HTTP', () => {
        const statusCodesDeErro = [401, 403, 409];

        for (const statusCode of statusCodesDeErro) {
            test(`Validar o tratamento para o Status Code ${statusCode}`, async () => {
                let response;

                await test.step(`Quando o serviço responde com o erro HTTP ${statusCode}`, async () => {
                    response = await api.getSimulatedError(statusCode);
                });

                await test.step(`Então o sistema deve repassar o código ${statusCode} corretamente`, async () => {
                    expect(response.status()).toBe(statusCode);
                });
            });
        }
    });

});