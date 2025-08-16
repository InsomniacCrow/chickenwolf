import { CommandInteraction, SlashCommandBuilder, ChannelType, User, RoleResolvable, OverwriteData, PermissionsBitField, PermissionOverwrites, UserResolvable } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("newchannel")
  .setDescription("Ts command creates a text channel");


function makeOverwrites(guildId: RoleResolvable, userList: Array<UserResolvable>): Array<OverwriteData> {

  const overwrites: Array<OverwriteData> = [
    {
      id: guildId, // deny @everyone
      deny: [PermissionsBitField.Flags.ViewChannel]
    }
  ];

  userList.forEach(userId => {
    overwrites.push({
      id: userId,
      allow: [PermissionsBitField.Flags.ViewChannel]
    });
  });

  return overwrites;
}

async function helper(interaction: CommandInteraction) {
  await interaction.reply("Fetched all input and working on your request!");

  try {
    if (interaction.guild) {
      const userList = [await interaction.guild.members.fetch("userid")];

      await interaction.guild.channels.create({
        name: "new", // The name given to the Channel
        type: ChannelType.GuildText, // The type of the Channel created.
        // Since "text" is the default Channel created, this could be ommitted
        permissionOverwrites: makeOverwrites(interaction.guild.id, userList),
      });
      
    } else {
      console.error("Applicable Guild D.N.E...");
    }
    // Now create the Channel in the server.
    // Notice how we are creating a Channel in the list of Channels
    // of the server. This will cause the Channel to spawn at the top
    // of the Channels list, without belonging to any Categories (more on that later)

    // If we managed to create the Channel, edit the initial response with
    // a success message
    await interaction.editReply({
      content: "Your channel was successfully created!",
    });
  } catch (error) {
    // If an error occurred and we were not able to create the Channel
    // the bot is most likely received the "Missing Permissions" error.
    // Log the error to the console
    console.log(error);
    // Also inform the user that an error occurred and give them feedback
    // about how to avoid this error if they want to try again
    await interaction.editReply({
      content:
        "Your channel could not be created! Please check if the bot has the necessary permissions!",
    });
  }
}

export async function execute(interaction: CommandInteraction) {
  return await helper(interaction);
  //await interaction.reply("Fetched all input and working on your request!");
}