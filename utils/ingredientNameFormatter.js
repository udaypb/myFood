
module.exports = {
    formatIngredientName: (ingredientName) =>{
        if (ingredientName == null || ingredientName == undefined) {
            return undefined;
        }
        let toRet = undefined;
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        if (ingredientName.split(" ").length < 4 && !format.test(ingredientName)) {
            toRet = ingredientName.toLowerCase().trim().replace(/\s/g, '_')
        }
        return toRet
    }
}
