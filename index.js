const discord = require('discord.js')
const bot = new discord.Client()
const config = require('./system/config/bot.json')
const fs = require('fs')
//consg ytdl = require('ytdl')
bot.login(config.token)

bot.programs = new discord.Collection()
const programs = fs.readdirSync('./system/executables').filter(file=>file.endsWith('.js'))
for (const file of programs){
    const program = require(`./system/executables/${file}`)
    bot.programs.set(program.name,program)
    console.log(`Loaded ${program.name}`)
}
bot.on("ready",()=>{
    console.log("Bot is ready!")
})

bot.on("message",message=>{
    if(message.author.bot) return
    const PREFIX = config.prefix
    let args = message.content.substring(PREFIX.length).split(" ")
    if(message.content.startsWith(PREFIX)){
        const exec = bot.programs.get(args[0]) || bot.programs.find(program=>program.aliases && program.aliases.includes(args[0]))

        exec.execute(message,args,bot)
    }
})