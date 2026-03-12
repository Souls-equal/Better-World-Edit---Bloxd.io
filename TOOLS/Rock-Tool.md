# Code and Usages

## 〖〔 Rocks Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives **two tools**, both renamed:

1.**Wood Axe**  
- **Click** → Set Pos1  
- **Alt Click** → Set Pos2

2.**Green Paintball**  
- **Click** → Launch the rock generation between Pos1 and Pos2

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
const replaceSlot
```

3.**Blocks**  
You can customize the blocks used to generate rocks. They will be placed randomly to create textured rocks:

```
let BLOCKS = [
  "Stone",
  "Cracked Stone Bricks",
  "Stone Bricks",
  "Messy Stone"
]
```

4.**Replace blocks**  
You can define which blocks are allowed to be replaced:

```
let REPLACE_BLOCKS = "all"
```

Or only specific blocks:

```
let REPLACE_BLOCKS = [
  "Grass Block",
  "Lime Concrete"
]
```

5.**Blocks per tick**  
Controls the speed of generation:

```
const BLOCKS_PER_TICK = 200
```

### 『 Tips 』

You should use it about 3 times in the same place to make the rock denser.

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 04 Rocks

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [ // set blocks u want to place randomly, or add more for more variety
  "Stone",
  "Cracked Stone Bricks",
  "Stone Bricks",
  "Messy Stone", // those blocks can be used to make some textured rocks
]

// set all to replace all blocks without exception
let REPLACE_BLOCKS = "all"

// Or a specific list:
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

const BLOCKS_PER_TICK = 200

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  const centerX = (b.minX + b.maxX) / 2
  const centerZ = (b.minZ + b.maxZ) / 2

  const sizeX = (b.maxX - b.minX) / 2
  const sizeZ = (b.maxZ - b.minZ) / 2
  const height = (b.maxY - b.minY)

  const baseRadius = Math.max(sizeX, sizeZ)

  while(processed < BLOCKS_PER_TICK){

    const dx = curX - centerX
    const dz = curZ - centerZ
    const dy = curY - b.minY

    const dist = Math.sqrt(dx*dx + dz*dz)

    const heightRatio = dy / height

    // rayon qui diminue vers le haut
    let radius = baseRadius * (1 - heightRatio)

    // bruit pour rendre irrégulier
    const noise = (Math.random() - 0.5) * baseRadius * 0.5

    const finalRadius = radius + noise

    if(dist <= finalRadius){

      const current = api.getBlock(curX, curY, curZ)

      if(shouldReplace(current)){
        api.setBlock(curX, curY, curZ, randBlock())
        totalReplaced++
      }

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
            "Rock finished! (" + totalReplaced + " blocks)",
            {color:"green"}
          )
          return
        }
      }
    }

  }
}

```
