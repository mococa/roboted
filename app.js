const express = require('express')
var app = express()
var robo = require('./robo');

app.use(express.json({ limit: '50mb' }))
//app.set('trust proxy', true);


app.get('/', (req,res)=>{
    res.send('koe')
})
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});
app.use('/api/robo', robo)
app.listen(3000, ()=>{
    console.log('ouvindo na porta 3000')
})