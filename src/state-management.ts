import { User } from "discord.js";
import * as crypto from "node:crypto";

import { Player, Group } from "./player";

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
  private groups: Map<Group, number>;
  private numPlayers: number = 0;

  constructor(adminPlayer: User) {
    this.gameID = crypto.randomBytes(6).toString("hex");
    this.adminPlayer.push(adminPlayer);
  }

  public userList(): User[] {
    var users: User[] = [];
    this.playerList.forEach((player) => {
      users.push(player.getUserId());
    });
    return users;
  }


  public addPlayer(player: User) {
    if (!this.userList().includes(player)) {
      var newPlayer = new Player(this.gameID, player)
      this.playerList.push(newPlayer);
      return;
    }
    throw new Error("Player already in list");
  }

  public removePlayer(player: User) {
    if (this.userList().includes(player)) {
      this.playerList = this.playerList.filter((item) => { return item.getUserId() != player });
      return;
    }
    throw new Error("Player not in list");
  }
  public getPlayerList(): Player[] {
    return this.playerList;
  }
  public userToPlayer(user: User): Player {
    var player: (Player | null) = null;
    this.playerList.forEach((indiv) => {
      if (indiv.getUserId() == user) {
        player = indiv;
      }
    });
    if (player) {
      return player;
    }
    throw new Error("User not found as player");
  }

  public initialiseGroups(partitions: Map<Group, number>) {
    this.groups = partitions;
  }

  public killPlayer(victim: Player) {
    if (this.playerList.includes(victim)) {
      victim = this.playerList.find((player) => { player == victim }) as Player;
      victim.setAlive(false);
      // REMOVE LIVING GROUP?
      return;
    }
    throw new Error("Player not in list");
  }
}
