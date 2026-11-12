export const rooms = {
  control: {title:"Control Room", art:"control", alt:"The Star City control room", exits:{NORTH:"habitat", EAST:"airlock"}, detail:"Red dust rattles against the windows. The mining crew has stopped answering the radio. A flashlight and a radio sit on the desk. The habitat concourse is north and the service airlock is east."},
  habitat: {title:"Habitat Concourse", art:"colony", alt:"The habitat domes in the Martian canyon", exits:{SOUTH:"control", WEST:"clinic", EAST:"depot"}, detail:"Families watch a pressure gauge that has stopped updating. The emergency panel has an empty battery slot. A nurse beckons from the clinic to the west. The equipment depot is east."},
  clinic: {title:"Clinic", art:"colony", alt:"The Star City habitat sector", exits:{EAST:"habitat"}, detail:"A nurse has moved the patients around a portable oxygen bank. A charged battery on the counter is reserved for the emergency panel."},
  depot: {title:"Equipment Depot", art:"control", alt:"Equipment at the Star City facility", exits:{WEST:"habitat"}, detail:"A cable scanner and a heavy valve wrench hang from numbered hooks. A placard shows the old municipal bypass."},
  airlock: {title:"Service Airlock", art:"airlock", alt:"A service rover and a relay in the Martian dust", exits:{}, detail:"You suit up and wait for the pressure to equalize. The surface lights disappear in the storm. Through the static, you hear a voice."}
};
const items = {"FLASHLIGHT":"Flashlight","BATTERY":"Charged battery","SCANNER":"Cable scanner","WRENCH":"Valve wrench"};
const pickups = {control:"FLASHLIGHT", clinic:"BATTERY", depot:"SCANNER WRENCH"};
const descriptions = {
  "control:RADIO":"The mine’s relay is silent. The clinic is calling on the internal line.",
  "control:FLASHLIGHT":"A working flashlight, ready for the mine.",
  "habitat:PANEL":"Emergency panel. It takes one charged battery. The clinic is to the west.",
  "clinic:CLINIC":"The nurse has set aside a charged battery for the concourse.",
  "clinic:BATTERY":"A charged battery for the habitat emergency panel.",
  "depot:SCANNER":"A handheld cable scanner.",
  "depot:WRENCH":"A heavy valve wrench."
};
export function newGame(){return {room:"control", inventory:new Set(), powered:false, complete:false}}
export function look(state){const r=rooms[state.room];const detail=state.room==="habitat"&&state.powered?"The pressure monitors are back online. The clinic is west and the equipment depot is east.":r.detail;const exits=Object.keys(r.exits);return detail+(exits.length?"\n\nExits: "+exits.join(", ")+".":"")}
export function run(state, raw) {
  let command=raw.trim().toUpperCase().replace(/\s+/g," ");
  if(state.complete)return "The opening mission is complete.";
  if(command==="LOOK")return look(state);
  if(command==="HELP")return "LOOK • GO NORTH / SOUTH / EAST / WEST • EXAMINE [object] • TAKE [object] • USE [object] • INVENTORY.";
  if(command==="INVENTORY")return state.inventory.size ? [...state.inventory].map(x=>items[x]).join(", ")+".":"You’re carrying nothing.";
  if(/^(NORTH|SOUTH|EAST|WEST)$/.test(command))command="GO "+command;
  const [verb,...rest]=command.split(" "), obj=rest.join(" ");
  if(verb==="GO"){
    const next=rooms[state.room].exits[obj];
    if(!next)return "There’s no exit in that direction.";
    if(next==="airlock"){
      if(!state.powered)return "Restore the habitat emergency panel before leaving.";
      if(!state.inventory.has("SCANNER")||!state.inventory.has("WRENCH"))return "The airlock checklist requires a cable scanner and a valve wrench from the depot.";
      state.complete=true;
    }
    state.room=next;
    return look(state);
  }
  if(verb==="EXAMINE")return descriptions[state.room+":"+obj]??"You don’t see that here.";
  if(verb==="TAKE"){
    if(state.inventory.has(obj))return "You already have it.";
    if(!(pickups[state.room]??"").split(" ").includes(obj)||(obj==="BATTERY"&&state.powered))return "You can’t take that here.";
    state.inventory.add(obj);
    return "Taken: "+items[obj]+".";
  }
  if(verb==="USE"&&obj==="BATTERY"&&state.room==="habitat"){
    if(state.powered)return "The habitat panel is already powered.";
    if(!state.inventory.delete("BATTERY"))return "You’re not carrying a battery.";
    state.powered=true;
    return "The battery clicks into place. The pressure monitors come back online.";
  }
  if(verb==="USE"&&obj==="FLASHLIGHT"&&state.inventory.has(obj))return "The flashlight works. Keep it for the mine.";
  return "Command not recognized here. Try LOOK or HELP.";
}
