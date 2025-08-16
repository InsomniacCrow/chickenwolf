import { CommandInteraction, CommandInteractionOptionResolver, InteractionType, SlashCommandBuilder, User } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("addself")
  .setDescription("add self to current game").addStringOption((option) =>
    option.setName("gameid").setDescription("ID of the game to add yourself to")
  );

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  const gameID = interaction.options.getString("gameid") ?? state.activeGame?.gameID;
  const game = state.getGameFromID(gameID);
  if (game === null) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    game.addUser(interaction.user);
    await interaction.reply(`Added ${interaction.user}`);
  } catch (error) {
    return interaction.reply("Player already in list");
  }
}
