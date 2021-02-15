const express = require('express')
const router = express.Router();
module.exports = router;
var Datastore = require('nedb')
var cmdsDB = new Datastore('comandos.db');
var perguntasDB = new Datastore('perguntas.db');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function loadDatabase(){
    cmdsDB.loadDatabase()
    perguntasDB.loadDatabase()
}
//javascript object notation
loadDatabase()
//fazer o comando do play (youtube)
//[] ==> array inteiros positivos: [1,2,3,4,5,6,7....]
comando('twitch cellbit')
function comando(cmd){
    cmdsDB.find({}, function(err,objetos){
        var comandos = []
        //comandos = [ "bla", "ble", "bli", "blo", "blu", "blão"  ]
        for(const obj of objetos){
            for(const _comando of obj.comando){
                comandos.push(_comando)
            }
            //cmd.split(' ')[0] é a primeira palavra de cmd
            if(comandos.includes(cmd.split(' ')[0])){
                if(obj.function == "plataforma"){
                    plataforma(obj, cmd.substring(cmd.split(' ')[0].length+1))
                }else{
                    var func = eval(obj.function)
                    func(cmd.substring(cmd.split(' ')[0].length+1))
                }
                break;
            }
        }
        
        
    })
}
function play(nomeDaMusica){
    console.log(`tocando ${nomeDaMusica}`)
}
function plataforma(objeto, nome){
    var ignorar = ["de ","do ","da "]
    var naoConhecoTxt = ""

    switch(objeto.id){
        case "youtube":
            var ar = ["Ainda não conheço este(a) Youtuber. Qual seu canal?",
            "Quem é este(a) Youtuber. Qual seu canal?",
            "Não sabia que era Youtuber. Qual é o canal dele(a)?"]
            naoConhecoTxt = ar[Math.floor(Math.random()*ar.length)]
        break;
        case "twitch":
            var ar = ["Ainda não conheço este(a) Streamer. Qual seu canal?",
                      "Quem é este(a) Streamer. Qual seu canal?",
                      "Não sabia que era Streamer. Qual é o canal dele(a)?"
                     ]
            naoConhecoTxt = ar[Math.floor(Math.random()*ar.length)]
        break;
    }
    for(const elem of ignorar){
        if(nome.startsWith(elem)){
            nome = nome.substring(elem.length)
            break;
        }
    }
    const carinha = objeto.db.find(x=>x.nome==nome)
    
    if(carinha != undefined){
        console.log("Canal do(a) "+carinha.nome +" é "+objeto.url[0]+carinha.canal)
    }else{

        rl.question(naoConhecoTxt, function(canal){
                var regexUrl = /^(((https?:\/\/)?(www\.)?(.+[a-z]\.\w{2,3})\/.+[a-z])|\w*)$/gi
                if(regexUrl.test(canal)){
                    rl.question("Ok, vou tentar lembrar disso.", function(){
                        objeto.db.push({
                            nome:nome,
                            canal:canal
                        })
                        cmdsDB.update({'id':objeto.id}, { $set: { "db": objeto.db } },function(err,num){
                            console.log(objeto.db)
                        })
                    })
                }else{
                    rl.question("Canal inválido", function(){})
                }
            }
        ) 
    }   
}