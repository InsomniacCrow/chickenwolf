import { Client, CommandInteraction, Events, GatewayIntentBits, Partials, Interaction } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { events } from "./events";
import { deployCommands } from "./deploy-commands";
import { GameManagement } from "./state-management";

const state: GameManagement = new GameManagement();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});

client.once(Events.ClientReady, () => {
  console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction, state);
  }
});

client.login(config.DISCORD_TOKEN);
