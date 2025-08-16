import { Keyv } from "keyv";
import { User } from "discord.js";

export function initialise_state(): Keyv {
  const toReturn = new Keyv();
  var players: User[] = [];
  toReturn.set("playerList", players);
  return toReturn;
}
