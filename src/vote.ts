import { CommandInteraction, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowData, MessageActionRowComponentBuilder, MessageActionRowComponentData, JSONEncodable, APISelectMenuComponent, ButtonBuilder, ButtonStyle, MessageFlags, UserSelectMenuBuilder, Snowflake, Interaction, TextChannel } from "discord.js"
import { client } from "./index.js";
import { Events , Channel } from "discord.js";


export type labelThing = {
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
}

export async function createPlayerSelect(channel: Channel, id: string, opts: Array<labelThing>, description: string) {
  const select = makeMenu(id, opts);
  const row1 = new ActionRowBuilder()
    .addComponents(select);

  await channel.send({  // hopefully works
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

        console.log(value);
        await interaction.deferUpdate()
        const user = await client.users.fetch(value[0]);
        await message.edit({
          content: `✅ You selected: ${user}`,
          components: [],
        });
        return user;
      }
    
    } catch(e) {
      console.error(e)
    }

  })
}

// export async function execute(interaction) {
//   return createPlayerSelect(interaction, "test", [{label: "aba", value: "123"}, {label: "aaa", value: "1233"}], "Choose something!");
// }
