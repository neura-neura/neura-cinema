/* Local addresses are user-selected; never send guest/admin credentials to public HTTP hosts. */
(function(root){
 'use strict';const KEY='cinemaLanAddress',DEFAULT='http://192.168.3.130:8767';
 function normalize(address,port){
  let value=String(address||'').trim();if(!value)throw Error('Introduce la IP o el nombre local de tu servidor.');
  if(!/^https?:\/\//i.test(value))value='http://'+value;
  let u;try{u=new URL(value)}catch(e){throw Error('La dirección local no es válida.')}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.pathname!=='/'||u.search||u.hash)throw Error('Introduce solo la dirección del servidor y su puerto, sin rutas ni credenciales.');
  const host=u.hostname.replace(/^\[|\]$/g,'').toLowerCase();let privateHost=host==='localhost'||host==='::1'||host.endsWith('.local');
  if(/^\d+\.\d+\.\d+\.\d+$/.test(host)){let v=host.split('.').map(Number);privateHost=v.every(n=>n>=0&&n<=255)&&(v[0]===10||v[0]===127||(v[0]===192&&v[1]===168)||(v[0]===172&&v[1]>=16&&v[1]<=31)||(v[0]===169&&v[1]===254));}
  if(/^(?:f[cd][a-f0-9]{2}|fe[89ab][a-f0-9]):/.test(host))privateHost=true;
  if(!privateHost)throw Error('Usa una IP privada de tu red o un nombre terminado en .local.');
  let chosen=String(u.port||port||8767).trim();if(!/^\d+$/.test(chosen)||Number(chosen)<1||Number(chosen)>65535)throw Error('El puerto debe estar entre 1 y 65535.');
  u.port=String(Number(chosen));let display=u.protocol==='https:'?'https://'+u.hostname:u.hostname;
  return {address:display,port:Number(chosen),url:u.origin};
 }
 function load(storage){try{return normalize(storage.getItem(KEY)||DEFAULT)}catch(e){return normalize(DEFAULT)}}
 function save(storage,address,port){const config=normalize(address,port);storage.setItem(KEY,config.url);return config}
 root.CinemaLan={normalize,load,save,key:KEY};
})(globalThis);
