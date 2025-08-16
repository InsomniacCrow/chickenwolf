class Player {
  private user_id: number;
  private group_ids: number[];

  public constructor(user_id: number) {
    this.user_id = user_id;
  }

  public getUserId(): number {
    return this.user_id;
  }
}