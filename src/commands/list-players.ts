import { CommandInteraction, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { GameManagement } from "../state-management";
import * as constants from "../string-constants";
import { Controller } from "../controller";

export const data = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("list all players");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  await interaction.reply("Current Games:")
  if (state.controllers.length == 0) {
    return (interaction.channel as TextChannel).send("No active game at the moment.")
    // return interaction.followUp("No players so far, maybe use '/addself'?");
  }
  for (let index = 0; index < state.controllers.length; index++) {
    const element = state.controllers[index];
    const userListString = element.getGame().getUserList().map((user) => {
      return `${user.displayName}`
    });
    (interaction.channel as TextChannel).send(`Players of game ${element.getGameId()}: ${userListString}`)
  }
}
