import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("removeself") // index import should be same as this
  .setDescription("remove yourself from the game before it starts").addStringOption((option) =>
  option.setName("gameid").setDescription("ID of the game to add yourself from"));

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  const gameID = interaction.options.getString("gameid") ?? state.activeGame?.gameID;
  const game = state.getGameFromID(gameID);
  if (game === null) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    game.removeUser(interaction.user);
    await interaction.reply(`Removed ${interaction.user}`);
  } catch (error) {
    console.log(error)
    return interaction.reply("Command failed");
  }
}
