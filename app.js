import {rooms,newGame,look,run} from "./engine.js";
const by=id=>document.getElementById(id);
const log=by("log"), input=by("command"), form=by("command-form"), scene=by("scene"), quick=by("quick");
let state=newGame();
function line(value, style){
  const p=document.createElement("p");
  p.textContent=value;
  if(style)p.className=style;
  log.append(p);
  log.scrollTop=log.scrollHeight;
}
function updateRoom(){
  const room=rooms[state.room];
  by("room-title").textContent=room.title;
  scene.src="art/"+room.art+".webp";
  scene.alt=room.alt;
}
function submit(value,fromKeyboard=false){
  if(!value.trim()||state.complete)return;
  line("> "+value,"typed");
  line(run(state,value));
  updateRoom();
  if(state.complete){
    form.hidden=true;
    quick.hidden=true;
    by("goal").hidden=true;
    by("ending").hidden=false;
    by("ending-title").focus();
  }else if(fromKeyboard){ input.focus(); }
}
function start(){
  state=newGame();
  log.replaceChildren();
  input.value="";
  form.hidden=false;
  quick.hidden=false;
  by("goal").hidden=false;
  by("ending").hidden=true;
  by("cover").hidden=true;
  by("game").hidden=false;
  updateRoom();
  line(look(state));
  line("Type HELP for available commands.","meta");
  by("room-title").focus();
}
for(const [label,cmd] of [["Look","LOOK"],["North","GO NORTH"],["South","GO SOUTH"],["East","GO EAST"],["West","GO WEST"],["Inventory","INVENTORY"],["Help","HELP"]]){
  const button=document.createElement("button");
  button.type="button";
  button.textContent=label;
  button.addEventListener("click",()=>submit(cmd));
  quick.append(button);
}
form.addEventListener("submit",event=>{event.preventDefault();const value=input.value;input.value="";submit(value,true)});
by("start").addEventListener("click",start);
by("restart").addEventListener("click",start);
