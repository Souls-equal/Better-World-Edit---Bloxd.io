# Better World Edit - Bloxd.io
Some tools to build easier in bloxd.io


ㅤ◆ㅤEach of them can generate textured shapes.

ㅤ◆ㅤEach code is made with the purpose of building certain shapes, so it is not just one code, it is often necessary to alternate.

ㅤ◆ㅤThe construction is rather fast but it should be possible to optimize even more, currently, it is made to cause almost no lag.

ㅤ◆ㅤAt the launch, tools are provided to make the best use of the codes, their uses are explained for each code.

ㅤ◆ㅤIn other cases, it is necessary to directly modify certain things in the code.

## 〖〔 Available Tools List 〕〗

ㅤ◈ㅤCubes / Rectangles Tools

ㅤ◈ㅤ3D Plane Tools

ㅤ◈ㅤCircles Tools

ㅤ◈ㅤSphere Tools

ㅤ◈ㅤLign Tools

ㅤ◈ㅤRock Tools

ㅤ◈ㅤTree Remover (default) Tools

ㅤ◈ㅤ2D & 3D Noise generation

ㅤ◈ㅤGradient Plane (plane V2) 

ㅤ◈ㅤ
```js
/* 
MIT License
Copyright (c) 2026 K4miNoK4mi - World Edit - ALL IN ONE 1.12
*/

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////

const WE_OWNER = "K4miNoK4mi"

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

const BLOCKS_GRASS = [
  "Grass Block","Lime Concrete","Lime Wool",
  "Lime Baked Clay","Jungle Grass Block","Lime Planks","Pine Grass Block",
]
const BLOCKS_ROCK = [
  "Stone","Cracked Stone Bricks","Stone Bricks","Messy Stone",
]
const BLOCKS_SPIKE = [
  "Obsidian","Black Concrete","Black Wool","Bedrock",
  "Black Portal","Purple Wool","Magenta Wool","Purple Ceramic","Purple Portal",
]

// all blocks that can be destroyed by the tree remover
const TREE_BREAKABLE = [
  "Maple Leaves","Maple Log","Fruity Maple Leaves",
  "Vines","Aspen Leaves","Aspen Log",
]

// Gradient plane blocks default
const GRADIENT = [
  ["Lime Concrete",  "Lime Wool"],
  ["Lime Concrete",  "Lime Baked Clay"],
  ["Green Concrete", "Jungle Grass Block"],
  ["Brown Concrete", "Dirt"],
  ["Brown Concrete", "Brown Wool"],
]

// noise terrain 

const BLOCKS_TERRAIN_3D = ["Stone","Messy Stone","Stone Bricks"]

const COLOR_BLOCKS = [
  {value:0.1,block:"White Wool"},{value:0.2,block:"White Chalk"},
  {value:0.3,block:"White Concrete"},{value:0.4,block:"Light Gray Chalk"},
  {value:0.5,block:"Light Gray Wool"},{value:0.6,block:"Light Gray Concrete"},
  {value:0.7,block:"Gray Chalk"},{value:0.8,block:"Gray Concrete"},
  {value:0.9,block:"Black Chalk"},{value:1.0,block:"Black Concrete"},
]
const HEIGHT_CONFIG = [
  {value:0.1,height:1},{value:0.2,height:2},{value:0.3,height:3},
  {value:0.4,height:4},{value:0.5,height:5},{value:0.6,height:6},
  {value:0.7,height:7},{value:0.8,height:8},{value:0.9,height:9},
  {value:1.0,height:10},
]

///////////////////////////////////////////////////////////
// SHOP CATEGORIES
///////////////////////////////////////////////////////////

const CAT_TOOLS    = "we_tools"
const CAT_SETTINGS = "we_settings"

api.configureShopCategory(CAT_TOOLS, {
  customTitle: "World Edit",
  sortPriority: 100,
})
api.configureShopCategory(CAT_SETTINGS, {
  customTitle: "Settings",
  sortPriority: 99,
})

///////////////////////////////////////////////////////////
// TOOLS
///////////////////////////////////////////////////////////

const WE_TOOLS = [
  { key: "rectangle",      icon: "fa-solid fa-square",        name: "Rectangle",        desc: "Replaces a rectangular selection between pos1 and pos2." },
  { key: "circle",         icon: "fa-solid fa-circle",        name: "Circle",           desc: "Replaces a 2D circle centered on a target point." },
  { key: "sphere",         icon: "fa-solid fa-globe",         name: "Sphere",           desc: "Replaces a 3D sphere, with one-click mode." },
  { key: "rocks",          icon: "fa-solid fa-cube",          name: "Rocks",            desc: "Generates irregular rocky formations." },
  { key: "line",           icon: "fa-solid fa-arrows-h",      name: "Line",             desc: "Draws a 3D line between two points." },
  { key: "plane",          icon: "fa-solid fa-square-dashed", name: "Plane",            desc: "Generates a flat plane between 4 points." },
  { key: "plane_gradient", icon: "fa-solid fa-palette",       name: "Plane + Gradient", desc: "Plane with a block gradient and Perlin noise dithering." },
  { key: "spike",          icon: "fa-solid fa-angles-up",     name: "Spike",            desc: "Builds a conical spike from a center toward a top point." },
  { key: "terrain",        icon: "fa-solid fa-layer-group",   name: "Terrain Noise",    desc: "Generates 2D or 3D terrain using procedural noise." },
  { key: "copy_paste",     icon: "fa-solid fa-copy",          name: "Copy & Paste",     desc: "Copies a selection and pastes it elsewhere with an anchor." },
  { key: "tree_remover",   icon: "fa-solid fa-recycle",       name: "Tree Remover",     desc: "Removes leaves and logs in an area around your click." },
]

WE_TOOLS.forEach((tool, i) => {
  api.createShopItem(CAT_TOOLS, tool.key, {
    image: tool.icon,
    customTitle: tool.name,
    description: tool.desc,
    sortPriority: WE_TOOLS.length - i,
  })
})

///////////////////////////////////////////////////////////
// SETTINGS DEFINITIONS PER TOOL
///////////////////////////////////////////////////////////

const TOOL_SETTINGS = {

  rectangle: [
    { key: "replace_blocks", label: "Blocks to place",     options: ["Grass Mix", "Rock Mix"],                    default: "Grass Mix"  },
    { key: "replace_filter", label: "Replace filter",      options: ["All blocks", "Air only", "Non-air only"],   default: "All blocks" },
    { key: "blocks_per_tick",label: "Speed (blocks/tick)", options: ["25","50","100","200"],                       default: "50"         },
  ],

  circle: [
    { key: "radius",         label: "Radius",              options: ["5","8","10","15","20","30"],                 default: "10"         },
    { key: "replace_blocks", label: "Blocks to place",     options: ["Grass Mix", "Rock Mix"],                    default: "Grass Mix"  },
    { key: "replace_filter", label: "Replace filter",      options: ["All blocks", "Air only", "Non-air only"],   default: "All blocks" },
  ],

  sphere: [
    { key: "radius",         label: "Radius",              options: ["3","4","6","8","10","15"],                   default: "4"          },
    { key: "replace_blocks", label: "Blocks to place",     options: ["Grass Mix", "Rock Mix"],                    default: "Grass Mix"  },
    { key: "replace_filter", label: "Replace filter",      options: ["All blocks", "Air only", "Non-air only"],   default: "All blocks" },
  ],

  rocks: [
    { key: "replace_blocks", label: "Blocks to place",     options: ["Rock Mix", "Grass Mix"],                    default: "Rock Mix"   },
    { key: "blocks_per_tick",label: "Speed (blocks/tick)", options: ["50","100","200","400"],                      default: "200"        },
  ],

  line: [
    { key: "thickness",      label: "Thickness",           options: ["1","2","3"],                                default: "1"          },
    { key: "replace_blocks", label: "Blocks to place",     options: ["Grass Mix", "Rock Mix"],                    default: "Grass Mix"  },
    { key: "blocks_per_tick",label: "Speed (blocks/tick)", options: ["100","200","400"],                           default: "200"        },
  ],

  plane: [
    { key: "thickness",      label: "Thickness",           options: ["0","1","2","3"],                            default: "0"          },
    { key: "replace_blocks", label: "Blocks to place",     options: ["Grass Mix", "Rock Mix"],                    default: "Grass Mix"  },
    { key: "max_steps",      label: "Max steps",           options: ["50","100","200"],                           default: "100"        },
  ],

  plane_gradient: [
    { key: "thickness",      label: "Thickness",           options: ["0","1","2","3"],                            default: "0"          },
    { key: "dither",         label: "Dithering",           options: ["On","Off"],                                 default: "On"         },
    { key: "dither_strength",label: "Dither strength",     options: ["0.3","0.5","0.7","0.9","1.0"],              default: "0.9"        },
    { key: "max_steps",      label: "Max steps",           options: ["50","100","200"],                           default: "100"        },
  ],

  spike: [
    { key: "base_radius",    label: "Base radius",         options: ["8","12","16","24","32"],                    default: "16"         },
    { key: "angle_step",     label: "Angle step (deg)",    options: ["1","2","3","5"],                            default: "2"          },
    { key: "blocks_per_tick",label: "Speed (blocks/tick)", options: ["40","80","160"],                             default: "80"         },
  ],

  terrain: [
    { key: "surface_only",   label: "Surface only (3D)",   options: ["On","Off"],                                 default: "On"         },
    { key: "rects_per_tick", label: "Rects/tick",          options: ["10","20","40"],                             default: "20"         },
  ],

  copy_paste: [
    { key: "blocks_per_tick",label: "Speed (blocks/tick)", options: ["25","50","100"],                            default: "50"         },
  ],

  tree_remover: [
    { key: "pos_x", label: "+X range", options: ["1","2","3","5"], default: "2" },
    { key: "neg_x", label: "-X range", options: ["1","2","3","5"], default: "2" },
    { key: "pos_y", label: "+Y range", options: ["1","2","3","5"], default: "2" },
    { key: "neg_y", label: "-Y range", options: ["3","5","7","10"],default: "7" },
    { key: "pos_z", label: "+Z range", options: ["1","2","3","5"], default: "2" },
    { key: "neg_z", label: "-Z range", options: ["1","2","3","5"], default: "2" },
  ],
}

///////////////////////////////////////////////////////////
// PER-PLAYER STATE
// settings[pid][toolKey][settKey] = value   â† isolated per tool
///////////////////////////////////////////////////////////

let activeTool = {}
let settings   = {}   // pid â†’ { toolKey â†’ { settKey â†’ value }, _registered â†’ [] }

function getSetting(pid, key) {
  const toolKey = activeTool[pid]
  if(!toolKey) return null
  const def = TOOL_SETTINGS[toolKey]?.find(s => s.key === key)?.default ?? null
  return settings[pid]?.[toolKey]?.[key] ?? def
}

function setSetting(pid, key, value) {
  const toolKey = activeTool[pid]
  if(!toolKey) return
  if(!settings[pid])            settings[pid] = {}
  if(!settings[pid][toolKey])   settings[pid][toolKey] = {}
  settings[pid][toolKey][key] = value
}

///////////////////////////////////////////////////////////
// REFRESH SETTINGS CATEGORY
///////////////////////////////////////////////////////////

function refreshSettingsCategory(pid) {
  const toolKey   = activeTool[pid]
  if(!toolKey) return
  const toolDef   = WE_TOOLS.find(t => t.key === toolKey)
  const toolSetts = TOOL_SETTINGS[toolKey] ?? []

  api.configureShopCategoryForPlayer(pid, CAT_SETTINGS, {
    customTitle: toolDef.name + " Settings",
  })

  if(!settings[pid])             settings[pid] = {}
  if(!settings[pid]._registered) settings[pid]._registered = []

  // Supprimer TOUS les anciens items (avec leur prÃ©fixe)
  settings[pid]._registered.forEach(itemKey => {
    try { api.resetShopItemForPlayer(pid, CAT_SETTINGS, itemKey) } catch(e) {}
  })
  settings[pid]._registered = []

  // CrÃ©er les nouveaux items avec clÃ© prÃ©fixÃ©e : "toolKey__settKey"
  toolSetts.forEach((sett, i) => {
    const itemKey = toolKey + "__" + sett.key   // â† clÃ© unique par tool
    const currentVal = getSetting(pid, sett.key)

    api.createShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
      image: "fa-solid fa-gear",
      customTitle: sett.label,
      description: "Current: " + currentVal,
      sortPriority: toolSetts.length - i,
      userInput: {
        type: "dropdown",
        dropdownOptions: sett.options,
        initialValue: currentVal,
        shouldResetSelectionOnOptionsChange: true,
      },
    })
    settings[pid]._registered.push(itemKey)
  })
}

///////////////////////////////////////////////////////////
// BUILD STATE
///////////////////////////////////////////////////////////

let pos1 = {}, pos2 = {}
let center = {}, spikePoint = {}
let planePoints = {}, planePointIndex = {}
let gradA = {}, gradB = {}
let clipboard = {}, anchor = {}

let activePid   = null
let isBuilding  = false
let isPreparing = false
let isCopying   = false
let isPasting   = false

let bounds       = null
let curX, curY, curZ, totalReplaced = 0

let circleCurX, circleCurZ

let sphereBounds = null, sphereCurX, sphereCurY, sphereCurZ

let linePoints = [], lineIndex = 0, lineOx = 0, lineOy = 0, lineOz = 0

let planeIu = 0, planeIv = 0, planeStepsU = 0, planeStepsV = 0
let planeP1, planeP2, planeP3, planeP4, planeNormal

let blocksToPlace = [], currentIndex = 0
let visited = {}, genParams = null

let terrainBounds = null, terrainCurX = 0, terrainTotal = 0
let terrainIs3D = true, terrainRectQueue = []
let terrainIsGen = false, terrainIsFinal = false, terrainTimer = 0

let copyBounds = null, copyCurX, copyCurY, copyCurZ, copyBuffer = [], copyPid = null
let pasteQueue = [], totalPasted = 0

///////////////////////////////////////////////////////////
// PERLIN
///////////////////////////////////////////////////////////

const PERM = []
;(()=>{
  const base = []
  for(let i=0;i<256;i++) base[i]=i
  let s=1337
  for(let i=255;i>0;i--){
    s=(s*1664525+1013904223)&0xffffffff
    const j=((s>>>0)%(i+1))
    const tmp=base[i];base[i]=base[j];base[j]=tmp
  }
  for(let i=0;i<512;i++) PERM[i]=base[i&255]
})()

function fade(t){ return t*t*t*(t*(t*6-15)+10) }
function gradPerlin(hash,x,y,z){
  const h=hash&15,u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z)
  return((h&1)===0?u:-u)+((h&2)===0?v:-v)
}
function perlin3(x,y,z){
  const X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255
  x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z)
  const u=fade(x),fv=fade(y),w=fade(z)
  const A=PERM[X]+Y,AA=PERM[A]+Z,AB=PERM[A+1]+Z
  const B=PERM[X+1]+Y,BA=PERM[B]+Z,BB=PERM[B+1]+Z
  function lerp(a,b,t){return a+t*(b-a)}
  return lerp(
    lerp(lerp(gradPerlin(PERM[AA],x,y,z),gradPerlin(PERM[BA],x-1,y,z),u),
         lerp(gradPerlin(PERM[AB],x,y-1,z),gradPerlin(PERM[BB],x-1,y-1,z),u),fv),
    lerp(lerp(gradPerlin(PERM[AA+1],x,y,z-1),gradPerlin(PERM[BA+1],x-1,y,z-1),u),
         lerp(gradPerlin(PERM[AB+1],x,y-1,z-1),gradPerlin(PERM[BB+1],x-1,y-1,z-1),u),fv),w)
}
function noise3(x,y,z){
  return perlin3(x*0.4,y*0.4,z*0.4)*0.6+perlin3(x*0.9,y*0.9,z*0.9)*0.4
}

const SEED_X=Math.random()*9999,SEED_Z=Math.random()*9999
function rand2D(ix,iz){
  let n=Math.sin(ix*127.1+iz*311.7+SEED_X*0.13+SEED_Z*0.07)*43758.5453
  return n-Math.floor(n)
}
function smoothNoise(x,z){
  const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz
  const ux=fx*fx*(3-2*fx),uz=fz*fz*(3-2*fz)
  const a=rand2D(ix,iz),b=rand2D(ix+1,iz),c=rand2D(ix,iz+1),d=rand2D(ix+1,iz+1)
  return a*(1-ux)*(1-uz)+b*ux*(1-uz)+c*(1-ux)*uz+d*ux*uz
}
function noise2D(x,z){
  let n=0,scale=0.05,amp=1,totalAmp=0
  for(let i=0;i<4;i++){
    n+=smoothNoise(x*scale+SEED_X,z*scale+SEED_Z)*amp
    totalAmp+=amp;scale*=2;amp*=0.5
  }
  return n/totalAmp
}

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function isWE(pid){ return api.getEntityName(pid)===WE_OWNER }
function randFrom(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function isBusy(){ return isBuilding||isPreparing||isCopying||isPasting||terrainIsGen||terrainIsFinal }

function getBounds(pid){
  const p1=pos1[pid],p2=pos2[pid]
  if(!p1||!p2) return null
  return{
    minX:Math.min(p1[0],p2[0]),maxX:Math.max(p1[0],p2[0]),
    minY:Math.min(p1[1],p2[1]),maxY:Math.max(p1[1],p2[1]),
    minZ:Math.min(p1[2],p2[2]),maxZ:Math.max(p1[2],p2[2]),
  }
}

function norm3(v){ return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]) }
function normalize3(v){ const n=norm3(v);if(n===0)return[0,0,0];return[v[0]/n,v[1]/n,v[2]/n] }
function cross3(a,b){ return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]] }
function dot3(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2] }
function lerp3(a,b,t){ return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t] }
function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)) }

function getColorBlock(value){
  for(let i=0;i<COLOR_BLOCKS.length;i++) if(value<=COLOR_BLOCKS[i].value) return COLOR_BLOCKS[i].block
  return COLOR_BLOCKS[COLOR_BLOCKS.length-1].block
}
function getHeight(value){
  for(let i=0;i<HEIGHT_CONFIG.length;i++) if(value<=HEIGHT_CONFIG[i].value) return HEIGHT_CONFIG[i].height
  return HEIGHT_CONFIG[HEIGHT_CONFIG.length-1].height
}

// Toutes les clÃ©s possibles Ã  travers tous les tools
const ALL_SETTING_KEYS = (() => {
  const keys = new Set()
  Object.entries(TOOL_SETTINGS).forEach(([toolKey, setts]) => {
    setts.forEach(s => keys.add(toolKey + "__" + s.key))
  })
  return [...keys]
})()

// Initialiser TOUS les items une seule fois par joueur
function initSettingsForPlayer(pid) {
  if(settings[pid]?._initialized) return
  if(!settings[pid]) settings[pid] = {}

  Object.entries(TOOL_SETTINGS).forEach(([toolKey, setts]) => {
    setts.forEach((sett, i) => {
      const itemKey = toolKey + "__" + sett.key
      api.createShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
        image: "fa-solid fa-gear",
        customTitle: sett.label,
        description: "Current: " + sett.default,
        sortPriority: setts.length - i,
        hidden: true,   // cachÃ© par dÃ©faut
        userInput: {
          type: "dropdown",
          dropdownOptions: sett.options,
          initialValue: sett.default,
          shouldResetSelectionOnOptionsChange: true,
        },
      })
    })
  })
  settings[pid]._initialized = true
}

function refreshSettingsCategory(pid) {
  const toolKey = activeTool[pid]
  if(!toolKey) return
  const toolDef   = WE_TOOLS.find(t => t.key === toolKey)
  const toolSetts = TOOL_SETTINGS[toolKey] ?? []

  initSettingsForPlayer(pid)

  api.configureShopCategoryForPlayer(pid, CAT_SETTINGS, {
    customTitle: toolDef.name + " Settings",
  })

  // Cacher TOUS les items
  ALL_SETTING_KEYS.forEach(itemKey => {
    api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, { hidden: true })
  })

  // Afficher uniquement ceux du tool actif
  toolSetts.forEach((sett, i) => {
    const itemKey = toolKey + "__" + sett.key
    const currentVal = getSetting(pid, sett.key)
    api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
      hidden: false,
      description: "Current: " + currentVal,
      sortPriority: toolSetts.length - i,
    })
  })
}

///////////////////////////////////////////////////////////
// SETTING SHORTCUTS
///////////////////////////////////////////////////////////

function getBlocksPerTick(pid)  { return parseInt(getSetting(pid,"blocks_per_tick")??"50") }
function getRadius(pid)         { return parseInt(getSetting(pid,"radius")??"10") }
function getThickness(pid)      { return parseInt(getSetting(pid,"thickness")??"0") }
function getLineThickness(pid)  { return parseInt(getSetting(pid,"thickness")??"1") }
function getMaxSteps(pid)       { return parseInt(getSetting(pid,"max_steps")??"100") }
function getSurfaceOnly(pid)    { return getSetting(pid,"surface_only")!=="Off" }
function getDither(pid)         { return getSetting(pid,"dither")!=="Off" }
function getDitherStrength(pid) { return parseFloat(getSetting(pid,"dither_strength")??"0.9") }
function getSpikeBaseRadius(pid){ return parseInt(getSetting(pid,"base_radius")??"16") }
function getSpikeAngleStep(pid) { return parseInt(getSetting(pid,"angle_step")??"2") }
function getRectsPerTick(pid)   { return parseInt(getSetting(pid,"rects_per_tick")??"20") }

function getBlockList(pid){
  return getSetting(pid,"replace_blocks")==="Rock Mix" ? BLOCKS_ROCK : BLOCKS_GRASS
}
function shouldReplaceFn(pid,blockName){
  const f=getSetting(pid,"replace_filter")??"All blocks"
  if(f==="Air only")     return blockName==="Air"
  if(f==="Non-air only") return blockName!=="Air"
  return true
}
function getTreeRange(pid){
  return{
    posX:parseInt(getSetting(pid,"pos_x")??"2"),
    negX:parseInt(getSetting(pid,"neg_x")??"2"),
    posY:parseInt(getSetting(pid,"pos_y")??"2"),
    negY:parseInt(getSetting(pid,"neg_y")??"7"),
    posZ:parseInt(getSetting(pid,"pos_z")??"2"),
    negZ:parseInt(getSetting(pid,"neg_z")??"2"),
  }
}

function gradientBlock(pid,bx,by,bz){
  const gA=gradA[pid],gB=gradB[pid]
  if(!gA||!gB){ const s=GRADIENT[0];return s[Math.floor(Math.random()*s.length)] }
  const ab=[gB[0]-gA[0],gB[1]-gA[1],gB[2]-gA[2]],len=norm3(ab)
  let t=0
  if(len>0){ const ap=[bx-gA[0],by-gA[1],bz-gA[2]];t=dot3(ap,ab)/(len*len) }
  if(getDither(pid)){ t+=noise3(bx,by,bz)*getDitherStrength(pid)*(1/(GRADIENT.length-1)) }
  t=clamp(t,0,1)
  const idx=clamp(Math.round(t*(GRADIENT.length-1)),0,GRADIENT.length-1)
  const s=GRADIENT[idx];return s[Math.floor(Math.random()*s.length)]
}

///////////////////////////////////////////////////////////
// SHOP EVENTS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return
  initSettingsForPlayer(pid)
  api.clearInventory(pid)
  api.setItemSlot(pid,9,"Diamond",1,{
    customDisplayName:"World Edit Shop",
    customDescription:"Open the WE menu",
  })
  api.openShop(pid,false,CAT_TOOLS)
}

onPlayerBoughtShopItem = (pid, categoryKey, itemKey, item, userInput) => {

  // â”€â”€ Tool selected â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(categoryKey===CAT_TOOLS){
    const prev=activeTool[pid]
    if(prev&&prev!==itemKey)
      api.updateShopItemForPlayer(pid,CAT_TOOLS,prev,{isSelected:false})

    activeTool[pid]=itemKey
    api.updateShopItemForPlayer(pid,CAT_TOOLS,itemKey,{isSelected:true})

    resetPlayerBuildState(pid)
    refreshSettingsCategory(pid)

    const toolDef=WE_TOOLS.find(t=>t.key===itemKey)
    api.sendOverShopInfo(pid,[
      {icon:toolDef.icon,style:{color:"white",fontSize:"18px"}},
      {str:"  "+toolDef.name+" activated!",style:{color:"#ffffff",fontSize:"16px"}},
    ])
    giveItems(pid)
    return
  }

  // â”€â”€ Setting changed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if(categoryKey === CAT_SETTINGS) {
  // itemKey est maintenant "toolKey__settKey"
  const settKey = itemKey.includes("__") ? itemKey.split("__")[1] : itemKey
  setSetting(pid, settKey, userInput)

  api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
    description: "Current: " + userInput,
  })

  const toolKey = activeTool[pid]
  const settDef = TOOL_SETTINGS[toolKey]?.find(s => s.key === settKey)
  api.sendOverShopInfo(pid, [
    { icon: "fa-solid fa-gear", style: { color: "white", fontSize: "16px" } },
    { str: "  " + (settDef?.label ?? settKey) + " â†’ " + userInput, style: { color: "#ffffff", fontSize: "15px" } },
  ])
}
}

///////////////////////////////////////////////////////////
// RESET BUILD STATE
///////////////////////////////////////////////////////////

function resetPlayerBuildState(pid){
  pos1[pid]=null;pos2[pid]=null
  center[pid]=null;spikePoint[pid]=null
  planePoints[pid]=[];planePointIndex[pid]=0
  gradA[pid]=null;gradB[pid]=null
  clipboard[pid]=null;anchor[pid]=null
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

function giveItems(pid){
  const tool=activeTool[pid]
  api.clearInventory(pid)
  api.setItemSlot(pid,9,"Diamond",1,{
    customDisplayName:"World Edit Shop",
    customDescription:"Open the WE menu",
  })

  if(tool==="rectangle"||tool==="rocks"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Left: Pos1 | Alt: Pos2"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Replace Tool",customDescription:"Click: Replace selection"})
  }
  else if(tool==="circle"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Left click: Set center"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Replace Tool",customDescription:"Click: Replace circle"})
  }
  else if(tool==="sphere"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Left click: Set center"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Replace Tool",customDescription:"Click: Replace sphere"})
    api.setItemSlot(pid,2,"Stone Pickaxe",1,{customDisplayName:"One-Click Sphere",customDescription:"Click: Sphere at target block"})
  }
  else if(tool==="line"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Left: Pos1 | Alt: Pos2"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Line Tool",customDescription:"Click: Generate line"})
  }
  else if(tool==="plane"||tool==="plane_gradient"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"Plane Tool",customDescription:"Click: Set next point (4 needed)"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Generate Plane",customDescription:"Click: Build plane"})
    if(tool==="plane_gradient"){
      api.setItemSlot(pid,2,"Blue Paintball",1,{customDisplayName:"Gradient Start",customDescription:"Click: Start point [0%]"})
      api.setItemSlot(pid,3,"Yellow Paintball",1,{customDisplayName:"Gradient End",customDescription:"Click: End point [100%]"})
    }
  }
  else if(tool==="spike"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Click: Center | Alt: Spike top"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Spike Tool",customDescription:"Click / Alt: Create spike"})
  }
  else if(tool==="terrain"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"Noise Axe",customDescription:"Left: Pos1 | Alt: Pos2"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Generate 3D Terrain",customDescription:"Click: 3D relief"})
    api.setItemSlot(pid,2,"Red Paintball",1,{customDisplayName:"Generate 2D Map",customDescription:"Click: 2D color map"})
  }
  else if(tool==="copy_paste"){
    api.setItemSlot(pid,0,"Wood Axe",1,{customDisplayName:"WE Axe",customDescription:"Left: Pos1 | Alt: Pos2"})
    api.setItemSlot(pid,1,"Green Paintball",1,{customDisplayName:"Paste Tool",customDescription:"Click: Paste at anchor"})
    api.setItemSlot(pid,2,"Red Paintball",1,{customDisplayName:"Set Anchor",customDescription:"Click: Set paste anchor point"})
  }
  else if(tool==="tree_remover"){
    api.setItemSlot(pid,0,"Iron Spade",1,{customDisplayName:"Tree Remover",customDescription:"Alt click: Remove trees around click"})
  }
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return
  const held=api.getHeldItem(pid)
  if(!held) return

  if(held.name==="Diamond"){ api.openShop(pid,true,CAT_TOOLS); return }

  const target=api.getPlayerTargetInfo(pid)
  if(!target||!target.position) return
  const [x,y,z]=target.position
  const tool=activeTool[pid]

  // â”€â”€ Wood Axe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(held.name==="Wood Axe"){
    if(tool==="rectangle"||tool==="rocks"||tool==="line"||tool==="copy_paste"||tool==="terrain"){
      if(!wasAltClick){
        pos1[pid]=[x,y,z];clipboard[pid]=null;anchor[pid]=null
        api.sendMessage(pid,"Pos1 â†’ "+x+" "+y+" "+z,{color:"green"})
        if(tool==="copy_paste"&&pos2[pid]) startCopy(pid)
      } else {
        pos2[pid]=[x,y,z];clipboard[pid]=null;anchor[pid]=null
        api.sendMessage(pid,"Pos2 â†’ "+x+" "+y+" "+z,{color:"yellow"})
        if(tool==="copy_paste"&&pos1[pid]) startCopy(pid)
      }
    }
    else if(tool==="circle"||tool==="sphere"){
      center[pid]=[x,y,z]
      api.sendMessage(pid,"Center â†’ "+x+" "+y+" "+z,{color:"green"})
    }
    else if(tool==="spike"){
      if(!wasAltClick){
        center[pid]=[x,y,z]
        api.sendMessage(pid,"Center set!",{color:"green"})
      }
    }
    else if(tool==="plane"||tool==="plane_gradient"){
      if(!planePoints[pid]) planePoints[pid]=[]
      if(!planePointIndex[pid]) planePointIndex[pid]=0
      planePointIndex[pid]++
      const idx=planePointIndex[pid]
      planePoints[pid][idx-1]=[x,y,z]
      const cols=["green","yellow","cyan","purple"]
      api.sendMessage(pid,"Pos"+idx+" â†’ "+x+","+y+","+z,{color:cols[idx-1]||"white"})
      if(idx>=4) planePointIndex[pid]=0
    }
    return
  }

  // â”€â”€ Green Paintball â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(held.name==="Green Paintball"){
    if(tool==="copy_paste"){
      if(!clipboard[pid]){ api.sendMessage(pid,"Nothing copied yet!",{color:"red"}); return }
      if(!anchor[pid]){ api.sendMessage(pid,"No anchor set!",{color:"red"}); return }
      if(isPasting){ api.sendMessage(pid,"Already pasting!",{color:"orange"}); return }
      startPaste(pid,x,y,z); return
    }
    if(isBusy()){ api.sendMessage(pid,"Already running!",{color:"orange"}); return }
    if(tool==="rectangle"||tool==="rocks") startRect(pid)
    else if(tool==="circle")         startCircle(pid)
    else if(tool==="sphere")         startSphere(pid)
    else if(tool==="line")           startLine(pid)
    else if(tool==="plane")          startPlane(pid,false)
    else if(tool==="plane_gradient") startPlane(pid,true)
    else if(tool==="spike")          startSpike(pid)
    else if(tool==="terrain")        startTerrain(pid,true)
    return
  }

  // â”€â”€ Red Paintball â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(held.name==="Red Paintball"){
    if(tool==="terrain"){
      if(isBusy()){ api.sendMessage(pid,"Already running!",{color:"orange"}); return }
      startTerrain(pid,false)
    }
    else if(tool==="copy_paste"){
      anchor[pid]=[x,y,z]
      api.sendMessage(pid,"Anchor set â†’ "+x+" "+y+" "+z,{color:"red"})
    }
    return
  }

  // â”€â”€ Stone Pickaxe (one-click sphere) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(held.name==="Stone Pickaxe"&&tool==="sphere"){
    if(isBusy()){ api.sendMessage(pid,"Already running!",{color:"orange"}); return }
    center[pid]=[x,y,z]
    api.sendMessage(pid,"One-click sphere â†’ "+x+" "+y+" "+z,{color:"aqua"})
    startSphere(pid)
    return
  }

  // â”€â”€ Gradient paintballs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(held.name==="Blue Paintball"&&tool==="plane_gradient"){
    gradA[pid]=[x,y,z]
    api.sendMessage(pid,"Gradient START â†’ "+x+","+y+","+z,{color:"blue"})
    return
  }
  if(held.name==="Yellow Paintball"&&tool==="plane_gradient"){
    gradB[pid]=[x,y,z]
    api.sendMessage(pid,"Gradient END â†’ "+x+","+y+","+z,{color:"yellow"})
    return
  }
}

///////////////////////////////////////////////////////////
// ALT ACTION
///////////////////////////////////////////////////////////

onPlayerAltAction = (pid, x, y, z, block, targetEId) => {
  if(!isWE(pid)) return
  const held=api.getHeldItem(pid)
  if(!held) return
  const tool=activeTool[pid]

  if(held.name==="Wood Axe"&&tool==="spike"){
    spikePoint[pid]=[x,y,z]
    api.sendMessage(pid,"Spike top set!",{color:"green"})
    return
  }
  if(held.name==="Green Paintball"&&tool==="spike"){
    if(isBusy()){ api.sendMessage(pid,"Already running!",{color:"orange"}); return }
    startSpike(pid)
    return
  }
  if(held.name==="Iron Spade"&&tool==="tree_remover"){
    const r=getTreeRange(pid)
    for(let xi=x-r.negX;xi<=x+r.posX;xi++)
      for(let yi=y-r.negY;yi<=y+r.posY;yi++)
        for(let zi=z-r.negZ;zi<=z+r.posZ;zi++){
          const b=api.getBlock(xi,yi,zi)
          if(TREE_BREAKABLE.includes(b.split("|")[0])) api.setBlock(xi,yi,zi,"Air")
        }
    api.sendMessage(pid,"Trees removed!",{color:"green"})
  }
}

///////////////////////////////////////////////////////////
// START FUNCTIONS
///////////////////////////////////////////////////////////

function startRect(pid){
  const b=getBounds(pid)
  if(!b){ api.sendMessage(pid,"Set pos1 and pos2 first!",{color:"red"}); return }
  bounds=b
  bounds._blocks=getBlockList(pid)
  bounds._pid=pid
  bounds._mode=activeTool[pid]==="rocks"?"rocks":"rect"
  curX=b.minX;curY=b.minY;curZ=b.minZ;totalReplaced=0;isBuilding=true;activePid=pid
  const vol=(b.maxX-b.minX+1)*(b.maxY-b.minY+1)*(b.maxZ-b.minZ+1)
  api.sendMessage(pid,"Replace started ("+vol+" blocks)â€¦",{color:"green"})
}

function startCircle(pid){
  if(!center[pid]){ api.sendMessage(pid,"Set a center first!",{color:"red"}); return }
  const r=getRadius(pid),c=center[pid]
  bounds={
    minX:c[0]-r,maxX:c[0]+r,minZ:c[2]-r,maxZ:c[2]+r,
    centerX:c[0],centerY:c[1],centerZ:c[2],r2:r*r,
    _mode:"circle",_pid:pid,
  }
  circleCurX=bounds.minX;circleCurZ=bounds.minZ;totalReplaced=0;isBuilding=true;activePid=pid
  api.sendMessage(pid,"Circle started (r="+r+")â€¦",{color:"green"})
}

function startSphere(pid){
  if(!center[pid]){ api.sendMessage(pid,"Set a center first!",{color:"red"}); return }
  const r=getRadius(pid),c=center[pid]
  sphereBounds={
    minX:c[0]-r,maxX:c[0]+r,minY:c[1]-r,maxY:c[1]+r,minZ:c[2]-r,maxZ:c[2]+r,
    centerX:c[0],centerY:c[1],centerZ:c[2],r2:r*r,
  }
  sphereCurX=sphereBounds.minX;sphereCurY=sphereBounds.minY;sphereCurZ=sphereBounds.minZ
  totalReplaced=0;isBuilding=true;activePid=pid
  bounds={_mode:"sphere",_pid:pid}
}

function startLine(pid){
  const p1=pos1[pid],p2=pos2[pid]
  if(!p1||!p2){ api.sendMessage(pid,"Set pos1 and pos2 first!",{color:"red"}); return }
  const dx=p2[0]-p1[0],dy=p2[1]-p1[1],dz=p2[2]-p1[2]
  const steps=Math.max(Math.abs(dx),Math.abs(dy),Math.abs(dz))
  const sx=dx/steps,sy=dy/steps,sz=dz/steps
  linePoints=[];let lx=p1[0],ly=p1[1],lz=p1[2]
  for(let i=0;i<=steps;i++){
    linePoints.push([Math.round(lx),Math.round(ly),Math.round(lz)])
    lx+=sx;ly+=sy;lz+=sz
  }
  lineIndex=0;lineOx=0;lineOy=0;lineOz=0
  isBuilding=true;activePid=pid
  bounds={_mode:"line",_pid:pid}
  api.sendMessage(pid,"Line started ("+linePoints.length+" points)",{color:"green"})
}

function startPlane(pid,withGradient){
  const pts=planePoints[pid]
  if(!pts||pts.length<4||pts.some(p=>!p)){
    api.sendMessage(pid,"Set 4 points first!",{color:"red"}); return
  }
  const [p1,p2,p3,p4]=pts
  const d12=norm3([p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]])
  const d43=norm3([p3[0]-p4[0],p3[1]-p4[1],p3[2]-p4[2]])
  const d14=norm3([p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]])
  const d23=norm3([p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]])
  const ms=getMaxSteps(pid)
  planeStepsU=Math.min(Math.ceil(Math.max(d12,d43))*2+1,ms)
  planeStepsV=Math.min(Math.ceil(Math.max(d14,d23))*2+1,ms)
  const eu=[p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  const ev=[p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]]
  planeNormal=normalize3(cross3(eu,ev))
  planeP1=p1;planeP2=p2;planeP3=p3;planeP4=p4
  planeIu=0;planeIv=0;totalReplaced=0
  isBuilding=true;activePid=pid
  bounds={_mode:withGradient?"plane_gradient":"plane",_pid:pid}
  api.sendMessage(pid,"Plane startedâ€¦",{color:"green"})
}

function startSpike(pid){
  if(!center[pid]||!spikePoint[pid]){
    api.sendMessage(pid,"Set center + spike top first!",{color:"red"}); return
  }
  const c=center[pid],sp=spikePoint[pid]
  const dx=sp[0]-c[0],dy=sp[1]-c[1],dz=sp[2]-c[2]
  const length=Math.sqrt(dx*dx+dy*dy+dz*dz)
  if(length===0){ api.sendMessage(pid,"Center and spike top are the same!",{color:"red"}); return }
  blocksToPlace=[];visited={};currentIndex=0
  genParams={
    nx:dx/length,ny:dy/length,nz:dz/length,
    cx:c[0],cy:c[1],cz:c[2],
    step:0,steps:Math.ceil(length),length,
    pid,
  }
  bounds={_mode:"spike",_pid:pid}
  isPreparing=true;activePid=pid
  api.sendMessage(pid,"Preparing spikeâ€¦",{color:"yellow"})
}

function startTerrain(pid,mode3D){
  const b=getBounds(pid)
  if(!b){ api.sendMessage(pid,"Set pos1 and pos2 first!",{color:"red"}); return }
  terrainBounds=b;terrainCurX=b.minX;terrainTotal=0;terrainIs3D=mode3D
  terrainRectQueue=[];terrainIsGen=true;terrainIsFinal=false;terrainTimer=0;activePid=pid
  const area=(b.maxX-b.minX+1)*(b.maxZ-b.minZ+1)
  api.sendMessage(pid,"Terrain "+(mode3D?"3D":"2D")+" started ("+area+" columns)â€¦",{color:"cyan"})
}

function startCopy(pid){
  if(isCopying){ api.sendMessage(pid,"Already copying!",{color:"orange"}); return }
  const b=getBounds(pid);if(!b) return
  const vol=(b.maxX-b.minX+1)*(b.maxY-b.minY+1)*(b.maxZ-b.minZ+1)
  api.sendMessage(pid,"Copying "+vol+" blocksâ€¦",{color:"green"})
  copyBounds=b;copyCurX=b.minX;copyCurY=b.minY;copyCurZ=b.minZ
  copyBuffer=[];copyPid=pid;clipboard[pid]=null;isCopying=true
}

function startPaste(pid,cx,cy,cz){
  const anc=anchor[pid],b=getBounds(pid)
  if(!anc||!b) return
  const offX=cx-anc[0],offY=cy-anc[1],offZ=cz-anc[2]
  const ox=b.minX+offX,oy=b.minY+offY,oz=b.minZ+offZ
  pasteQueue=clipboard[pid].map(e=>({x:ox+e.dx,y:oy+e.dy,z:oz+e.dz,block:e.block}))
  totalPasted=0;isPasting=true
  api.sendMessage(pid,"Pasting "+pasteQueue.length+" blocksâ€¦",{color:"red"})
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {

  // â”€â”€ Spike: prepare â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(isPreparing){
    const {nx,ny,nz,cx,cy,cz,steps,length,pid}=genParams
    const stepsThisTick=Math.min(2,steps-genParams.step)
    const angleStep=getSpikeAngleStep(pid)
    const baseRadius=getSpikeBaseRadius(pid)
    for(let s=0;s<stepsThisTick;s++){
      const i=genParams.step,t=i/steps
      const pcx=cx+nx*length*t,pcy=cy+ny*length*t,pcz=cz+nz*length*t
      const radius=(1-t)*baseRadius
      for(let angle=0;angle<360;angle+=angleStep){
        const rad=angle*Math.PI/180
        const bx=Math.round(pcx+Math.cos(rad)*radius)
        const bz=Math.round(pcz+Math.sin(rad)*radius)
        const by=Math.round(pcy)
        const key=bx+","+by+","+bz
        if(!visited[key]){ visited[key]=true;blocksToPlace.push([bx,by,bz]) }
      }
      genParams.step++
    }
    if(genParams.step>=steps){
      isPreparing=false;isBuilding=true
      api.broadcastMessage("Building spike ("+blocksToPlace.length+" blocks)â€¦",{color:"green"})
    }
    return
  }

  // â”€â”€ Copy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(isCopying){
    const b=copyBounds,bpt=getBlocksPerTick(copyPid)
    let processed=0
    while(processed<bpt){
      copyBuffer.push({
        dx:copyCurX-b.minX,dy:copyCurY-b.minY,dz:copyCurZ-b.minZ,
        block:api.getBlock(copyCurX,copyCurY,copyCurZ),
      })
      processed++;copyCurZ++
      if(copyCurZ>b.maxZ){ copyCurZ=b.minZ;copyCurX++
        if(copyCurX>b.maxX){ copyCurX=b.minX;copyCurY++
          if(copyCurY>b.maxY){
            clipboard[copyPid]=copyBuffer
            anchor[copyPid]=pos1[copyPid]
            isCopying=false
            api.sendMessage(copyPid,"Copied! Anchor auto-set on pos1. Paste with Green or Red Paintball.",{color:"green"})
            return
          }
        }
      }
    }
    return
  }

  // â”€â”€ Paste â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(isPasting){
    const bpt=getBlocksPerTick(activePid)
    let processed=0
    while(processed<bpt&&pasteQueue.length>0){
      const e=pasteQueue.shift();api.setBlock(e.x,e.y,e.z,e.block);totalPasted++;processed++
    }
    if(pasteQueue.length===0){
      isPasting=false
      api.broadcastMessage("Paste finished! ("+totalPasted+" blocks)",{color:"green"})
    }
    return
  }

  // â”€â”€ Terrain â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(terrainIsGen||terrainIsFinal){
    terrainTimer++;if(terrainTimer<=2) return;terrainTimer=0
    const b=terrainBounds,rpt=getRectsPerTick(activePid)
    while(terrainIsGen&&terrainRectQueue.length<256){
      if(terrainCurX>b.maxX){ terrainIsGen=false;terrainIsFinal=true;break }
      enqueueTerrainColumn(terrainCurX,b,activePid);terrainCurX++
    }
    let dispatched=0
    while(terrainRectQueue.length>0&&dispatched<rpt){
      const {p1,p2,block}=terrainRectQueue.shift()
      api.setBlockRect(p1,p2,block);terrainTotal++;dispatched++
    }
    if(terrainIsFinal&&terrainRectQueue.length===0){
      terrainIsFinal=false
      api.broadcastMessage("Terrain "+(terrainIs3D?"3D":"2D")+" done! ("+terrainTotal+" rects)",{color:"white"})
    }
    return
  }

  // â”€â”€ Main build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(!isBuilding) return

  const mode=bounds?._mode
  const pid=bounds?._pid
  const bpt=getBlocksPerTick(pid)

  // Spike: place
  if(mode==="spike"){
    let placed=0
    while(placed<bpt&&currentIndex<blocksToPlace.length){
      const [x,y,z]=blocksToPlace[currentIndex]
      api.setBlock(x,y,z,randFrom(BLOCKS_SPIKE))
      currentIndex++;placed++
    }
    if(currentIndex>=blocksToPlace.length){
      isBuilding=false;api.broadcastMessage("Spike finished!",{color:"green"})
    }
    return
  }

  // Line
  if(mode==="line"){
    const thick=getLineThickness(pid),blockList=getBlockList(pid)
    let placed=0
    while(placed<bpt){
      if(lineIndex>=linePoints.length){
        isBuilding=false;api.broadcastMessage("Line finished!",{color:"green"});return
      }
      const p=linePoints[lineIndex]
      api.setBlock(p[0]+lineOx,p[1]+lineOy,p[2]+lineOz,randFrom(blockList))
      placed++;lineOz++
      if(lineOz>=thick){ lineOz=0;lineOy++
        if(lineOy>=thick){ lineOy=0;lineOx++
          if(lineOx>=thick){ lineOx=0;lineIndex++ }
        }
      }
    }
    return
  }

  // Plane / Plane Gradient
  if(mode==="plane"||mode==="plane_gradient"){
    const thick=getThickness(pid)
    let processed=0
    while(processed<bpt){
      if(planeIu>planeStepsU){
        isBuilding=false;api.broadcastMessage("Plane finished! ("+totalReplaced+" blocks)",{color:"green"});return
      }
      const u=planeIu/planeStepsU
      const edgeA=lerp3(planeP1,planeP2,u),edgeB=lerp3(planeP4,planeP3,u)
      const v=planeIv/planeStepsV,pt=lerp3(edgeA,edgeB,v)
      for(let t=-thick;t<=thick;t++){
        const bx=Math.round(pt[0]+planeNormal[0]*t)
        const by=Math.round(pt[1]+planeNormal[1]*t)
        const bz=Math.round(pt[2]+planeNormal[2]*t)
        if(shouldReplaceFn(pid,api.getBlock(bx,by,bz))){
          const blk=mode==="plane_gradient"?gradientBlock(pid,bx,by,bz):randFrom(getBlockList(pid))
          api.setBlock(bx,by,bz,blk);totalReplaced++
        }
      }
      processed++;planeIv++
      if(planeIv>planeStepsV){ planeIv=0;planeIu++ }
    }
    return
  }

  // Sphere
  if(mode==="sphere"){
    const b=sphereBounds,blockList=getBlockList(pid)
    let processed=0
    while(processed<bpt){
      const dx=sphereCurX-b.centerX,dy=sphereCurY-b.centerY,dz=sphereCurZ-b.centerZ
      if(dx*dx+dy*dy+dz*dz<=b.r2&&shouldReplaceFn(pid,api.getBlock(sphereCurX,sphereCurY,sphereCurZ))){
        api.setBlock(sphereCurX,sphereCurY,sphereCurZ,randFrom(blockList));totalReplaced++
      }
      processed++;sphereCurX++
      if(sphereCurX>b.maxX){ sphereCurX=b.minX;sphereCurZ++
        if(sphereCurZ>b.maxZ){ sphereCurZ=b.minZ;sphereCurY++
          if(sphereCurY>b.maxY){
            isBuilding=false;api.broadcastMessage("Sphere finished! ("+totalReplaced+" blocks)",{color:"green"});return
          }
        }
      }
    }
    return
  }

  // Circle
  if(mode==="circle"){
    const b=bounds,blockList=getBlockList(pid)
    let processed=0
    while(processed<bpt){
      const dx=circleCurX-b.centerX,dz=circleCurZ-b.centerZ
      if(dx*dx+dz*dz<=b.r2&&shouldReplaceFn(pid,api.getBlock(circleCurX,b.centerY,circleCurZ))){
        api.setBlock(circleCurX,b.centerY,circleCurZ,randFrom(blockList));totalReplaced++
      }
      processed++;circleCurX++
      if(circleCurX>b.maxX){ circleCurX=b.minX;circleCurZ++
        if(circleCurZ>b.maxZ){
          isBuilding=false;api.broadcastMessage("Circle finished! ("+totalReplaced+" blocks)",{color:"green"});return
        }
      }
    }
    return
  }

  // Rectangle / Rocks
  const b=bounds,blockList=b._blocks
  const isRock=mode==="rocks"
  const cX=(b.minX+b.maxX)/2,cZ=(b.minZ+b.maxZ)/2
  const h2=b.maxY-b.minY,baseR=Math.max((b.maxX-b.minX)/2,(b.maxZ-b.minZ)/2)
  let processed=0
  while(processed<bpt){
    let place=true
    if(isRock){
      const dx=curX-cX,dz=curZ-cZ,dy=curY-b.minY
      const radius=baseR*(1-dy/h2)+(Math.random()-0.5)*baseR*0.5
      place=Math.sqrt(dx*dx+dz*dz)<=radius
    }
    if(place&&shouldReplaceFn(pid,api.getBlock(curX,curY,curZ))){
      api.setBlock(curX,curY,curZ,randFrom(blockList));totalReplaced++
    }
    processed++;curZ++
    if(curZ>b.maxZ){ curZ=b.minZ;curX++
      if(curX>b.maxX){ curX=b.minX;curY++
        if(curY>b.maxY){
          isBuilding=false;api.broadcastMessage("Replace finished! ("+totalReplaced+" blocks)",{color:"green"});return
        }
      }
    }
  }
}

///////////////////////////////////////////////////////////
// TERRAIN HELPER
///////////////////////////////////////////////////////////

function enqueueTerrainColumn(x,b,pid){
  if(terrainIs3D){
    for(let z=b.minZ;z<=b.maxZ;z++){
      const value=noise2D(x,z),h=getHeight(value),block=randFrom(BLOCKS_TERRAIN_3D),topY=b.minY+h-1
      if(getSurfaceOnly(pid)){
        terrainRectQueue.push({p1:[x,topY,z],p2:[x,topY,z],block,cost:1})
      } else {
        terrainRectQueue.push({p1:[x,b.minY,z],p2:[x,topY,z],block,cost:h})
      }
    }
  } else {
    let batchStartZ=b.minZ,batchBlock=null
    for(let z=b.minZ;z<=b.maxZ+1;z++){
      const isLast=z>b.maxZ,currBlock=isLast?null:getColorBlock(noise2D(x,z))
      const shouldFlush=isLast||!batchBlock||currBlock!==batchBlock||(z-batchStartZ)>=360
      if(shouldFlush&&batchBlock){
        terrainRectQueue.push({p1:[x,b.minY,batchStartZ],p2:[x,b.minY,z-1],block:batchBlock,cost:z-batchStartZ})
        batchBlock=null;batchStartZ=z
      }
      if(!isLast&&!batchBlock){ batchBlock=currBlock;batchStartZ=z }
    }
  }
} 
```