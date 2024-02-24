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
        RefreshHemp();
    }
}

hempButton.addEventListener('click', function() {
  hemp += multiplier;
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
}

function Worker_Mini(){
    /*
    dodaje zdjęcie pracownika do strony DZIAŁA

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

function saveProgress() {
    localStorage.setItem("hemp", hemp);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("upgradeCost", upgradeCost);
    localStorage.setItem("workers", JSON.stringify(workers));
    localStorage.setItem("newPlayer", newPlayer.toString());
    localStorage.setItem("farmName", document.getElementById('farmNameHeader').innerHTML);
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

    console.log("Postęp gry został zresetowany.");
}