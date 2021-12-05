// For reference, refer https://knexjs.org/#Schema-Building
var async = require("async")
const db = require("../db")



//Create Table1: ingredients
/**
 * columns:
 * id: integer, primary key
 * name: text, not null
 * ingredienttype: text
 */
async function createIngredientsTable() {
    try {
        await db.schema.withSchema('public').createTable('ingredients', table => {
         table.text('id').primary()
         table.text('name') //using text type as string has length = 255
         table.string('ingredienttype')   
         table.unique(['name'], {indexName: 'name_unique'})
        })
        console.log('Created ingredients Table')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

//Create Table2: recipes
async function createRecipesTable() {
    try {
        await db.schema.withSchema('public').createTable('recipes', table => {
         table.increments('id').primary()
         table.string('name').notNullable()
         table.text('instructions').notNullable() //using text type as string has length = 255
         table.json('ingredients')  //using json type to store array of ingredient ids TODO: while inserting add JSON.stringify to insert the array
         table.text('rawingredients') //these will be ingredients with units and quantities
        })
        console.log('Created recipes Table')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}




console.log('creating all tables for "maindata" database.........')
async.series([
    createIngredientsTable,
    createRecipesTable
], (err) => {
    if (err) console.error(err.message)
    console.log('All tables created successfully')
    process.exit(0)
})
