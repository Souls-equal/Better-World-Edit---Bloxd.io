# Codes and Usages




## 〖〔 Cube / Rectangle Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code. You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives a "Wooden Axe" as well as a "Green Paintball", both renamed,

1. The axe can be used to set :
- Pos 1 with the normal click
- Pos 2 with the alt click

2. Paintball allows you to validate and launch construction with a click

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code

1. You have to change the User of the code, because only one people can the code.

2. It is also possible to change the location of items when they appear on 'onPlayerJoin'

3. And very important, the blocks :
- It is possible to set a list of blocks that will be placed randomly (texturing)
- And you can also choose which blocks will be replaced (or "all")

### 『 Code to copy 』
```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 01 Rectangle

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi" // set your username

const axeSlot = 0
const replaceSlot = 1

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [ // set blocks u want to place randomly, or add more for more variety
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Baked Clay",
  "Jungle Grass Block",
  "Lime Planks",
  "Pine Grass Block", // those blocks can be used to make some textured grass
]

// set all to replace all blocks without exception
let REPLACE_BLOCKS = "all"

// or a specific list:
// let REPLACE_BLOCKS = [
//   "Grass Block",
//   "Lime Concrete",
// ]

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null

let isBuilding = false
let bounds = null

let curX, curY, curZ
let totalReplaced = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock(){
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)]
}

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
}

function shouldReplace(blockName){
  if(REPLACE_BLOCKS === "all") return true
  return REPLACE_BLOCKS.includes(blockName)
}

function getBounds(){
  if(!pos1 || !pos2) return null
  return {
    minX: Math.min(pos1[0], pos2[0]),
    maxX: Math.max(pos1[0], pos2[0]),
    minY: Math.min(pos1[1], pos2[1]),
    maxY: Math.max(pos1[1], pos2[1]),
    minZ: Math.min(pos1[2], pos2[2]),
    maxZ: Math.max(pos1[2], pos2[2])
  }
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left: Pos1 | Alt: Pos2"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Replace Tool",
    customDescription: "Click: Replace selection"
  })
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const targetInfo = api.getPlayerTargetInfo(pid)
  if(!targetInfo || !targetInfo.position) return

  const x = targetInfo.position[0]
  const y = targetInfo.position[1]
  const z = targetInfo.position[2]

  if(held.name === "Wood Axe"){
    if(!wasAltClick){
      pos1 = [x, y, z]
      api.sendMessage(pid, "Pos1 set", {color:"green"})
    } else {
      pos2 = [x, y, z]
      api.sendMessage(pid, "Pos2 set", {color:"yellow"})
    }
    return
  }

  if(held.name === "Green Paintball"){
    startReplace(pid)
  }
}

///////////////////////////////////////////////////////////
// REPLACE
///////////////////////////////////////////////////////////

function startReplace(pid){
  const b = getBounds()

  if(!b){
    api.sendMessage(pid, "Define pos1/pos2!", {color:"red"})
    return
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  bounds = b
  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalReplaced = 0
  isBuilding = true

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)
  api.sendMessage(pid, "Replace started (volume: " + vol + " blocks)…", {color:"green"})
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

const BLOCKS_PER_TICK = 50

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    const current = api.getBlock(curX, curY, curZ)
    if(shouldReplace(current)){
      api.setBlock(curX, curY, curZ, randBlock())
      totalReplaced++
    }
    processed++

    curZ++
    if(curZ > b.maxZ){
      curZ = b.minZ
      curX++
      if(curX > b.maxX){
        curX = b.minX
        curY++
        if(curY > b.maxY){
          isBuilding = false
          api.broadcastMessage(
            "Replace finished! (" + totalReplaced + " blocks replaced)",
            {color:"green"}
          )
          return
        }
      }
    }
  }
}

```




## 〖〔 Plane Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives two axes and one paintball, all renamed.

1. The Wood Axe can be used to set the first edge :
- Pos 1 with the normal click
- Pos 2 with the alt click

2. The Stone Axe can be used to set the second edge :
- Pos 3 with the normal click
- Pos 4 with the alt click

3. Paintball allows you to validate and launch the plane construction with a click.

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code

1. You have to change the User of the code, because only one person can use the tool.

2. It is also possible to change the location of items when they appear on 'onPlayerJoin'

3. You can change the thickness of the generated plane

4. And very important, the blocks :
- It is possible to set a list of blocks that will be placed randomly (texturing)
- And you can also choose which blocks will be replaced (or "all")

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 06 Plane

Permission is hereby granted, free of charge, to any person obtaining a copy

///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1

// thickness of the plane
const PLANE_THICKNESS = 0

const BLOCKS_PER_TICK = 60
const MAX_PLANE_STEPS = 100

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Baked Clay",
  "Jungle Grass Block",
  "Lime Planks",
  "Pine Grass Block",
]

let REPLACE_BLOCKS = "all"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null
let pos3 = null
let pos4 = null

let pointIndex = 0

let buildQueue = []
let isBuilding = false

let totalQueued = 0
let totalReplaced = 0

let iu = 0
let iv = 0

let stepsU = 0
let stepsV = 0

let p1,p2,p3,p4
let normal

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock(){
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)]
}

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
}

function shouldReplace(blockName){
  if(REPLACE_BLOCKS === "all") return true
  return REPLACE_BLOCKS.includes(blockName)
}

function lerp3(a,b,t){
  return [
    a[0] + (b[0]-a[0])*t,
    a[1] + (b[1]-a[1])*t,
    a[2] + (b[2]-a[2])*t
  ]
}

function norm3(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
}

function normalize3(v){
  const n = norm3(v)
  if(n===0) return [0,0,0]
  return [v[0]/n, v[1]/n, v[2]/n]
}

function cross3(a,b){
  return [
    a[1]*b[2]-a[2]*b[1],
    a[2]*b[0]-a[0]*b[2],
    a[0]*b[1]-a[1]*b[0]
  ]
}

///////////////////////////////////////////////////////////
// PLANE GENERATION
///////////////////////////////////////////////////////////

function buildPlane(){
  const p1 = pos1
  const p2 = pos2
  const p3 = pos3
  const p4 = pos4

  const d12 = norm3([p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]])
  const d43 = norm3([p3[0]-p4[0],p3[1]-p4[1],p3[2]-p4[2]])
  const d14 = norm3([p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]])
  const d23 = norm3([p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]])

  let stepsU = Math.ceil(Math.max(d12,d43))*2+1
  let stepsV = Math.ceil(Math.max(d14,d23))*2+1
	
  // safety limit
  stepsU = Math.min(stepsU, MAX_PLANE_STEPS)
  stepsV = Math.min(stepsV, MAX_PLANE_STEPS)

  const edgeU = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  const edgeV = [p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]]

  const normal = normalize3(cross3(edgeU,edgeV))

  const seen = new Set()
  const queue = []

  for(let iu=0; iu<=stepsU; iu++){

    const u = iu/stepsU

    const edgeA = lerp3(p1,p2,u)
    const edgeB = lerp3(p4,p3,u)

    for(let iv=0; iv<=stepsV; iv++){

      const v = iv/stepsV
      const pt = lerp3(edgeA,edgeB,v)

      for(let t=-PLANE_THICKNESS; t<=PLANE_THICKNESS; t++){

        const bx = Math.round(pt[0]+normal[0]*t)
        const by = Math.round(pt[1]+normal[1]*t)
        const bz = Math.round(pt[2]+normal[2]*t)

        const key = bx+"|"+by+"|"+bz

        if(!seen.has(key)){
          seen.add(key)
          queue.push([bx,by,bz])
        }
      }
    }
  }
  return queue
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid)=>{
  if(!isWE(pid)) return

  api.clearInventory(pid)
  api.setItemSlot(pid,axeSlot,"Wood Axe",1,{
    customDisplayName:"Plane Tool",
    customDescription:"Alt-click: set next point"
  })
  api.setItemSlot(pid,replaceSlot,"Green Paintball",1,{
    customDisplayName:"Generate Plane",
    customDescription:"Click to build plane"
  })

}

///////////////////////////////////////////////////////////
// CLICK EVENTS
///////////////////////////////////////////////////////////

onPlayerClick = (pid,wasAltClick)=>{

  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const target = api.getPlayerTargetInfo(pid)
  if(!target || !target.position) return

  const x = target.position[0]
  const y = target.position[1]
  const z = target.position[2]

  /////////////////////////////////////////////////////////
  // POINT SELECTION
  /////////////////////////////////////////////////////////

  if(held.name === "Wood Axe"){
    pointIndex++
    if(pointIndex===1){
      pos1=[x,y,z]
      api.sendMessage(pid,"Pos1 set ("+x+","+y+","+z+")",{color:"green"})
    }
    else if(pointIndex===2){
      pos2=[x,y,z]
      api.sendMessage(pid,"Pos2 set ("+x+","+y+","+z+")",{color:"yellow"})
    }
    else if(pointIndex===3){
      pos3=[x,y,z]
      api.sendMessage(pid,"Pos3 set ("+x+","+y+","+z+")",{color:"cyan"})
    }
    else if(pointIndex===4){
      pos4=[x,y,z]
      api.sendMessage(pid,"Pos4 set ("+x+","+y+","+z+")",{color:"purple"})
      pointIndex = 0
    }
    return
  }

  /////////////////////////////////////////////////////////
  // START BUILD
  /////////////////////////////////////////////////////////

  if(held.name==="Green Paintball"){
    startPlane(pid)
  }
}

///////////////////////////////////////////////////////////
// START PLANE
///////////////////////////////////////////////////////////

function startPlane(pid){
  if(!pos1||!pos2||!pos3||!pos4){
    api.sendMessage(pid,"Please set 4 points first!",{color:"red"})
    return
  }
  if(isBuilding){
    api.sendMessage(pid,"Plane generation already running!",{color:"orange"})
    return
  }

  p1 = pos1
  p2 = pos2
  p3 = pos3
  p4 = pos4

  const d12 = norm3([p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]])
  const d43 = norm3([p3[0]-p4[0],p3[1]-p4[1],p3[2]-p4[2]])

  const d14 = norm3([p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]])
  const d23 = norm3([p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]])

  stepsU = Math.ceil(Math.max(d12,d43))*2+1
  stepsV = Math.ceil(Math.max(d14,d23))*2+1

  const edgeU = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  const edgeV = [p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]]

  normal = normalize3(cross3(edgeU,edgeV))
  iu = 0
  iv = 0

  totalReplaced = 0
  isBuilding = true

  api.sendMessage(pid,"Plane generation started...",{color:"green"})
}

///////////////////////////////////////////////////////////
// TICK PROCESSING
///////////////////////////////////////////////////////////

tick = ()=>{
  if(!isBuilding) return
  let processed = 0
  while(processed < BLOCKS_PER_TICK){
    if(iu > stepsU){
      isBuilding=false
      api.broadcastMessage(
        "Plane finished ("+totalReplaced+" blocks placed)",
        {color:"green"}
      )
      return
    }
    const u = iu/stepsU
    const edgeA = lerp3(p1,p2,u)
    const edgeB = lerp3(p4,p3,u)
    const v = iv/stepsV
    const pt = lerp3(edgeA,edgeB,v)

    for(let t=-PLANE_THICKNESS;t<=PLANE_THICKNESS;t++){

      const bx = Math.round(pt[0]+normal[0]*t)
      const by = Math.round(pt[1]+normal[1]*t)
      const bz = Math.round(pt[2]+normal[2]*t)

      const current = api.getBlock(bx,by,bz)

      if(shouldReplace(current)){
        api.setBlock(bx,by,bz,randBlock())
        totalReplaced++
      }
    }
    processed++
    iv++
    if(iv > stepsV){
      iv = 0
      iu++
    }
  }
}
```

