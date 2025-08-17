import { CommandInteraction, SlashCommandBuilder, ChannelType, User, RoleResolvable, OverwriteData, PermissionsBitField, PermissionOverwrites, UserResolvable, TextChannel, Guild, Channel } from "discord.js";
import { Player } from "./player";

function makeOverwrites(guildId: RoleResolvable, userList: Array<UserResolvable>, readOnly: boolean = false): Array<OverwriteData> {

  const overwrites: Array<OverwriteData> = [
    {
      id: guildId, // deny @everyone
      deny: [PermissionsBitField.Flags.ViewChannel]
    }
  ];
  if (readOnly) {
    userList.forEach(userId => {
      overwrites.push({
        id: userId,
        allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages]
      });
    });
  } else {
    userList.forEach(userId => {
      overwrites.push({
        id: userId,
        allow: [PermissionsBitField.Flags.ViewChannel]
      });
    });
  }

  return overwrites;
}

export async function makeNewChannel(
  fromChannel: TextChannel,
  guild: Guild,
  channel_name: string = "new",
  readOnly: boolean = false,
  userList: User[] = []
): Promise<Channel> {
  await fromChannel.send("Fetched all input and working on your request!");
  var channel: Channel;
  try {
    if (guild) {
      channel = await guild.channels.create({
        name: channel_name, // The name given to the Channel
        type: ChannelType.GuildText, // The type of the Channel created.
        // Since "text" is the default Channel created, this could be ommitted
        permissionOverwrites: makeOverwrites(guild.id, userList, readOnly),
      });

    } else {
      console.error("Applicable Guild D.N.E...");
      throw new Error("Cannot create channel");
    }
    // Now create the Channel in the server.
    // Notice how we are creating a Channel in the list of Channels
    // of the server. This will cause the Channel to spawn at the top
    // of the Channels list, without belonging to any Categories (more on that later)

    // If we managed to create the Channel, edit the initial response with
    // a success message
    await fromChannel.send("Your channel was successfully created!");
    return channel;
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
    throw new Error("Cannot create channel");
  }
}

export async function muteUsers(channel: Channel, users: User[], unmute: boolean = false) {
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    (channel as TextChannel).permissionOverwrites.edit(user, {SendMessages: unmute}).catch(console.error);
  }
}

/*
Only alive players will be affected by the mutePlayers function.
*/
export async function mutePlayers(channel:Channel, players: Player[], unmute: boolean=false) {
  muteUsers(channel, playerToUsers(players), unmute);
}

/*
filters out living players and returns a list of their user id.
*/
export function playerToUsers(players: Player[]): User[] {
  console.log(players);
  return players.filter((p) => p.getAlive()).map((p) =>  p.getUserId());
}

/*
Taken from https://stackoverflow.com/questions/37764665/how-to-implement-sleep-function-in-typescript
*/
export function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}