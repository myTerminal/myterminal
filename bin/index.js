#!/usr/bin/env node
var path=require("path"),os=require("os"),spawn=require("child_process").spawn,blessed=require("blessed"),clear=require("clear");fse=require("fs-extra"),version=require("../package.json").version,args=process.argv,suppliedRelativeConfigPath=args[2],defaultConfigFilePath=path.resolve(os.homedir(),"myterminal-configs.json");var cliCompanion=function(){var e={};e.screen=blessed.screen({smartCSR:!0,title:"myterminal-cli v"+version,dockBorders:!0}),e.menuBox=blessed.box({parent:e.screen,left:0,top:0,width:"100%",height:"100%",tags:!0,style:{bg:"#111"}}),e.menuBoxTitle=blessed.text({parent:e.menuBox,left:0,top:0,width:"100%",height:"shrink",content:"myterminal-cli v"+version,tags:!0,align:"center",padding:1,style:{bg:"#00FFFF"}}),e.menuBoxThreader=blessed.text({parent:e.menuBox,left:0,top:3,width:"100%",height:"shrink",content:"All",tags:!0,padding:1,style:{bg:"#111"}}),e.menuBoxInstructions=blessed.text({parent:e.menuBox,left:0,top:6,width:"100%",height:"shrink",content:"Press a marked key to perform the respective operation",tags:!0,style:{bg:"#111"}}),e.menuBoxTable=blessed.text({parent:e.menuBox,left:0,top:7,width:"100%",height:"shrink",content:"{red-fg}(q){/} Quit",tags:!0,padding:1,style:{bg:"#111"}}),e.commandLogBox=blessed.box({parent:e.screen,left:"50%-1",top:0,width:"50%+1",height:"100%",border:{type:"bg",top:!1,right:!1,bottom:!1,left:!0},hidden:!0,scrollable:!0,alwaysScroll:!0,tags:!0,style:{border:{fg:"#339933"}}}),e.commandLogBoxTitle=blessed.text({parent:e.commandLogBox,left:0,top:0,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{bg:"green"}}),e.commandLogBoxSubtitle=blessed.text({parent:e.commandLogBox,left:0,top:1,width:"100%",height:"shrink",content:"",tags:!0,hidden:!0,align:"center",style:{fg:"black",bg:"white"}}),e.prompt=blessed.prompt({parent:e.screen,border:"line",height:"shrink",width:"half",top:"center",left:"center",label:" {blue-fg}Enter the value for{/blue-fg} ",tags:!0,keys:!0,vi:!0});var t,n,o,r,i=[";",".","/","q","C-c","C-q"],c=[],s=function(){fse.copySync(path.resolve(__dirname,"../examples/configs.json"),defaultConfigFilePath,{overwrite:!1})},a=function(e){t=e},l=function(){u(),y()},m=function(){e.commandLogBox.setContent("")},u=function(){d(),g(),e.screen.render()},d=function(){var n=c.map(function(e,t){return c.slice(0,t+1)}).map(function(e,n){return e.reduce(function(e,t){return e.commands[t]},t)}).map(function(e){return e.title}),o=[t.title].concat(n).map(function(e){return"{#00FFFF-fg}"+e+"{/}"}).join(" -> ");e.menuBoxThreader.setContent(o)},g=function(){var r=b(),i=[];x().forEach(function(e){i.push("{green-fg}("+e+"){/} "+r.commands[e].title+(r.commands[e].commands?"...":""))}),i.push(""),n&&i.push("{green-fg}(;){/} Select the last action"),o&&i.push("{green-fg}(.){/} Re-run the last command"),i.push("{green-fg}(/){/} Run a custom command"),i.push(""),r!==t?i.push("{red-fg}(q){/} Go back..."):i.push("{red-fg}(q){/} Quit"),e.menuBoxTable.setContent(i.join("\n"))},f=function(t){m(),e.commandLogBoxTitle.setContent("{green-bg}Command: "+(t.title||t.task)+"{/}"),e.commandLogBoxTitle.show(),e.commandLogBoxSubtitle.setContent("{white-bg}Directory: "+F(t.directory)+"{/}"),e.commandLogBoxSubtitle.show(),e.commandLogBox.insertBottom(""),e.commandLogBox.insertBottom(""),e.screen.render()},h=function(){e.commandLogBox.insertBottom("{green-bg}Done{/}"),e.commandLogBox.setScrollPerc(100),e.screen.render()},p=function(){e.menuBoxTable.insertBottom("\nYou can press {yellow-fg}(\\){/} to abort current task")},b=function(){return c.length?c.reduce(function(e,t){return e.commands[t]},t):t},x=function(){return Object.keys(b().commands)},B=function(e){return c.length?c.reduce(function(e,t){return e.commands[t]},t).commands[e]:t.commands[e]},y=function(){x().concat(i).forEach(function(t){e.screen.key(t,w)})},k=function(){x().concat(i).forEach(function(t){e.screen.unkey(t)})},v=function(){e.screen.key("\\",P)},C=function(){e.screen.unkey("\\")},L=function(){process.on("SIGINT",function(){r?E():process.exit()})},w=function(e){if(k(),"C-c"===e||"C-q"===e)A();else if("/"===e)u(),p(),j();else if(";"===e)n?(u(),p(),T(n)):l();else if("."===e)o?(u(),p(),f(o),R(o.task,o.directory)):l();else if("q"===e)c.length||A(),c.pop(),l();else if(x().indexOf(e)>-1){var t=B(e),r=t.task;r?(u(),p(),T(t)):(c.push(e),l())}else l()},P=function(t){e.commandLogBox.insertBottom("{magenta-bg}Aborted{/}"),e.commandLogBox.setScrollPerc(100),E()},S=function(e){q([],e.params,function(t){var n=[e.task].concat(t).join(" ");R(n,e.directory)})},q=function(t,n,o){t.length===n.length?o(t):e.prompt.input(n[t.length],"",function(r,i){try{q(t.concat([i]),n,o)}catch(t){e.commandLogBox.insertBottom("{red-bg}"+t.toString()+"{/}"),e.commandLogBox.setScrollPerc(100),l()}})},F=function(e){return e||b().directory||"."},T=function(t){n=t,e.menuBox.width="50%",e.commandLogBox.show(),f(t),t.params?S(t):R(t.task,t.directory)},j=function(){q([],["custom-command","directory"],function(e){var t=F(e[1]);T({title:e[0],task:e[0],directory:t})})},R=function(t,n){var i=t.split(" "),c=i[0],s=i.slice(1),a=F(n);o={task:t,directory:a},r=spawn(c,s,{cwd:a,shell:!0}),r.stdout.on("data",function(t){e.commandLogBox.insertBottom(t.toString()),e.commandLogBox.setScrollPerc(100),e.screen.render()}),r.stderr.on("data",function(t){e.commandLogBox.insertBottom("{red-bg}Error{/}"),e.commandLogBox.insertBottom("{red-fg}"+t.toString()+"{/}"),e.commandLogBox.setScrollPerc(100),e.screen.render()}),r.on("close",I),v()},E=function(){r.kill(),r=null},I=function(){h(),u(),r=null,C(),y()},A=function(){e.screen.destroy(),clear()};return L(),e.screen.enableKeys(),{copyConfigFileIfNotPresent:s,setConfigs:a,promptForAction:l}}(),absoluteConfigPath=suppliedRelativeConfigPath?path.resolve(process.cwd(),suppliedRelativeConfigPath):defaultConfigFilePath;cliCompanion.copyConfigFileIfNotPresent(),cliCompanion.setConfigs(require(absoluteConfigPath)),cliCompanion.promptForAction();