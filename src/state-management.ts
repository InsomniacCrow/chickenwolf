import { User } from "discord.js";
import * as crypto from "node:crypto";

export enum GameState {
  Pregame,
  Startgame,
  ScenarioStart,
  Scenario,
  NightTime,
  WakeAndDiscuss,
  Vote,
  RevealVoteLoser,
  WinCheck,
  Endgame,
}

export class GameManagement {
  games: Game[];
  activeGame: Game | null = null;

  constructor() {
  }

  newGame(adminPlayer: User) {
    var game = new Game(adminPlayer);
    this.activeGame = game;
  }
}

export class Game {
  playerList: User[] = []; // temp will be replaced with amy's player list
  gameID: string;
  currentState: GameState = GameState.Pregame;
  adminPlayer: User[] = [];

  constructor(adminPlayer: User) {
    this.gameID = crypto.randomBytes(6).toString("hex");
    this.adminPlayer.push(adminPlayer);
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
