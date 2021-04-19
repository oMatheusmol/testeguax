const index = require('../index.js')
const { assert } = require('chai')
const supertest = require('supertest')
const nock = require('nock')

describe('Testes:', () => {
  it('Teste 1', () => {
    const body = {
      name: "teste-unitario",
      price: "120",
      amount: '165265456'
    }
    let num = Number.parseInt(body.amount)
    let pack = 0
    while (num > 1000) {
      num -= 1000
      pack+=1
    }
    const result = index.buildProduct(body);
    assert.strictEqual(result.name, body.name);
    assert.strictEqual(result.price, Number.parseInt(body.price));
    assert.strictEqual(result.amount,num);
    assert.strictEqual(result.pack, pack);

  })

  it('Teste 2', (done) => {
    
    nock('https://mt-node-stock-api.glitch.me')
      .post('/products')
      .reply(201);
    supertest(index.server)
      .post('/products')
      .send({
        name: 'teste-p',
        price: '351',
        amount: '450',
      })
      
      
      .expect(201, {
        name: 'teste-p',
        price: 351,
        amount: 450,
        pack: 0
      })
      .end(done)
  })
  it('Teste 3', (done) => {
    
    nock('https://mt-node-stock-api.glitch.me')
      .post('/products')
      .reply(201);
    supertest(index.server)
      .post('/products')
      .send({
        name: 'teste-p2',
        price: '0.10',
        amount: '450',
      })
      
      
      .expect(201, {
        name: 'teste-p2',
        price: 0.10,
        amount: 450,
        pack: 0
      })
      .end(done)
  })

  it('Teste 4', (done) => {
    supertest(index.server)
      .get('/products/teste-p')
      .expect(200, {
        name: 'teste-p',
        price: 351,
        amount: 450,
        pack:0
      })
      .end(done)
  })

  it('Teste da rota productNames - deve retornar lista completa de produtos existentes', (done) => {
    const resultadoEsperado = [
      { name: 'teste-p2',price:0.10},
      { name: 'cachorro', price: 110.59 },
      { name: 'gato', price: 568.5 },
      { name: 'galinha', price: 284 },
      { name: 'teste-p', price: 351 },
      { name: 'macaco', price:755},
      { name: 'peixe', price:48}
    ]
    resultadoEsperado.sort((a, b) => a.price - b.price)
    let newarr = []
    for (let prod in resultadoEsperado) {
      newarr.push(resultadoEsperado[prod].name)
    }
    supertest(index.server)
      .get('/productsNames')
      .expect(200, newarr)
      .end(done)
  })
})
