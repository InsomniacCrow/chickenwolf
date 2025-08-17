import { Game, GameState } from "./state-management";
import { Channel, channelLink, CommandInteraction, Guild, TextChannel, User } from "discord.js";
import { Group, Player } from "./player";
import { randomise } from "./randomi";
import { delay, makeNewChannel, mutePlayers, playerToUsers } from "./newchannel";
import { werewolf } from "./string-constants";
import { channel } from "node:diagnostics_channel";

/*
The Controller
*/
export class Controller {
  private ongoing: boolean;
  private game: Game;
  private game_id: string;
  private admin: User;
  private num_players: number;
  private channel: Channel;
  private guild: Guild;
  private groupChannels: Map<Group, Channel>;
  private players: Player[];

  /*
  Constructs a game. By default has 5 players, 1 werewolf and 4 villagers.
  */
  public constructor(admin: User, guild: Guild, channel: Channel, game: Game, num_players: number = 2) {
    this.admin = admin;
    this.game = game; // creates a new game
    this.game_id = game.gameID;
    this.num_players = num_players;
    this.channel = channel;
    this.guild = guild;
    this.groupChannels = new Map();
    this.ongoing = false; // Is the game running right now?
  }

  /*
  This is hardcoded for now, but in the future we hope to create custom classes etc.
  */
  createGroupPartition(): Map<Group, number> {
    var map = new Map()
    map.set(new Group(this.game_id, "Villager"), 1);
    const werewolves = new Group(this.game_id, "Werewolves", true);
    werewolves.addProperties("action", "kill");
    werewolves.addProperties("vote", true);
    map.set(werewolves, 1);
    return map;
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
    (this.channel as TextChannel).permissionOverwrites
      .edit(user, { SendMessages: sendMessage, ViewChannel: sendMessage })
      .catch(console.error);
  }

  waitingTime = 3000;

  /* Starts a game loop!
  Trys to start a game loop. If there's enough people, begin the game.
  While the game has not ended, repeatedly call the game loop.
  */
  public async startGame(interaction: CommandInteraction) {
    if (this.ongoing) {
      (this.channel as TextChannel).send("Nuh-uh game had already started you cannot start a game inside a started game, did I said games' started?");
      return;
    }
    if (interaction.user != this.admin) {
      (this.channel as TextChannel).send("You cannot start the game because you're not the game initialiser.");
      return;
    }
    // prints starting message
    if (this.game.getUserList().length < this.num_players) {
      (this.channel as TextChannel).send("Cannot start the game: Not enough participants.");
      return;
    } else if (this.game.getUserList().length > this.num_players) {
      (this.channel as TextChannel).send("I don't know how you got here but you gotta kick someone, sorry bug.");
      return;
    } else {
      (this.channel as TextChannel).send("Game is starting!")
      this.ongoing = true;
    }

    // Initialises players and groups.
    const roleNumbers = this.createGroupPartition();
    randomise(this.game.getUserList(), roleNumbers).forEach(element => {
      this.game.addPlayer(element);
    });
    roleNumbers.forEach(async (_, key) => {
      if (key.acts_in_night) {
        let users = key.getPlayers().map(p => p.getUserId())
        const pings = users.map((user) => {
          return `<@${user.id}>`
        });
        var channel = await makeNewChannel(this.channel as TextChannel, this.guild, `${key.getProperties().get("name")}: ${this.game_id}`, true, users);
        this.groupChannels.set(key, channel);
        await (channel as TextChannel).send(`Hello ${pings}, you are all ${key.getProperties().get("name")}, here's your rubber room of rats :)`);
      }
    });
    
    await (this.channel as TextChannel).send(`Gaming is starting in ${this.waitingTime/1000} seconds :3`);
    await delay(this.waitingTime); // Make this constants sometime
    
    // commentted out temporarily so I won't send too many request to discord
    (this.channel as TextChannel).send("Game starting.");
    var counter: number = 1;
    while (true){
      await this.gameLoop(counter);
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
  async getWinner() {
    // TODO: CHANGE THOS!!!
    return new Group(this.game_id, "gsagfdsafsadfsdafsadfasdflkjsdafhj;adsfjasdklf") 
    // return null;
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
  Takes in the current round number
  */

  groupTime = 20000; // 20 seconds to discuss
  voteTime  = 10000; // 10 seconds to vote
  dayTime   = 60000; // 1 minute to discuss in day

  public async gameLoop(counter: number) {
    (this.channel as TextChannel).send(`Night ${counter}. Now everyone shutuup.`)
    await mutePlayers(this.channel, this.game.getPlayerList());
    var nightResult = await this.nightCycle();
    (this.channel as TextChannel).send(nightResult);
    if (this.getWinner() != null) {
      return;
    }
    (this.channel as TextChannel).send(`Day ${counter}. Now everyone yap.`);
    await mutePlayers(this.channel, this.game.getPlayerList(), true);
    await delay(this.dayTime - 5000);
    await (this.channel as TextChannel).send("5 seconds left");
    await delay(5000);
    var dayResult = await this.dayCycle();
    (this.channel as TextChannel).send(dayResult);
  }

  /*
  A night cycle that runs through the action of each group and announces player deaths by the end of the night.
  Return a string as the annoucement to give at the end of the night.
  */
  public async nightCycle(): Promise<string> {
    var a: [Group, Channel][] = Array.from(this.groupChannels);
    var result: string[] = [];
    await Promise.all(a.map((async (groupNChannel) => {
      let group = groupNChannel[0];
      let groupChannel = groupNChannel[1];
      if (group.acts_in_night) {
        await mutePlayers(groupChannel, group.getPlayers(), true); // unmutes the players
        console.log("Is it stuck in a loop...")
        const pings = playerToUsers(group.getPlayers()).map((user) => {
          return `<@${user.id}>`
        });
        await (groupChannel as TextChannel).send(`${pings} you guys can do shit now, talk.`);
        await (delay(this.groupTime));
        await (groupChannel as TextChannel).send(`now shut up >:(`); 
        await mutePlayers(groupChannel, group.getPlayers()); // mutes them.
      }
      if (group.getProperties().get("vote") == true) {
        switch (group.getProperties().get("action")) {
          case "kill":    
            // get vote result
            // kill and mute the dead  >:)
            result.push(` ________ was killed last night`);
            break;
        
          default:
            break;
        }
      }
    })))
   
    // Cycle through groups that acts at night.
    return result.toString(); // placeholder
  }

  public async dayCycle(): Promise<string> {

    return `fdsaf`; // placeholder
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

  public async nukeChannels() {
    await this.channel.delete();
    var gc = Array.from(this.groupChannels.values());
    gc.forEach(async (channel: Channel) => {
      await channel.delete();
    });
    console.log(`Nuked ${this.game_id}'s channels :)`);
  }
}
