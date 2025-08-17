import { CommandInteraction, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowData, MessageActionRowComponentBuilder, MessageActionRowComponentData, JSONEncodable, APISelectMenuComponent, ButtonBuilder, ButtonStyle, MessageFlags, UserSelectMenuBuilder, Snowflake, Interaction } from "discord.js";
//import * as constants from "../string-constants";
//import { GameManagement } from "../state-management";

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

  return new StringSelectMenuBuilder()
    .setCustomId(id)
    .setPlaceholder('Make a selection!')
    .addOptions(thing);
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

  const select = makeMenu(id, opts);
  
  // const select = new UserSelectMenuBuilder()
  //   .setCustomId("test")
  //   .setPlaceholder("Select members...")
  //   .setDefaultUsers([""])
  //   .setMinValues(1) // minimum required selections
    // .setMaxValues(5); // maximum number of users that can be selected

  // const button1 = new ButtonBuilder()
  //   .setCustomId('button1')
  //   .setLabel('Button 1')
  //   .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder()
    .addComponents(select);

  // const row2 = new ActionRowBuilder()
  //   .addComponents(button1);

  await interaction.reply({
    content: description,
    components: [row1],
    
  });
}

export async function execute(interaction) {
  return createPlayerSelect(interaction, "test", [], "Choose something!");
}
