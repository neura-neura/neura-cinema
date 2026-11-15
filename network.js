/* Bound the complete request, including a stalled response body. */
(function(root){
 'use strict';
 async function json(url,options={},timeoutMs=12000){
  const controller=new AbortController();let timedOut=false;
  const cancel=()=>controller.abort(options.signal.reason);
  if(options.signal){if(options.signal.aborted)cancel();else options.signal.addEventListener('abort',cancel,{once:true})}
  const timer=setTimeout(()=>{timedOut=true;controller.abort()},timeoutMs);
  try{const response=await fetch(url,{...options,signal:controller.signal});const data=await response.json();return {response,data}}
  catch(e){if(timedOut){const failure=new Error('El servidor tardó demasiado en responder. Reintenta la conexión; si estás en casa, usa «Guardar y conectar por LAN».');failure.name='ConnectionTimeoutError';throw failure}throw e}
  finally{clearTimeout(timer);options.signal?.removeEventListener('abort',cancel)}
 }
 root.CinemaNet={json};
})(globalThis);
