# Code and Usages

## 〖〔 Spike Tool 〕〗

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
const SPIKE_LENGTH = 15
const BASE_RADIUS = 6
```

- SPIKE_LENGTH = height of the spike  
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

const SPIKE_LENGTH = 15
const BASE_RADIUS = 6

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

let center = null
let spikePoint = null

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
    customDescription: "Click 1: Center | Click 2: Spike top"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Spike Tool",
    customDescription: "Click: Create spike"
  })
}

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
    if(!center){
      center = [x, y, z]
      api.sendMessage(pid, "Center set!", {color:"green"})
    } else {
      spikePoint = [x, y, z]
      api.sendMessage(pid, "Spike top set!", {color:"green"})
    }
    return
  }

  if(held.name === "Green Paintball"){
    startReplace(pid)
  }
}

function drawCircle(cx, cy, cz, r){
  const r2 = r * r

  for(let x = -r; x <= r; x++){
    for(let z = -r; z <= r; z++){

      if(x*x + z*z <= r2){

        const bx = Math.round(cx + x)
        const by = Math.round(cy)
        const bz = Math.round(cz + z)

        const current = api.getBlock(bx,by,bz)
        if(shouldReplace(current)){
          api.setBlock(bx,by,bz, randBlock())
        }
      }
    }
  }
}

function startReplace(pid){
  if(!center || !spikePoint){
    api.sendMessage(pid, "Set center + spike top!", {color:"red"})
    return
  }

  const dx = spikePoint[0] - center[0]
  const dy = spikePoint[1] - center[1]
  const dz = spikePoint[2] - center[2]

  const length = Math.sqrt(dx*dx + dy*dy + dz*dz)

  const nx = dx / length
  const ny = dy / length
  const nz = dz / length

  const steps = SPIKE_LENGTH

  for(let i = 0; i <= steps; i++){

    const t = i / steps

    const cx = center[0] + nx * i
    const cy = center[1] + ny * i
    const cz = center[2] + nz * i

    const radius = (1 - t) * BASE_RADIUS

    drawCircle(cx, cy, cz, radius)
  }

  api.broadcastMessage("Spike created!", {color:"green"})
}
```
