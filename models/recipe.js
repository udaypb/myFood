class Recipe {
    constructor(name, ingredientIds, instructions, rawingredients) {
        this.name = name
        this.ingredients = ingredientIds
        this.instructions = instructions
        this.rawingredients = rawingredients
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
            instructions: this.instructions,
            rawingredients: this.rawingredients
        }
    }
}

module.exports = Recipe