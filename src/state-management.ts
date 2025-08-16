import { TextChannel, Channel, User } from "discord.js";
import * as crypto from "node:crypto";

import { Player, Group } from "./player";
import { Controller } from "./controller";
import { helper } from "./newchannel";

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
  gameControllers: Map<string, Controller> = new  Map();  // maps channel id to controller
  channels: Map<string, Channel> = new Map(); // map channel id to channels

  constructor() {
  }

  public async newGame(adminPlayer: User, interaction) {
    // Creates a new controller and game.
    var game = new Game(adminPlayer);
    this.activeGame = game;
    this.games.push(game);
    interaction.channel.send(`Created new game ${game.gameID}`);
    var channel: TextChannel = await helper(interaction.channel, interaction.guild);
    try {
      let controller = new Controller(adminPlayer, channel, game);
      this.gameControllers[channel.id] = controller;
      this.channels[channel.id] = channel;
      // by default adds the adminPlayer to the game
      controller.addUser(adminPlayer);
    } catch (error) {
      console.log(error);
    }   
  }

  getGameFromID(id: string): Game {
    var filteredGames: Game[] = this.games.filter((g) => {
      return g.gameID == id;
    })
    if (filteredGames.length != 1) {
      throw new Error("Game ID not found");
    }
    return filteredGames[0];
  }

  getControllerFromChannelId(channelId: string): Controller {
    return this.gameControllers[this.channels[channelId]]; 
  }
}

export class Game {
  private playerList: Player[] = [];
  private userList: User[] = [];
  public gameID: string;
  private currentState: GameState = GameState.Pregame;
  private adminPlayer: User[] = [];
  private groups: Map<Group, number>;
  private numPlayers: number = 0;

  constructor(adminPlayer: User) {
    this.gameID = crypto.randomBytes(6).toString("hex");
    this.adminPlayer.push(adminPlayer);
  }

  public getUserList(): User[] {
    var users: User[] = [];
    this.playerList.forEach((player) => {
      users.push(player.getUserId());
    });
    return users;
  }

  public addUser(user: User) {
    if (!this.userList.includes(user)) {
      this.userList.push(user);
      return;
    }
    throw new Error("User already in list");
  }

  public removeUser(user: User) {
    if (this.userList.includes(user)){
      this.userList = this.userList.filter((item) => {return item != user})
    }
    throw new Error("User not in list");
  }


  public addPlayer(player: User) {
    if (!this.userList.includes(player)) {
      var newPlayer = new Player(this.gameID, player)
      this.playerList.push(newPlayer);
      return;
    }
    throw new Error("Player already in list");
  }

  public removePlayer(player: User) {
    console.log(player);
    if (this.userList.includes(player)) {
      this.playerList = this.playerList.filter((item) => { return item.getUserId() != player });
      return;
    }
    console.log(this.userList);
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
