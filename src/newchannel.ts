import { CommandInteraction, SlashCommandBuilder, ChannelType, User, RoleResolvable, OverwriteData, PermissionsBitField, PermissionOverwrites, UserResolvable, TextChannel, Guild, Channel } from "discord.js";

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

export async function makeNewChannel(fromChannel, guild: Guild, channel_name: string = "new") {
  await fromChannel.send("Fetched all input and working on your request!");
  var channel: Channel;
  try {
    if (guild) {
      const userList = [];

      channel = await guild.channels.create({
        name: channel_name, // The name given to the Channel
        type: ChannelType.GuildText, // The type of the Channel created.
        // Since "text" is the default Channel created, this could be ommitted
        permissionOverwrites: makeOverwrites(guild.id, userList),
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
    await fromChannel.send("Your channel was successfully created!");
  } catch (error) {
    // If an error occurred and we were not able to create the Channel
    // the bot is most likely received the "Missing Permissions" error.
    // Log the error to the console
    console.log(error);
    // Also inform the user that an error occurred and give them feedback
    // about how to avoid this error if they want to try again
    await fromChannel.send({
      content:
        "Your channel could not be created! Please check if the bot has the necessary permissions!",
    });
  }
  return channel;
}
