import {Input,ALL_FORMATS,BlobSource,Output,Mp4OutputFormat,StreamTarget,Conversion,Quality,canEncodeVideo} from './vendor/mediabunny-1.66.0.mjs';
const VERSION=1,MAX_AGE=48*3600*1000;
let active=null;
export function cancel(){return active?.cancel()}
async function cacheDirectory(){if(!navigator.storage?.getDirectory)throw Error('Este navegador no ofrece almacenamiento temporal para convertir videos grandes. Usa Chrome/Edge actualizado o desmarca «Preparar en esta computadora».');return(await navigator.storage.getDirectory()).getDirectoryHandle('neura-cinema-prepared',{create:true})}
async function hash(text){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),x=>x.toString(16).padStart(2,'0')).join('')}
async function remove(dir,key){for(let ext of ['.mp4','.json'])try{await dir.removeEntry(key+ext)}catch(e){if(e.name!=='NotFoundError')throw e}}
async function clean(dir,keep){for await(let [name,handle] of dir.entries()){if(handle.kind!=='file'||!name.endsWith('.json')||name===keep+'.json')continue;try{let meta=JSON.parse(await(await handle.getFile()).text());if(Date.now()-meta.created>MAX_AGE)await remove(dir,name.slice(0,-5))}catch(e){if(Date.now()-(await handle.getFile()).lastModified>MAX_AGE)await remove(dir,name.slice(0,-5))}}for await(let [name,handle] of dir.entries()){if(handle.kind==='file'&&name.endsWith('.mp4')&&name!==keep+'.mp4'&&Date.now()-(await handle.getFile()).lastModified>MAX_AGE)await remove(dir,name.slice(0,-4))}}
export async function prepare(original,profile,onProgress,isStopped){
 const dir=await cacheDirectory(),key=await hash(JSON.stringify([VERSION,original.name,original.size,original.lastModified,profile]));await clean(dir,key);
 const work=async()=>{
  const resultName=original.name.replace(/\.[^.]+$/,'')+'.'+profile+'p.mp4';
  try{let meta=JSON.parse(await(await dir.getFileHandle(key+'.json')).getFile().then(f=>f.text()));if(Date.now()-meta.created<MAX_AGE){let f=await(await dir.getFileHandle(key+'.mp4')).getFile();if(f.size===meta.size&&f.size>0){onProgress({phase:'cached',progress:1});return{file:new File([f],resultName,{type:'video/mp4',lastModified:meta.created}),clear:()=>remove(dir,key)}}}}catch(e){}
  if(isStopped())throw Error('Preparación detenida');
  await remove(dir,key);
  const input=new Input({formats:ALL_FORMATS,source:new BlobSource(original)});let output;
  try{
   const video=await input.getPrimaryVideoTrack(),audio=await input.getPrimaryAudioTrack();if(!video)throw Error('El archivo no contiene una pista de video compatible');
   let iw=await video.getDisplayWidth(),ih=await video.getDisplayHeight();let ratio=Math.min(1,Number(profile)/ih,({'480':854,'720':1280,'1080':1920}[profile])/iw);let width=Math.max(2,Math.floor(iw*ratio/2)*2),height=Math.max(2,Math.floor(ih*ratio/2)*2);let quality=new Quality({bitrate:{'480':850000,'720':1900000,'1080':3800000}[profile],bitrateMode:'constant'});
   if(!await canEncodeVideo('avc',{width,height,quality}))throw Error('Tu navegador no puede codificar H.264 con este perfil. Usa Chrome/Edge actualizado o desmarca la preparación local.');
   const duration=await input.computeDuration();const estimate=duration*({'480':1.1,'720':2.2,'1080':4.3}[profile])*1e6/8;const space=await navigator.storage.estimate();if(Number.isFinite(space.quota)&&Number.isFinite(space.usage)&&space.quota-space.usage<estimate*1.3)throw Error('No queda espacio temporal suficiente en este navegador para preparar el MP4. Libera espacio o usa el servidor.');
   const handle=await dir.getFileHandle(key+'.mp4',{create:true}),stream=await handle.createWritable();
   output=new Output({format:new Mp4OutputFormat({fastStart:'reserve'}),target:new StreamTarget(stream,{chunked:true,chunkSize:4*1024**2})});
   active=await Conversion.init({input,output,tracks:'primary',video:{width,height,fit:'contain',codec:'avc',quality,hardwareAcceleration:'prefer-hardware',keyFrameInterval:2,allowTransformationMetadata:false},audio:{codec:'aac',quality:new Quality({bitrate:128000}),numberOfChannels:2,sampleRate:48000},tags:{},showWarnings:false});
   // Never silently drop the selected video's audio when a decoder is unavailable.
   if(!active.isValid||active.discardedTracks.some(t=>t.track===video||t.track===audio))throw Error('Este navegador no puede convertir una pista de video o audio de este archivo. Puedes usar la preparación en el servidor.');
   active.onProgress=p=>{onProgress({phase:'converting',progress:Math.min(.995,p),duration});if(isStopped())void active?.cancel()};
   if(isStopped())throw Error('Preparación detenida');await active.execute();active=null;
   const f=await handle.getFile();if(!f.size)throw Error('La conversión produjo un archivo vacío');
   const created=Date.now(),metadata=await dir.getFileHandle(key+'.json',{create:true}),writer=await metadata.createWritable();await writer.write(JSON.stringify({created,size:f.size}));await writer.close();onProgress({phase:'complete',progress:1,duration});
   return{file:new File([f],resultName,{type:'video/mp4',lastModified:created}),clear:()=>remove(dir,key)};
  }catch(e){try{await active?.cancel()}catch{}active=null;try{await output?.cancel()}catch{}await remove(dir,key).catch(()=>{});throw e}finally{input.dispose()}
 };
 return navigator.locks?navigator.locks.request('cinema-prepare:'+key,work):work();
}
