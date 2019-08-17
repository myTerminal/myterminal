"use strict";var _require=require("child_process"),spawn=_require.spawn,blessed=require("blessed"),clear=require("clear"),_require2=require("../package.json"),version=_require2.version;module.exports=function(){function n(e){a.commandLogBox.setContent(""),a.commandLogBoxTitle.setContent("{green-bg}Command: "+(e.title||e.task)+"{/}"),a.commandLogBoxTitle.show(),a.commandLogBoxSubtitle.setContent("{white-bg}Directory: "+k(e.directory)+"{/}"),a.commandLogBoxSubtitle.show(),a.commandLogBox.insertBottom(""),a.commandLogBox.insertBottom(""),a.screen.render()}function o(){a.menuBoxTable.insertBottom("\nYou can press {yellow-fg}(\\){/} to abort current task")}var r,c,s,i,a={},m=[";",".","/","q","C-c","C-q"],l=[],e=function(){a.screen=blessed.screen({smartCSR:!0,title:"myterminal-cli v"+version,dockBorders:!0}),a.menuBox=blessed.box({parent:a.screen,left:0,top:0,width:"100%",height:"100%",tags:!0,style:{bg:"#111"}}),a.menuBoxTitle=blessed.text({parent:a.menuBox,left:0,top:0,width:"100%",height:"shrink",content:"myterminal-cli v"+version,tags:!0,align:"center",padding:1,style:{fg:"black",bg:"#00FFFF"}}),a.menuBoxThreader=blessed.text({parent:a.menuBox,left:0,top:3,width:"100%",height:"shrink",content:"All",tags:!0,padding:1,style:{bg:"#111"}}),a.menuBoxInstructions=blessed.text({parent:a.menuBox,left:0,top:6,width:"100%",height:"shrink",content:"Press a marked key to perform the respective operation",tags:!0,style:{bg:"#111"}}),a.menuBoxTable=blessed.text({parent:a.menuBox,left:0,top:7,width:"100%",height:"shrink",content:"{red-fg}(q){/} Quit",tags:!0,padding:1,style:{bg:"#111"}}),a.commandLogBox=blessed.box({parent:a.screen,left:"50%-1",top:0,width:"50%+1",height:"100%",border:{type:"bg",top:!1,right:!1,bottom:!1,left:!0},hidden:!0,scrollable:!0,alwaysScroll:!0,tags:!0,style:{border:{fg:"#339933"}}}),a.commandLogBoxTitle=blessed.text({parent:a.commandLogBox,left:0,top:0,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{bg:"green"}}),a.commandLogBoxSubtitle=blessed.text({parent:a.commandLogBox,left:0,top:1,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{fg:"black",bg:"white"}}),a.prompt=blessed.prompt({parent:a.screen,border:"line",height:"shrink",width:"half",top:"center",left:"center",label:" {blue-fg}Enter the value for{/blue-fg} ",tags:!0,keys:!0,vi:!0})},u=function(){d(),p()},d=function(){t(),g(),a.screen.render()},t=function(){var e=l.map(function(e,t){return l.slice(0,t+1)}).map(function(e){return e.reduce(function(e,t){return e.commands[t]},r)}).map(function(e){return e.title}),t=[r.title].concat(e).map(function(e){return"{#00FFFF-fg}"+e+"{/}"}).join(" -> ");a.menuBoxThreader.setContent(t)},g=function(){var t=f(),n=[];h().forEach(function(e){n.push("{green-fg}("+e+"){/} "+t.commands[e].title+(t.commands[e].commands?"...":""))}),n.push(""),c&&n.push("{green-fg}(;){/} Select the last action"),s&&n.push("{green-fg}(.){/} Re-run the last command"),n.push("{green-fg}(/){/} Run a custom command"),n.push(""),t!==r?n.push("{red-fg}(q){/} Go back..."):n.push("{red-fg}(q){/} Quit"),a.menuBoxTable.setContent(n.join("\n"))},f=function(){return l.length?l.reduce(function(e,t){return e.commands[t]},r):r},h=function(){return Object.keys(f().commands)},p=function(){h().concat(m).forEach(function(e){return a.screen.key(e,x)})},b=function(){process.on("SIGINT",function(){i?q():process.exit()})},x=function(e){if(h().concat(m).forEach(function(e){return a.screen.unkey(e)}),"C-c"===e||"C-q"===e)C();else if("/"===e)d(),o(),w();else if(";"===e)c?(d(),o(),L(c)):u();else if("."===e)s?(d(),o(),n(s),v(s.task,s.directory)):u();else if("q"===e)l.length||C(),l.pop(),u();else if(-1<h().indexOf(e)){var t=function(e){return l.length?l.reduce(function(e,t){return e.commands[t]},r).commands[e]:r.commands[e]}(e);t.task?(d(),o(),L(t)):(l.push(e),u())}else u()},B=function(){a.commandLogBox.insertBottom("{magenta-bg}Aborted{/}"),a.commandLogBox.setScrollPerc(100),q()},y=function n(o,r,c){o.length===r.length?c(o):a.prompt.input(r[o.length],"",function(e,t){try{n(o.concat([t]),r,c)}catch(e){a.commandLogBox.insertBottom("{red-bg}"+e.toString()+"{/}"),a.commandLogBox.setScrollPerc(100),u()}})},k=function(e){return e||f().directory||"."},L=function(e){c=e,a.menuBox.width="50%",a.commandLogBox.show(),n(e),e.params?function(n){y([],n.params,function(e){var t=[n.task].concat(e).join(" ");v(t,n.directory)})}(e):v(e.task,e.directory)},w=function(){y([],["custom-command","directory"],function(e){var t=k(e[1]);L({title:e[0],task:e[0],directory:t})})},v=function(e,t){var n=e.split(" "),o=n[0],r=n.slice(1),c=k(t);s={task:e,directory:c},(i=spawn(o,r,{cwd:c,shell:!0})).stdout.on("data",function(e){a.commandLogBox.insertBottom(e.toString()),a.commandLogBox.setScrollPerc(100),a.screen.render()}),i.stderr.on("data",function(e){a.commandLogBox.insertBottom("{red-bg}Error{/}"),a.commandLogBox.insertBottom("{red-fg}"+e.toString()+"{/}"),a.commandLogBox.setScrollPerc(100),a.screen.render()}),i.on("close",S),a.screen.key("\\",B)},q=function(){i.kill(),i=null},S=function(){a.commandLogBox.insertBottom("{green-bg}Done{/}"),a.commandLogBox.setScrollPerc(100),a.screen.render(),d(),i=null,a.screen.unkey("\\"),p()},C=function(){a.screen.destroy(),clear()};return{setConfigs:function(e){r=e},init:function(){b(),e(),a.screen.enableKeys(),u()}}}();