const Base_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_gcHIV50fVN49bKYkFa1nyrblo3tL33oSrizTf6Fl";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
dropdowns.forEach((select) => {
  for (let currCode in countryList) {  // Assumes countryList is already defined
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if ((select.name === "from" && currCode === "USD") ||
        (select.name === "to" && currCode === "INR")) {
      newOption.selected = true;
    }
    
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
});

// Function to update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value.trim();

  if (!amtVal || isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${Base_URL}&base_currency=${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (!data.data || !data.data[toCurr.value]) {
      msg.innerText = "Exchange rate not available!";
      return;
    }

    let rate = data.data[toCurr.value].value;
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rates!";
    console.error("API Error:", error);
  }
};

// Function to update flag icon
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];  // Assumes countryList is defined
  let img = element.parentElement.querySelector("img");

  if (img && countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};

// Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);

