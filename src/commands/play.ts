import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Replies with stuff!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("If only Amy gave us admin privileges ;_;");
}