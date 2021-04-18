const request = require('request')
const urlProductStock = "https://mt-node-stock-api.glitch.me/products"
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let productsDB = [
  {
    name: 'cachorro', price: 100, amount: (amount) => {
      let pack = 0
      while (amount > 1000) {
        amount -= 1000
        pack++
      }
      return (pack,amount)
    }
  },
  {
    name: 'gato', price: 50, amount: (amount) => {
      let pack = 0
      while (amount > 1000) {
        amount -= 1000
        pack++
      }
      return (pack,amount)
    }
  },
  {
    name: 'galinha', price: 25, amount: (amount) => {
      let pack = 0
      while (amount > 1000) {
        amount -= 1000
        pack++
      }
      return (pack,amount)
    }
  }
]

const buildProduct = (body) => {
  let num = Number.parseInt(body.amount)
  let pack = 0
  while (num > 1000) {
    num -= 1000
    pack++
  }
  return {
    name: body.name,
    price: Number.parseInt(body.price, 10),
    amount: num,
    pack: pack
  }

}


app.get("/products", (req, res) => { res.status(200).send(productsDB) })

app.get("/productsNames", (req, res) => {
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
    return res.status(404).send()
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
