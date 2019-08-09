const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fs = require ('fs')
client.characters = require('./Characters.json')
client.Classes = require("./Classes.json")
client.equipaments = require('./Equipaments and Itens.json')
client.enemies = require('./enemies.json')

client.once('ready', () =>{
    console.log ('Ready!')
})


client.on('message', async message => {
    if(message.content.toLowerCase() === "como começar uma aventura?" || message.content.toLowerCase() === "como criar um personagem?") {
        message.reply("Digite `.start`, será perguntado se quer iniciar uma aventura, digite sim.\n Tenha em mãos um link que corresponde a imagem que representará seu personagem.\n As classes são: Guerreiro, Mago, Paladino, Sacerdote, Assassino e Hunter")
    }
})


client.on('message', async message => {
    let app = message.author
    const filter = start => {
        return start.author.id === app.id;
    }
    if (message.content.startsWith(`${prefix}start`)){
        await message.reply('Você deseja começar uma aventura?')
        await message.channel.awaitMessages(filter, {max:1, time: 180000}).then(collectedstart => {
            if (collectedstart.first().content.toLowerCase() === "sim") {
                if(!(app.username in client.characters)){
                    client.characters[app.username] = {}
                }
                message.reply('Qual será o nome do seu personagem?')
                const filter2 = name => {
                    return name.author.id === app.id;
                }
                message.channel.awaitMessages(filter2, {max:1, time:180000}).then(collectedname => {
                    let name = collectedname.first().content
                    for (const user of Object.keys(client.characters)){
                        if(!(name in client.characters[user])) {
                                console.log(name)
                            }
                            else return message.reply('Já existe um personagem com esse nome.');
                        }        
                            message.reply('Qual será a classe do seu personagem?')
                            const filter3 = classc => {
                                return classc.author.id === app.id;
                            }
                            message.channel.awaitMessages(filter3, {max:1, time:180000}).then(collectedclass => {
                                let charclass = collectedclass.first().content.toLowerCase()
                                if(charclass === "guerreiro" || charclass === "mago" || charclass === "assassino" || charclass === "sacerdote" || charclass === "paladino" || charclass === "hunter"){
                                    message.reply('Você quer colocar uma imagem para seu personagem? Se sim, Poste o link da imagem. Caso contrario digite Não')
                                    const filter4 = chaimage => {
                                        return chaimage.author.id === app.id
                                    }
                                    message.channel.awaitMessages(filter4, {max:1, time:180000}).then(collectimage => {
                                        if (collectimage.first().content.toLowerCase() === "não"){
                                            let cclass = client.Classes[charclass].class
                                            let cHp = client.Classes[charclass].Hp
                                            let cSp = client.Classes[charclass].Sp
                                            image = null
                                            client.characters[app.username] = {
                                                [name]: {
                                                    characterclass: `${cclass}`,
                                                    level: 1,
                                                    equipamentos: {
                                                        helmet: "none",
                                                        chest: "none",
                                                        arms: "none",
                                                        legs: "none",
                                                        boots: "none",
                                                        weapons: "bare hand"
                                                    },
                                                    MaxHp: `${cHp}`,
                                                    MaxSp: `${cSp}`,
                                                    Hp: `${cHp}`,
                                                    Sp: `${cSp}`,
                                                    image: `${image}`,
                                                    Novas: 100,
                                                    inventory:{}
                                                }
                                            }
                                            message.reply('Personagem criado com sucesso')
                                            fs.writeFile ('./Characters.json', JSON.stringify (client.characters, null, 2), err => {
                                                if (err) throw err;
                                                console.log('Salvo');
                                            });
                                        }
                                        else if (collectimage.first().content.includes('https://') ||collectimage.first().content.startsWith('http://') ) {
                                            image = collectimage.first().content
                                            let cclass = client.Classes[charclass].class
                                            let cHp = client.Classes[charclass].Hp
                                            let cSp = client.Classes[charclass].Sp
                                            client.characters[app.username] = {
                                                [name]: {
                                                    characterclass: `${cclass}`,
                                                    level: 1,
                                                    equipamentos: {
                                                        helmet: "none",
                                                        chest: "none",
                                                        arms: "none",
                                                        legs: "none",
                                                        boots: "none",
                                                        weapons: "bare hand"
                                                    },
                                                    MaxHp: `${cHp}`,
                                                    MaxSp: `${cSp}`,
                                                    Hp: `${cHp}`,
                                                    Sp: `${cSp}`,
                                                    image: `${image}`,
                                                    Novas: 100,
                                                    inventory:{}
                                                }
                                            }
                                            message.reply('Personagem criado com sucesso')
                                            fs.writeFile ('./Characters.json', JSON.stringify (client.characters, null, 2), err => {
                                                if (err) throw err;
                                                console.log('Salvo');
                                            });
                                            
                                        }
                                    }).catch(err => {
                                        message.reply('Poste uma imagem válida')
                                    })                             
                                }
                            }).catch(err => {
                                message.reply('Escolha uma classe válida.')
                            })
                }).catch (err => {
                    message.reply('Já existe um personagem com esse nome.')
                })
            }
        }).catch(err => {
            return;
        })
    }
})

client.on('message', message => {
    if (message.content.startsWith(`${prefix}personagem`)){
        let app = message.author
        let args = message.content.split('|')
        if (args[1] === undefined){
            message.reply('Qual o nome do personagem?')
            const filter = playerchar => {
                return playerchar.author.id === app.id;
            }
            message.channel.awaitMessages(filter, {max:1, time:60000}).then( collectchar => {
                fs.readFile ('./Characters.json',  (err, jsonString) => {
                    if (err) throw err;
                    console.log('Read');
                });

                let char = collectchar.first().content
                let cimage = client.characters[app.username][char].image;
                let clevel = client.characters[app.username][char].level;
                let ccharacterclass = client.characters[app.username][char].characterclass
                let cHp = client.characters[app.username][char].Hp
                let cSp = client.characters[app.username][char].Sp
                let cmaxHp = client.characters[app.username][char].MaxHp
                let cmaxSp = client.characters[app.username][char].MaxSp
                let chelmet = client.characters[app.username][char].equipamentos.helmet
                let cchest = client.characters[app.username][char].equipamentos.chest
                let carms = client.characters[app.username][char].equipamentos.arms
                let clegs = client.characters[app.username][char].equipamentos.legs
                let cboots = client.characters[app.username][char].equipamentos.boots
                let cweapon = client.characters[app.username][char].equipamentos.weapons.name
                let cnovas = client.characters[app.username][char].Novas

                const charembed = new Discord.RichEmbed()
                    .setColor('#0033cc')
                    .setTitle(`__${char}__`)
                    .setThumbnail(`${cimage}`)
                    .addField('Classe', `${ccharacterclass}`)
                    .addField('Level', `${clevel}`)
                    .addField('Status', `HP: ${cHp}/${cmaxHp}\nSP: ${cSp}/${cmaxSp}`)
                    .addField('Equipamentos', `Cabeça: ${chelmet}\nPeito: ${cchest}\nBraços: ${carms}\nPernas: ${clegs}\nBotas: ${cboots}\n\nArma: ${cweapon}`)
                    .addField('Novas:', `${cnovas}`)
                
                message.reply(charembed)
            })
        }
        else if (!(args[1] in client.characters[app.username])) {
            message.reply('Esse personagem não é seu ou não existe.')
        }
        else {
            fs.readFile ('./Characters.json',  (err, jsonString) => {
                if (err) throw err;
                console.log('Read');
            });
            let char = args[1]
            let cimage = client.characters[app.username][char].image;
            let clevel = client.characters[app.username][char].level;
            let ccharacterclass = client.characters[app.username][char].characterclass
            let cHp = client.characters[app.username][char].Hp
            let cSp = client.characters[app.username][char].Sp
            let cmaxHp = client.characters[app.username][char].MaxHp
            let cmaxSp = client.characters[app.username][char].MaxSp
            let chelmet = client.characters[app.username][char].equipamentos.helmet
            let cchest = client.characters[app.username][char].equipamentos.chest
            let carms = client.characters[app.username][char].equipamentos.arms
            let clegs = client.characters[app.username][char].equipamentos.legs
            let cboots = client.characters[app.username][char].equipamentos.boots
            let cweapon = client.characters[app.username][char].equipamentos.weapons.name
            let cnovas = client.characters[app.username][char].Novas

            const charembed = new Discord.RichEmbed()
                .setColor('#0033cc')
                .setTitle(`__${char}__`)
                .setThumbnail(`${cimage}`)
                .addField('Classe', `${ccharacterclass}`)
                .addField('Level', `${clevel}`)
                .addField('Status', `HP: ${cHp}/${cmaxHp}\nSP: ${cSp}/${cmaxSp}`)
                .addField('Equipamentos', `Cabeça: ${chelmet}\nPeito: ${cchest}\nBraços: ${carms}\nPernas: ${clegs}\nBotas: ${cboots}\n\nArma: ${cweapon}`)
                .addField('Novas:', `${cnovas}`)
            
            message.reply(charembed)
        }

    }
})

client.on('message', async message =>{
    if (message.content.startsWith(`${prefix}fight`)){
        let args = message.content.split('|')
        let hero = args[1]
        let app = message.author
        var enemyHP = client.enemies.Goblin.enemyHp
        var heroHP = client.characters[app.username][hero].Hp
        var enemy = client.enemies.Goblin.name
        var defense
        var thisdamage
        while(enemyHP > 0 && heroHP > 0){
            await message.reply('O que você quer fazer?\nAtacar\nDefender')
            const filter = battle => {
                return battle.author.id === app.id
            }
            await message.channel.awaitMessages(filter, {max:1, time:15000}).then(collectedbattle => {
                if (collectedbattle.first().content.toLowerCase() === "atacar"){
                    var min = client.characters[app.username][hero].equipamentos.weapons.damage.min
                    var max = client.characters[app.username][hero].equipamentos.weapons.damage.max
                    var randomhero = Math.floor(Math.random() * +max) +min
                    thisdamage = +randomhero
                    newenemyHP = +enemyHP - +thisdamage
                    enemyHP = +newenemyHP
                    defense = 0
                    message.reply(`Você causou ${thisdamage} de dano ao ${enemy} lhe restam ${Math.max(0,newenemyHP)} de HP`)
                }
                else if (collectedbattle.first().content.toLowerCase() === "defender"){
                    message.reply(`Você se prepara para bloquear o golpe do ${enemy}`)
                    randomhero = 0
                    defense = 2
                }
            })
            if (enemyHP > 0) {
                var min = client.enemies.Goblin.attack.min
                var max = client.enemies.Goblin.attack.max
                var randomenemy = Math.floor(Math.random() * +max) +min
                thisdamage2 = randomenemy - defense
                newheroHP = heroHP - Math.max(0,thisdamage2)
                await message.reply(`O ${enemy} ataca, causando ${Math.max(0,thisdamage2)} de dano deixando-o com ${newheroHP} de HP`)
                heroHP = newheroHP
            }
            if (enemyHP <= 0){
                message.reply(`Você derrotou o ${enemy}`)
            }
        }
    }
})



client.on('message', async message => {
    if (message.content.startsWith(`${prefix}shop`)) {
        let app = message.author
        let args = message.content.split('|')
        let character = args[1]
        var heroNovas = client.characters[app.username][character].Novas
        var type = client.equipaments;
        const typeembed = new Discord.RichEmbed()
                .setColor('#0033cc')
                .setTitle('__SHOP__')
                .addField('Você tem:', `${heroNovas} Novas`)
                .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                .addBlankField()
        Object.values(type).forEach(function(elements){        
                typeembed.addField(elements.name, elements.description);
        });
        message.reply(`O que você deseja comprar?`, typeembed);
        const filter = shop => {
            return shop.author.id === app.id
        }
        message.channel.awaitMessages(filter, {max:1, time:180000}).then(collectshop => {
            if (collectshop.first().content.toLowerCase() === "armas"){
                var weapons = client.equipaments.Armas;
                const weaponsembed = new Discord.RichEmbed()
                    .setColor('#0033cc')
                    .setTitle('__SHOP__')
                    .addField('Você tem:', `${heroNovas} Novas`)
                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                    .addBlankField()
                Object.values(weapons).forEach(function(elements){
                    if(elements.name != undefined && elements.description != undefined){      
                        weaponsembed.addField(elements.name, elements.description);
                    }
                });
                message.reply(`O que você deseja comprar?`, weaponsembed);
                const filterwe = weaponsshop => {
                    return weaponsshop.author.id === app.id
                }
                message.channel.awaitMessages(filterwe, {max:1, time:180000}).then(collectweapon => {
                    if (collectweapon.first().content.toLowerCase() === "espadas de uma mão"){
                        var weapons = client.equipaments.Armas.onehanded;
                        const onehandedembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                onehandedembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, onehandedembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "espadas de duas mãos"){
                        var weapons = client.equipaments.Armas.twohanded;
                        const twohandedembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                twohandedembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, twohandedembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "adagas"){
                        var weapons = client.equipaments.Armas.dagger;
                        const daggerembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                daggerembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, daggerembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "cajados"){
                        var weapons = client.equipaments.Armas.staff;
                        const staffembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                staffembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}\nMagical Damage:${elements.damage.mdamage}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, staffembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "livros sagrados"){
                        var weapons = client.equipaments.Armas.holybooks;
                        const holybooksembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                holybooksembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}\nMagical Damage:${elements.damage.mdamage}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, holybooksembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "arcos"){
                        var weapons = client.equipaments.Armas.bows;
                        const bowsembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                bowsembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, bowsembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "escudos"){
                        var weapons = client.equipaments.Armas.shields;
                        const shieldsembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                shieldsembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, shieldsembed);
                    }
                    if (collectweapon.first().content.toLowerCase() === "espadas de uma mão"){
                        var weapons = client.equipaments.Armas.onehanded;
                        const onehandedembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                            Object.values(weapons).forEach(function(elements){
                            if(elements.name != undefined){
                                onehandedembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, onehandedembed);
                    }
                })
            }
            if (collectshop.first().content.toLowerCase() === "armaduras"){
                var armors = client.equipaments.Armaduras;
                const armorsembed = new Discord.RichEmbed()
                    .setColor('#0033cc')
                    .setTitle('__SHOP__')
                    .addField('Você tem:', `${heroNovas} Novas`)
                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                    .addBlankField()
                Object.values(armors).forEach(function(elements){
                    if(elements.name != undefined && elements.description != undefined){      
                        armorsembed.addField(elements.name, elements.description);
                    }
                });
                message.reply(`O que você deseja comprar?`, armorsembed);
                const filterar = armorsshop => {
                    return armorsshop.author.id === app.id
                }
                message.channel.awaitMessages(filterar, {max:1, time:180000}).then(collectarmors => {
                    if (collectarmors.first().content.toLowerCase() === "placas"){
                        var plates = client.equipaments.Armaduras.Placas;
                        const platesembed = new Discord.RichEmbed()
                            .setColor('#0033cc')
                            .setTitle('__SHOP__')
                            .addField('Você tem:', `${heroNovas} Novas`)
                            .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                            .addBlankField()
                        Object.values(plates).forEach(function(elements){
                            if(elements.name != undefined && elements.description != undefined){      
                                platesembed.addField(elements.name, elements.description);
                            }
                        });
                        message.reply(`O que você deseja comprar?`, platesembed);
                        const filterpl = platesshop => {
                            return platesshop.author.id === app.id
                        }
                        message.channel.awaitMessages(filterpl, {max:1, time:180000}).then(collectplates => {
                            if(collectplates.first().content.toLowerCase() === "cabeça"){
                                var head = client.equipaments.Armaduras.Placas.Cabeça;
                                const headembed = new Discord.RichEmbed()
                                    .setColor('#0033cc')
                                    .setTitle('__SHOP__')
                                    .addField('Você tem:', `${heroNovas} Novas`)
                                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                                    .addBlankField()
                                Object.values(head).forEach(function(elements){
                                    if(elements.name != undefined){      
                                        headembed.addField(elements.name, `Preço:${elements.price} Novas\nDefesa:${elements.defense}`);
                                    }
                                });
                                message.reply(`O que você deseja comprar?`, headembed);
                            }
                            if(collectplates.first().content.toLowerCase() === "peito"){
                                var chest = client.equipaments.Armaduras.Placas.Peito;
                                const chestembed = new Discord.RichEmbed()
                                    .setColor('#0033cc')
                                    .setTitle('__SHOP__')
                                    .addField('Você tem:', `${heroNovas} Novas`)
                                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                                    .addBlankField()
                                Object.values(chest).forEach(function(elements){
                                    if(elements.name != undefined){      
                                        chestembed.addField(elements.name, `Preço:${elements.price} Novas\nDefesa:${elements.defense}`);
                                    }
                                });
                                message.reply(`O que você deseja comprar?`, chestembed);    
                            }
                            if(collectplates.first().content.toLowerCase() === "braços"){
                                var arms = client.equipaments.Armaduras.Placas.Braços;
                                const armsembed = new Discord.RichEmbed()
                                    .setColor('#0033cc')
                                    .setTitle('__SHOP__')
                                    .addField('Você tem:', `${heroNovas} Novas`)
                                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                                    .addBlankField()
                                Object.values(arms).forEach(function(elements){
                                    if(elements.name != undefined){      
                                        armsembed.addField(elements.name, `Preço:${elements.price} Novas\nDefesa:${elements.defense}`);
                                    }
                                });
                                message.reply(`O que você deseja comprar?`, armsembed);    
                            }
                            if(collectplates.first().content.toLowerCase() === "pernas"){
                                var legs = client.equipaments.Armaduras.Placas.Pernas;
                                const legsembed = new Discord.RichEmbed()
                                    .setColor('#0033cc')
                                    .setTitle('__SHOP__')
                                    .addField('Você tem:', `${heroNovas} Novas`)
                                    .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                                    .addBlankField()
                                Object.values(legs).forEach(function(elements){
                                    if(elements.name != undefined){      
                                        legsembed.addField(elements.name, `Preço:${elements.price} Novas\nDefesa:${elements.defense}`);
                                    }
                                });
                                message.reply(`O que você deseja comprar?`, legsembed);    
                            }
                        })
                    }
                })
            }
        })
    }
})

client.on('message', message =>{
    if (message.content.startsWith(`${prefix}comprar`)) {
        let app = message.author
        let args = message.content.split('|')
        item = args[2]
        char = args[1]
        for (const bequip of Object.keys(client.equipaments)) {
            if (!(item in client.equipaments[bequip])){
                for (const buequip of Object.keys(client.equipaments[bequip])){
                    for (const bequipname of Object.keys(client.equipaments[bequip][buequip])){
                        if (bequipname === item){
                            let price = client.equipaments[bequip][buequip][bequipname].price
                            let bitem = client.equipaments[bequip][buequip][bequipname]
                            if (client.characters[app.username][char].Novas > price){
                                newNova = client.characters[app.username][char].Novas - price
                                client.characters[app.username][char].inventory = {
                                    [bequip]:{[item]: bitem, name:`${client.equipaments[bequip].name}`, description:`${client.equipaments[bequip].description}` }
                                }
                                client.characters[app.username][char].Novas = newNova
                                message.reply(`item comprado! Você agora tem ${newNova} Novas`)
                                fs.writeFile ('./Characters.json', JSON.stringify (client.characters, null, 2), err => {
                                    if (err) throw err;
                                    console.log('Salvo');
                                });
                            }
                            else {
                                let cbuy = +bequipname.price - +client.characters[app.username][char].Novas
                                return message.reply(`Você não tem Novas o Suficiente. Voce precisa de mais ${cbuy}`)
                            }
                        }
                    }
                }
            }
        }
        // for (const bitem of Object.keys(client.equipaments.consumables)) {
        // }
    }    
})

client.on('message', message => {
    if(message.content.startsWith(`${prefix}inventario`)){
        let app = message.author
        let args = message.content.split('|')
        let char = args[1]
        let heroNovas = client.characters[app.username][char].Novas
        if (!(char in client.characters[app.username])){
            message.reply('Esse personagem não é seu, ou não existe.')
        }
        else{
            const filter = inventory => {
                return inventory.author.id === app.id
            }
            var itens = client.characters[app.username][char].inventory
            const inventoryembed = new Discord.RichEmbed()
                .setColor('#0033cc')
                .setTitle(`__IVENTÁRIO DO __${char.toUpperCase()}`)
                .addField('Você tem:', `${heroNovas} Novas`)
                .addField('Para comprar', "digite `.comprar|nome do personagem|nome do item`")
                .addBlankField()
            Object.values(itens).forEach(function(elements){
                if(elements.name != undefined){
                    inventoryembed.addField(elements.name, elements.description);
                }
            message.reply(inventoryembed)
            })
            message.channel.awaitMessages(filter, {max:1, time:180000}).then(collectinventory => {
                if (collectinventory.first().content.toLowerCase() === "armas"){
                    var weapons = client.characters[app.username][char].inventory.Armas
                    const weaponsembed = new Discord.RichEmbed()
                        .setColor('#0033cc')
                        .setTitle('__SHOP__')
                        .addField('Você tem:', `${heroNovas} Novas`)
                        .addField('Para equipar o item', "digite `.equip|nome do personagem|nome do item`")
                        .addBlankField()
                    Object.values(weapons).forEach(function(elements){
                        if(elements.name != undefined){      
                            weaponsembed.addField(elements.name, `Preço:${elements.price}\nDamage:  Min:${elements.damage.min}   Max:${elements.damage.max}`);
                        }
                    });
                    message.reply(weaponsembed)
                }
            })
        }
    }
})

client.on('message', message =>{
    if (message.content.startsWith(`${prefix}equip`)){
        let app = message.author
        let args = message.content.split('|')
        let char = args[1]
        let item = args[2]
        for (const equip of Object.keys(client.characters[app.username][char].inventory.Armas)){
            if (equip === item){
                let equipw = client.characters[app.username][char].inventory.Armas[equip]
                client.characters[app.username][char].equipamentos.weapons = equipw
                fs.writeFile ('./Characters.json', JSON.stringify (client.characters, null, 2), err => {
                    if (err) throw err;
                    console.log('Salvo');
                });
                message.reply(`Item ${item} equipado!`)
            }
        }
    }
})

client.on('message', message => {
    if(message.content.startsWith(`${prefix}sleep`)){
        message.channel.send('Indo dormir')
        client.destroy()
    }
})



client.login(token);