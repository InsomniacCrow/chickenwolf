import { Game, GameState } from "./state-management";
import { Channel, CommandInteraction, TextChannel, User } from "discord.js";
import { Player } from "./player";

/*
The Controller
*/
export class Controller {
  private game: Game;
  private admin: User;
  private num_players: number;
  private channel: TextChannel;

  /*
  Constructs a game. By default has 5 players, 1 werewolf and 4 villagers.
  */
  public constructor(admin: User, channel: TextChannel, game: Game, num_players: number = 5){
    this.admin = admin;
    this.game = game; // creates a new game
    this.num_players = num_players;
    this.channel = channel;
  }

  public addUser(user: User) {
    this.game.addPlayer(user); // TODO: Change the name of the function in game
  }
  
  // Starts a game loop!
  public async startGame(interaction: CommandInteraction) {
    if (interaction.user != this.admin) {
    }
    // prints starting message
    this.channel.send("Game is starting!")
  }

  public nightCycle() {

  }

  public canStart() {
    if (this.game.getPlayerList().length < this.num_players) {
    }
  }
}