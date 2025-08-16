import { CommandInteraction, CommandInteractionOptionResolver, InteractionType, SlashCommandBuilder, User } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("addself")
  .setDescription("add self to current game").addStringOption((option) =>
    option.setName("Game ID").setDescription("ID of the game to add yourself to")
  );

export async function execute(interaction, state: GameManagement) {
  const gameID = interaction.getString("Game ID") ?? state.activeGame?.gameID;
  const game = state.getGameFromID(gameID);
  if (game === null) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    game.addPlayer(interaction.user);
    await interaction.reply(`Added ${interaction.user}`);
  } catch (error) {
    return interaction.reply("Player already in list");
  }
}
