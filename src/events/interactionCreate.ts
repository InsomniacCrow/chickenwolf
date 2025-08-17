// import { CommandInteraction } from "discord.js";

// const { MessageEmbed, Events } = require("discord.js")
// const client = require("../index.js")

// export async function respond(interaction: CommandInteraction){
//   try {
//     if(!interaction.isStringSelectMenu()) return
    
//     if(interaction.customId === "starter") {
      
//       let message = await interaction.channel.messages.fetch(interaction.message.id);
//       let value = interaction.values;
//       console.log(value);
      
//       if(value[0] === "charmander") {
//         await interaction.deferUpdate()
        
//         await message.edit({content: "gasp, ch"})
        
//       } else if(value[0] === "squirtle") { 
//         await interaction.deferUpdate()
        
//         await message.edit({content: "no way, sq"})
//       } 
    
//   }
  
//   // if error
//   } catch(e) {
//     console.error(e)
//     //interaction.followUp({content: e.message, ephemeral: true})
//   }
// }