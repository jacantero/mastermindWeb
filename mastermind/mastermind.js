const MAX_COMBINATION_LENGTH = 4;
const COLOR_OPTIONS = ["bg-coral", "bg-yellow", "bg-purple", "bg-black", "bg-green", "bg-blue"];
const MAX_ATTEMPTS = 10;

function createCurrentCombination(){
    let newCurrentCombination = [];
    for(let i=0; i<=MAX_COMBINATION_LENGTH-1; i++){
        newCurrentCombination.push("bg-gray");
    }
    return newCurrentCombination;
}

function generateFeedBack(currentCombination, targetCombination){
    let rightPositions = [];
    let misplacedCurrentPositions = [];
    let misplacedTargetPositions = [];
    currentCombination.forEach((element, index)=>{
        if(element==targetCombination[index]) rightPositions.push(index);
    });
    currentCombination.forEach((element, i)=>{
        if (rightPositions.indexOf(i)==-1){
            targetCombination.forEach((element, j)=>{
                if (rightPositions.indexOf(j)==-1 && misplacedCurrentPositions.indexOf(i)==-1 && misplacedTargetPositions.indexOf(j)==-1 && currentCombination[i]==targetCombination[j]){
                    misplacedCurrentPositions.push(i);
                    misplacedTargetPositions.push(j);
                } 
            })
        }
    });
    return [rightPositions.length, misplacedCurrentPositions.length];
}


function paintFeedback(feedback){
    let feedbackContainer = document.createElement("div");
    feedbackContainer.classList.add("feedback");
    for(let i=1; i<=feedback[0]; i++){
        let rightSquare = document.createElement("div");
        rightSquare.classList.add("right-square");
        feedbackContainer.appendChild(rightSquare);
    }
    for(let i=1; i<=feedback[1]; i++){
        let misplacedSquare = document.createElement("div");
        misplacedSquare.classList.add("misplaced-square");
        feedbackContainer.appendChild(misplacedSquare);
    }
    return feedbackContainer;
}

function createTargetCombination(combinationLength, colorOptions){
    let targetCombination = [];
    let randomIndex; 
    for(let i=0; i<=combinationLength-1; i++){
        randomIndex = Math.floor(Math.random()*colorOptions.length);
        targetCombination.push(colorOptions[randomIndex]);
    }
    return targetCombination;
}



function resetCurrentCombinationColors(){
    document.querySelectorAll(".current_combination_button").forEach(element=>{
        element.setAttribute("class", "current_combination_button bg-gray");
    });
}

function paintCurrentCombination(currentCombination){
    document.querySelectorAll(".current_combination_button").forEach((element, index)=>{
        element.classList.remove("bg-gray");
        element.classList.add(currentCombination[index]);
    })
}

function addColorElementToCombination(backgroundColor){
    let newSquareColor = document.createElement("div");
    newSquareColor.classList.add("historic_square");
    newSquareColor.classList.add(backgroundColor);
    return newSquareColor;
}

function checkUserHasWon(current, target){
    const isUserWinner = current.every((element, index) => element === target[index]);
    if (isUserWinner) window.alert("Has ganado, la última combinación era la correcta");
    return true;
}

function checkUserHasLost(attempts, userHasWon){
    const isGameOver = attempts == MAX_ATTEMPTS;
    if (isGameOver && !userHasWon) window.alert(`Game Over. La combinación correcta es ${targetCombination}`);
}

function addCurrentCombinationToHistoric(){
    const isInvalidCombination = currentCombination.includes("bg-gray");
    if (!isInvalidCombination){
        let newHistoricCombination = document.createElement("div");
        newHistoricCombination.classList.add("historic_combination");
        for(let i=0; i<=currentCombination.length-1; i++){
            newHistoricCombination.insertAdjacentElement("beforeend", addColorElementToCombination(currentCombination[i]));
        }
        let feedback = generateFeedBack(currentCombination, targetCombination);
        let feedbackContainer = paintFeedback(feedback);
        newHistoricCombination.insertAdjacentElement("beforeend", feedbackContainer);
        document.querySelector("#historial").insertAdjacentElement("afterbegin", newHistoricCombination);
        numberOfAttempts++;
        let isUserWinner = checkUserHasWon(currentCombination, targetCombination);
        checkUserHasLost(numberOfAttempts, isUserWinner);
        currentCombination = createCurrentCombination();
        resetCurrentCombinationColors(); 
    } else {
        window.alert("Tu combinación de colores no es válida. Tienes que elegir 4 colores");
    }
    
}


document.querySelectorAll(".color_option_button");
const targetCombination = createTargetCombination(MAX_COMBINATION_LENGTH, COLOR_OPTIONS);
console.log(targetCombination);
let numberOfAttempts = 0;
let currentCombination = createCurrentCombination();
document.querySelectorAll(".color_option_button").forEach((element)=>{
    element.addEventListener("click", (event)=>{  
        for(let i=0; i<=currentCombination.length-1; i++){
            if (currentCombination[i]=="bg-gray"){
                currentCombination[i]=event.target.classList[1];
                paintCurrentCombination(currentCombination);
                break;
            }
        }
    })
})

document.querySelectorAll(".current_combination_button").forEach((element, i)=>{
    element.addEventListener("click", (event)=>{
        event.target.classList.remove(currentCombination[i]);
        event.target.classList.add("bg-gray");
        currentCombination[i]="bg-gray";
    })
});

document.querySelector("#confirm_current_combination").addEventListener("click", addCurrentCombinationToHistoric);