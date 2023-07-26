import { v4 as uuidv4 } from 'uuid';

export default class Hotshot {
    constructor(id, name, carbs, weight, img, barcode, weightUnit) {
        this.id = id;
        this.name = name;
        this.carbs = carbs;
        this.weight = weight;
        this.img = img;
        this.barcode = barcode;
        // Null = do not show a unit, that is why the code is not using "weightUnit ?? 'weight_grams'".
        this.weightUnit = weightUnit !== undefined ? weightUnit : "weight_grams";
    }

    static generateID() {
        return uuidv4();
    }
}