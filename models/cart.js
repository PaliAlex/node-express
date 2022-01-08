const path = require('path');
const fs = require('fs');

class Cart {
    static async add(course) {
        const cart = await Cart.fetch();

        const index = cart.courses.findIndex(it => it.id === course.id);

        const candidate = cart.courses[index];

        if(candidate) {
            //курс уже есть
            candidate.count++;
            cart.courses[index] = candidate;
        } else {
            //нужно добавить
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += Number(course.price);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart),
                (error) => {
                    if(error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }
}

module.exports = Cart;
