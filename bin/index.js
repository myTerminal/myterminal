#!/usr/bin/env node
var path=require("path"),os=require("os"),stdin=process.stdin,spawn=require("child_process").spawn,version=require("../package.json").version,prompt=require("prompt"),clear=require("clear"),chalk=require("chalk"),fse=require("fs-extra"),args=process.argv,suppliedRelativeConfigPath=args[2],defaultConfigFilePath=path.resolve(os.homedir(),"myterminal-configs.json"),myterminalCliCompanion=function(){var n,e,o,t=[],r=function(){fse.copySync(path.resolve(__dirname,"../examples/configs.json"),defaultConfigFilePath,{overwrite:!1})},i=function(e){n=e},c=function(){a(),g()},a=function(){s(),u(),m(),f()},s=function(){var n=l("myterminal-cli v"+version);clear(),console.log(chalk.inverse.cyan(x(" "))),console.log(chalk.inverse.cyan(n)),console.log(chalk.inverse.cyan(x(" "))+"\n")},l=function(n){var e=x(" ").length-n.length;return F(" ",Math.floor(e/2))+n+F(" ",Math.ceil(e/2))},u=function(){var e=t.map(function(n,e){return t.slice(0,e+1)}).map(function(e,o){return e.reduce(function(n,e){return n.commands[e]},n)}).map(function(n){return n.title});console.log(chalk.cyan([n.title].concat(e).join(" -> ")+"\n"))},m=function(){console.log("Press a marked key to perform the respective operation\n")},f=function(){var o=p();d().forEach(function(n){console.log(chalk.green("("+n+") ")+o.commands[n].title+(o.commands[n].commands?"...":""))}),console.log("\nPress "+chalk.green("'/'")+" to run a custom command"),e&&console.log("Press "+chalk.green("[space]")+" to re-run the last command"),o!==n?console.log(chalk.red("\n(q) ")+"Go back...\n"):console.log(chalk.red("\n(q) ")+"Quit\n")},p=function(){return t.length?t.reduce(function(n,e){return n.commands[e]},n):n},d=function(){return Object.keys(p().commands)},g=function(){k(),stdin.on("data",C)},h=function(){stdin.removeListener("data",C)},v=function(){k(),stdin.on("data",P)},y=function(){stdin.removeListener("data",P)},k=function(){stdin.setRawMode(!0),stdin.resume(),stdin.setEncoding("utf8")},C=function(n){if(h(),""===n)E();else if("/"===n)a(),w();else if(" "===n)e?(a(),j(e)):c();else if("q"===n)t.length||E(),t.pop(),c();else if(d().indexOf(n)>-1){var o=q(n),r=o.task;r?(a(),j(o)):(t.push(n),c())}else c()},P=function(n){""===n&&b()},q=function(e){return t.length?t.reduce(function(n,e){return n.commands[e]},n).commands[e]:n.commands[e]},w=function(){prompt.start(),prompt.get(["custom-command","directory"],function(n,e){j({title:e["custom-command"]+" in "+e.directory,task:e["custom-command"],directory:e.directory})})},j=function(n){e=n,console.log(chalk.inverse.green(l("Command: "+n.title))+"\n"),n.params?R(n):N(n.task,n.directory)},x=function(n){return new Array(process.stdout.columns-1).join(",").split(",").map(function(){return n}).join("")},F=function(n,e){return new Array(e).join(",").split(",").map(function(){return n}).join("")},N=function(n,e){var t=n.split(" "),r=t[0],i=t.slice(1);o=spawn(r,i,{cwd:e,stdio:[0,1,2],shell:!0}),o.on("close",I),v()},b=function(){o.kill(),o=null},I=function(){console.log("\n"+chalk.green(x("-"))),o=null,y(),g()},R=function(n){prompt.start(),prompt.get(n.params,function(e,o){var t=[n.task].concat(n.params.map(function(e,t){return o[n.params[t]]})).join(" ");N(t,n.directory)})},S=function(){process.on("SIGINT",function(){o?b():process.exit()})},E=function(){clear(),process.exit()};return S(),{copyConfigFileIfNotPresent:r,setConfigs:i,showNextScreen:c}}();prompt.message="Enter the value for ",prompt.delimiter="";var absoluteConfigPath=suppliedRelativeConfigPath?path.resolve(process.cwd(),suppliedRelativeConfigPath):defaultConfigFilePath;myterminalCliCompanion.copyConfigFileIfNotPresent(),myterminalCliCompanion.setConfigs(require(absoluteConfigPath)),myterminalCliCompanion.showNextScreen();