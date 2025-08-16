import { CommandInteraction, SlashCommandBuilder, Guild } from "discord.js";

import { helper } from "../newchannel";

export const data = new SlashCommandBuilder()
  .setName("newchannel")
  .setDescription("Ts command creates a text channel");


export async function execute(interaction: CommandInteraction) {
  return await helper(interaction, interaction.guild as Guild);
  //await interaction.reply("Fetched all input and working on your request!");
}
