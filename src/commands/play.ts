import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Keyv from "keyv";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Replies with stuff! Woah");

export async function execute(interaction: CommandInteraction, state: (GameManagement | null) = null) {
  await interaction.reply("ashahshah")
}
