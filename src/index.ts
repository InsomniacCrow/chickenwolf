import * as fs from 'fs';
import * as path from 'path';
import { ApplicationCommand, REST, Routes, Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { config } from "./config"

const client = Object.assign(
  new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] }),
  {
    commands: new Collection<string, ApplicationCommand>(),
  }
);

const deploymentData = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      deploymentData.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.once(Events.GuildCreate, async (guild) => {
  try {
    console.log("refreshing app commands and shi");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild.id), {
      body: deploymentData,
    }
    )
    console.log("great success")
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

client.login(config.DISCORD_TOKEN);
