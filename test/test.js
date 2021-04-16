const index = require('../index.js')
const { assert } = require('chai')
const supertest = require('supertest')
const nock = require('nock')

describe('Testes:', () => {
  it('Teste 1', () => {
    const body = {
      name: "teste-unitario",
      price: "15"
    }
    const result = index.buildProduct(body);
    assert.strictEqual(result.name, body.name);
    assert.strictEqual(result.price, 15);
  })

  it('Teste 2', (done) => {
    nock('https://mt-node-stock-api.glitch.me')
      .post('/products')
      .reply(201);
    supertest(index.server)
      .post('/products')
      .send({
        name: 'teste-p',
        price: '15'
      })
      .expect(201, {
        name: 'teste-p',
        price: 15
      })
      .end(done)
  })

  it('Teste 3', (done) => {
    supertest(index.server)
      .get('/products/teste-p')
      .expect(200, {
        name: 'teste-p',
        price: 15
      })
      .end(done)
  })

  it('Teste da rota productNames - deve retornar lista completa de produtos existentes', (done) => {
    const resultadoEsperado = [
      { name: 'cachorro', price: 100 },
      { name: 'gato', price: 50 },
      { name: 'galinha', price: 25 },
      { name: 'teste-p', price: 15 }
    ]
    supertest(index.server)
      .get('/productsNames')
      .expect(200, resultadoEsperado)
      .end(done)
  })
})
