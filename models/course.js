const fs = require('fs');
const path = require('path');
const uuid = require('uuid')

class Course {
    constructor(
        title,
        price,
        image,
    ) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.id = uuid.v4();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            image: this.image,
            id: this.id,
        }
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
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

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
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

    static async getAllById(id) {
        const courses = await Course.getAll();

        return courses.find(it => it.id === id)
    }

    static async update(course) {
        const courses = await Course.getAll();

        const index = courses.findIndex(it => it.id === course.id);

        courses[index] = course;

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
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
}

module.exports = Course;
