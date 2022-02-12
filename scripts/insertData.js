var recipesJson = require("./recipes_raw_nosource_fn.json")
const db = require("../db")
var async = require("async")
const parser = require('ingredients-parser')
const Ingredient = require("../models/ingredient.js")
const Recipe = require("../models/recipe.js")
const {formatIngredientName} = require('../utils/ingredientNameFormatter')
const {formatRecipeName} = require('../utils/recipeNameFormatter')
const {uuid} = require('uuidv4')
/* Uses knex batchInsert(https://knexjs.org/#Utility-BatchInsert) to insert multiple rows at once
* @param {array} rows -  rows array with format [{column1: value1, column2: value2}, {column1: value1, column2: value2}....]
* @param {string} table - table name
**/
async function insertRowsInBulk(rows, tableName, callback) {
//batch insert rows into ingredient table:
db.batchInsert(tableName, rows, chunkSize = 10000)
    .returning("id")
    .then(function(ids) {
        callback(null, ids)
    })
    .catch(function(error) {
        console.log('ERROR:', error)
        callback(error)
    })
}

/*
* Parses ingredients from recipes / recipe instructions and returns formatted ingredient rows that
* can be inserted into the database.
* @param {object} recipes - recipes object 
* @return {array} - array of ingredient rows to be inserted
**/
function createIngredientAndRecipesRows(recipes) {
    var ingredientsDict = {}
    var recipeIngredients = {}
    Object.keys(recipes).map((key) => {
        let recipe = recipes[key];
        if (recipe.ingredients !== undefined && recipe.ingredients.length > 0 && recipe.title && !recipeIngredients[formatRecipeName(recipe.title)]) {
            let ingredientIds = []
            recipe.ingredients.map(function(ingredient) {
                let parsed = parser.parse(ingredient)
                let parsedIngredient = parsed.ingredient
                if (formatIngredientName(parsedIngredient) !== undefined &&  parsedIngredient !== undefined && ingredientsDict[parsedIngredient] === undefined) {
                    let ingredientId = uuid()
                    ingredientIds.push(ingredientId)
                   ingredientsDict[formatIngredientName(parsedIngredient)] = ingredientId
                }
            })
            if(recipe.title != undefined && formatRecipeName(recipe.title) !== undefined){
                recipeIngredients[formatRecipeName(recipe.title)] = ingredientIds
            }
        }
    })

    //create rows:
    var ingredientRows = []
    var recipeRows = []

    //create ingredient rows:
    Object.keys(ingredientsDict).map(function(ingredientName) {
        ingredientRows.push(new Ingredient(ingredientsDict[ingredientName], ingredientName, "null").getIngredientJson())
    });

    //create recipe rows:
    Object.keys(recipes).map(function(key) {
        let recipe = recipes[key]
        if (recipe.title !== undefined && formatRecipeName(recipe.title) !== undefined &&  recipeIngredients[formatRecipeName(recipe.title)] && recipe.instructions && recipe.instructions !== "") {
            recipeRows.push(new Recipe(recipe.title, JSON.stringify(recipeIngredients[formatRecipeName(recipe.title)]), recipe.instructions, recipe.ingredients).getRecipeJson())
        }
    })
    return {ingredientRows: ingredientRows, recipeRows: recipeRows}
}



var rows = createIngredientAndRecipesRows(recipesJson)

async.series([
    function(next) {insertRowsInBulk(rows.ingredientRows, "ingredients", next)},
    function(next) {insertRowsInBulk(rows.recipeRows, "recipes", next)}
], function(err, results) {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Inserted ${rows.ingredientRows.length} rows in table ingredients`)
    console.log(`Inserted ${rows.recipeRows.length} rows in table recipes`)
})


