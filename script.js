const input = document.querySelector(".input");
const tipWrapper = document.querySelector(".input__tip-wrapper");

const bill = document.querySelector("#bill-input");
const customTip = document.querySelector(".input__tip--field");/* Lehet hogy nem kell */
const numOfPeople = document.querySelector("#people-input");

const outPutTexts = document.querySelectorAll(".output__amount");
const tipAmount = outPutTexts[0];
const totalAmount = outPutTexts[1];

const errorMessages = document.querySelectorAll(".input__error-message");
const billError = errorMessages[0];
const peopleError = errorMessages[1];

const resetBtn = document.querySelector(".output__reset");/* Mikor minden szükséges adat meg lett adva
    eltávolítani a disabled osztályt róla. */

const isBillValid = () => bill.value.length >= 1 && bill.checkValidity();/* fügvénybe */
const isCustomTipValid = () => customTip.value.length >= 1 && customTip.checkValidity();
const isNumOfPeopleValid = () => numOfPeople.value.length >= 1 && numOfPeople.checkValidity();

/* Számoláshoz szükségesek + alapértékek megadása(hamár be volt ütve korábban*/
let tipValue = customTip.value;
let billValue = bill.value;
let peopleValue = numOfPeople.value;

/* button-os
    eventlistener a wrapper-re
    mikor egy <button>-re kattintunk mentsük el annak a referencáját és így mikor egy újra 
    kattintunk eltudjuk az előző aktív gomb stílusát távolítani
    ebben az eventlistener-ben a customTip esetén csak annyit tegyen hogy eltávolítja az 
        előzőleg kiválasztott gomb stílusát a többit a "change" listener intézi
    
    "change" event listener legyen az <input>-okon
    */
let prevBtn = 0;
tipWrapper.addEventListener("click", (event) => {
     if(event.target.tagName.toLowerCase() === "button"){
        if(prevBtn === 0){
            event.target.classList.add("active-btn");
            customTip.classList.remove("active-custom-tip");
            prevBtn = event.target;
            tipValue = event.target.value;
        } else {
            prevBtn.classList.remove("active-btn");
            event.target.classList.add("active-btn");
            customTip.classList.remove("active-custom-tip");
            prevBtn = event.target;
            tipValue = event.target.value;
        }
    } else if(event.target === customTip){
        if(prevBtn !== 0){
            prevBtn.classList.remove("active-btn");
        }
        event.target.classList.add("active-custom-tip");
        tipValue = event.target.value;/* Lehet hogy maradjon meg. Mivel ha el is kattintunk
        a custom értékről a beírt érték megmarad. Ezzel pedig ha visszakattintunk rá akkor
        a beírt érték ismét a kiválasztott lesz. */
    }
    result();
});


/* input field-ek */
/* "keyup" event-et kipróbálni */
/* Bill */
bill.addEventListener("keyup", () => {/* "keyup"-ra lett cserélve. Ezzel minden billentyű felengedésnél futtatja a reset()-et így minden karakter beütés után frissíti az eredményt/jelzi hogy baj van. */
    if(isBillValid()){
        billError.style.display = "none";
    } else {
        billError.style.display = "block";
    }
    billValue = bill.value;
    resetBtn.classList.remove("disabled");/* Bármennyi megadott értéknél lehessen resetelni. */
    result();
});

/* Custom tip */
customTip.addEventListener("keyup", () => {
    tipValue = customTip.value;
    resetBtn.classList.remove("disabled");
    result();
});

/* Number of people */
numOfPeople.addEventListener("keyup", () => {
    if(isNumOfPeopleValid()){
        peopleError.style.display = "none";
    } else {
        peopleError.style.display = "block";
    }

    peopleValue = numOfPeople.value;
    resetBtn.classList.remove("disabled");
    result();
});

function result(){
    if(isBillValid() && isNumOfPeopleValid() && (isCustomTipValid() || tipValue > 0)){/* Utolsó VAGY eset: custom tip van és az valid || tipValue nem 0(ami a megadott alapértéke) vagyis egy fix tip gomb lett választva */
        totalAmount.textContent = `$${(parseFloat(billValue) / parseFloat(peopleValue) + (parseFloat(billValue) / (100 / parseFloat(tipValue)) / parseFloat(peopleValue))).toFixed(2)}`;
        tipAmount.textContent = `$${(parseFloat(billValue) / (100 / parseFloat(tipValue)) / parseFloat(peopleValue)).toFixed(2)}`
        /* Törölni */
        /* console.log(bill.checkValidity());
        console.log("Bill: " + billValue);
        console.log("Custom tip: " + tipValue);
        console.log("People: " + peopleValue); */
        
        resetBtn.classList.remove("disabled");
    }
    /* console.log("isBillValid: " + isBillValid());
    console.log("isCustomTipValid: " + isCustomTipValid());
    console.log("isNumOfPeopleValid: " + isNumOfPeopleValid()); */
}

function reset(prevBtn){/* Módosítani kellesz: valószinüleg prevBtn/customTip-ről osztályt kell leszedni */
    bill.value = "";
    customTip.value = "";
    numOfPeople.value = "";
    tipAmount.textContent = "$0.00";
    totalAmount.textContent = "$0.00";
    resetBtn.classList.add("disabled");

    if(prevBtn !== 0){/* Hogyha fix tip gomb nem lett megnyomva */
        prevBtn.classList.remove("active-btn");
    }
    customTip.classList.remove("active-custom-tip");
    
    
    
}
resetBtn.addEventListener("click", () => reset(prevBtn));


