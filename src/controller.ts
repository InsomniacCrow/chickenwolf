import { Game, GameState } from "./state-management";
import { Channel, channelLink, CommandInteraction, TextChannel, User } from "discord.js";
import { Group, Player } from "./player";

/*
The Controller
*/
export class Controller {
  private game: Game;
  private game_id: string;
  private admin: User;
  private num_players: number;
  private channel: Channel;
  private groupChannels: Map<Group, Channel>;

  /*
  Constructs a game. By default has 5 players, 1 werewolf and 4 villagers.
  */
  public constructor(admin: User, channel: Channel, game: Game, num_players: number = 5) {
    this.admin = admin;
    this.game = game; // creates a new game
    this.game_id = game.gameID;
    this.num_players = num_players;
    this.channel = channel;
    this.groupChannels = new Map();
  }

  public getGameId(): string {
    return this.game_id;
  }

  public getChannel(): Channel {
    return this.channel;
  }

  public async addUser(user: User) {
    try {
      this.game.addUser(user); 
    } catch (error) {
      throw new Error(error.message);
    }
    this.addUserToChannel(user);
  }

  public async removeUser(user: User) {
    try {
      this.game.removeUser(user);
    } catch (error) {
      throw new Error(error.message);
    }
    this.addUserToChannel(user, false);
  }

  async addUserToChannel(user: User, sendMessage: boolean = true) {
    console.log("IS this even working...");
    console.log((this.channel as TextChannel).permissionOverwrites);
    (this.channel as TextChannel).permissionOverwrites
      .edit(user, {SendMessages: sendMessage, ViewChannel: sendMessage})
      .catch(console.error);
  }

  /* Starts a game loop!
  Trys to start a game loop. If there's enough people, begin the game.
  While the game has not ended, repeatedly call the game loop.
  */
  public async startGame(interaction: CommandInteraction) {
    if (interaction.user != this.admin) {
      (this.channel as TextChannel).send("You cannot start the game because you're not the game initialiser.");
      return;
    }
    // prints starting message
    if (this.game.getUserList().length < this.num_players) {
      (this.channel as TextChannel).send("Cannot start the game: Not enough participants.");
    } else if (this.game.getUserList().length > this.num_players){
      (this.channel as TextChannel).send("I don't know how you got here but you gotta kick someone, sorry bug.");
    } else {
      (this.channel as TextChannel).send("Game is starting!")
    }
    
    while (true){
      this.gameLoop();
      let winner = await this.getWinner();
      if (winner != null){
        this.announceWinner(winner);
        break;
      }
    }

    //TODO: Tidy up and delete game channel after a short period.
  }

  /*
  Gets winner
  */
  async getWinner(){
    // TODO: CHANGE THOS!!!
    return new Group(this.game_id, false, "gsagfdsafsadfsdafsadfasdflkjsdafhj;adsfjasdklf") 
  }

  /*
  Announces winner
  Also reveal everyone's role
  */
  async announceWinner(group: Group) {
    // do something
  }

  /*
  A single round of game. 
  IF there is a winning group, returns the winning group. Otherwise, return null.
  */
  public async gameLoop() {
    var result = await this.nightCycle();
  }

  /*
  A night cycle that runs through the action of each group and announces player deaths by the end of the night.
  */
  public async nightCycle() {

  }

  public async dayCycle() {

  }

  /*
  Cannot for the live of me figure out how to make group dm
  */
  public async groupDm(group: Group) {
    group.getPlayers().forEach(player => {
      player.getUserId()
    });
  }

  public getGame(): Game {
    return this.game;
  }
}
