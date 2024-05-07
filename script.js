// Get references to DOM elements needed throughout the script
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

// Flag to track if any errors occurred during input validation
let isError = false;

// Removes unwanted characters from input strings (e.g., pluses, minuses, spaces)
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Checks for invalid input patterns, specifically scientific notation here
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;  // Matches strings like '1e10'
  return str.match(regex);
}

// Adds a new entry field set for calorie input
function addEntry() {
  // Locate the container for the selected meal type
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // Determine new entry number by counting existing input fields
  let entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  // HTML string for the new input field set
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
  `;
  // Insert the new field set into the DOM
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// Function to sum up calories from a list of input elements
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);
    if (invalidInputMatch) {
      alert(`Invalid input: ${invalidInputMatch[0]}`);
      isError = true;
      return null; // Exit if invalid input detected
    }
    // Add numeric value of currVal to total calories
    calories += Number(currVal);
  }
  return calories; // Return the total calories computed
}

// Calculate total calories and update the display
function calculateCalories(e) {
  e.preventDefault(); // Prevent default form submission behavior
  isError = false;
  
  // Get input elements for each meal type and exercise
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  // Calculate calories for each type of input
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return; // Exit if any error was found
  }

  // Compute net calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  // Update the output display
  output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr></hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>`;
  output.classList.remove('hide');
}

// Function to clear all input fields and hide the output display
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));
  for (const container of inputContainers)
