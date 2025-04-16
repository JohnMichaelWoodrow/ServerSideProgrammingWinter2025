const { randomInt } = require('crypto');

class BattleshipGame {
  constructor() {
    this.active = false;
  }

  startGame(grid, fleet) {
    if (this.active) return { status: 'reject' };

    this.gridSize = grid;
    this.userFleet = JSON.parse(JSON.stringify(fleet));
    this.serverFleet = JSON.parse(JSON.stringify(fleet));
    this.userHits = [];
    this.serverHits = [];
    this.serverBoard = Array.from({ length: grid[1] }, () => Array(grid[0]).fill(null));
    this.serverShips = [];
    this.cycle = 0;
    this.startTime = Date.now();
    this.active = true;
    this.playerHits = 0;
    this.maxPlayerHP = 17; // 2+3+3+4+5 from user fleet

    // Place ships randomly on server board
    for (let i = 0; i < fleet.length; i++) {
      const [count] = fleet[i];
      const size = i + 2;
      for (let j = 0; j < count; j++) {
        this.placeShip(size, i);
      }
    }

    return {
      status: 'started',
      message: 'New game. You start',
      cycle: this.cycle,
      time: Date.now()
    };
  }

  placeShip(size, fleetIndex) {
    let placed = false;

    while (!placed) {
      const dir = Math.random() < 0.5 ? 'H' : 'V';
      const maxX = dir === 'H' ? this.gridSize[0] - size : this.gridSize[0] - 1;
      const maxY = dir === 'V' ? this.gridSize[1] - size : this.gridSize[1] - 1;
      const x = randomInt(maxX + 1);
      const y = randomInt(maxY + 1);

      let valid = true;
      const positions = [];

      for (let i = 0; i < size; i++) {
        const xi = dir === 'H' ? x + i : x;
        const yi = dir === 'V' ? y + i : y;
        if (this.serverBoard[yi][xi] !== null) {
          valid = false;
          break;
        }
        positions.push([xi, yi]);
      }

      if (valid) {
        const ship = {
          id: this.serverShips.length,
          fleetIndex,
          size,
          hits: [],
          positions
        };
        this.serverShips.push(ship);
        for (const [xi, yi] of positions) {
          this.serverBoard[yi][xi] = ship.id;
        }
        placed = true;
      }
    }
  }

  lob([x, y]) {
    if (!this.active) return { status: 'reject', time: Date.now() };

    this.cycle++;

    const tile = this.serverBoard[y]?.[x];
    const serverGuess = [
      randomInt(this.gridSize[0]),
      randomInt(this.gridSize[1])
    ];
    this.lastServerGuess = serverGuess;

    if (tile !== null && tile !== undefined) {
      const ship = this.serverShips[tile];
      const alreadyHit = ship.hits.some(([hx, hy]) => hx === x && hy === y);

      if (!alreadyHit) {
        ship.hits.push([x, y]);

        const isSunk = ship.hits.length === ship.size;
        if (isSunk) {
          this.serverFleet[ship.fleetIndex][1]--;

          if (this.serverFleet.every(([_, afloat]) => afloat === 0)) {
            this.active = false;
            return {
              status: 'concede',
              message: 'You win',
              grid: serverGuess,
              cycle: this.cycle,
              duration: Date.now() - this.startTime,
              myfleet: this.serverFleet,
              yourfleet: this.userFleet,
              time: Date.now()
            };
          }

          return {
            status: 'sunk',
            shipType: ['Destroyer', 'Submarine', 'Battleship', 'Carrier'][ship.fleetIndex],
            grid: serverGuess,
            cycle: this.cycle,
            time: Date.now()
          };
        }

        return {
          status: 'hit',
          grid: serverGuess,
          cycle: this.cycle,
          time: Date.now()
        };
      }
    }

    return {
      status: 'miss',
      grid: serverGuess,
      cycle: this.cycle,
      time: Date.now()
    };
  }

  reportHit() {
    if (!this.active || !this.lastServerGuess)
      return { status: 'reject', message: 'Unexpected', time: Date.now() };

    this.serverHits.push(this.lastServerGuess);
    this.lastServerGuess = null;

    this.playerHits++;
    if (this.playerHits >= this.maxPlayerHP) {
      this.active = false;
      return {
        status: 'ended',
        message: 'Server has sunk all your ships. I win!',
        cycle: this.cycle,
        duration: Date.now() - this.startTime,
        myfleet: this.serverFleet,
        yourfleet: this.userFleet,
        time: Date.now()
      };
    }

    return { status: 'ok' };
  }

  reportMiss() {
    if (!this.active || !this.lastServerGuess)
      return { status: 'reject', message: 'Unexpected', time: Date.now() };

    this.lastServerGuess = null;
    return { status: 'ok' };
  }

  concede() {
    if (!this.active) return { status: 'reject', time: Date.now() };
    this.active = false;

    return {
      status: 'ended',
      message: 'I win. Thank you for playing.',
      cycle: this.cycle,
      duration: Date.now() - this.startTime,
      myfleet: this.serverFleet,
      yourfleet: this.userFleet,
      time: Date.now()
    };
  }

  cancel() {
    if (!this.active) return { status: 'reject', time: Date.now() };
    this.active = false;

    return {
      status: 'ended',
      message: 'Game over. Thank you for playing',
      cycle: this.cycle,
      duration: Date.now() - this.startTime,
      myfleet: this.serverFleet,
      yourfleet: this.userFleet,
      time: Date.now()
    };
  }

  status() {
    if (!this.active) return { status: 'reject', time: Date.now() };

    return {
      status: 'in progress',
      cycle: this.cycle,
      duration: Date.now() - this.startTime,
      myfleet: this.serverFleet,
      yourfleet: this.userFleet,
      time: Date.now()
    };
  }
}

module.exports = new BattleshipGame();
