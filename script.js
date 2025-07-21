const players = [
  { id: 1, name: "Saka", position: "Midfielder", price: 12, team: "Arsenal", points: 0 },
  { id: 2, name: "Haaland", position: "Forward", price: 14, team: "Man City", points: 0 },
  { id: 3, name: "Rashford", position: "Midfielder", price: 10, team: "Man Utd", points: 0 },
  { id: 4, name: "Lenny", position: "Defender", price: 9, team: "Liverpool", points: 0 },
  { id: 5, name: "Alisson", position: "Goalkeeper", price: 8, team: "Liverpool", points: 0 },
  { id: 6, name: "Son", position: "Midfielder", price: 11, team: "Spurs", points: 0 },
  { id: 7, name: "Kane", position: "Forward", price: 13, team: "Spurs", points: 0 },
  { id: 8, name: "De Bruyne", position: "Midfielder", price: 12, team: "Man City", points: 0 },
];

let userTeam = [];
let budget = 100;

const playerList = document.getElementById("player-list");
const teamList = document.getElementById("team");
const budgetValue = document.getElementById("budgetValue");

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach(player => {
    const card = document.createElement("div");
    card.classList.add("player-card");
    card.innerHTML = `
      <strong>${player.name}</strong><br>
      Position: ${player.position}<br>
      Team: ${player.team}<br>
      Price: £${player.price}m<br>
      Points: ${player.points}<br>
      <button onclick="addToTeam(${player.id})">Add to Team</button>
    `;
    playerList.appendChild(card);
  });
}

function renderTeam() {
  teamList.innerHTML = "";
  userTeam.forEach(player => {
    const li = document.createElement("li");
    li.classList.add("player-card");
    li.innerHTML = `
      ${player.name} (${player.position}) - £${player.price}m - ${player.points} pts
      <button onclick="removeFromTeam(${player.id})">Remove</button>
    `;
    teamList.appendChild(li);
  });
}

function addToTeam(id) {
  const player = players.find(p => p.id === id);
  if (userTeam.includes(player)) {
    alert("Player already in team!");
    return;
  }
  if (budget < player.price) {
    alert("Not enough budget!");
    return;
  }
  userTeam.push(player);
  budget -= player.price;
  updateUI();
  saveGame();
}

function removeFromTeam(id) {
  const index = userTeam.findIndex(p => p.id === id);
  if (index !== -1) {
    budget += userTeam[index].price;
    userTeam.splice(index, 1);
    updateUI();
    saveGame();
  }
}

function addFunds() {
  const input = document.getElementById("addMoneyInput");
  const amount = parseFloat(input.value);
  if (!isNaN(amount) && amount > 0) {
    budget += amount;
    input.value = "";
    updateUI();
    saveGame();
  } else {
    alert("Enter a valid amount");
  }
}

function getUniqueTeams() {
  const teams = new Set();
  players.forEach(p => teams.add(p.team));
  return [...teams];
}

function populateTeamDropdowns() {
  const team1 = document.getElementById("team1Select");
  const team2 = document.getElementById("team2Select");

  const teams = getUniqueTeams();

  team1.innerHTML = "";
  team2.innerHTML = "";

  teams.forEach(team => {
    const opt1 = document.createElement("option");
    opt1.value = team;
    opt1.textContent = team;
    team1.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = team;
    opt2.textContent = team;
    team2.appendChild(opt2);
  });
}

function simulateMatch() {
  const team1 = document.getElementById("team1Select").value;
  const team2 = document.getElementById("team2Select").value;

  if (team1 === team2) {
    alert("Select two different teams!");
    return;
  }

  const winner = Math.random() < 0.5 ? team1 : team2;
  const loser = winner === team1 ? team2 : team1;

  players.forEach(p => {
    if (p.team === winner) {
      p.points += 5;
    } else if (p.team === loser) {
      p.points -= 2;
    }
  });

  alert(`${winner} wins! Players updated.`);
  updateUI();
  saveGame();
}

// 💾 LocalStorage Logic
function saveGame() {
  localStorage.setItem("userTeam", JSON.stringify(userTeam));
  localStorage.setItem("budget", budget.toString());
}

function loadGame() {
  const savedTeam = localStorage.getItem("userTeam");
  const savedBudget = localStorage.getItem("budget");

  if (savedTeam && savedBudget) {
    const parsedTeam = JSON.parse(savedTeam);
    userTeam = parsedTeam.map(savedPlayer => {
      const fullPlayer = players.find(p => p.id === savedPlayer.id);
      return { ...fullPlayer, ...savedPlayer };
    });
    budget = parseFloat(savedBudget);
  }
}

function resetGame() {
  if (confirm("Are you sure you want to reset your game?")) {
    localStorage.clear();
    userTeam = [];
    budget = 100;
    updateUI();
  }
}

function updateUI() {
  renderPlayers();
  renderTeam();
  populateTeamDropdowns();
  budgetValue.innerText = budget.toFixed(2);
}

// 🚀 Start
loadGame();
updateUI();
