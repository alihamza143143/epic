const youtubedl = require('youtube-dl');
const Pornsearch = require('pornsearch');
const { promisify } = require('util')
var app = require('express')();
var http = require('http').Server(app);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Server running on port ${port} 🔥`));

var io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Socket Connected');
    socket.on('search-term', async(data) => {
        await searchVideoLinks(data);
    })
})

let searchVideoLinks = async (vidSearchTerm) => {
    // let returnArray = [];
    const phSearcher = new Pornsearch(vidSearchTerm, driver = 'pornhub');
    const rtSearcher = new Pornsearch(vidSearchTerm, driver = 'redtube');
    const xvSearcher = new Pornsearch(vidSearchTerm, driver = 'xvideos');
    // const sdcSearcher = new Pornsearch(vidSearchTerm, driver = 'sex');

    let p_s = await phSearcher.videos();
    let r_t = await rtSearcher.videos();
    let x_v = await xvSearcher.videos();
    // let s_dc = sdcSearcher.videos();

    const videoArray = [p_s, r_t, x_v]
    const getInfo = promisify(youtubedl.getInfo).bind(youtubedl)
    let urls = []
    for (let i = 0; i < videoArray.length; i++) {
        urls = urls.concat(videoArray[i].map(v => v.url));
    }
    console.log("URLS ", urls)
    for (var i = 0; i < urls.length; i++) {
        try {
            let info = await getInfo(urls[i])
            console.log("INFO ", info)
            io.emit('search-term-result', info);
            // returnArray.push(info)
        } catch (err) {
            console.log("ERR ", err)
        }
    }
    // return returnArray
}


