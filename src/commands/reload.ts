import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("DEV ONLY, reloads a command")
  .addStringOption((option) =>
    option.setName('command')
      .setDescription('command to reload')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const commandName = interaction.options.getString('command', true).toLowerCase();
  const command = interaction.client.application.commands.fetch(commandName);
  if (!command) {
    await interaction.reply(`no command with name ${commandName}`);
    return;
  }
  const trueCommandName = command.then(cmd => { return cmd.name });

  delete require.cache[require.resolve(`./${trueCommandName}.js`)]
  try {
    const newCommand = require(`./${trueCommandName}.js`);
    interaction.client.application.commands.set(newCommand.data.name, newCommand);
    await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);

  } catch (error) {
    console.error(error);
    await interaction.reply(`FUCK!!! error while reloading command ${trueCommandName}, with error "${error.message}"`)
  }
}
