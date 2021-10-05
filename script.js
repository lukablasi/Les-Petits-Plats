

//pulling data from API
async function apiRequest() {
    try {
        const resp = await fetch('recipes.js');
        const response = await resp.json();
    } catch (error) {
        console.log(error)
    }
} 


let filter = '';

//printing unsorted data on a website
async function populateRecipes(filter) {
    const api = await apiRequest();
    const container = document.getElementById('recipes');
    removeAllChildNodes(container);
    const filteredRecipes = [];
    for (let recipe of recipes)  {
        
        let lowName = recipe.name.toLowerCase();
        let lowDescription = recipe.description.toLowerCase();
        let allIngredients = [];
        
        for (let ingredient of recipe.ingredients) {
            allIngredients.push(ingredient.ingredient)
        }
        let lowerAllIngredients = allIngredients.map(v => v.toLowerCase());
        if (lowName.includes(filter) || recipe.name.includes(filter) || lowDescription.includes(filter) || recipe.description.includes(filter) || allIngredients.includes(filter) || lowerAllIngredients.includes(filter)) {
            filteredRecipes.push(recipe)
            
        }
    } 
    const noResults = document.getElementById('no-results');
    if(filteredRecipes.length > 0) {
        noResults.classList.add('d-none');
        noResults.classList.remove('d-block');
    } else {
        noResults.classList.remove('d-none');
        noResults.classList.add('d-block');
    }
    for (let recipe of filteredRecipes) {
        const recipeContainer = document.createElement('div');
        const recipePlaceholder = document.createElement('img');
        const recipeMain = document.createElement('div');
        const recipeTopRow = document.createElement('div');
        const recipeName = document.createElement('div');
        const recipeTime = document.createElement('div');
        const recipeBottomRow = document.createElement('div');
        const recipeIngredients = document.createElement('div');
        const recipeDescription = document.createElement('div');
    
        container.appendChild(recipeContainer);
        recipeContainer.appendChild(recipePlaceholder);
        recipeContainer.appendChild(recipeMain);
        recipeMain.appendChild(recipeTopRow);
        recipeMain.appendChild(recipeBottomRow);
        recipeTopRow.appendChild(recipeName);
        recipeTopRow.appendChild(recipeTime);
        recipeBottomRow.appendChild(recipeIngredients);
        recipeBottomRow.appendChild(recipeDescription);
    
        recipeContainer.classList.add('col-md-6');
        recipeContainer.classList.add('col-lg-4');
        recipeContainer.classList.add('my-3');
        recipeContainer.classList.add('recipe-container');
        recipeContainer.classList.add(recipe.appliance.split(' ').join('-').toLowerCase())
        for (let ustensil of recipe.ustensils) {
            recipeContainer.classList.add(ustensil.split(' ').join('-').toLowerCase())
        }
        for (let ingredients of recipe.ingredients) {
            recipeContainer.classList.add(ingredients.ingredient.split(' ').join('-').toLowerCase())
        }
        
        
        recipePlaceholder.setAttribute('src', 'placeholder.png');
        recipePlaceholder.classList.add('w-100');
        recipePlaceholder.classList.add('rounded-top');
    
        recipeMain.classList.add('main-container');
        recipeMain.classList.add('rounded-bottom');
    
        recipeTopRow.classList.add('row');
        recipeBottomRow.classList.add('row');
    
        recipeTopRow.classList.add('top-row');
        recipeBottomRow.classList.add('bottom-row');
    
        recipeName.innerHTML = recipe.name;
        recipeName.classList.add('col-8');
        recipeName.classList.add('recipe-name');
    
        recipeTime.innerHTML = '<img src="time.svg">' + ' ' + recipe.time + ' min';
        recipeTime.classList.add('col-4');
        recipeTime.classList.add('recipe-time');
        
    
        for (let ingredient of recipe.ingredients) {
            if (ingredient.quantity != undefined && ingredient.unit != undefined) {
            recipeIngredients.innerHTML += '<b>' + ingredient.ingredient + ': ' + '</b>' + ingredient.quantity + ' ' + ingredient.unit + '<br>';
            } else if (ingredient.quantity != undefined && ingredient.unit == undefined) {
                recipeIngredients.innerHTML += '<b>' + ingredient.ingredient + ': ' + '</b>' + ingredient.quantity + '<br>';
            } else {
                recipeIngredients.innerHTML += '<b>' + ingredient.ingredient + '</b>';
            }
        }
        recipeIngredients.classList.add('ingredients');
        recipeIngredients.classList.add('col-6');
        recipeIngredients.classList.add('p-3');
    
        const maxNumbChar = 125;
    
        if (recipe.description.length < maxNumbChar) {
        recipeDescription.innerHTML = recipe.description;
        } else {
        recipeDescription.innerHTML = recipe.description.substring(0,maxNumbChar) + '...';
        }
    
        recipeDescription.classList.add('col-6');
        recipeDescription.classList.add('description');
        recipeDescription.classList.add('p-3');
        
        addTag();
        
    }
    }
    
    populateRecipes(filter);


//add search bar functionality
const searchBar = document.getElementsByClassName('search-bar')[0];
searchBar.addEventListener('keyup', (e) => {
    if (e.target.value.length > 2) {
        let filter = e.target.value.toLowerCase();
        populateRecipes(filter);
        
    } else {
        let filter = '';
        populateRecipes(filter)
    }
})

//remove all child nodes
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//create ingredients box
const ingredientsSelectContainer = document.getElementById('ingredients-container');
const ingredientsSelectBox = document.createElement('div');
ingredientsSelectBox.classList.add('dropdown-menu');
ingredientsSelectBox.classList.add('ingredients-menu');
ingredientsSelectBox.setAttribute('aria-labelledby', 'ingredients-container');


ingredientsSelectContainer.appendChild(ingredientsSelectBox);

const ingredientsContainer = document.getElementById('ingredients-container');
const ingredientsButton = document.getElementById('ingredients-button');
    
let allIngredientsBox = [];

for (let recipe of recipes) {
    for (let ingredient of recipe.ingredients) {
        allIngredientsBox.push(ingredient.ingredient)
    }
}
let uniqueIngredients = [...new Set(allIngredientsBox)];
uniqueIngredients.forEach(function(ingredient) {
    const ingredientsInstance = document.createElement('a');
    ingredientsSelectBox.appendChild(ingredientsInstance).innerHTML = ingredient;
    ingredientsInstance.classList.add('dropdown-item');
    let ingredientClass = ingredientsInstance.innerHTML.toLowerCase().split(' ');
    ingredientsInstance.classList.add('ingredient');
    for (let clas of ingredientClass) {
        ingredientsInstance.classList.add(clas);
    }
    
    ingredientsInstance.setAttribute('href', '#')
    ingredientsInstance.addEventListener('click', () => {
        const selectedTags = document.getElementById('selected-tags');
        const selectedTag = document.createElement('button');
        selectedTags.appendChild(selectedTag);
        selectedTag.classList.add('btn');
        selectedTag.classList.add('btn-primary');
        selectedTag.classList.add('col-2');
        selectedTag.innerHTML = ingredientsInstance.innerHTML;
        addTag();
        selectedTag.addEventListener('click', () => {
            selectedTags.removeChild(selectedTag);
            addTag()
        })
    })
});

//ingredients button handler
const ingredientsInput = document.getElementById('ingredients-input');
ingredientsInput.addEventListener('click', (e) => {

    ingredientsSelectBox.classList.add('show');
    ingredientsButton.setAttribute('aria-expanded', true);

})

document.addEventListener('click', (e) => {
    ingredientsSelectBox.classList.remove('show');
    ingredientsButton.setAttribute('aria-expanded', false)
})

const lowerUniqueIngredients = uniqueIngredients.map(v => v.toLowerCase());

ingredientsInput.addEventListener('keyup', (e) => {
    if (e.target.value.length > 2) {
        let filter = e.target.value.toLowerCase();
        let filteredIngredients = lowerUniqueIngredients.filter(ingri => {
            return ingri.includes(filter)
        });
        let ingredientsCollection = document.querySelectorAll('.ingredient');
        
        for (let ingredient of ingredientsCollection) {
            ingredient.classList.add('d-none');
        }
        for (let filteredIngredient of filteredIngredients) {
            const instances = document.getElementsByClassName(filteredIngredient);
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
            }
        }
    } else {
            const instances = document.getElementsByClassName('ingredient');
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
            }
    }
})

//create device box
let allDevices = [];

for (recipe of recipes) {
    allDevices.push(recipe.appliance)
}

let uniqueDevices = [...new Set(allDevices)];

const deviceContainer = document.getElementById('device-container');
const deviceMenu = document.createElement('div');
deviceContainer.appendChild(deviceMenu);
deviceMenu.classList.add('dropdown-menu');
deviceMenu.classList.add('device-menu');

uniqueDevices.forEach(function(device) {
    const deviceInstance = document.createElement('a');
    deviceMenu.appendChild(deviceInstance).innerHTML = device;
    deviceInstance.classList.add('dropdown-item');
    const deviceClass = deviceInstance.innerHTML.toLowerCase().split(' ');
    deviceInstance.classList.add('device');
    for (let clas of deviceClass) {
        deviceInstance.classList.add(clas);
    }
    deviceInstance.setAttribute('href', '#');
    deviceInstance.addEventListener('click', () => {
        const selectedTags = document.getElementById('selected-tags');
        const selectedTag = document.createElement('button');
        selectedTags.appendChild(selectedTag);
        selectedTag.classList.add('btn');
        selectedTag.classList.add('btn-success');
        selectedTag.classList.add('col-2');
        selectedTag.innerHTML = deviceInstance.innerHTML;
        addTag();
        selectedTag.addEventListener('click', () => {
            selectedTags.removeChild(selectedTag);
            addTag()
        })
    })
});

//devices button handler
const deviceButton = document.getElementById('device-button');
const devicesInput = document.getElementById('device-input');
devicesInput.addEventListener('click', () => {
    deviceMenu.classList.add('show');
    deviceButton.setAttribute('aria-expanded', true);
})

document.addEventListener('click', (e) => {
    deviceMenu.classList.remove('show');
    deviceButton.setAttribute('aria-expanded', false);

})

const lowerUniqueDevices = uniqueDevices.map(v => v.toLowerCase());

devicesInput.addEventListener('keyup', (e) => {
    if (e.target.value.length > 2) {
        let filter = e.target.value.toLowerCase();
        let filteredDevices = lowerUniqueDevices.filter(dev=> {
            return dev.includes(filter)
        });
        let devicesCollection = document.querySelectorAll('.device');
        for (let device of devicesCollection) {
            device.classList.add('d-none');
        }
        for (let filteredDevice of filteredDevices) {
            const instances = document.getElementsByClassName(filteredDevice);
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
                
            }
        }
    } else {
            const instances = document.getElementsByClassName('device');
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
            }
    }
})

//create ustensils box
let allUstensils = [];

for (let recipe of recipes) {
    for (let ustensil of recipe.ustensils) {
        allUstensils.push(ustensil)
    }
}
let uniqueUstensils = [...new Set(allUstensils)];

const ustensilContainer = document.getElementById('ustensils-container');
const ustensilMenu = document.createElement('div');
ustensilContainer.appendChild(ustensilMenu);
ustensilMenu.classList.add('dropdown-menu');
ustensilMenu.classList.add('ustensil-menu');

uniqueUstensils.forEach(function(ustensil) {
    const ustensilInstance = document.createElement('a');
    ustensilMenu.appendChild(ustensilInstance).innerHTML = ustensil;
    ustensilInstance.classList.add('dropdown-item');
    const ustensilClass = ustensilInstance.innerHTML.toLowerCase().split(' ');
    ustensilInstance.classList.add('ustensil');
    for (let clas of ustensilClass) {
        ustensilInstance.classList.add(clas);
    }
    ustensilInstance.setAttribute('href', '#');
    ustensilInstance.addEventListener('click', () => {
        const selectedTags = document.getElementById('selected-tags');
        const selectedTag = document.createElement('button');
        selectedTags.appendChild(selectedTag);
        selectedTag.classList.add('btn');
        selectedTag.classList.add('btn-danger');
        selectedTag.classList.add('col-2');
        selectedTag.innerHTML = ustensilInstance.innerHTML;
        addTag();
        selectedTag.addEventListener('click', () => {
            selectedTags.removeChild(selectedTag);
            addTag()
        })
    })
});

//ustensils button handler
const ustensilsButton = document.getElementById('ustensils-button');
const ustensilsInput = document.getElementById('ustensils-input');
ustensilsInput.addEventListener('click', () => {
    ustensilMenu.classList.add('show');
    ustensilsButton.setAttribute('aria-expanded', true);
})

document.addEventListener('click', (e) => {
    ustensilMenu.classList.remove('show');
    ustensilsButton.setAttribute('aria-expanded', true);
})

const lowerUniqueUstensils = uniqueUstensils.map(v => v.toLowerCase());

ustensilsInput.addEventListener('keyup', (e) => {
    if (e.target.value.length > 2) {
        let filter = e.target.value.toLowerCase();
        let filteredUstensils = lowerUniqueUstensils.filter(dev=> {
            return dev.includes(filter)
        });
        let ustensilsCollection = document.querySelectorAll('.ustensil');
        for (let ustensil of ustensilsCollection) {
            ustensil.classList.add('d-none');
        }
        for (let filteredUstensil of filteredUstensils) {
            const instances = document.getElementsByClassName(filteredUstensil);
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
                
            }
        }
    } else {
            const instances = document.getElementsByClassName('ustensil');
            for (let instance of instances) {
                instance.classList.remove('d-none');
                instance.classList.add('d-block');
            }
    }
})

//filter by selected tags
// let tags = [];
function addTag() {
//     let tag = selectedTag.innerHTML.split(' ').join('-').toLowerCase();
//     currentTags = 
//     const allRecipes = document.getElementsByClassName('recipe-container');
//     for (let recipe of allRecipes) {
        
//         if (recipe.classList.contains(tag)) {
            
//         } else {
//             recipe.classList.add('d-none')
//         }
    
// }
    const allRecipes = document.getElementsByClassName('recipe-container');
    const selectedTags = document.getElementById('selected-tags').children;
    if (selectedTags.length == 0) {
        
        for (let recipe of allRecipes) {
            recipe.classList.remove('d-none')
            recipe.classList.add('d-block')
        }
    } else {
    for (let recipe of allRecipes) {
        recipe.classList.remove('d-none')
            recipe.classList.add('d-block')
        for (let tag of selectedTags) {
            tag = tag.innerHTML.split(' ').join('-').toLowerCase();
            
            if (recipe.classList.contains(tag)) {
                            // recipe.classList.remove('d-none')
                            recipe.classList.add('d-block')
                            
                        } else  {
                            recipe.classList.remove('d-block')
                            recipe.classList.add('d-none')
                            
                        }
        }
    }}

    


    
    // for (let tag of selectedTags) {
    //     tag = tag.innerHTML.split(' ').join('-').toLowerCase();
    //     console.log(tag)
    //     for (let recipe of allRecipes) {
            
    //         if (recipe.classList.contains(tag)) {
    //             recipe.classList.remove('d-none')
    //             recipe.classList.add('d-block')
                
    //         } else {
    //             recipe.classList.remove('d-block')
    //             recipe.classList.add('d-none')
                
    //         }
    //     }
    // }
}

// function removeTag(selectedTag) {
    
//     let tag = selectedTag.innerHTML.split(' ').join('-').toLowerCase();
//     const allRecipes = document.getElementsByClassName('recipe-container');
//     for (let recipe of allRecipes) {
        
//             if (recipe.classList.contains(tag)) {
                
//             } else {
//                 recipe.classList.remove('d-none')
//             }
        
//     }
// }

// function updateTags(tags) {
//     const allRecipes = document.getElementsByClassName('recipe-container');
//     for (let recipe of allRecipes) {
//         for (let tag of tags) {
//             if (recipe.classList.contains(tag)) {
//                 recipe.classList.add('d-block')
//             } else {
//                 recipe.classList.add('d-none')
//             }
//         }
//     }
// }