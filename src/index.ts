import { Client, CommandInteraction, Events, GatewayIntentBits, Interaction } from "discord.js";
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

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if(!interaction.isUserSelectMenu() || !interaction.channel) {
      return;
    }
    
    if(interaction.customId === "test") {
      
      let message = await interaction.channel.messages.fetch(interaction.message.id);
      let value = interaction.values;
      //console.log(value);

      //const selectedUsers = interaction.values; // Array of user IDs
      console.log(value);
      await interaction.deferUpdate()
      await message.edit({
        content: `✅ You selected: ${value}}`,
      });
      // if(value[0] === "charmander") {
      //   await interaction.deferUpdate()
        
      //   await message.edit({content: "gasp, ch"})
        
      // } else if(value[0] === "squirtle") { 
      //   await interaction.deferUpdate()
        
      //   await message.edit({content: "no way, sq", components: []})
      // } 
    
  }
  
  // if error
  } catch(e) {
    console.error(e)
    //interaction.followUp({content: e.message, ephemeral: true})
  }

})

client.login(config.DISCORD_TOKEN);
