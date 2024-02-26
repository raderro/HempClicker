let newPlayer = true;

let hemp = 0;
let multiplier = 1;

let timeout;

let upgradeCost = 10;

let workers = {
    mini: { quantity: 0, hempPerSecond: 0.2, cost: 100 },
    mid: { quantity: 0, hempPerSecond: 3.5, cost: 1000 },
    big: { quantity: 0, hempPerSecond: 15, cost: 10000 }
};

upgradeButton = document.getElementById('upgradeButton');
hempCounter = document.getElementById('hempCounter');
hempButton = document.getElementById('hempButton');
clickUpgradeCost = document.getElementById('clickUpgradeCost');

miniWorkerButton = document.getElementById('miniWorkerButton');
midWorkerButton = document.getElementById('midWorkerButton');
bigWorkerButton = document.getElementById('bigWorkerButton');

modal = document.getElementById("farmNameModal");
submitFarmNameBtn = document.getElementById("submitNameBtn");

let quest1hemp = 0;
let quest1hempisDone = false;
let quest1hempCollect = false;
quest1 = document.getElementById('quest1');
quest1Progress = document.getElementById('quest1Progress');

let quest2upgrade = 0;
let quest2upgradeisDone = false;
let quest2upgradeCollect = false;
quest2 = document.getElementById('quest2');
quest2Progress = document.getElementById('quest2Progress');

let quest3buy = 0;
let quest3buyisDone = false;
let quest3buyCollect = false;
quest3 = document.getElementById('quest3');
quest3Progress = document.getElementById('quest3Progress');

window.onload = function() {
    loadProgress();
    RefreshHemp();

    if(newPlayer == true){
        modal.style.display = "block";
    }
    else{
        modal.style.display = "none";
    }
}

submitFarmNameBtn.addEventListener('click', function() {
    let farmName = document.getElementById('farmNameInput').value.trim();
    var maxChars = 20;

    if(farmName.trim()==''){
        alert("The farm name cannot be empty!");
    }
    else if(farmName.length > maxChars){
        alert("The farm name cannot exceed " + maxChars + " characters!");
    }
    else{
        document.getElementById('farmNameHeader').innerHTML = "Farm name: " + farmName;
        newPlayer = false;
        modal.style.display = "none";
    }
});

upgradeButton.addEventListener('click', function() {
    UpgradeClick();
});

function UpgradeClick(){
    var clickSound = new Audio('assets/click.wav');
    clickSound.play();

    if(hemp >= upgradeCost){
        hemp -= upgradeCost;
        multiplier += 0.1;
        upgradeCost += 15;
        if(quest2upgradeisDone == false){
            Quest2();
        }
        RefreshHemp();
    }
}

hempButton.addEventListener('click', function() {
  hemp += multiplier;
  if(quest1hempisDone == false){
    Quest1();
  }
  var clickSound = new Audio('assets/click.wav');
  clickSound.play();
  timeout = setTimeout(RefreshHemp, 1);
});

miniWorkerButton.addEventListener('click', function() {
    var clickSound = new Audio('assets/click.wav');
    clickSound.play();

    if(hemp >= workers.mini.cost){
        hemp -= workers.mini.cost;
        workers.mini.quantity += 1;
        workers.mini.cost += 25;
        if(quest3buyisDone == false){
            Quest3();
        }
        document.getElementById('miniWorkerCost').innerHTML = workers.mini.cost;
        miniworker = new Worker_Mini();
    }
});

midWorkerButton.addEventListener('click', function() {
    var clickSound = new Audio('assets/click.wav');
    clickSound.play();

    if(hemp >= workers.mid.cost){
        hemp -= workers.mid.cost;
        workers.mid.quantity += 1;
        workers.mid.cost += 250;
        document.getElementById('midWorkerCost').innerHTML = workers.mid.cost;
        midworker = new Worker_Mid();
    }
});

bigWorkerButton.addEventListener('click', function() {
    var clickSound = new Audio('assets/click.wav');
    clickSound.play();

    if(hemp >= workers.big.cost){
        hemp -= workers.big.cost;
        workers.big.quantity += 1;
        workers.big.cost += 2500;
        document.getElementById('bigWorkerCost').innerHTML = workers.big.cost;
        bigworker = new Worker_Big();
    }
});

function RefreshHemp() {
    if(hemp > 1000 && hemp < 1000000){
        hempCounter.innerHTML = "Hemp: " + (Math.floor(hemp / 100) / 10).toFixed(1) + "K";
    }
    else if(hemp > 1000000 && hemp < 1000000000){
        hempCounter.innerHTML = "Hemp: " + (Math.floor(hemp / 10000) / 100).toFixed(1) + "M";
    }
    else if(hemp > 1000000000 && hemp < 1000000000000){
        hempCounter.innerHTML = "Hemp: " + (hemp / 1000000000).toFixed(1) + "B";
    }
    else if(hemp > 1000000000000 && hemp < 1000000000000000){
        hempCounter.innerHTML = "Hemp: " + (hemp / 1000000000000).toFixed(1) +"T";
    }
    else if(hemp > 1000000000000000 && hemp < 1000000000000000000){
        hempCounter.innerHTML = "Hemp: " + (Math.floor(hemp / 1000000000000000 * 10) / 10).toFixed(1) + "Q";
    }
    else{
        hempCounter.innerHTML = "Hemp: " + Math.floor(hemp);
    }

    if(upgradeCost < 1000){
        clickUpgradeCost.innerHTML = upgradeCost;
    }
    else if(upgradeCost >= 1000 && upgradeCost < 1000000){
        clickUpgradeCost.innerHTML = (Math.floor(upgradeCost / 100) / 10).toFixed(1) + "K";
    }
    else if(upgradeCost > 1000000 && upgradeCost < 1000000000){
        clickUpgradeCost.innerHTML = (Math.floor(upgradeCost / 10000) / 100).toFixed(1) + "M";
    }

    document.getElementById('miniWorkersStats').innerHTML = "Mini Workers: " + workers.mini.quantity;
    document.getElementById('midWorkersStats').innerHTML = "Mid Workers: " + workers.mid.quantity;
    document.getElementById('bigWorkersStats').innerHTML = "Big Workers: " + workers.big.quantity;

    if(workers.mini.cost < 1000){
        document.getElementById('miniWorkerCost').innerHTML = workers.mini.cost;
    }
    else if(workers.mini.cost >= 1000 && workers.mini.cost < 1000000 ){
        document.getElementById('miniWorkerCost').innerHTML = (Math.floor(workers.mini.cost / 100) / 10).toFixed(1) + "K";
    }
    else if(workers.mini.cost >= 1000000 && workers.mini.cost < 1000000000){
        document.getElementById('miniWorkerCost').innerHTML = (Math.floor(workers.mini.cost / 10000) / 100).toFixed(1) + "M";
    }

    if(workers.mid.cost >= 1000 && workers.mid.cost < 1000000 ){
        document.getElementById('midWorkerCost').innerHTML = (Math.floor(workers.mid.cost / 100) / 10).toFixed(1) + "K";
    }
    else if(workers.mid.cost > 1000000 && workers.mid.cost < 1000000000){
        document.getElementById('midWorkerCost').innerHTML = (Math.floor(workers.mid.cost / 10000) / 100).toFixed(1) + "M";
    }

    if(workers.big.cost > 1000 && workers.big.cost < 1000000 ){
        document.getElementById('bigWorkerCost').innerHTML = (Math.floor(workers.big.cost / 100) / 10).toFixed(1) + "K";
    }
    else if(workers.big.cost > 1000000 && workers.big.cost < 1000000000){
        document.getElementById('bigWorkerCost').innerHTML = (Math.floor(workers.big.cost / 10000) / 100).toFixed(1) + "M";
    }

    quest1.innerHTML = "Collect 10 hemp: " + quest1hemp + "/10";
    quest1Progress.value = quest1hemp;
    quest2.innerHTML = "Upgrade clicker 10 times: " + quest2upgrade + "/10";
    quest2Progress.value = quest2upgrade;
    quest3.innerHTML = "Buy the first 5 mini workers: " + quest3buy + "/5";
    quest3Progress.value = quest3buy;

    if(quest1hempisDone == true && quest1hempCollect == false){
        document.getElementById('quest1_').remove();
    }

    if(quest2upgradeisDone == true && quest2upgradeCollect == false){
        document.getElementById('quest2_').remove();
    }

    if(quest3buyisDone == true && quest3buyCollect == false){
        document.getElementById('quest3_').remove();
    }
}

function Worker_Mini(){
    
    /*dodaje zdjęcie pracownika do strony DZIAŁA

    const img_mini_worker = document.createElement("img");
    img_mini_worker.src = "assets/pngaaa.com-490587.png";
    img_mini_worker.style.width = "50px";
    document.body.appendChild(img_mini_worker);
    */

    this.hempPerSecond = workers.mini.hempPerSecond;
    this.interval = setInterval(() => {
        hemp += this.hempPerSecond;
        RefreshHemp();
    }, 1000);
}

function Worker_Mid(){
    this.hempPerSecond = 3.5;
    this.interval = setInterval(() => {
        hemp += this.hempPerSecond;
        RefreshHemp();
    }, 1000);
}

function Worker_Big(){
    this.hempPerSecond = 15;
    this.interval = setInterval(() => {
        hemp += this.hempPerSecond;
        RefreshHemp();
    }, 1000);
}

function Quest1(){
    quest1.innerHTML = "Collect 10 hemp: " + quest1hemp + "/10";

    if(quest1hempisDone == false){
        if(quest1hemp < 10){
            quest1hemp += 1;
        }
        if(quest1hemp >= 10){
            quest1hempisDone = true;
        }
    }

    if(quest1hempisDone == true && quest1hempCollect == false){
        quest1hempCollect = true;
        hemp += 100;
        document.getElementById('quest1_').remove();
    }

    quest1.innerHTML = "Collect 10 hemp: " + quest1hemp + "/10";
}

function Quest2(){
    quest2.innerHTML = "Upgrade clicker 10 times: " + quest2upgrade + "/10";

    if(quest2upgradeisDone == false){
        if(quest2upgrade < 10){
            quest2upgrade += 1;
        }
        if(quest2upgrade >= 10){
            quest2upgradeisDone = true;
        }
    }

    if(quest2upgradeisDone == true && quest2upgradeCollect == false){
        quest2upgradeCollect = true;
        hemp += 200;
        document.getElementById('quest2_').remove();
    }

    quest2.innerHTML = "Upgrade clicker 10 times: " + quest2upgrade + "/10";
}

function Quest3(){
    quest3.innerHTML = "Buy the first 5 mini workers: " + quest3buy + "/5";

    if(quest3buyisDone == false){
        if(quest3buy < 5){
            quest3buy += 1;
        }
        if(quest3buy >= 5){
            quest3buyisDone = true;
        }
    }

    if(quest3buyisDone == true && quest3buyCollect == false){
        quest3buyCollect = true;
        hemp += 150;
        document.getElementById('quest3_').remove();
    }

    quest3.innerHTML = "Buy the first 5 mini workers: " + quest3buy + "/5";
}

function saveProgress() {
    localStorage.setItem("hemp", hemp);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("upgradeCost", upgradeCost);
    localStorage.setItem("workers", JSON.stringify(workers));
    localStorage.setItem("newPlayer", newPlayer.toString());
    localStorage.setItem("farmName", document.getElementById('farmNameHeader').innerHTML);
    localStorage.setItem("quest1hemp", quest1hemp);
    localStorage.setItem("quest1hempisDone", quest1hempisDone.toString());
    localStorage.setItem("quest1hempCollect", quest1hempCollect.toString());
    localStorage.setItem("quest2upgrade", quest2upgrade);
    localStorage.setItem("quest2upgradeisDone", quest2upgradeisDone.toString());
    localStorage.setItem("quest2upgradeCollect", quest2upgradeCollect.toString());
    localStorage.setItem("quest3buy", quest3buy);
    localStorage.setItem("quest3buyisDone", quest3buyisDone.toString());
    localStorage.setItem("quest3buyCollect", quest3buyCollect.toString());
}

function loadProgress() {
    if (localStorage.getItem("hemp")) {
        hemp = parseInt(localStorage.getItem("hemp"));
    }
    if (localStorage.getItem("multiplier")) {
        multiplier = parseInt(localStorage.getItem("multiplier"));
    }
    if (localStorage.getItem("upgradeCost")) {
        upgradeCost = parseInt(localStorage.getItem("upgradeCost"));
    }
    if (localStorage.getItem("workers")) {
        workers = JSON.parse(localStorage.getItem("workers"));
    }
    if (localStorage.getItem("newPlayer")) {
        newPlayer = localStorage.getItem("newPlayer") === "true";
    }
    if(localStorage.getItem("farmName")) {
        document.getElementById('farmNameHeader').innerHTML = localStorage.getItem("farmName");
    }
    if(localStorage.getItem("quest1hemp")) {
        quest1hemp = parseInt(localStorage.getItem("quest1hemp"));
    }
    if(localStorage.getItem("quest1hempisDone")) {
        quest1hempisDone = localStorage.getItem("quest1hempisDone") === "true";
    }
    if(localStorage.getItem("quest1hempCollect")) {
        quest1hempCollect = localStorage.getItem("quest1hempCollect") === "true";
    }
    if(localStorage.getItem("quest2upgrade")) {
        quest2upgrade = parseInt(localStorage.getItem("quest2upgrade"));
    }
    if(localStorage.getItem("quest2upgradeisDone")) {
        quest2upgradeisDone = localStorage.getItem("quest2upgradeisDone") === "true";
    }
    if(localStorage.getItem("quest2upgradeCollect")) {
        quest2upgradeCollect = localStorage.getItem("quest2upgradeCollect") === "true";
    }
    if(localStorage.getItem("quest3buy")) {
        quest3buy = parseInt(localStorage.getItem("quest3buy"));
    }
    if(localStorage.getItem("quest3buyisDone")) {
        quest3buyisDone = localStorage.getItem("quest3buyisDone") === "true";
    }
    if(localStorage.getItem("quest3buyCollect")) {
        quest3buyCollect = localStorage.getItem("quest3buyCollect") === "true";
    }

    if(quest1hempisDone == true && quest1hempCollect == true){
        document.getElementById('quest1_').remove();
    }

    if(quest2upgradeisDone == true && quest2upgradeCollect == true){
        document.getElementById('quest2_').remove();
    }

    if(quest3buyisDone == true && quest3buyCollect == true){
        document.getElementById('quest3_').remove();
    }

    let add_mini_workers = workers.mini.quantity;
    for (let i = 0; i < add_mini_workers; i++) {
        miniworker = new Worker_Mini();
    }

    let add_mid_workers = workers.mid.quantity;
    for (let i = 0; i < add_mid_workers; i++) {
        midworker = new Worker_Mid();
    }

    let add_big_workers = workers.big.quantity;
    for (let i = 0; i < add_big_workers; i++) {
        bigworker = new Worker_Big();
    }
}

window.onbeforeunload = function() {
    saveProgress();
}

function resetProgress() {
    hemp = 0;
    localStorage.removeItem("hemp");
    multiplier = 1;
    localStorage.removeItem("multiplier");
    upgradeCost = 10;
    localStorage.removeItem("upgradeCost");
    workers = {
        mini: { quantity: 0, hempPerSecond: 0.2, cost: 100 },
        mid: { quantity: 0, hempPerSecond: 3.5, cost: 1000 },
        big: { quantity: 0, hempPerSecond: 15, cost: 10000 }
    };
    localStorage.removeItem("workers");
    newPlayer = true;
    localStorage.removeItem("newPlayer");
    document.getElementById('farmNameHeader').innerHTML = "Farm name: ";
    localStorage.removeItem("farmName");
    quest1hemp = 0;
    localStorage.removeItem("quest1hemp");
    quest1hempisDone = false;
    localStorage.removeItem("quest1hempisDone");
    quest1hempCollect = false;
    localStorage.removeItem("quest1hempCollect");
    quest2upgrade = 0;
    localStorage.removeItem("quest2upgrade");
    quest2upgradeisDone = false;
    localStorage.removeItem("quest2upgradeisDone");
    quest2upgradeCollect = false;
    localStorage.removeItem("quest2upgradeCollect");
    quest3buy = 0;
    localStorage.removeItem("quest3buy");
    quest3buyisDone = false;
    localStorage.removeItem("quest3buyisDone");
    quest3buyCollect = false;
    localStorage.removeItem("quest3buyCollect");

    console.log("Postęp gry został zresetowany.");
}