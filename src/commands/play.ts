import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Replies with stuff! Woah");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  state.newGame(interaction.user, interaction);
  return interaction.reply(`Creating new game...`)
}
