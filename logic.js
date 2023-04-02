const displayText=document.querySelector("[data-passwordDisplay]");
const copyPopup=document.querySelector("[data-copyMsg]");
const copyBtn=document.querySelector("[data-copy]");
const inputSlider = document.querySelector(".slider");
const displayLength= document.querySelector("[data-lengthNumber]");
const indecator= document.querySelector("[data-indecator]");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const generatePassword=document.querySelector(".generateButton");
const allCheckBoxs = document.querySelectorAll("input[type=checkbox]");

const symbols = '`!@#$%^&*()_+-=[]\{}|;:",./<>?`';


let password = "";
let passwordLength=10;
let checkCount = 0;
handleSlider();
getIndecation("#ccc");



//slider
function handleSlider() {
    inputSlider.value=passwordLength;
    displayLength.innerText = passwordLength;


    //chatGPT
    const min = inputSlider.min;
    const max = inputSlider.max;
    const value = inputSlider.value;
    const percent = ((value - min) / (max - min)) * 100;
    const color = 'linear-gradient(90deg, rgba(212, 65, 253, 0.562)' + percent + '%, white ' + percent + '%)';
    inputSlider.style.background = color;
    
      
    
}

//random interger

function getRandomInteger(max,min){
    return Math.floor(Math.random()*(max-min))+min  
}

// generate radom number from 0 - 9
 
function getRandomNumber(){
    return getRandomInteger(0,9);
}

// generate radom lowercase char

function getRandomLowerCase(){
    return String.fromCharCode (getRandomInteger(97,123));
}

// generate random Uppercase char
function getRandomUpperCase(){
    return String.fromCharCode (getRandomInteger(65,91));
}

// generate random Symbols

function getRandomSymbols(){
    let randNumIndex = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNumIndex);
    
}

// strength light

function getIndecation(color){
    indecator.style.backgroundColor=color;
    indecator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}
   

//calcualte strength color

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNumber=true;
    if(symbolCheck.checked) hasSymbol=true;


    // rules

    if(hasUpper && hasLower && (hasNumber||hasSymbol) && passwordLength>=8){
        getIndecation("#0f0");
    }
    else if((hasUpper||hasLower)&&(hasNumber||hasSymbol)&&passwordLength>=6){
        getIndecation("#ff0");
    }
    else{
        getIndecation("#f00");
    }
    

}

function sufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// function for copy the paswword text
async function copyText(){

    try {
        await navigator.clipboard.writeText(displayText.value);
        copyPopup.innerText="Copied!";
    } catch (e) {
        copyPopup.innerText="Failed!";
    }

    copyPopup.classList.add("active"); //to make the copied span visible in css

    setTimeout(()=>
    {
        copyPopup.classList.remove("active"); 
    },2000);

}


//slider movement 

inputSlider.addEventListener("input",(e)=>{
   passwordLength = e.target.value;
    handleSlider();
})
//copy event listner

copyBtn.addEventListener("click",()=>{
    if(displayText.value)
    copyText();
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBoxs.forEach(checkBox => {
        if(checkBox.checked)
        checkCount++;
    });
    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBoxs.forEach(checkBox => {
    checkBox.addEventListener("change",handleCheckBoxChange)
});

generatePassword.addEventListener("click",()=>{

    if(passwordLength<=0) return;

    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // password journey
    password ="";
    // if(upperCaseCheck.checked){
    //     password+=getRandomUpperCase;
    // }
    // if(lowerCaseCheck.checked){
    //     password+=getRandomLowerCase;
    // }
    // if(numberCheck.checked){
    //     password+=getRandomNumber;
    // }
    // if(symbolCheck.checked){
    //     password+=getRandomSymbols;
    // }

    let funcArr = [];
    if(upperCaseCheck.checked){
            funcArr.push(getRandomUpperCase);
        }
    if(lowerCaseCheck.checked){
            funcArr.push(getRandomLowerCase);
        }
    if(numberCheck.checked){
            funcArr.push(getRandomNumber);
        }
    if(symbolCheck.checked){
            funcArr.push(getRandomSymbols);
        }

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
        
    }
    

    //reamining addition

    for (let i = 0; i < passwordLength-funcArr.length; i++) {
        let randomIndex= getRandomInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
        
    }

    password = sufflePassword(Array.from(password));

    displayText.value=password;

    calculateStrength();


})

