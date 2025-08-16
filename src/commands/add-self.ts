import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import Keyv from "keyv";

export const data = new SlashCommandBuilder()
  .setName("addself")
  .setDescription("add self to current game");

export async function execute(interaction: CommandInteraction, state: Keyv) {
  const playerList: User[] = await state.get("playerList") as User[];
  playerList.push(interaction.user);
  state.set("playerList", playerList);
  await interaction.reply(`Added ${interaction.user} Players: ${playerList}`);
}
