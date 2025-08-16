import { User } from "discord.js";

export enum GroupProperties {
  Vote = "vote",
  CanKill = "kill",
  CanSheild = "shield"
}

export class Group {
  private game_id: string;
  private players: Player[];
  private properties: Map<string, boolean|number|string>;
  public readonly acts_in_night: boolean;

  // By default the group acts in day
  public constructor(game_id: string, acts_in_night: boolean = false) {
    this.game_id = game_id;
    this.players = this.players;
    this.properties = new Map<string, boolean|number|string>();
    this.acts_in_night = acts_in_night;
  }

  public getGameId(): string {
    return this.game_id;
  }

  public getProperties(): Map<string, boolean|number|string> {
    return this.properties;
  }

  public addProperties(property: string, value: boolean|number|string) {
    this.properties.set(property, value);
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public addPlayer(player: Player) {
    this.players.push(player);
    player.addToGroup(this); // links the player
  }

}

/*
 *  Basic player class
 */
export class Player {
  private game_id: string; // id of the game player belongs to
  private user_id: User;
  private groups: Group[];
  private isAlive: boolean = true;

  public constructor(game_id: string, user_id: User) {
    this.game_id = game_id
    this.user_id = user_id;
    this.groups = []; // starts with empty group id.
  }

  public getUserId(): User {
    return this.user_id;
  }

  public getGameId(): string {
    return this.game_id;
  }

  public addToGroup(group: Group): void {
    this.groups.push(group);
  }

  public getGroups(): Group[] {
    return this.groups;
  }

  public getPlayerDisplayName(): string {
    return this.user_id.displayName as string ?? "Nameless";
  }

  public setAlive(cond: boolean) {
    this.isAlive = cond;
  }
}
