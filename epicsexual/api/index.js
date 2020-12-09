const youtubedl = require('youtube-dl');
const Pornsearch = require('pornsearch');
const app = require('fastify')();
const { promisify } = require('util')


// app.get('/videos/:searchTerm', async (req, reply) => {
//     const search_results = await searchVideoLinks(req.params.searchTerm);
//     console.log("SEARCH RES ", search_results)
//   return {
//     searcher: search_results,
//     query: req.params.searchTerm,
//   };
// });
app.register(require('fastify-socket.io'));
app.io.on('connection', () => { /* … */ });
app.listen(3000);
// app.register(require('fastify-socket.io'));
// app.io.on('connection', client => {
//   client.on('search-term', async (data) => { 
//     await searchVideoLinks(data);
//    });
//   client.on('disconnect', () => { /* … */ });
// });
// app.listen(3000).then(() => {
//   console.log('Server running at http://localhost:3000/');
// });
console.log('Server Running');
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

  const videoArray = [p_s , r_t, x_v]
  const getInfo = promisify(youtubedl.getInfo).bind(youtubedl)
  let urls = []
  for(let i = 0; i < videoArray.length; i++){
    urls = urls.concat(videoArray[i].map(v => v.url));
  }
  console.log("URLS ", urls)
  for(var i = 0; i < urls.length; i++) {
    try {
      let info = await getInfo(urls[i])
      console.log("INFO ", info)
      app.io.emit('search-term-result', info);
      // returnArray.push(info)
    } catch(err) {
      console.log("ERR ", err)
    }
  }
  // return returnArray
}


// let processVideoLinks = async (vidLinks) => {
//   let proArray = []
//   for (const vidLink in vidLinks) {
//     youtubedl.getInfo(vidLink.url, function (err, info) {
//       console.log("info", info)
//       if (err) throw err
//       proArray.push(vidLink.url)
//     })
//   }
//   return proArray;
// }