/**
 * Created by sea35 on 2017/1/12.
 */
import koa from 'koa';
import koaServeIndex from 'koa-serve-index';
import koaStatic  from 'koa-static';
const proxy = require('koa-proxies')
const app = new koa();
const defaultCwd = process.cwd();
const defaultArgs={
    port:3001
}

function proxyConfigAnalyze(context) {
    let l=context.indexOf("/(.*)");
    if(l>=0){
        return function (url) {
            var newUrl= url.replace(context.replace("/(.*)",""),"");
            console.log(newUrl);
            return newUrl;
        }
    }
    return null;
}
function formatProxy(context) {
    return context.replace("/*","").replace("/(.*)","").replace("post","").replace("get","").replace("POST","").replace("GET","").trim();
}
export default function createServer(_args){

    const args={...defaultArgs,..._args};

    app.use(koaServeIndex(defaultCwd,{
        hidden: true,
        view: 'details',
    }));

    app.use(koaStatic(defaultCwd));
    let proxyTable;
    try{
        proxyTable=require(defaultCwd+"/proxy.config.js");
    }catch(e){
        console.log("not find proxy.config.js");
    }

    Object.keys(proxyTable).forEach(context => {
        let options = proxyTable[context]
        if (typeof options === 'string') {
            options = {
                target: options,
                changeOrigin: true,
                logs: true,
                rewrite:proxyConfigAnalyze(context)
            }
        }
        app.use(proxy(formatProxy(context), options))
    })
    app.listen(args.port,e => console.log(e || 'listening at port '+args.port));
}




