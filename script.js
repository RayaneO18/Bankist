"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKER APP

// Data
const account1 = {
  owner: "Hedi Rivas",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ""; //selectionner un txt html

  // const move =

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal"; // dire si il gagne ou perds de l argent

    const html = `<div class="movements__row"> 
      <div class= "movements__type movements__type--${type}"> ${
      //reprise du code html en adaptant le type
      i + 1
    } ${type} </div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html); //mettre 'afterbegin' pour que ca se fait apres
  });
};

//creer user d un utilisateur
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase() //mettre tout les strings en minuscule
      .split(" ") // creer un tableau qui espace le prenom et nom
      .map((name) => name[0]) // prend l'index 0 du nom et prenom
      .join(""); //rassemble les deux tableaux qui donne les initiales
  });
};
console.log(accounts);
createUsername(accounts);

//calculer movements
const calcDisplayBalance = function (movements) {
  currentAccount.balance = movements.reduce((a, b) => a + b, 0); //le zero est la valeur initial
  labelBalance.textContent = `${currentAccount.balance} €`;
};

//method filter permet de recuperer les valeurs d un tableaux si ils sont positive ou negative, in et out of the site

const calcDisplaySummary = function (movements) {
  const incomes = movements.filter((mov) => mov > 0).reduce((a, b) => a + b, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((inte) => {
      return inte >= 1;
    })

    .reduce((a, b) => a + b, 0);
  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;

// quand on se log

btnLogin.addEventListener("click", (e) => {
  e.preventDefault(); //permet de bloquer l apparaition de la page
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = "";
    inputLoginPin.value = "";

    updateUI(currentAccount);
  }
});
//transfer money
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault(); //permet de bloquer l apparaition de la page
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

//delete an account (cloturer un compte)

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const requestedAmount = currentAccount.movements.some(
    (mov) => mov >= loanAmount * 0.1
  );
  if (loanAmount > 0 && requestedAmount) {
    //add movement
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    console.log(loanAmount);
  }
  inputLoanAmount.value = "";
});

const updateUI = function (acc) {
  displayMovements(acc.movements);

  calcDisplayBalance(acc.movements);

  calcDisplaySummary(acc.movements);
};
