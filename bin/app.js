let fs = require('fs');
let path = require('path');
//let savejson = require('./save-json');

let filePath            = __dirname + '/jsondata/test-case-1.json';
let categoryJSON        = JSON.parse(fs.readFileSync(filePath));

let categoryTarget      = categoryJSON.target;
let categoryData        = categoryJSON.data;

//an array of values that represents category property in the payload
let categories          = getAllCategories(categoryData);
let subCategories       = initialiseSubCategories(categories, categoryData);
let hierarchicalDisplay = '';

for (let category of categories) {
    hierarchicalDisplay += category + '\n' + buildCategoryTable(0, 1, subCategories[category], category);
}

console.log(hierarchicalDisplay);

function buildCategoryTable(parentId,depth,subCategory,category)
{
    let children = subCategory.filter((element) => element.parentId == parentId && category == element.category);

    if(children.length == 0)
    {
        return '';
    }
    
    let builtTable = "";
    let equalSigns = "==".repeat(depth);

    for (let child of children) {
        let subChild = buildCategoryTable(child.id, depth + 1, subCategory, category);
        builtTable   += equalSigns + child.displayName + '\n' + subChild;
    }

    return builtTable;

}


function initialiseSubCategories(categories, categoryData)
{
    let subCategories = {};

    for (const key of categories) {
        subCategories[key] = categoryData.filter((element) => element.category == key); 
    }

    return subCategories;

}

function getAllCategories(categoryData)
{
    let categories = [];

    for (let index = 0; index < categoryData.length; index++) {
        let filtered = categories.filter((item) => item == categoryData[index].category);
        if(filtered == 0)
        {
            categories.push(categoryData[index].category);
        }
    }

    return categories;

}


