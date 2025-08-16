import { User } from "discord.js";
import * as crypto from "node:crypto";

export class GameManagement {
  games: Game[];
  activeGame: Game | null;

  constructor() {
    this.activeGame = new Game();
  }
}

export class Game {
  playerList: User[]; // temp will be replaced with amy's player list
  gameID: string;

  constructor() {
    this.playerList = [];
    this.gameID = crypto.randomBytes(6).toString("hex");
  }

  addPlayer(player: User) {
    if (!this.playerList.includes(player)) {
      this.playerList.push(player);
      return;
    }
    throw new Error("Player already in list");
  }
  removePlayer(player: User) {
    if (this.playerList.includes(player)) {
      this.playerList = this.playerList.filter((item) => { return item != player });
      return;
    }
    throw new Error("Player not in list");
  }
}
