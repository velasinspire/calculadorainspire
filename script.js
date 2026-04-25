const form = document.getElementById("calculator-form");
const message = document.getElementById("form-message");
const resultCard = document.getElementById("result-card");

const outputFields = {
  waxPerCandle: document.getElementById("wax-per-candle"),
  fragrancePerCandle: document.getElementById("fragrance-per-candle"),
  totalWax: document.getElementById("total-wax"),
  totalFragrance: document.getElementById("total-fragrance"),
  totalProduction: document.getElementById("total-production"),
};

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatGrams(value) {
  return `${formatter.format(value)}g`;
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = "form-message";

  if (type) {
    message.classList.add(`is-${type}`);
  }
}

function hideResults() {
  resultCard.classList.remove("is-visible");
}

function showResults() {
  resultCard.classList.add("is-visible");
}

function getInputData(id) {
  const element = document.getElementById(id);
  const rawValue = element.value.trim();

  return {
    rawValue,
    numericValue: Number(rawValue),
  };
}

function isValidPositiveNumber(value) {
  return Number.isFinite(value) && value > 0;
}

function isValidNonNegativeNumber(value) {
  return Number.isFinite(value) && value >= 0;
}

function calculateMaterials(total, percentage) {
  const wax = total / (1 + percentage / 100);
  const fragrance = total - wax;

  return { wax, fragrance };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const candleSizeInput = getInputData("candle-size");
  const candleQuantityInput = getInputData("candle-quantity");
  const fragrancePercentInput = getInputData("fragrance-percent");

  const candleSize = candleSizeInput.numericValue;
  const candleQuantity = candleQuantityInput.numericValue;
  const fragrancePercent = fragrancePercentInput.numericValue;

  if (
    !candleSizeInput.rawValue ||
    !candleQuantityInput.rawValue ||
    !fragrancePercentInput.rawValue ||
    !isValidPositiveNumber(candleSize) ||
    !isValidPositiveNumber(candleQuantity) ||
    !Number.isInteger(candleQuantity) ||
    !isValidNonNegativeNumber(fragrancePercent)
  ) {
    hideResults();
    setMessage(
      "Preencha todos os campos corretamente. A quantidade deve ser inteira e os valores não podem ser negativos.",
      "error"
    );
    return;
  }

  const perCandle = calculateMaterials(candleSize, fragrancePercent);
  const totalWax = perCandle.wax * candleQuantity;
  const totalFragrance = perCandle.fragrance * candleQuantity;
  const totalProduction = candleSize * candleQuantity;

  outputFields.waxPerCandle.textContent = formatGrams(perCandle.wax);
  outputFields.fragrancePerCandle.textContent = formatGrams(perCandle.fragrance);
  outputFields.totalWax.textContent = formatGrams(totalWax);
  outputFields.totalFragrance.textContent = formatGrams(totalFragrance);
  outputFields.totalProduction.textContent = formatGrams(totalProduction);

  setMessage("Cálculo concluído com sucesso.", "success");
  showResults();
});
