import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Keyv from "keyv";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Tells you how to use it!");

export async function execute(interaction: CommandInteraction, state: (Keyv | null) = null) {
  return interaction.reply("ahsdfkjlhsdf");
}
