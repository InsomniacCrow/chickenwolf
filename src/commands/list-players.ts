import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import Keyv from "keyv";

export const data = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("list all players");

export async function execute(interaction: CommandInteraction, state: Keyv) {
  const playerList: User[] = await state.get("playerList") as User[];
  await interaction.reply(`Players: ${JSON.stringify(playerList)}`);
}
