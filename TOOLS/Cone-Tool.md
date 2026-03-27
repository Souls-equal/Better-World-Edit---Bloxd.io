# Code and Usages

## 〖〔 Cone Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives a **Wooden Axe** as well as a **Green Paintball**, both renamed.

1. The axe can be used to set :
- The **center of the spike** with the first click
- The **top (direction) of the spike** with the second click

2. Paintball allows you to validate and launch the **spike generation** with a click.

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code.

1. You have to change the **User of the code**, because only one person can use the tool.

2. It is also possible to change the **location of items when they appear on `onPlayerJoin`**

3. You can change the **length and base size of the spike**

Example :

```
const BASE_RADIUS = 6
```

- BASE_RADIUS = size of the circular base  

4. And very important, the blocks :

- It is possible to set a **list of blocks that will be placed randomly** (texturing)
- And you can also choose **which blocks will be replaced** (or "all")

Example :

```
let BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool"
]
```

Replace all blocks:

```
let REPLACE_BLOCKS = "all"
```

Or only specific blocks :

```
let REPLACE_BLOCKS = [
  "Grass Block",
  "Lime Concrete"
]
```

### 『 Code to copy 』

```js
const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1
const ANGLE_STEP = 2
const BASE_RADIUS = 16
const BLOCKS_PER_TICK = 80
const STEPS_PER_TICK = 2

let BLOCKS = [
  "Obsidian",
  "Black Concrete",
  "Obsidian",
  "Black Concrete",
  "Obsidian",
  "Black Concrete",
  "Obsidian",
  "Black Concrete",
  "Obsidian",
  "Black Concrete",
  "Black Wool",
  "Black Wool",
  "Black Wool",
  "Black Wool",
  "Black Wool",
  "Bedrock",
  "Bedrock",
  "Bedrock",
  "Black Portal",
  "Purple Wool",
  "Magenta Wool",
  "Purple Ceramic",
  "Purple Portal",
]

let REPLACE_BLOCKS = "all"

let center = null
let spikePoint = null

let blocksToPlace = []
let currentIndex = 0
let isBuilding = false
let isPreparing = false

let visited = {}
let genParams = null

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

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Click: Center | Alt Click: Spike top"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Spike Tool",
    customDescription: "Click / Alt Click: Create spike"
  })
}

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return
  if(wasAltClick) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const targetInfo = api.getPlayerTargetInfo(pid)
  if(!targetInfo || !targetInfo.position) return

  const x = targetInfo.position[0]
  const y = targetInfo.position[1]
  const z = targetInfo.position[2]

  if(held.name === "Wood Axe"){
    center = [x, y, z]
    api.sendMessage(pid, "Center set!", {color:"green"})
    return
  }

  if(held.name === "Green Paintball"){
    startReplace(pid)
  }
}

onPlayerAltAction = (pid, x, y, z, block, targetEId) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  if(held.name === "Wood Axe"){
    spikePoint = [x, y, z]
    api.sendMessage(pid, "Spike top set!", {color:"green"})
    return
  }

  if(held.name === "Green Paintball"){
    startReplace(pid)
  }
}

function startReplace(pid){
  if(!center || !spikePoint){
    api.sendMessage(pid, "Set center + spike top first!", {color:"red"})
    return
  }

  if(isBuilding || isPreparing){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  const dx = spikePoint[0] - center[0]
  const dy = spikePoint[1] - center[1]
  const dz = spikePoint[2] - center[2]
  const length = Math.sqrt(dx*dx + dy*dy + dz*dz)

  if(length === 0){
    api.sendMessage(pid, "Center and spike top are the same!", {color:"red"})
    return
  }

  blocksToPlace = []
  visited = {}
  currentIndex = 0

  genParams = {
    nx: dx / length,
    ny: dy / length,
    nz: dz / length,
    cx: center[0],
    cy: center[1],
    cz: center[2],
    step: 0,
    steps: Math.ceil(length),
    length: length
  }

  isPreparing = true
  api.sendMessage(pid, "Preparing spike...", {color:"yellow"})
}

tick = () => {
  if(isPreparing){
    const { nx, ny, nz, cx, cy, cz, step, steps, length } = genParams
    const stepsThisTick = Math.min(STEPS_PER_TICK, steps - step)

    for(let s = 0; s < stepsThisTick; s++){
      const i = genParams.step
      const t = i / steps

      const pcx = cx + nx * length * t
      const pcy = cy + ny * length * t
      const pcz = cz + nz * length * t

      const radius = (1 - t) * BASE_RADIUS

      for(let angle = 0; angle < 360; angle += ANGLE_STEP){
        const rad = angle * Math.PI / 180
        const bx = Math.round(pcx + Math.cos(rad) * radius)
        const bz = Math.round(pcz + Math.sin(rad) * radius)
        const by = Math.round(pcy)
        const key = bx + "," + by + "," + bz
        if(!visited[key]){
          visited[key] = true
          blocksToPlace.push([bx, by, bz])
        }
      }

      genParams.step++
    }

    if(genParams.step >= steps){
      isPreparing = false
      isBuilding = true
      api.broadcastMessage("Building spike... (" + blocksToPlace.length + " blocks)", {color:"green"})
    }
    return
  }

  if(isBuilding){
    let placed = 0

    while(placed < BLOCKS_PER_TICK && currentIndex < blocksToPlace.length){
      const [x, y, z] = blocksToPlace[currentIndex]
      const current = api.getBlock(x, y, z)
      if(shouldReplace(current)){
        api.setBlock(x, y, z, randBlock())
      }
      currentIndex++
      placed++
    }

    if(currentIndex >= blocksToPlace.length){
      isBuilding = false
      api.broadcastMessage("Spike finished!", {color:"green"})
    }
  }
}
```
