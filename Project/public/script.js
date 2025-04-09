const playerBoard = document.getElementById('playerBoard');
const serverBoard = document.getElementById('serverBoard');
const output = document.getElementById('output');
const api = '/battleship';
// Auto-reset on page load so new game always works
fetch(`${api}/reset`);
let gameActive = false;
let cycle = 0;

function renderBoard(board, clickHandler) {
  board.innerHTML = '';
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      if (clickHandler) {
        cell.onclick = () => clickHandler(x, y, cell);
      }
      board.appendChild(cell);
    }
  }
}

function formatFleet(fleet) {
  const names = ['Destroyer (2)', 'Cruiser/Sub (3)', 'Battleship (4)', 'Carrier (5)'];
  return fleet
    .map((f, i) => `${names[i]}: ${f[1]} of ${f[0]} afloat`)
    .join('<br>');
}

function log(message) {
  const time = new Date().toLocaleTimeString();
  output.innerHTML = `[${time}] ${message}<br>` + output.innerHTML;
}

async function startGame() {
  const res = await fetch(`${api}/new?grid=[10,10]&fleet=[[1,1],[2,2],[1,1],[1,1]]`);
  const data = await res.json();
  if (data.status === 'started') {
    gameActive = true;
    cycle = 0;
    renderBoard(playerBoard, makeGuess);
    renderBoard(serverBoard);
    output.innerHTML = '';
    log(`Game started. You go first.`);
  } else {
    log(`⚠️ Could not start game: ${data.status}`);
  }
}

async function makeGuess(x, y, cell) {
  if (!gameActive) return alert("Start the game first.");

  if (
    cell.classList.contains('hit') ||
    cell.classList.contains('sunk') ||
    cell.classList.contains('miss')
  ) {
    log(`⚠️ You already guessed (${x},${y}).`);
    return;
  }

  const res = await fetch(`${api}/lob?grid=[${x},${y}]`);
  const data = await res.json();
  cycle = data.cycle || cycle + 1;

  if (data.status === 'reject') {
    log(`⚠️ Guess rejected. Try again.`);
    return;
  }

  const result = data.status.toUpperCase();
  const resultColor = result === 'MISS' ? 'miss' : 'hit';
  cell.classList.add(resultColor);

  const serverX = data.grid?.[0];
  const serverY = data.grid?.[1];
  const serverIndex = serverY * 10 + serverX;
  const serverCell = serverBoard.children[serverIndex];
  if (serverCell) {
    serverCell.classList.add('server-guess');
  }

  let statusLine = `🟡 Cycle ${cycle}: You guessed (${x},${y}) — Result: ${result}`;
  if (data.shipType) {
    statusLine += `<br>🚢 You sunk the server's ${data.shipType}!`;
  }

  if (serverX != null && serverY != null) {
    statusLine += `<br>🔴 Server guessed (${serverX},${serverY})`;
  }

  if (data.status === 'concede') {
    statusLine += `<br>🏆 ${data.message || "You win!"}`;
    gameActive = false;
  }

  log(statusLine);
}

async function reportHit() {
  const res = await fetch(`${api}/hit`);
  const data = await res.json();

  if (data.status === 'ok') {
    log(`✔️ Server's guess was a HIT.`);
  } else if (data.status === 'ended') {
    log(`💀 ${data.message || "Server wins!"}`);
    gameActive = false;
  } else {
    log(`⚠️ Cannot report hit now.`);
  }
}

async function reportMiss() {
  const res = await fetch(`${api}/miss`);
  const data = await res.json();
  if (data.status === 'ok') {
    log(`❌ Server's guess was a MISS.`);
  } else {
    log(`⚠️ Cannot report miss now.`);
  }
}

async function cancelGame() {
  const res = await fetch(`${api}/cancel`);
  const data = await res.json();
  log(`❌ Game cancelled.`);
  gameActive = false;
}

async function concedeGame() {
  const res = await fetch(`${api}/concede`);
  const data = await res.json();
  log(`🫡 You conceded. Server wins.`);
  gameActive = false;
}

async function getStatus() {
  const res = await fetch(`${api}/status`);
  const data = await res.json();
  if (data.status === 'in progress') {
    log(`
🔄 Game Status:
Cycle: ${data.cycle}
Duration: ${(data.duration / 1000).toFixed(1)} seconds
🛳️ Server Fleet:<br>${formatFleet(data.myfleet)}
🚢 Your Fleet:<br>${formatFleet(data.yourfleet)}
    `);
  } else {
    log(`⚠️ No game in progress.`);
  }
}

window.onbeforeunload = () => {
  navigator.sendBeacon(`${api}/reset`);
};
