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
    const filteredRecipes = recipes.filter( recipe => {
        let lowName = recipe.name.toLowerCase();
        let lowDescription = recipe.description.toLowerCase();
        let allIngredients = [];
        
        for (let ingredient of recipe.ingredients) {
            allIngredients.push(ingredient.ingredient)
        }
        let lowerAllIngredients = allIngredients.map(v => v.toLowerCase());
        return lowName.includes(filter) || recipe.name.includes(filter) || lowDescription.includes(filter) || recipe.description.includes(filter) || allIngredients.includes(filter) || lowerAllIngredients.includes(filter)
    } )
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