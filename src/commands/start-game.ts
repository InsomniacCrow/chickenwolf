import { Game, GameState, GameManagement} from "../state-management";
import { Controller } from "../controller";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "discord.js";
import { Player } from "../player";

export const data = new SlashCommandBuilder()
  .setName("startgame")
  .setDescription("start the game with specified id");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  let channel = interaction.channelId;
}