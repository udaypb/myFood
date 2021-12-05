class Ingredient {

    constructor(name, type) {
        this.name = name
        this.ingredienttype = type
        return this
    }

    getName() {
        return this.name
    }

    getIngredientType() {
        return this.ingredienttype
    }

    getIngredientJson() {
        return {name: this.name, ingredienttype: this.ingredienttype}
    }
}

module.exports = Ingredient