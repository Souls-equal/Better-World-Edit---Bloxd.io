# Code and Usages

## 〖〔 Line Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives **two tools**, both renamed:

1.**Wood Axe**  
- **Click** → Set Position 1  
- **Alt Click** → Set Position 2

2.**Green Paintball**  
- **Click** → Launch the line generation between Pos1 and Pos2

#### 〚 Code 〛

In addition to the items, there are several important settings inside the code:

1.**User restriction**  
Change the username in the config so the tool only works for you:

```
const WE_OWNER = "YourName"
```

2.**Item slots**  
You can change where the items appear in the inventory when the player joins:

```
const axeSlot
const buildSlot
```

3.**Line thickness**  
Change the thickness of the generated line (1 = 1x1, 2 = 2x2, 3 = 3x3):

```
const LINE_THICKNESS = 1
```

4.**Blocks**  
You can customize the blocks used to generate the line. They will be placed randomly to create textures:

```
let BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool"
]
```

5.**Blocks per tick**  
Controls the speed of line generation:

```
const BLOCKS_PER_TICK = 200
```

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 05 Line

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const buildSlot = 1

// 1 = 1x1
// 2 = 2x2
// 3 = 3x3
const LINE_THICKNESS = 1

const BLOCKS_PER_TICK = 200

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

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null

let isBuilding = false

let points = []
let pointIndex = 0

let ox = 0
let oy = 0
let oz = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock() {
  return BLOCKS[Math.floor(Math.random()*BLOCKS.length)]
}

function isWE(pid) {
  return api.getEntityName(pid) === WE_OWNER
}

///////////////////////////////////////////////////////////
// LINE CALCULATION
///////////////////////////////////////////////////////////

function computeLine() {

  points = []

  const dx = pos2[0] - pos1[0]
  const dy = pos2[1] - pos1[1]
  const dz = pos2[2] - pos1[2]

  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz))

  const sx = dx / steps
  const sy = dy / steps
  const sz = dz / steps

  let x = pos1[0]
  let y = pos1[1]
  let z = pos1[2]

  for (let i=0; i<=steps; i++) {
    points.push([Math.round(x), Math.round(y), Math.round(z)])
    x+=sx
    y+=sy
    z+=sz
  }
}

///////////////////////////////////////////////////////////
// START
///////////////////////////////////////////////////////////

function startLine(pid) {

  if(!pos1 || !pos2) {
    api.sendMessage(pid,"Define pos1 and pos2 first!",{color:"red"})
    return
  }

  if(isBuilding) {
    api.sendMessage(pid,"A line is already being generated!",{color:"orange"})
    return
  }

  computeLine()

  pointIndex = 0
  ox = 0
  oy = 0
  oz = 0

  isBuilding = true

  api.sendMessage(pid, "Line generation started (" + points.length + " points)", {color:"green"})
};

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {

  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1,{
    customDisplayName:"WE Axe",
    customDescription:"Left click: Pos1 | Alt click: Pos2"
  })

  api.setItemSlot(pid, buildSlot, "Green Paintball", 1,{
    customDisplayName:"Line Tool",
    customDescription:"Click to generate the line"
  })
};

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

  if (held.name === "Wood Axe") {
    if (!wasAltClick) {
      pos1 = [x,y,z]
      api.sendMessage(pid,"Position 1 set",{color:"green"})
    }
    else {
      pos2 = [x,y,z]
      api.sendMessage(pid,"Position 2 set",{color:"yellow"})
    }
    return
  }
  if (held.name === "Green Paintball") {
    startLine(pid)
  }
};

///////////////////////////////////////////////////////////
// TICK BUILDER
///////////////////////////////////////////////////////////

tick = () => {
  if (!isBuilding) return
  let placed = 0
  while(placed < BLOCKS_PER_TICK){
    if(pointIndex >= points.length){
      isBuilding = false
      api.broadcastMessage(
        "Line generation finished!",
        {color:"green"}
      )
      return
    }
    const p = points[pointIndex]
    api.setBlock(p[0] + ox, p[1] + oy, p[2] + oz, randBlock())
    placed++
    oz++
    if(oz >= LINE_THICKNESS){
      oz = 0
      oy++
      if(oy >= LINE_THICKNESS){
        oy = 0
        ox++
        if(ox >= LINE_THICKNESS){
          ox = 0
          pointIndex++
        }
      }
    }
  }
};
```
