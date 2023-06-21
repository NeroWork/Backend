const {Faker, en} = require("@faker-js/faker");

const faker = new Faker({locale: en});

const generateProducts = (numberOfProducts) => {
    let products = [];
    for(let i=0; i<numberOfProducts; i++){
        products.push(generateProduct());
    }
    return products;
}

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.url(),
        price: faker.commerce.price(),
        stock: faker.commerce.price({min: 0, max: 200})
    }
}

module.exports = {
    generateProduct,
    generateProducts
}