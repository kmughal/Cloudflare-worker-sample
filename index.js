addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const page =
    "<!DOCTYPE html><html lang='en'> <head> <meta charset='UTF-8'/> <meta name='viewport' content='width=device-width, initial-scale=1.0'/> <title>Document</title> </head> <body> <h1>Line Status <button onClick='start()'>Reload</button></h1> <hr/> <div id='output'></div><script>start(); function start(){document.getElementById('output').innerHTML='realoding wait'; fetch('https://api.tfl.gov.uk/line/mode/tube/status').then(res=> res.json()).then(json=>{createUI(json)}).catch(console.error);}function createUI(data){const html=[]; for(let i=0;i<data.length;i++){html.push(createLine(data[i]));}document.getElementById('output').innerHTML=html.join('');}function createLine(line){return ['<h1>',line.name, ' ' , getStatus(line.lineStatuses)].join(' ');}function getStatus(ls){if (ls.every(l=> l.statusSeverity===10)) return 'Good Service'; return ls.map(l=>{return l.statusSeverityDescription}).join(' ');}</script> </body></html>"

  console.log(request.url.indexOf('line-status'), 'is line status')
  if (request.url.indexOf('line-status') !== -1) {
    const res = await fetch('https://api.tfl.gov.uk/line/mode/tube/status')
    const json = await res.json()
    return new Response(JSON.stringify(json, null, 4), {
      headers: { 'content-type': 'application/json' },
    })
  } else
    return new Response(page, {
      headers: { 'content-type': 'text/html' },
    })
}
