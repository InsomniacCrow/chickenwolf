import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { GameManagement } from "../state-management";
import * as constants from "../string-constants";
import { stat } from "node:fs";

export const data = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("list all players");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  if (state.activeGame === null) {
    return interaction.reply(constants.noActiveGame);
  }
  await interaction.reply(`Players: ${state.activeGame.playerList}`);
}
