import { User } from "discord.js";
import * as crypto from "node:crypto";
import { Player } from "./player";

export enum GameState {
  Pregame,
  Startgame,
  NightTime,
  WakeAndDiscuss,
  Vote,
  RevealVoteLoser,
  WinCheck,
  Endgame,
}

export class GameManagement {
  games: Game[] = [];
  activeGame: Game | null = null;

  constructor() {
  }

  newGame(adminPlayer: User) {
    var game = new Game(adminPlayer);
    this.activeGame = game;
    this.games.push(game);
  }
}

export class Game {
  private playerList: Player[] = [];
  public gameID: string;
  private currentState: GameState = GameState.Pregame;
  private adminPlayer: User[] = [];

  constructor(adminPlayer: User) {
    this.gameID = crypto.randomBytes(6).toString("hex");
    this.adminPlayer.push(adminPlayer);
  }

  userList(): User[] {
    var users: User[] = [];
    this.playerList.forEach((player) => {
      users.push(player.getUserId());
    });
    return users;
  }

  addPlayer(player: User) {
    if (!this.userList().includes(player)) {
      var newPlayer = new Player(this.gameID, player)
      this.playerList.push(newPlayer);
      return;
    }
    throw new Error("Player already in list");
  }
  removePlayer(player: User) {
    if (this.userList().includes(player)) {
      this.playerList = this.playerList.filter((item) => { return item.getUserId() != player });
      return;
    }
    throw new Error("Player not in list");
  }
}
