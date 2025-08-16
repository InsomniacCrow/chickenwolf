import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";

export const data = new SlashCommandBuilder()
  .setName("removeself") // index import should be same as this
  .setDescription("INSERT DESC HERE");

export async function execute(interaction: CommandInteraction, state: (GameManagement | null) = null) {

}
