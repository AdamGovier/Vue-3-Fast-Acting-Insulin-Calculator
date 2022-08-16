import { v4 as uuidv4 } from 'uuid';

export default class Hotshot {
    constructor(id, name, carbs, weight, img) {
        this.id = id;
        this.name = name;
        this.carbs = carbs;
        this.weight = weight;
        this.img = img;
    }

    static generateID() {
        return uuidv4();
    }
}