const request = require('request')
const urlProductStock = "https://mt-node-stock-api.glitch.me/products"
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let productsDB = [
  {
    name: 'cachorro', price: 110.59, amount: 484654
  },
  {
    name: 'gato', price: 568.5, amount: 604
  },
  {
    name: 'galinha', price: 284, amount: 1060
  },
  {
    name: 'peixe', price: 48, amount: 3145
  },
  {
    name: 'macaco', price: 755, amount: 157
  }
]

for(i=0;i<productsDB.length;i++){
  let num = Number.parseInt(productsDB[i].amount)
  let pack = 0
  
  while(num>1000){
    num -= 1000
    pack++
  }

  productsDB[i].amount = `Packs: ${pack} and ${num} remaining products` 
}

const buildProduct = (body) => {
  let num = Number.parseInt(body.amount)
  let price = Number(body.price, 10)

  if(!num || num<1)return res.status(404).send('Amount must be greater than 1!')
  if(!price || price<=0) return res.status(404).send('Price must be a possitive number!')
  
  let pack = 0
  while (num > 1000) {
    num -= 1000
    pack++
  }
  
  return {
    name: body.name,
    price: price,
    amount: num,
    pack: pack
  }

}

app.get("/products", (req, res) => { res.status(200).send(productsDB) })

app.get("/productsNames", (req, res) => {
  productsDB.sort((a, b) => a.price - b.price) 
  let newarr = []
  for (let prod in productsDB) {
    newarr.push((productsDB[prod].name))
  }
  res.status(200).send(newarr)
});

app.get("/products/:name", (req, res) => {
  let product;
  productsDB.forEach(element => {
    if (element.name === req.params.name) {
      product = element;
    }
  });
  if (product) {
    res.status(200).send(product)
  } else {
    res.sendStatus(500)
  }
});

app.post("/products", (req, res) => {
  const newProduct = buildProduct(req.body)

  let product = productsDB.find(item => (item.name === newProduct.name))
  if (product) {
    return res.sendStatus(500)
  }
  if (newProduct.name.length <= 5) {
    return res.sendStatus(500)
  }
  if (isNaN(newProduct.price)) {
    return res.sendStatus(500)
  }
  if (newProduct.price <= 0) {
    return res.sendStatus(500)
  }

  let data = {
    name: req.body.name
  }
  request({
    url: urlProductStock,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
    method: 'POST',
    json: true
  }, (err, response, body) => {
    if (err) {
      return res.sendStatus(500)
    }

    productsDB.push(newProduct)
    res.status(201).send(newProduct)
  })
});

app.put("/products/:name", (req, res) => {
  let product = productsDB.find(item => (item.name === req.params.name))

  if (!product) {
    return res.sendStatus(500)
  }
  let newPrice = Number.parseInt(req.body.price, 10)

  if (isNaN(newPrice)) {
    return res.sendStatus(500)
  }

  if (newPrice <= 0) {
    return res.sendStatus(500)
  }

  product.price = newPrice
  res.status(200).send(product)
});

app.delete("/products/:name", (req, res) => {
  let product = productsDB.find(item => (item.name === req.params.name))

  if (!product) {
    return res.status(404).send('Product not found!')
  }

  productsDB.splice(productsDB.indexOf(product), 1)
  res.status(200).send(productsDB)
});

const server = app.listen(3000, () => {
  console.log("Listening on port %s", server.address().port);
  console.log('http://localhost:%s', server.address().port)
});

module.exports = {
  buildProduct,
  server
}
