const { TableHints } = require("sequelize/dist")

class Ingredient {

    constructor(id, name, type) {
        this.name = name
        this.ingredienttype = type
        this.id = id
        return this
    }

    getName() {
        return this.name
    }

    getIngredientType() {
        return this.ingredienttype
    }

    getIngredientJson() {
        return {name: this.name, ingredienttype: this.ingredienttype, id: this.id}
    }
}

module.exports = Ingredient