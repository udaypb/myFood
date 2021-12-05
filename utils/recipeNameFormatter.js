module.exports = {
    formatRecipeName: (recipeName) =>{
        if (recipeName == null || recipeName == undefined) {
            return undefined;
        }
        let toRet = undefined;
        if (recipeName.split(" ").length < 40) {
            toRet = recipeName.toLowerCase().trim().replace(/\s/g, '_')
        }
        return toRet
    }
}
