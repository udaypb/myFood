class Recipe {
    constructor(name, ingredients, instructions) {
        this.name = name
        this.ingredients = ingredients
        this.instructions = instructions
        return this
    }

    getName() {
        return this.name
    }

    getIngredients() {
        return this.ingredients
    }

    getRecipeJson() {
        return {
            name: this.name,
            ingredients: this.ingredients,
            instructions: this.instructions
        }
    }
}

module.exports = Recipe