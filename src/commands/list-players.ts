import { CommandInteraction, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { GameManagement, Game } from "../state-management";
import * as constants from "../string-constants";
import { Controller } from "../controller";

export const data = new SlashCommandBuilder()
  .setName("listplayers")
  .setDescription("list all players");

export async function execute(interaction: CommandInteraction, state: GameManagement) {
  var output = "";
  const controllers: Controller[] = Array.from(state.gameControllers.values());
  controllers.forEach((controller: Controller) => {
    const userList: User[] = controller.getGame().getUserList();
    output += `Game ${controller.getGame().gameID}\n`;
    userList.forEach((user: User) => {
      output += `\t${user.displayName}\n`;
    });
    (interaction.channel as TextChannel).send(output);
    output += "\n";
  });
  interaction.reply(output);
}
