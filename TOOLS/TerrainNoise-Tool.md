# Code and Usages

## 〖〔 Terrain_Noise Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives a **Wooden Axe**, a **Red Paintball** as well as a **Green Paintball**, both renamed.

1. The axe can be used to set :
- The **center of the circle** with a normal click

2. Green Paintball allows you to validate and launch the **terrain replacement in 3D** with a click.

3. Red Paintball allows you to validate and launch the **terrain replacement in 2D** (on the ground) with a click.

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code.

1. You have to change the **User of the code**, because only one person can use the tool.

2. It is also possible to change the **location of items when they appear on `onPlayerJoin`**

3. You can change if only block at surface are placed or under one too by setting **SURFACE_ONLY_3D** to true or false.

4. Very important, the blocks :

- It is possible to set a **list of blocks that will be placed randomly** (texturing)

Example :

```
let TEXTURE_BLOCKS_3D = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool"
]
```
5. And finally, you can change the height and color the gen

Example:

Color for value (when its 2D)
```
const COLOR_BLOCKS = [
  { value: 0.1, block: "White Wool"          },
  { value: 0.2, block: "White Chalk"         },
  { value: 0.3, block: "White Concrete"      },
  { value: 0.4, block: "Light Gray Chalk"    },
  { value: 0.5, block: "Light Gray Wool"     },
  { value: 0.6, block: "Light Gray Concrete" },
  { value: 0.7, block: "Gray Chalk"          },
  { value: 0.8, block: "Gray Concrete"       },
  { value: 0.9, block: "Black Chalk"         },
  { value: 1.0, block: "Black Concrete"      }
]
```

Height for value:
```
const HEIGHT_CONFIG = [
  { value: 0.1, height: 1  },
  { value: 0.2, height: 2  },
  { value: 0.3, height: 3  },
  { value: 0.4, height: 4  },
  { value: 0.5, height: 5  },
  { value: 0.6, height: 6  },
  { value: 0.7, height: 7  },
  { value: 0.8, height: 8  },
  { value: 0.9, height: 9  },
  { value: 1.0, height: 10 }
]
```

### 『 Code to copy 』

```js
const WE_OWNER      = "K4miNoK4mi"
const axeSlot       = 0
const generateSlot  = 1
const flatSlot      = 2

const RECTS_PER_TICK   = 20   // max number of setBlockRect calls per effective tick
const BLOCKS_PER_TICK  = 60   // maximum number of blocks placed per tick (a rectangle of H blocks counts as H)
const QUEUE_BUFFER     = 256  // pre-calculated rectangles in advance
const MAX_RECT_BLOCKS  = 360

const SURFACE_ONLY_3D  = true // true = place only higher block (less lag, same visual effect on the surface)

const COLOR_BLOCKS = [
  { value: 0.1, block: "White Wool"          },
  { value: 0.2, block: "White Chalk"         },
  { value: 0.3, block: "White Concrete"      },
  { value: 0.4, block: "Light Gray Chalk"    },
  { value: 0.5, block: "Light Gray Wool"     },
  { value: 0.6, block: "Light Gray Concrete" },
  { value: 0.7, block: "Gray Chalk"          },
  { value: 0.8, block: "Gray Concrete"       },
  { value: 0.9, block: "Black Chalk"         },
  { value: 1.0, block: "Black Concrete"      }
]

const HEIGHT_CONFIG = [
  { value: 0.1, height: 1  },
  { value: 0.2, height: 2  },
  { value: 0.3, height: 3  },
  { value: 0.4, height: 4  },
  { value: 0.5, height: 5  },
  { value: 0.6, height: 6  },
  { value: 0.7, height: 7  },
  { value: 0.8, height: 8  },
  { value: 0.9, height: 9  },
  { value: 1.0, height: 10 }
]

const TEXTURE_BLOCKS_3D = [
  "Stone",
  "Messy Stone",
  "Stone Bricks",
]

let pos1 = null
let pos2 = null

let isGenerating = false
let isFinalizing = false
let bounds       = null
let curX         = 0
let total        = 0
let is3D         = true

let rectQueue = [] // { p1, p2, block }
let timer = 0

const SEED_X = Math.random() * 9999
const SEED_Z = Math.random() * 9999

function rand2D(ix, iz) {
  let n = Math.sin(ix * 127.1 + iz * 311.7 + SEED_X * 0.13 + SEED_Z * 0.07) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z)
  const fx = x - ix,        fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  const a = rand2D(ix,   iz),   b = rand2D(ix+1, iz)
  const c = rand2D(ix,   iz+1), d = rand2D(ix+1, iz+1)
  return a*(1-ux)*(1-uz) + b*ux*(1-uz) + c*(1-ux)*uz + d*ux*uz
}

function noise2D(x, z) {
  let n = 0, scale = 0.05, amp = 1, totalAmp = 0
  for(let i = 0; i < 4; i++) {
    n += smoothNoise(x * scale + SEED_X, z * scale + SEED_Z) * amp
    totalAmp += amp
    scale *= 2
    amp   *= 0.5
  }
  return n / totalAmp
}

function isWE(pid) { return api.getEntityName(pid) === WE_OWNER }

function getBounds() {
  if(!pos1 || !pos2) return null
  return {
    minX: Math.min(pos1[0], pos2[0]), maxX: Math.max(pos1[0], pos2[0]),
    minY: Math.min(pos1[1], pos2[1]), maxY: Math.max(pos1[1], pos2[1]),
    minZ: Math.min(pos1[2], pos2[2]), maxZ: Math.max(pos1[2], pos2[2])
  }
}

function getColorBlock(value) {
  for(let i = 0; i < COLOR_BLOCKS.length; i++) {
    if(value <= COLOR_BLOCKS[i].value) return COLOR_BLOCKS[i].block
  }
  return COLOR_BLOCKS[COLOR_BLOCKS.length - 1].block
}

function getHeight(value) {
  for(let i = 0; i < HEIGHT_CONFIG.length; i++) {
    if(value <= HEIGHT_CONFIG[i].value) return HEIGHT_CONFIG[i].height
  }
  return HEIGHT_CONFIG[HEIGHT_CONFIG.length - 1].height
}

function randomTextureBlock() {
  return TEXTURE_BLOCKS_3D[Math.floor(Math.random() * TEXTURE_BLOCKS_3D.length)]
}

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return
  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "Noise Axe",
    customDescription: "Left: Pos1 | Alt: Pos2"
  })
  api.setItemSlot(pid, generateSlot, "Green Paintball", 1, {
    customDisplayName: "Generate 3D Terrain",
    customDescription: "Relief + texture aléatoire"
  })
  api.setItemSlot(pid, flatSlot, "Red Paintball", 1, {
    customDisplayName: "Generate 2D Map",
    customDescription: "Visualisation couleur plate"
  })
}

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return
  const held = api.getHeldItem(pid)
  if(!held) return
  const target = api.getPlayerTargetInfo(pid)
  if(!target || !target.position) return
  const [x, y, z] = target.position

  if(held.name === "Wood Axe") {
    if(!wasAltClick) { pos1 = [x, y, z]; api.sendMessage(pid, "Pos1 set", {color:"green"}) }
    else             { pos2 = [x, y, z]; api.sendMessage(pid, "Pos2 set", {color:"yellow"}) }
    return
  }

  if(held.name === "Green Paintball") startGeneration(pid, true)
  if(held.name === "Red Paintball")   startGeneration(pid, false)
}

function startGeneration(pid, mode3D) {
  const b = getBounds()
  if(!b)          { api.sendMessage(pid, "Define pos1/pos2!", {color:"red"});    return }
  if(isGenerating || isFinalizing) {
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  bounds       = b
  curX         = b.minX
  total        = 0
  is3D         = mode3D
  rectQueue    = []
  isGenerating = true
  isFinalizing = false

  const area  = (b.maxX - b.minX + 1) * (b.maxZ - b.minZ + 1)
  const label = mode3D ? "3D terrain (texture)" : "2D map (couleur)"
  api.sendMessage(pid, `Generating ${label} (${area} colonnes)...`, {color:"cyan"})
}

function enqueueColumn(x) {
  const b = bounds

  if(is3D) {
    for(let z = b.minZ; z <= b.maxZ; z++) {
      const value  = noise2D(x, z)
      const height = getHeight(value)
      const block  = randomTextureBlock()
      const topY   = b.minY + height - 1

      if(SURFACE_ONLY_3D) {
        // Un seul bloc au sommet : 1 appel API, 1 bloc placé
        rectQueue.push({
          p1: [x, topY, z],
          p2: [x, topY, z],
          block,
          cost: 1
        })
      } else {
        // Colonne complète du bas jusqu'au sommet
        rectQueue.push({
          p1: [x, b.minY, z],
          p2: [x, topY,   z],
          block,
          cost: height
        })
      }
    }
  } else {
    // 2D : batch des Z consécutifs avec le même bloc couleur
    let batchStartZ = b.minZ
    let batchBlock  = null

    for(let z = b.minZ; z <= b.maxZ + 1; z++) {
      const isLast    = (z > b.maxZ)
      const currBlock = isLast ? null : getColorBlock(noise2D(x, z))

      const shouldFlush = isLast
        || !batchBlock
        || currBlock !== batchBlock
        || (z - batchStartZ) >= MAX_RECT_BLOCKS

      if(shouldFlush && batchBlock) {
        rectQueue.push({
          p1: [x, b.minY, batchStartZ],
          p2: [x, b.minY, z - 1],
          block: batchBlock,
          cost: z - batchStartZ
        })
        batchBlock  = null
        batchStartZ = z
      }

      if(!isLast && !batchBlock) {
        batchBlock  = currBlock
        batchStartZ = z
      }
    }
  }
}

tick = () => {
  timer++
  if(timer <= 2) return
  timer = 0

  if(!isGenerating && !isFinalizing) return

  // Remplir la queue depuis les colonnes calculées
  while(isGenerating && rectQueue.length < QUEUE_BUFFER) {
    if(curX > bounds.maxX) {
      isGenerating = false
      isFinalizing = true
      break
    }
    enqueueColumn(curX)
    curX++
  }

  // Dépiler N rects max ce tick, avec double limite : appels ET blocs
  let dispatched  = 0
  let blocksSent  = 0
  while(rectQueue.length > 0 && dispatched < RECTS_PER_TICK && blocksSent < BLOCKS_PER_TICK) {
    const { p1, p2, block, cost } = rectQueue.shift()
    api.setBlockRect(p1, p2, block)
    total++
    dispatched++
    blocksSent += (cost || 1)
  }

  // Terminer quand tout est vidé
  if(isFinalizing && rectQueue.length === 0) {
    isFinalizing = false
    const label = is3D ? "3D Terrain" : "2D Map"
    api.broadcastMessage(`${label} généré ! (${total} rects)`, {color:"white"})
  }
}
```
