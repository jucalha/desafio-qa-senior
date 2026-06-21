import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Configuração de Carga em Rampa (Stages)
  stages: [
    { duration: '10s', target: 10 }, // Sobe tráfego de 1 a 10 usuários em 10s
    { duration: '15s', target: 10 }, // Mantém a carga de 10 usuários por 15s
    { duration: '5s', target: 0 },   // Desce o tráfego para 0 usuários em 5s
  ],
  
  thresholds: {
    http_req_duration: ['p(95)<800'], 
    http_req_failed: ['rate<0.01'],   
  },
};

export default function () {
  // 3. Batendo em um endpoint da nossa API configurada
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Pausa para simular o tempo de pensamento do usuário
  sleep(1);
}