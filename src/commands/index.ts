import * as play from "./play";
import * as newchannel from "./newchannel";
import * as help from "./help";
import * as listplayers from "./list-players";
import * as addself from "./add-self";
import * as removeself from "./remove-self";
import * as startgame from "./start-game";

export const commands = {
  play,
  help,
  listplayers,
  addself,
  removeself,
  newchannel, // deprecated
  startgame
};
