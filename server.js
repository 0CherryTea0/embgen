const express = require('express');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const agent = require('superagent');
const app = new express();

app.use(bodyParser.json({urlencoded: false}));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.post('/send', (req, res) => {
    if(!req.body.webhook || req.body.webhook == ' ') return res.status(400).send('Неверный URL вебхука');
    agent.get(req.body.webhook)
    .end((err, webhook_res) => {
        if(!webhook_res) return res.status(400).send('Неверный URL вебхука');
        if(!webhook_res.body.id || !webhook_res.body.token) return res.status(400).send('Неверный URL вебхука');
        if(!req.body.message && !req.body.embed.enabled) return res.status(400).send('Введите эмбед или сообщение');
        const hook = new Discord.WebhookClient(webhook_res.body.id, webhook_res.body.token);
        let embed = new Discord.MessageEmbed()
        .setColor(req.body.embed.color)
        .setAuthor(req.body.embed.author.text, req.body.embed.author.image, req.body.embed.author.link)
        .setURL(req.body.embed.url)
        .setTitle(req.body.embed.title)
        .setDescription(req.body.embed.description)
        .setThumbnail(req.body.embed.thumbnail)
        .setImage(req.body.embed.image)
        .setFooter(req.body.embed.footer.text, req.body.embed.footer.image)
        if(req.body.embed.timestamp != ' ') embed.setTimestamp(req.body.embed.timestamp);
        req.body.embed.fields.forEach(field => {
            if(!field.name || field.name == ' ') field.name = '⁣';
            if(!field.value || field.value == ' ') field.value = '⁣';
            embed.addField(field.name, field.value, field.inline)
        })
        hook.send(req.body.message, req.body.embed.enabled ? embed : null).then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            return res.status(400).send(err.message);
        })
    })
})

let server = app.listen(3000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
})