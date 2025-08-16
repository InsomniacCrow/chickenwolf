import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Tells you how to use it!");

export async function execute(interaction: CommandInteraction, state: (GameManagement | null) = null) {
  return interaction.reply("ahsdfkjlhsdf");
}
