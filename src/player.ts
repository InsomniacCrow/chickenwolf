enum GroupProperties {
  CanVote = 1,
  CanKill,
  CanSheild,
}

class Group {
  private game_id: number;
  private players: Player[];
  private properties: string[];

  public constructor(game_id: number) {
    this.game_id = game_id;
    this.players = this.players;
    this.properties = this.properties;
  }

  public getGameId(): number{
    return this.game_id;
  }

}

/*
 *  Basic player class
 */
class Player {
  private game_id: number; // id of the game player belongs to
  private user_id: number; 
  private groups: Group[];

  public constructor(game_id: number, user_id: number) {
    this.game_id = game_id
    this.user_id = user_id;
    this.groups = []; // starts with empty group id.
  }

  public getUserId(): number {
    return this.user_id;
  }

  public getGameId(): number {
    return this.game_id;
  }

  public addToGroup(group: Group): void {
    this.groups.push(group);
  }

  public getGroups(): Group[] {
    return this.groups;
  }
}
