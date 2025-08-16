import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("removeself") // index import should be same as this
  .setDescription("remove yourself from the game before it starts");

export async function execute(interaction, state: GameManagement) {
  if (!state.activeGame) {
    return interaction.reply(constants.noActiveGame);
  }
  try {
    state.activeGame.removePlayer(interaction.user);
    return interaction.reply("Removed self from game");
  } catch (error) {
    return interaction.reply("Command failed");
  }
}
