import { CommandInteraction, InteractionType, SlashCommandBuilder, User } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("addself")
  .setDescription("add self to current game");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  if (state.activeGame === null) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    state.activeGame.addPlayer(interaction.user);
    await interaction.reply(`Added ${interaction.user} Players: ${state.activeGame.playerList}`);
  } catch (error) {
    return interaction.reply("Player already in list");
  }
}
