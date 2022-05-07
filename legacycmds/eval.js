const axios = require("axios");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "eval",
    description: "Evaluate some smexy code from xWass",
    async execute(client, message, args) {

        if (message.author.id !== "971185270261157888") return

        const pre_clean = async (code) => {
            let edit = code.replaceAll("```js", "")
            edit = edit.replaceAll("```", "")
            return edit
        }
        const pre_cleaned = await pre_clean(args.join(" "))
        const clean = async (text) => {
            if (text && text.constructor.name == "Promise")
                text = await text;
            if (typeof text !== "string")
                text = require("util").inspect(text, { depth: 1 });
            return text;
        
        }
        try {
            const evaled = await eval(pre_cleaned);
            const cleaned = await clean(evaled);
            if (cleaned.length > 1980) {
                const resp = await axios.post("https://haste.churton.uk/documents", cleaned);
                const url = `https://haste.churton.uk/${resp.data.key}`;
                let embed = new MessageEmbed()
                .setDescription(`I could not send the response because it was too long. View it (here)[${url}]`)
                return await message.channel.send({embeds: [embed]})
            }
            message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`\n${err}\n\`\`\``);
            }
        }
}
