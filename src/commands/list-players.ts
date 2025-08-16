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
  if (state.activeGame.playerList.length == 0) {
    return interaction.reply("No players so far, maybe use '/addself'?");
  }
  const playerListString = state.activeGame.playerList.map((player) => {
    return `${player.getPlayerDisplayName()} `
  });

  await interaction.reply(`Players: ${playerListString}`);
}
