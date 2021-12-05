var recipesJson = require("./recipes_raw_nosource_fn.json")
const db = require("../db")
var async = require("async")
const parser = require('ingredients-parser')
const Ingredient = require("../models/ingredient.js")
const Recipe = require("../models/recipe.js")


/* Uses knex batchInsert(https://knexjs.org/#Utility-BatchInsert) to insert multiple rows at once
* @param {array} rows -  rows array with format [{column1: value1, column2: value2}, {column1: value1, column2: value2}....]
* @param {string} table - table name
**/
async function insertRowsInBulk(rows, tableName) {
//batch insert rows into ingredient table:
db.batchInsert(tableName, rows, chunkSize = 10000)
    .returning("id")
    .then(function(ids) {console.log(`Yay! inserted ${ids.length()} rows in ${tableName}`)})
    .catch(function(error) {console.log('ERROR:', error)})
}

/*
* Parses ingredients from recipes / recipe instructions and returns formatted ingredient rows that
* can be inserted into the database.
* @param {object} recipes - recipes object 
* @return {array} - array of ingredient rows to be inserted
**/
function createIngredientRows(recipes, ) {
    var ingredientsDict = {}

    Object.keys(recipes).map((key) => {
        let recipe = recipes[key];
        if (recipe.ingredients != undefined && recipe.ingredients.length > 0) {
            recipe.ingredients.map(function(ingredient) {
                let parsed = parser.parse(ingredient)
                let parsedIngredient = parsed.ingredient
                if (ingredientsDict[parsedIngredient] === undefined && parsedIngredient !== undefined) {
                    //to exclude special characters from ingredient name
                    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
                    if (parsedIngredient.split(" ").length < 4 && !format.test(parsedIngredient)) {
                        let igName = parsedIngredient.toLowerCase().trim().replace(/\s/g, '_')
                        ingredientsDict[igName] = 1
                    }
                }
            })
        }
    })

    //create rows:
    var ingredientRows = []
    Object.keys(ingredientsDict).map(function(ingredientName) {
        ingredientRows.push(new Ingredient(ingredientName, "null").getIngredientJson())
    });
    return ingredientRows;
}

var ingredientRows = createIngredientRows(recipesJson)

console.log('will insert ', ingredientRows)
// insertRowsInBulk(ingredientRows, "ingredients")