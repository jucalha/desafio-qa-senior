import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/support/apiHelper';
import testData from '../../src/data/testData.json';

test.describe('Suíte de Testes de Contrato / Schema (API)', () => {

    let api: ApiHelper;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('Validar o schema de tipagem do endpoint GET /posts', async () => {
        const response = await api.getPosts();
        const body = await response.json();
        const amostraPost = body[0];

        await test.step('Então a tipagem dos campos deve ser estritamente respeitada', async () => {
            expect(typeof amostraPost.id).toBe('number');
            expect(typeof amostraPost.userId).toBe('number');
            expect(typeof amostraPost.title).toBe('string');
            expect(typeof amostraPost.body).toBe('string');
        });
    });

    test('Validar o schema de resposta do endpoint POST /posts', async () => {
        const payload = testData.api.novoPost;
        const response = await api.createPost(payload);
        const body = await response.json();

        await test.step('Então o Back-end deve retornar o ID gerado como Número', async () => {
            expect(typeof body.id).toBe('number');
        });

        await test.step('E os dados refletidos devem manter a tipagem original (String/Number)', async () => {
            expect(typeof body.title).toBe('string');
            expect(typeof body.body).toBe('string');
            expect(typeof body.userId).toBe('number');
        });
    });

    test('Validar o schema de resposta do endpoint PUT /posts', async () => {
        const payload = testData.api.postAtualizado;
        const response = await api.updatePost(payload.id, payload);
        const body = await response.json();

        await test.step('Então a estrutura do objeto atualizado deve manter a integridade dos tipos', async () => {
            expect(typeof body.id).toBe('number');
            expect(typeof body.title).toBe('string');
            expect(typeof body.body).toBe('string');
            expect(typeof body.userId).toBe('number');
        });
    });

});