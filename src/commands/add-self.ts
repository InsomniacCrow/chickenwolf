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
  var controller;
  try {
    controller = state.getControllerFromId(gameID);
  } catch (error) {
    return interaction.reply("Game does not exist or hasn't finish creating, maybe try again in a few seconds?");
  }
  if (controller === null) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    await controller.addUser(interaction.user);
    return interaction.reply(`Added ${interaction.user} to game ${controller.getGameId()}`);
  } catch (error) {
    return interaction.reply("Player already in list");
  }
}
