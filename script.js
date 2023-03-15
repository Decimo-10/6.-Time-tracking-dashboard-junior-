/* buttons for periods */
const periodBtns = document.querySelectorAll(".period");
const dailyBtn = periodBtns[0];
const weeklyBtn = periodBtns[1];
const monthlyBtn = periodBtns[2];

const acitivities = document.querySelector(".activites");/* <section> which will contain the activities */

/* Array to contain color values and be able to find them based on the activity type. */
const colors = [
    {
        type: "work",
        color: "hsl(15, 100%, 70%)"
    },
    {
        type: "play",
        color: "hsl(195, 74%, 62%)"
    },
    {
        type: "study",
        color: "hsl(348, 100%, 68%)"
    },
    {
        type: "exercise",
        color: "hsl(145, 58%, 55%)"
    },
    {
        type: "social",
        color: "hsl(264, 64%, 52%)" 
    },
    {
        type: "self care",
        color: "hsl(43, 84%, 65%)"
    }
];

const jsonFile = "data.json";


let actiWrappers = []; /* An array to store references to the created activity HTML elements so that they can be accessed later when we want to update the text contents. */
    
function createActivities(period){/* Create the HTML elements and give them the necessary properties */
    fetch(jsonFile)
    .then((response) => response.json())
    .then((data) => {
        for(let i = 0; i < data.length; i++){
            /* Creating the neceassry HTML elements */
            const wrapper = document.createElement("div");
            const activity = document.createElement("div");
            const type = document.createElement("h2");
            const time = document.createElement("p");
            const last = document.createElement("p");

            /* Setting the classes */
            wrapper.classList.add("wrapper");
            activity.classList.add("activity");
            type.classList.add("activity__type");
            time.classList.add("activity__time");
            last.classList.add("activity__last");

            
            /* Background color for wrapper */
            wrapper.style.backgroundColor = colors.find(obj => obj.type == data[i].title.toLowerCase()).color;

            /* Background image for wrapper */
            const imgName = (`icon-${data[i].title.toLowerCase()}.svg`).replace(" ", "-");/* create file name */
            wrapper.style.backgroundImage = `url(images/${imgName})`;
            

            /* Append the elements */
            activity.append(type, createThreePoint(), time, last);
            wrapper.append(activity);
            acitivities.append(wrapper);
            actiWrappers.push(activity);
        }
        updateText(period);
    })
    .catch((error) => console.error(`Could not get data ${error}`));
}

function updateText(period){/* Update the text content of the activites */
    fetch(jsonFile)
    .then(response => response.json())
    .then((data) => {
        for(let i = 0; i < data.length; i++){
            const type = actiWrappers[i].childNodes[0];/* Activity type <h2> */
            const time = actiWrappers[i].childNodes[2];/* current time <p> */
            const last = actiWrappers[i].childNodes[3];/* previous time <p> */
            type.textContent = data[i].title;
            time.textContent = `${data[i].timeframes[period].current}hrs`;
            switch(period){
                case "daily":
                    last.textContent = `Yesterday - ${data[i].timeframes[period].previous}hrs`;
                    break;
                case "weekly":
                    last.textContent = `Last week - ${data[i].timeframes[period].previous}hrs`;
                    break;
                case "monthly":
                    last.textContent = `Last month - ${data[i].timeframes[period].previous}hrs`;
                    break;
            }
        }

        /* Give the "active" class to the current period's button */
        switch(period){
            case "daily":
                dailyBtn.classList.add("active");
                weeklyBtn.classList.remove("active");
                monthlyBtn.classList.remove("active");
                break;
            case "weekly":
                weeklyBtn.classList.add("active");
                dailyBtn.classList.remove("active");
                monthlyBtn.classList.remove("active");
                break;
            case "monthly":
                monthlyBtn.classList.add("active");
                dailyBtn.classList.remove("active");
                weeklyBtn.classList.remove("active");
                break;
        }
    })
    .catch(error => console.error(`Could not get data ${error}`));
}

function createThreePoint(){/* Seperated into it's own function just for clarity's sake. */
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "21");
    svg.setAttribute("height", "5");
    svg.classList.add("activity__more");

    const threePoint = document.createElementNS("http://www.w3.org/2000/svg", "path");
    threePoint.setAttribute("d","M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z");
    threePoint.setAttribute("fill", "#BBC0FF");
    threePoint.setAttribute("fill-rule", "evenodd");

    svg.appendChild(threePoint);
    return svg;
}

createActivities("daily");

dailyBtn.addEventListener("click", () => {updateText("daily")});
weeklyBtn.addEventListener("click", () => {updateText("weekly")});
monthlyBtn.addEventListener("click", () => {updateText("monthly")});


