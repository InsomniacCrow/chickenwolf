import { CommandInteraction, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { GameManagement } from "../state-management";
import * as constants from "../string-constants";
import { Controller } from "../controller";

export const data = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("list all players");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  if (state.controllers.length == 0) {
    return (interaction.channel as TextChannel).send("No active game at the moment.")
    // return interaction.followUp("No players so far, maybe use '/addself'?");
  }
  await interaction.reply("Current Games:")
  for (let index = 0; index < state.controllers.length; index++) {
    const element = state.controllers[index];
    var userListString: string = "";
    element.getGame().getUserList().forEach((user: User) => {
      userListString += `${user.displayName}, `;
      userListString += '\n';
    });
    if (userListString.length == 0) {
      interaction.followUp(`Game ${element.getGameId()} has no players`);
      continue;
    }
    userListString = userListString.slice(0, -3);
    interaction.followUp(`Players of game ${element.getGameId()}: ${userListString}`)
  }
}
