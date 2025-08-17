import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import * as constants from "../string-constants";
import { GameManagement } from "../state-management";
import { Controller } from "../controller";

export const data = new SlashCommandBuilder()
  .setName("cleanupchannels") // index import should be same as this
  .setDescription("Devs only, cleans up channels");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  await interaction.reply("Nuking channels...");
  if ((interaction.member?.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)) {
    const controllers = state.controllers;
    controllers.forEach(async (controller: Controller) => {
      await controller.nukeChannels();
      await interaction.followUp(`Nuked ${controller.getGameId()}'s channels`);
    });
  } else {
    return interaction.reply("You don't have admin permissions baka!");
  }
}
