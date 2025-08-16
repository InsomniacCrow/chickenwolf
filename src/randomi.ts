import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Group, Player } from "./player"

// type  = {
//   guildId: string;
// };

const ROLE_NUM = 1;

// oops it deleted itself
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function randomise(userList: Array<User>, roleNumbers: Map<Group, number>): Array<Player> {
  /**
   * Assigns roles from list of players.
   * Will also affect players array in Groups class given in roleNumbers.
   */
  const players: Array<Player> = [];
  if (!userList || !roleNumbers || userList.length != (roleNumbers.entries().reduce((acc: Group, current: number) => {acc + current[ROLE_NUM]}, 0))) {
    console.error("Player Number and Role Number mismatch/D.N.E");

  } else {
    shuffle(userList);
    if (!userList) {
      console.error("f you, it's not undefined i swearrrr");
    }
    roleNumbers.forEach((num, roleGroup) => {
      for (let i = 0; i < num; i++) {
        // I checked for undefined above, so I don't know why ? is there
        const newPlayer = new Player(roleGroup.getGameId(), userList.pop() as User);
        newPlayer.addToGroup(roleGroup);
        roleGroup.addPlayer(newPlayer);
        players.push(newPlayer);
      }
    })
  }
  return players;
}