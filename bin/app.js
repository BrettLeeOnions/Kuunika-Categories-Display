//Importing our required libraries
let fs = require('fs');
let path = require('path');

//Creates our test case JSON files if they don't already exist locally
let createTestCaseFile = require('./save-json').createTestCaseFile;

const testCase1File      = path.join(__dirname,'/jsondata/test-case-1.json');
const testCase2File      = path.join(__dirname,'/jsondata/test-case-2.json');

if(!fs.existsSync(testCase1File)){
    createTestCaseFile();
}

//Reads the saved JSON file saved on disk and saves is to a Object
let filePath            = __dirname + '/jsondata/test-case-1.json';
let categoryJSON        = JSON.parse(fs.readFileSync(filePath));


//Splits the JSON Object into it two major parts
let categoryTarget      = categoryJSON.target;
let categoryData        = categoryJSON.data;

/*
* An array of values that represents category property in the payload
* This creates an array of the top level categories that will begin each section
* e.g. Clinical, Vaccination, Diagnostics
*/
let categories          = getAllCategories(categoryData);

//This is an array of the containing all of the sub-catagories that will be displayed in a hierarchy 
let subCategories       = initialiseSubCategories(categories, categoryData);

//The final output will be a case of this 
let hierarchicalDisplay = '';


for (let category of categories) {
    let subCategory = null;

    if(categoryTarget != 0){
        subCategory = subCategories[category].filter((element) => element.id == categoryTarget || element.parentId == categoryTarget);
    }
    else{
        subCategory = subCategories[category];
    }

    if(subCategory.length > 0){
        hierarchicalDisplay += category + '\n' + buildCategoryTable(0, 1, subCategory, category) + '\n';
    }
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


