var path=require("path"),os=require("os"),spawn=require("child_process").spawn,blessed=require("blessed"),clear=require("clear"),fse=require("fs-extra"),version=require("../package.json").version,defaultConfigFilePath=path.resolve(os.homedir(),"myterminal-configs.json");module.exports=function(){var e={};e.screen=blessed.screen({smartCSR:!0,title:"myterminal-cli v"+version,dockBorders:!0}),e.menuBox=blessed.box({parent:e.screen,left:0,top:0,width:"100%",height:"100%",tags:!0,style:{bg:"#111"}}),e.menuBoxTitle=blessed.text({parent:e.menuBox,left:0,top:0,width:"100%",height:"shrink",content:"myterminal-cli v"+version,tags:!0,align:"center",padding:1,style:{fg:"black",bg:"#00FFFF"}}),e.menuBoxThreader=blessed.text({parent:e.menuBox,left:0,top:3,width:"100%",height:"shrink",content:"All",tags:!0,padding:1,style:{bg:"#111"}}),e.menuBoxInstructions=blessed.text({parent:e.menuBox,left:0,top:6,width:"100%",height:"shrink",content:"Press a marked key to perform the respective operation",tags:!0,style:{bg:"#111"}}),e.menuBoxTable=blessed.text({parent:e.menuBox,left:0,top:7,width:"100%",height:"shrink",content:"{red-fg}(q){/} Quit",tags:!0,padding:1,style:{bg:"#111"}}),e.commandLogBox=blessed.box({parent:e.screen,left:"50%-1",top:0,width:"50%+1",height:"100%",border:{type:"bg",top:!1,right:!1,bottom:!1,left:!0},hidden:!0,scrollable:!0,alwaysScroll:!0,tags:!0,style:{border:{fg:"#339933"}}}),e.commandLogBoxTitle=blessed.text({parent:e.commandLogBox,left:0,top:0,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{bg:"green"}}),e.commandLogBoxSubtitle=blessed.text({parent:e.commandLogBox,left:0,top:1,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{fg:"black",bg:"white"}}),e.prompt=blessed.prompt({parent:e.screen,border:"line",height:"shrink",width:"half",top:"center",left:"center",label:" {blue-fg}Enter the value for{/blue-fg} ",tags:!0,keys:!0,vi:!0});var t,n,o,r,c=[";",".","/","q","C-c","C-q"],s=[],i=function(){fse.copySync(path.resolve(__dirname,"../examples/configs.json"),defaultConfigFilePath,{overwrite:!1})},a=function(e){t=e},l=function(){d(),y()},m=function(){e.commandLogBox.setContent("")},d=function(){u(),g(),e.screen.render()},u=function(){var n=s.map(function(e,t){return s.slice(0,t+1)}).map(function(e,n){return e.reduce(function(e,t){return e.commands[t]},t)}).map(function(e){return e.title}),o=[t.title].concat(n).map(function(e){return"{#00FFFF-fg}"+e+"{/}"}).join(" -> ");e.menuBoxThreader.setContent(o)},g=function(){var r=x(),c=[];b().forEach(function(e){c.push("{green-fg}("+e+"){/} "+r.commands[e].title+(r.commands[e].commands?"...":""))}),c.push(""),n&&c.push("{green-fg}(;){/} Select the last action"),o&&c.push("{green-fg}(.){/} Re-run the last command"),c.push("{green-fg}(/){/} Run a custom command"),c.push(""),r!==t?c.push("{red-fg}(q){/} Go back..."):c.push("{red-fg}(q){/} Quit"),e.menuBoxTable.setContent(c.join("\n"))},f=function(t){m(),e.commandLogBoxTitle.setContent("{green-bg}Command: "+(t.title||t.task)+"{/}"),e.commandLogBoxTitle.show(),e.commandLogBoxSubtitle.setContent("{white-bg}Directory: "+T(t.directory)+"{/}"),e.commandLogBoxSubtitle.show(),e.commandLogBox.insertBottom(""),e.commandLogBox.insertBottom(""),e.screen.render()},h=function(){e.commandLogBox.insertBottom("{green-bg}Done{/}"),e.commandLogBox.setScrollPerc(100),e.screen.render()},p=function(){e.menuBoxTable.insertBottom("\nYou can press {yellow-fg}(\\){/} to abort current task")},x=function(){return s.length?s.reduce(function(e,t){return e.commands[t]},t):t},b=function(){return Object.keys(x().commands)},B=function(e){return s.length?s.reduce(function(e,t){return e.commands[t]},t).commands[e]:t.commands[e]},y=function(){b().concat(c).forEach(function(t){e.screen.key(t,S)})},k=function(){b().concat(c).forEach(function(t){e.screen.unkey(t)})},L=function(){e.screen.key("\\",C)},w=function(){e.screen.unkey("\\")},v=function(){process.on("SIGINT",function(){r?I():process.exit()})},S=function(e){if(k(),"C-c"===e||"C-q"===e)R();else if("/"===e)d(),p(),j();else if(";"===e)n?(d(),p(),P(n)):l();else if("."===e)o?(d(),p(),f(o),E(o.task,o.directory)):l();else if("q"===e)s.length||R(),s.pop(),l();else if(b().indexOf(e)>-1){var t=B(e),r=t.task;r?(d(),p(),P(t)):(s.push(e),l())}else l()},C=function(t){e.commandLogBox.insertBottom("{magenta-bg}Aborted{/}"),e.commandLogBox.setScrollPerc(100),I()},q=function(e){F([],e.params,function(t){var n=[e.task].concat(t).join(" ");E(n,e.directory)})},F=function(t,n,o){t.length===n.length?o(t):e.prompt.input(n[t.length],"",function(r,c){try{F(t.concat([c]),n,o)}catch(t){e.commandLogBox.insertBottom("{red-bg}"+t.toString()+"{/}"),e.commandLogBox.setScrollPerc(100),l()}})},T=function(e){return e||x().directory||"."},P=function(t){n=t,e.menuBox.width="50%",e.commandLogBox.show(),f(t),t.params?q(t):E(t.task,t.directory)},j=function(){F([],["custom-command","directory"],function(e){var t=T(e[1]);P({title:e[0],task:e[0],directory:t})})},E=function(t,n){var c=t.split(" "),s=c[0],i=c.slice(1),a=T(n);o={task:t,directory:a},r=spawn(s,i,{cwd:a,shell:!0}),r.stdout.on("data",function(t){e.commandLogBox.insertBottom(t.toString()),e.commandLogBox.setScrollPerc(100),e.screen.render()}),r.stderr.on("data",function(t){e.commandLogBox.insertBottom("{red-bg}Error{/}"),e.commandLogBox.insertBottom("{red-fg}"+t.toString()+"{/}"),e.commandLogBox.setScrollPerc(100),e.screen.render()}),r.on("close",A),L()},I=function(){r.kill(),r=null},A=function(){h(),d(),r=null,w(),y()},R=function(){e.screen.destroy(),clear()};return v(),e.screen.enableKeys(),{copyConfigFileIfNotPresent:i,setConfigs:a,promptForAction:l}}();