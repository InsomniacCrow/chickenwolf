import { CommandInteraction, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowData, MessageActionRowComponentBuilder, MessageActionRowComponentData, JSONEncodable, APISelectMenuComponent, ButtonBuilder, ButtonStyle, MessageFlags, UserSelectMenuBuilder, Snowflake, Interaction } from "discord.js";
//import * as constants from "../string-constants";
//import { GameManagement } from "../state-management";
import { client } from "../index.js";
import { Events } from "discord.js";


export const data = new SlashCommandBuilder()
  .setName("vote") // index import should be same as this
  .setDescription("Vote tester");

type labelThing = {
  label: string,
  value: Snowflake
}

function makeMenu(id: string, opts: Array<labelThing>): StringSelectMenuBuilder {
  const thing: Array<StringSelectMenuOptionBuilder> = [];
  opts.forEach(({label, value}) => {
    thing.push(new StringSelectMenuOptionBuilder()
    .setLabel(label)
    .setValue(value))
  })

  const select = new StringSelectMenuBuilder()
    .setCustomId(id)
    .setPlaceholder('Make a selection!').addOptions(thing);
  
  // thing.forEach((item) => {
  //   select.addOptions(item);
  // });
    // .addOptions(thing);

  return select;
    //   new StringSelectMenuOptionBuilder()
    //     .setLabel('Bulbasaur')
    //     .setDescription('The dual-type Grass/Poison Seed Pokémon.')
    //     .setValue('bulbasaur'),
    //   new StringSelectMenuOptionBuilder()
    //     .setLabel('Charmander')
    //     .setDescription('The Fire-type Lizard Pokémon.')
    //     .setValue('charmander'),
    //   new StringSelectMenuOptionBuilder()
    //     .setLabel('Squirtle')
    //     .setDescription('The Water-type Tiny Turtle Pokémon.')
    //     .setValue('squirtle')
    //     // .setEmoji({
    //     //   name: "🛖",
    //     // }),
    // );
}

async function createPlayerSelect(interaction, id: string, opts: Array<labelThing>, description: string) {
  //await interaction.reply("Loading...");
  //let message = await interaction.channel.messages.fetch(interaction.message.id);
 // await interaction.deferUpdate();

  const select = makeMenu(id, opts);
  
  // // const select = new UserSelectMenuBuilder()
  // //   .setCustomId("test")
  // //   .setPlaceholder("Select members...")
  // //   .setDefaultUsers([""])
  // //   .setMinValues(1) // minimum required selections
  //   // .setMaxValues(5); // maximum number of users that can be selected

  // // const button1 = new ButtonBuilder()
  // //   .setCustomId('button1')
  // //   .setLabel('Button 1')
  // //   .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder()
    .addComponents(select);

  // // const row2 = new ActionRowBuilder()
  // //   .addComponents(button1);

  await interaction.reply({
    content: description,
    components: [row1],
    
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
      if (!interaction.isStringSelectMenu() || !interaction.channel) {
        return;
      }
      let message = await interaction.channel.messages.fetch(interaction.message.id);
      let value = interaction.values;
      await message.edit({
        content: `✅ You selected: ${value}}`,
      });
      
      if (interaction.customId === id) {
        
        let message = await interaction.channel.messages.fetch(interaction.message.id);
        let value = interaction.values;
        //console.log(value);

        //const selectedUsers = interaction.values; // Array of user IDs
        console.log(value);
        await interaction.deferUpdate()
        await message.edit({
          content: `✅ You selected: ${value}}`,
          components: [],
        });
        // if(value[0] === "charmander") {
        //   await interaction.deferUpdate()
          
        //   await message.edit({content: "gasp, ch"})
          
        // } else if(value[0] === "squirtle") { 
        //   await interaction.deferUpdate()
          
        //   await message.edit({content: "no way, sq", components: []})
        // } 
      
    }
    
    } catch(e) {
      console.error(e)
      //interaction.followUp({content: e.message, ephemeral: true})
    }

  })
}

export async function execute(interaction) {
  return createPlayerSelect(interaction, "test", [{label: "aba", value: "123"}, {label: "aaa", value: "1233"}], "Choose something!");
}
