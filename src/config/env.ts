import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
    BASE_URL_API: process.env.BASE_URL_API || 'https://jsonplaceholder.typicode.com',
    BASE_URL_UI: process.env.BASE_URL_UI || 'https://www.saucedemo.com',
    MOCK_URL_ERRORS: process.env.MOCK_URL_ERRORS || 'https://httpstat.us',
    USER_UI: process.env.USER_UI || '',
    PASSWORD_UI: process.env.PASSWORD_UI || '',
};