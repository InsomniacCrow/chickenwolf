import { User } from "discord.js";

enum GroupProperties {
  CanVote = 1,
  CanKill,
  CanSheild
}

export class Group {
  private game_id: string;
  private players: Player[];
  private properties: number[];

  public constructor(game_id: string) {
    this.game_id = game_id;
    this.players = this.players;
    this.properties = this.properties;
  }

  public getGameId(): string {
    return this.game_id;
  }

  public getProperties(): number[] {
    return this.properties;
  }

  public addProperties(property: number) {
    this.properties.push(property);
  }

  public getPlayers(): Player[] {
    return this.players;
  }

}

/*
 *  Basic player class
 */
export class Player {
  private game_id: string; // id of the game player belongs to
  private user_id: User;
  private groups: Group[];

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
}
