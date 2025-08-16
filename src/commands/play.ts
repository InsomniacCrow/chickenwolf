import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Replies with stuff!");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  state.newGame(interaction.user);
  await interaction.reply(`Created new game ${state.activeGame?.gameID}`);
}
