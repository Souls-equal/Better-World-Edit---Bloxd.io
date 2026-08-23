/*
MIT License
Copyright (c) 2026 K4miNoK4mi - World Edit - ALL IN ONE 1.15
*/

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////

const WE_OWNER = "K4miNoK4mi"

const PATH_MARKER_BLOCK = "Red Wool"
const PATH_MARKER_FIRST_BLOCK = "Yellow Wool"
const PATH_SCAN_TOP = 255
const PATH_SCAN_BOTTOM = -100
const PATH_SCAN_MARGIN = 16

const TERRAIN_QUEUE_BUFFER = 256
const TERRAIN_TICK_DELAY = 2
const TERRAIN_MAX_RECT_LENGTH = 360

const LAYER_FILL_LIMIT_PER_CALL = 360
const LAYER_FILL_MAX_BLOCKS = 50000000
const LAYER_FILL_CONFIRM_THRESHOLD = 1000000
const LAYER_FILL_CONFIRM_TIMEOUT_TICKS = 300
const LAYER_FILL_CHUNK_SIZE = 32

///////////////////////////////////////////////////////////
// BLOCK MIXES
///////////////////////////////////////////////////////////

const BLOCKS_GRASS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Baked Clay",
  "Jungle Grass Block",
  "Lime Planks",
  "Pine Grass Block",
]

const BLOCKS_ROCK = [
  "Stone",
  "Cracked Stone Bricks",
  "Stone Bricks",
  "Messy Stone",
]

const BLOCKS_PATH = [
  "Dirt",
  "Messy Dirt",
  "Rocky Dirt",
]

const BLOCKS_SPIKE = [
  "Obsidian",
  "Black Concrete",
  "Black Wool",
  "Bedrock",
  "Black Portal",
  "Purple Wool",
  "Magenta Wool",
  "Purple Ceramic",
  "Purple Portal",
]

const BLOCKS_TERRAIN_3D = [
  "Stone",
  "Messy Stone",
  "Stone Bricks",
]

const PATH_DEFAULT_REPLACE_BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Planks",
  "Messy Dirt",
  "Rocky Dirt",
  "Dirt",
]

const TREE_BREAKABLE = [
  "Maple Leaves",
  "Maple Log",
  "Fruity Maple Leaves",
  "Vines",
  "Aspen Leaves",
  "Aspen Log",
]

const GRADIENT = [
  ["Lime Concrete", "Lime Wool"],
  ["Lime Concrete", "Lime Baked Clay"],
  ["Green Concrete", "Jungle Grass Block"],
  ["Brown Concrete", "Dirt"],
  ["Brown Concrete", "Brown Wool"],
]

const COLOR_BLOCKS = [
  { value: 0.1, block: "White Wool" },
  { value: 0.2, block: "White Chalk" },
  { value: 0.3, block: "White Concrete" },
  { value: 0.4, block: "Light Gray Chalk" },
  { value: 0.5, block: "Light Gray Wool" },
  { value: 0.6, block: "Light Gray Concrete" },
  { value: 0.7, block: "Gray Chalk" },
  { value: 0.8, block: "Gray Concrete" },
  { value: 0.9, block: "Black Chalk" },
  { value: 1.0, block: "Black Concrete" },
]

const HEIGHT_CONFIG = [
  { value: 0.1, height: 1 },
  { value: 0.2, height: 2 },
  { value: 0.3, height: 3 },
  { value: 0.4, height: 4 },
  { value: 0.5, height: 5 },
  { value: 0.6, height: 6 },
  { value: 0.7, height: 7 },
  { value: 0.8, height: 8 },
  { value: 0.9, height: 9 },
  { value: 1.0, height: 10 },
]

const DEFAULT_PALETTE_NAME = "Grass Mix"
const LAYER_FILL_SPECIAL_CHOICES = ["Air", "Water"]

const DEFAULT_PALETTE_LIBRARY = {
  "Grass Mix": [...BLOCKS_GRASS],
  "Rock Mix": [...BLOCKS_ROCK],
  "Path Mix": [...BLOCKS_PATH],
  "Spike Mix": [...BLOCKS_SPIKE],
  "Terrain Mix": [...BLOCKS_TERRAIN_3D],
}

const STANDARD_BLOCK_OPTIONS = ["Grass Mix", "Rock Mix", "Path Mix"]
const LAYER_FILL_BLOCK_OPTIONS = ["Air", "Water", "Grass Mix", "Rock Mix", "Path Mix"]

///////////////////////////////////////////////////////////
// SHOP CATEGORIES
///////////////////////////////////////////////////////////

const CAT_TOOLS = "we_tools"
const CAT_SETTINGS = "we_settings"
const CAT_PALETTES = "we_palettes"

api.configureShopCategory(CAT_TOOLS, {
  customTitle: "World Edit",
  sortPriority: 100,
})

api.configureShopCategory(CAT_SETTINGS, {
  customTitle: "Settings",
  sortPriority: 99,
})

api.configureShopCategory(CAT_PALETTES, {
  customTitle: "Palettes",
  sortPriority: 98,
})

///////////////////////////////////////////////////////////
// TOOLS
///////////////////////////////////////////////////////////

const WE_TOOLS = [
  { key: "rectangle", icon: "fa-solid fa-square", name: "Rectangle", desc: "Replaces a rectangular selection between pos1 and pos2." },
  { key: "circle", icon: "fa-solid fa-circle", name: "Circle", desc: "Replaces a 2D circle centered on a target point." },
  { key: "sphere", icon: "fa-solid fa-globe", name: "Sphere", desc: "Replaces a 3D sphere with a one-click mode." },
  { key: "rocks", icon: "fa-solid fa-cube", name: "Rocks", desc: "Generates irregular rocky formations inside a selection." },
  { key: "line", icon: "fa-solid fa-arrows-left-right", name: "Line", desc: "Draws a 3D line between two points." },
  { key: "plane", icon: "fa-solid fa-square-dashed", name: "Plane", desc: "Generates a flat plane between 4 points." },
  { key: "plane_gradient", icon: "fa-solid fa-palette", name: "Plane + Gradient", desc: "Plane with a block gradient and Perlin dithering." },
  { key: "spike", icon: "fa-solid fa-angles-up", name: "Spike", desc: "Builds a conical spike from a center toward a top point." },
  { key: "terrain", icon: "fa-solid fa-layer-group", name: "Terrain Noise", desc: "Generates 2D or 3D terrain using procedural noise." },
  { key: "copy_paste", icon: "fa-solid fa-copy", name: "Copy & Paste", desc: "Copies a selection and pastes it elsewhere with an anchor." },
  { key: "layer_fill", icon: "fa-solid fa-fill-drip", name: "Layer Fill", desc: "Fills a cuboid selection quickly with chunk-safe rectangles." },
  { key: "path", icon: "fa-solid fa-route", name: "Path", desc: "Builds a terrain path or a 3D tube through multiple waypoints." },
  { key: "tree_remover", icon: "fa-solid fa-recycle", name: "Tree Remover", desc: "Removes leaves and logs around your click." },
]

WE_TOOLS.forEach((tool, index) => {
  api.createShopItem(CAT_TOOLS, tool.key, {
    image: tool.icon,
    customTitle: tool.name,
    description: tool.desc,
    sortPriority: WE_TOOLS.length - index,
  })
})

///////////////////////////////////////////////////////////
// SETTINGS PER TOOL
///////////////////////////////////////////////////////////

const TOOL_SETTINGS = {
  rectangle: [
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Grass Mix" },
    { key: "replace_filter", label: "Replace filter", options: ["All blocks", "Air only", "Non-air only"], default: "All blocks" },
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["25", "50", "100", "200"], default: "50" },
  ],

  circle: [
    { key: "radius", label: "Radius", options: ["5", "8", "10", "15", "20", "30"], default: "10" },
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Grass Mix" },
    { key: "replace_filter", label: "Replace filter", options: ["All blocks", "Air only", "Non-air only"], default: "All blocks" },
  ],

  sphere: [
    { key: "radius", label: "Radius", options: ["3", "4", "6", "8", "10", "15"], default: "4" },
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Grass Mix" },
    { key: "replace_filter", label: "Replace filter", options: ["All blocks", "Air only", "Non-air only"], default: "All blocks" },
  ],

  rocks: [
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Rock Mix" },
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["50", "100", "200", "400"], default: "200" },
  ],

  line: [
    { key: "thickness", label: "Thickness", options: ["1", "2", "3"], default: "1" },
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Grass Mix" },
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["100", "200", "400"], default: "200" },
  ],

  plane: [
    { key: "thickness", label: "Thickness", options: ["0", "1", "2", "3"], default: "0" },
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Grass Mix" },
    { key: "max_steps", label: "Max steps", options: ["50", "100", "200"], default: "100" },
  ],

  plane_gradient: [
    { key: "thickness", label: "Thickness", options: ["0", "1", "2", "3"], default: "0" },
    { key: "dither", label: "Dithering", options: ["On", "Off"], default: "On" },
    { key: "dither_strength", label: "Dither strength", options: ["0.3", "0.5", "0.7", "0.9", "1.0"], default: "0.9" },
    { key: "max_steps", label: "Max steps", options: ["50", "100", "200"], default: "100" },
  ],

  spike: [
    { key: "base_radius", label: "Base radius", options: ["8", "12", "16", "24", "32"], default: "16" },
    { key: "angle_step", label: "Angle step (deg)", options: ["1", "2", "3", "5"], default: "2" },
    { key: "replace_blocks", label: "Blocks to place", options: STANDARD_BLOCK_OPTIONS, default: "Spike Mix" },
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["40", "80", "160"], default: "80" },
  ],

  terrain: [
    { key: "replace_blocks", label: "3D palette", options: STANDARD_BLOCK_OPTIONS, default: "Terrain Mix" },
    { key: "surface_only", label: "Surface only (3D)", options: ["On", "Off"], default: "On" },
    { key: "rects_per_tick", label: "Rects/tick", options: ["10", "20", "40"], default: "20" },
  ],

  copy_paste: [
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["25", "50", "100"], default: "50" },
  ],

  layer_fill: [
    { key: "fill_blocks", label: "Blocks to place", options: LAYER_FILL_BLOCK_OPTIONS, default: "Air" },
    { key: "rects_per_tick", label: "Rects/tick", options: ["10", "20", "40", "60"], default: "60" },
    { key: "load_chunks", label: "Load chunks", options: ["Off", "On"], default: "Off" },
  ],

  path: [
    { key: "width", label: "Width (radius)", options: ["1", "2", "3", "4", "5"], default: "3" },
    { key: "path_mode", label: "Mode", options: ["Tube", "Road"], default: "Tube" },
    { key: "path_depth", label: "Road depth", options: ["1", "2", "3", "4"], default: "2" },
    { key: "replace_blocks", label: "Blocks to place", options: ["Path Mix", "Grass Mix", "Rock Mix"], default: "Path Mix" },
    { key: "replace_filter", label: "Replace filter", options: ["Path Default", "All blocks", "Air only", "Non-air only"], default: "Path Default" },
    { key: "blocks_per_tick", label: "Speed (blocks/tick)", options: ["50", "100", "200", "400"], default: "100" },
  ],

  tree_remover: [
    { key: "pos_x", label: "+X range", options: ["1", "2", "3", "5"], default: "2" },
    { key: "neg_x", label: "-X range", options: ["1", "2", "3", "5"], default: "2" },
    { key: "pos_y", label: "+Y range", options: ["1", "2", "3", "5"], default: "2" },
    { key: "neg_y", label: "-Y range", options: ["3", "5", "7", "10"], default: "7" },
    { key: "pos_z", label: "+Z range", options: ["1", "2", "3", "5"], default: "2" },
    { key: "neg_z", label: "-Z range", options: ["1", "2", "3", "5"], default: "2" },
  ],
}

///////////////////////////////////////////////////////////
// PER-PLAYER SETTINGS STATE
///////////////////////////////////////////////////////////

let activeTool = {}
let settings = {}
let paletteLibrary = {}
let paletteEditor = {}

function getSetting(pid, key) {
  const toolKey = activeTool[pid]
  if(!toolKey) return null
  const defaultValue = TOOL_SETTINGS[toolKey]?.find((setting) => setting.key === key)?.default ?? null
  return settings[pid]?.[toolKey]?.[key] ?? defaultValue
}

function setSetting(pid, key, value) {
  const toolKey = activeTool[pid]
  if(!toolKey) return

  if(!settings[pid]) settings[pid] = {}
  if(!settings[pid][toolKey]) settings[pid][toolKey] = {}
  settings[pid][toolKey][key] = value
}

const ALL_SETTING_KEYS = (() => {
  const keys = new Set()
  Object.entries(TOOL_SETTINGS).forEach(([toolKey, toolSettings]) => {
    toolSettings.forEach((setting) => keys.add(toolKey + "__" + setting.key))
  })
  return [...keys]
})()

function clonePaletteMap(source) {
  const out = {}
  Object.entries(source).forEach(([name, blocks]) => {
    out[name] = [...blocks]
  })
  return out
}

function ensurePaletteState(pid) {
  if(!paletteLibrary[pid]) {
    paletteLibrary[pid] = clonePaletteMap(DEFAULT_PALETTE_LIBRARY)
  }

  if(!paletteEditor[pid]) {
    paletteEditor[pid] = {
      selected: DEFAULT_PALETTE_NAME,
      blocks: [...paletteLibrary[pid][DEFAULT_PALETTE_NAME]],
      _initialized: false,
    }
  }
}

function getPaletteStore(pid) {
  ensurePaletteState(pid)
  return paletteLibrary[pid]
}

function getPaletteNames(pid) {
  return Object.keys(getPaletteStore(pid))
}

function getPaletteBlocksByName(pid, paletteName) {
  const store = getPaletteStore(pid)
  const blocks = store[paletteName]
  if(Array.isArray(blocks) && blocks.length > 0) return blocks

  const fallback = store[DEFAULT_PALETTE_NAME] ?? DEFAULT_PALETTE_LIBRARY[DEFAULT_PALETTE_NAME]
  if(Array.isArray(fallback) && fallback.length > 0) return fallback
  return ["Grass Block"]
}

function getPaletteDraft(pid) {
  ensurePaletteState(pid)
  return paletteEditor[pid]
}

function loadPaletteIntoDraft(pid, paletteName) {
  const store = getPaletteStore(pid)
  const names = Object.keys(store)
  const chosen = store[paletteName] ? paletteName : (names[0] ?? DEFAULT_PALETTE_NAME)
  const blocks = store[chosen] ?? DEFAULT_PALETTE_LIBRARY[DEFAULT_PALETTE_NAME]
  paletteEditor[pid].selected = chosen
  paletteEditor[pid].blocks = [...blocks]
}

function formatPaletteSummary(blocks) {
  if(!blocks || blocks.length === 0) return "Empty draft"

  const counts = {}
  for(const block of blocks) counts[block] = (counts[block] ?? 0) + 1

  const entries = Object.entries(counts).map(([block, count]) => count > 1 ? block + " x" + count : block)
  const preview = entries.slice(0, 6).join(", ")
  const extra = entries.length > 6 ? " +" + (entries.length - 6) + " more" : ""
  return blocks.length + " blocks | " + Object.keys(counts).length + " unique | " + preview + extra
}

function getPaletteRemoveOptions(pid) {
  const draft = getPaletteDraft(pid)
  const unique = []
  for(const block of draft.blocks) {
    if(!unique.includes(block)) unique.push(block)
  }
  return unique.length > 0 ? unique : ["(empty)"]
}

function getSettingOptionsForPlayer(pid, toolKey, setting) {
  if(setting.key === "replace_blocks") return getPaletteNames(pid)
  if(toolKey === "layer_fill" && setting.key === "fill_blocks") {
    return [...LAYER_FILL_SPECIAL_CHOICES, ...getPaletteNames(pid)]
  }
  return setting.options
}

function ensureSettingValueValid(pid, toolKey, setting) {
  const options = getSettingOptionsForPlayer(pid, toolKey, setting)
  const defaultValue = options.includes(setting.default) ? setting.default : options[0]
  const current = settings[pid]?.[toolKey]?.[setting.key] ?? defaultValue

  if(options.includes(current)) return current

  if(!settings[pid]) settings[pid] = {}
  if(!settings[pid][toolKey]) settings[pid][toolKey] = {}
  settings[pid][toolKey][setting.key] = defaultValue
  return defaultValue
}

function initPaletteCategoryForPlayer(pid) {
  ensurePaletteState(pid)
  if(paletteEditor[pid]._initialized) return

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_target", {
    image: "fa-solid fa-swatchbook",
    customTitle: "Palette to Edit",
    description: "Choose which palette to load into the editor.",
    sortPriority: 100,
    userInput: {
      type: "dropdown",
      dropdownOptions: getPaletteNames(pid),
      initialValue: getPaletteDraft(pid).selected,
      shouldResetSelectionOnOptionsChange: true,
    },
  })

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_preview", {
    image: "fa-solid fa-list",
    customTitle: "Current Draft",
    description: formatPaletteSummary(getPaletteDraft(pid).blocks),
    sortPriority: 99,
    canBuy: false,
  })

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_add_block", {
    image: "fa-solid fa-plus",
    customTitle: "Add Block",
    description: "Add a block to the current draft palette.",
    sortPriority: 98,
    buyButtonText: "Add",
    userInput: {
      type: "text",
      placeholderText: "Grass Block",
    },
  })

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_remove_block", {
    image: "fa-solid fa-minus",
    customTitle: "Remove Block",
    description: "Remove one block entry from the current draft.",
    sortPriority: 97,
    buyButtonText: "Remove",
    userInput: {
      type: "dropdown",
      dropdownOptions: getPaletteRemoveOptions(pid),
      shouldResetSelectionOnOptionsChange: true,
    },
  })

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_save_as", {
    image: "fa-solid fa-floppy-disk",
    customTitle: "Save as New Palette",
    description: "Save the current draft under a custom palette name.",
    sortPriority: 96,
    buyButtonText: "Save",
    userInput: {
      type: "text",
      placeholderText: "My Palette",
    },
  })

  api.createShopItemForPlayer(pid, CAT_PALETTES, "palette_apply_selected", {
    image: "fa-solid fa-pen-to-square",
    customTitle: "Overwrite Selected Palette",
    description: "Apply the current draft to the selected palette, including defaults.",
    sortPriority: 95,
    buyButtonText: "Overwrite",
  })

  paletteEditor[pid]._initialized = true
}

function refreshPaletteCategory(pid) {
  initPaletteCategoryForPlayer(pid)

  const draft = getPaletteDraft(pid)
  const paletteNames = getPaletteNames(pid)
  const removeOptions = getPaletteRemoveOptions(pid)
  const canRemove = draft.blocks.length > 0

  api.configureShopCategoryForPlayer(pid, CAT_PALETTES, {
    customTitle: "Palettes",
    description: "Create, preview, save, and overwrite palettes.",
  })

  api.updateShopItemForPlayer(pid, CAT_PALETTES, "palette_target", {
    description: "Currently editing: " + draft.selected,
    userInput: {
      type: "dropdown",
      dropdownOptions: paletteNames,
      initialValue: draft.selected,
      shouldResetSelectionOnOptionsChange: true,
    },
  })

  api.updateShopItemForPlayer(pid, CAT_PALETTES, "palette_preview", {
    description: formatPaletteSummary(draft.blocks),
  })

  api.updateShopItemForPlayer(pid, CAT_PALETTES, "palette_remove_block", {
    canBuy: canRemove,
    description: canRemove ? "Remove one block entry from the current draft." : "Draft is empty.",
    userInput: {
      type: "dropdown",
      dropdownOptions: removeOptions,
      shouldResetSelectionOnOptionsChange: true,
    },
  })

  api.updateShopItemForPlayer(pid, CAT_PALETTES, "palette_apply_selected", {
    canBuy: draft.blocks.length > 0,
    description: draft.blocks.length > 0
      ? "Overwrite \"" + draft.selected + "\" with the current draft."
      : "Draft is empty. Add blocks before overwriting a palette.",
  })
}

function initSettingsForPlayer(pid) {
  if(settings[pid]?._initialized) return
  if(!settings[pid]) settings[pid] = {}

  Object.entries(TOOL_SETTINGS).forEach(([toolKey, toolSettings]) => {
    toolSettings.forEach((setting, index) => {
      const itemKey = toolKey + "__" + setting.key
      const initialValue = ensureSettingValueValid(pid, toolKey, setting)
      api.createShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
        image: "fa-solid fa-gear",
        customTitle: setting.label,
        description: "Current: " + initialValue,
        sortPriority: toolSettings.length - index,
        hidden: true,
        userInput: {
          type: "dropdown",
          dropdownOptions: getSettingOptionsForPlayer(pid, toolKey, setting),
          initialValue,
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

  const toolDef = WE_TOOLS.find((tool) => tool.key === toolKey)
  const toolSettings = TOOL_SETTINGS[toolKey] ?? []

  initSettingsForPlayer(pid)

  api.configureShopCategoryForPlayer(pid, CAT_SETTINGS, {
    customTitle: toolDef.name + " Settings",
  })

  ALL_SETTING_KEYS.forEach((itemKey) => {
    api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, { hidden: true })
  })

  toolSettings.forEach((setting, index) => {
    const itemKey = toolKey + "__" + setting.key
    const currentValue = ensureSettingValueValid(pid, toolKey, setting)
    api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
      hidden: false,
      description: "Current: " + currentValue,
      sortPriority: toolSettings.length - index,
      userInput: {
        type: "dropdown",
        dropdownOptions: getSettingOptionsForPlayer(pid, toolKey, setting),
        initialValue: currentValue,
        shouldResetSelectionOnOptionsChange: true,
      },
    })
  })
}

///////////////////////////////////////////////////////////
// BUILD STATE
///////////////////////////////////////////////////////////

let pos1 = {}
let pos2 = {}
let center = {}
let spikePoint = {}
let planePoints = {}
let planePointIndex = {}
let gradA = {}
let gradB = {}
let clipboard = {}
let anchor = {}
let pathWaypoints = {}
let pathPendingA = {}

let activePid = null
let isBuilding = false
let isPreparing = false
let isCopying = false
let isPasting = false

let bounds = null
let curX = 0
let curY = 0
let curZ = 0
let totalReplaced = 0

let circleCurX = 0
let circleCurZ = 0

let sphereBounds = null
let sphereCurX = 0
let sphereCurY = 0
let sphereCurZ = 0

let linePoints = []
let lineOffsets = []
let lineIndex = 0
let lineOffsetIndex = 0

let planeIu = 0
let planeIv = 0
let planeStepsU = 0
let planeStepsV = 0
let planeP1 = null
let planeP2 = null
let planeP3 = null
let planeP4 = null
let planeNormal = null
let planeVisited = null

let blocksToPlace = []
let currentIndex = 0
let visited = {}
let genParams = null

let terrainBounds = null
let terrainCurX = 0
let terrainTotal = 0
let terrainIs3D = true
let terrainRectQueue = []
let terrainIsGen = false
let terrainIsFinal = false
let terrainTimer = 0
let terrainPid = null

let copyBounds = null
let copyCurX = 0
let copyCurY = 0
let copyCurZ = 0
let copyBuffer = []
let copyPid = null

let pasteQueue = []
let pastePid = null
let totalPasted = 0

let pathState = null
let layerFillState = null
let layerFillTickCount = 0
let layerFillPendingConfirm = {}

///////////////////////////////////////////////////////////
// PERLIN NOISE
///////////////////////////////////////////////////////////

const PERM = []
;(() => {
  const base = []
  for(let i = 0; i < 256; i++) base[i] = i

  let seed = 1337
  for(let i = 255; i > 0; i--){
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    const j = (seed >>> 0) % (i + 1)
    const tmp = base[i]
    base[i] = base[j]
    base[j] = tmp
  }

  for(let i = 0; i < 512; i++) PERM[i] = base[i & 255]
})()

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function gradPerlin(hash, x, y, z) {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : (h === 12 || h === 14 ? x : z)
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

function perlin3(x, y, z) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255

  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)

  const u = fade(x)
  const v = fade(y)
  const w = fade(z)

  const A = PERM[X] + Y
  const AA = PERM[A] + Z
  const AB = PERM[A + 1] + Z
  const B = PERM[X + 1] + Y
  const BA = PERM[B] + Z
  const BB = PERM[B + 1] + Z

  function lerp(a, b, t) {
    return a + t * (b - a)
  }

  return lerp(
    lerp(
      lerp(gradPerlin(PERM[AA], x, y, z), gradPerlin(PERM[BA], x - 1, y, z), u),
      lerp(gradPerlin(PERM[AB], x, y - 1, z), gradPerlin(PERM[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(gradPerlin(PERM[AA + 1], x, y, z - 1), gradPerlin(PERM[BA + 1], x - 1, y, z - 1), u),
      lerp(gradPerlin(PERM[AB + 1], x, y - 1, z - 1), gradPerlin(PERM[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  )
}

function noise3(x, y, z) {
  return perlin3(x * 0.4, y * 0.4, z * 0.4) * 0.6 + perlin3(x * 0.9, y * 0.9, z * 0.9) * 0.4
}

const SEED_X = Math.random() * 9999
const SEED_Z = Math.random() * 9999

function rand2D(ix, iz) {
  const n = Math.sin(ix * 127.1 + iz * 311.7 + SEED_X * 0.13 + SEED_Z * 0.07) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x, z) {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = x - ix
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  const a = rand2D(ix, iz)
  const b = rand2D(ix + 1, iz)
  const c = rand2D(ix, iz + 1)
  const d = rand2D(ix + 1, iz + 1)
  return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) + c * (1 - ux) * uz + d * ux * uz
}

function noise2D(x, z) {
  let n = 0
  let scale = 0.05
  let amp = 1
  let totalAmp = 0

  for(let i = 0; i < 4; i++){
    n += smoothNoise(x * scale + SEED_X, z * scale + SEED_Z) * amp
    totalAmp += amp
    scale *= 2
    amp *= 0.5
  }

  return n / totalAmp
}

///////////////////////////////////////////////////////////
// GENERIC UTILS
///////////////////////////////////////////////////////////

function baseBlockName(blockName) {
  return (blockName ?? "").split("|")[0]
}

function isWE(pid) {
  return api.getEntityName(pid) === WE_OWNER
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isBusy() {
  return isBuilding || isPreparing || isCopying || isPasting || terrainIsGen || terrainIsFinal
}

function getBounds(pid) {
  const p1 = pos1[pid]
  const p2 = pos2[pid]
  if(!p1 || !p2) return null

  return {
    minX: Math.min(p1[0], p2[0]),
    maxX: Math.max(p1[0], p2[0]),
    minY: Math.min(p1[1], p2[1]),
    maxY: Math.max(p1[1], p2[1]),
    minZ: Math.min(p1[2], p2[2]),
    maxZ: Math.max(p1[2], p2[2]),
  }
}

function norm3(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}

function normalize3(v) {
  const n = norm3(v)
  if(n === 0) return [0, 0, 0]
  return [v[0] / n, v[1] / n, v[2] / n]
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function lerp3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getColorBlock(value) {
  for(let i = 0; i < COLOR_BLOCKS.length; i++){
    if(value <= COLOR_BLOCKS[i].value) return COLOR_BLOCKS[i].block
  }
  return COLOR_BLOCKS[COLOR_BLOCKS.length - 1].block
}

function getHeight(value) {
  for(let i = 0; i < HEIGHT_CONFIG.length; i++){
    if(value <= HEIGHT_CONFIG[i].value) return HEIGHT_CONFIG[i].height
  }
  return HEIGHT_CONFIG[HEIGHT_CONFIG.length - 1].height
}

function isSolid(blockName) {
  const base = baseBlockName(blockName)
  return base !== "" && base !== "Air" && base !== "Water" && base !== "Lava"
}

///////////////////////////////////////////////////////////
// SETTING HELPERS
///////////////////////////////////////////////////////////

function getBlocksPerTick(pid) {
  return parseInt(getSetting(pid, "blocks_per_tick") ?? "50", 10)
}

function getRadius(pid) {
  return parseInt(getSetting(pid, "radius") ?? "10", 10)
}

function getThickness(pid) {
  return parseInt(getSetting(pid, "thickness") ?? "0", 10)
}

function getMaxSteps(pid) {
  return parseInt(getSetting(pid, "max_steps") ?? "100", 10)
}

function getSurfaceOnly(pid) {
  return getSetting(pid, "surface_only") !== "Off"
}

function getDither(pid) {
  return getSetting(pid, "dither") !== "Off"
}

function getDitherStrength(pid) {
  return parseFloat(getSetting(pid, "dither_strength") ?? "0.9")
}

function getSpikeBaseRadius(pid) {
  return parseInt(getSetting(pid, "base_radius") ?? "16", 10)
}

function getSpikeAngleStep(pid) {
  return parseInt(getSetting(pid, "angle_step") ?? "2", 10)
}

function getRectsPerTick(pid) {
  return parseInt(getSetting(pid, "rects_per_tick") ?? "20", 10)
}

function getLayerFillRectsPerTick(pid) {
  return parseInt(getSetting(pid, "rects_per_tick") ?? "60", 10)
}

function shouldLoadLayerFillChunks(pid) {
  return getSetting(pid, "load_chunks") === "On"
}

function getPathWidth(pid) {
  return parseInt(getSetting(pid, "width") ?? "3", 10)
}

function getPathMode(pid) {
  return (getSetting(pid, "path_mode") ?? "Tube") === "Road" ? "road" : "tube"
}

function getPathDepth(pid) {
  return parseInt(getSetting(pid, "path_depth") ?? "2", 10)
}

function getTreeRange(pid) {
  return {
    posX: parseInt(getSetting(pid, "pos_x") ?? "2", 10),
    negX: parseInt(getSetting(pid, "neg_x") ?? "2", 10),
    posY: parseInt(getSetting(pid, "pos_y") ?? "2", 10),
    negY: parseInt(getSetting(pid, "neg_y") ?? "7", 10),
    posZ: parseInt(getSetting(pid, "pos_z") ?? "2", 10),
    negZ: parseInt(getSetting(pid, "neg_z") ?? "2", 10),
  }
}

function getBlockList(pid) {
  return getPaletteBlocksByName(pid, getSetting(pid, "replace_blocks") ?? DEFAULT_PALETTE_NAME)
}

function getLayerFillBlockList(pid) {
  const choice = getSetting(pid, "fill_blocks") ?? "Air"
  if(choice === "Air") return ["Air"]
  if(choice === "Water") return ["Water"]
  return getPaletteBlocksByName(pid, choice)
}

function shouldReplaceFn(pid, blockName, toolKeyOverride = activeTool[pid]) {
  const base = baseBlockName(blockName)
  const filter = settings[pid]?.[toolKeyOverride]?.replace_filter
    ?? TOOL_SETTINGS[toolKeyOverride]?.find((setting) => setting.key === "replace_filter")?.default
    ?? "All blocks"

  if(toolKeyOverride === "path" && filter === "Path Default") {
    return PATH_DEFAULT_REPLACE_BLOCKS.includes(base)
  }
  if(filter === "Air only") return base === "Air"
  if(filter === "Non-air only") return base !== "Air"
  return true
}

function makeCenteredOffsets(size) {
  const offsets = []
  const start = -Math.floor(size / 2)
  const end = start + size - 1

  for(let ox = start; ox <= end; ox++){
    for(let oy = start; oy <= end; oy++){
      for(let oz = start; oz <= end; oz++){
        offsets.push([ox, oy, oz])
      }
    }
  }

  return offsets
}

function formatApproxTicks(ticks) {
  const seconds = Math.max(1, Math.round(ticks / 20))
  if(seconds < 60) return "~" + seconds + "s"
  return "~" + Math.floor(seconds / 60) + "m " + (seconds % 60) + "s"
}

function buildLayerFillRects(x1, y1, z1, x2, y2, z2) {
  const rects = []
  const stack = [[x1, y1, z1, x2, y2, z2]]

  while(stack.length > 0) {
    const [cx1, cy1, cz1, cx2, cy2, cz2] = stack.pop()
    const sx = cx2 - cx1 + 1
    const sy = cy2 - cy1 + 1
    const sz = cz2 - cz1 + 1
    const volume = sx * sy * sz

    if(volume <= LAYER_FILL_LIMIT_PER_CALL) {
      rects.push([cx1, cy1, cz1, cx2, cy2, cz2, volume])
      continue
    }

    if(sx >= sy && sx >= sz) {
      const step = Math.max(1, Math.floor(LAYER_FILL_LIMIT_PER_CALL / (sy * sz)))
      let x = cx1
      while(x <= cx2) {
        const xe = Math.min(x + step - 1, cx2)
        stack.push([x, cy1, cz1, xe, cy2, cz2])
        x = xe + 1
      }
    } else if(sz >= sy) {
      const step = Math.max(1, Math.floor(LAYER_FILL_LIMIT_PER_CALL / (sx * sy)))
      let z = cz1
      while(z <= cz2) {
        const ze = Math.min(z + step - 1, cz2)
        stack.push([cx1, cy1, z, cx2, cy2, ze])
        z = ze + 1
      }
    } else {
      const step = Math.max(1, Math.floor(LAYER_FILL_LIMIT_PER_CALL / (sx * sz)))
      let y = cy1
      while(y <= cy2) {
        const ye = Math.min(y + step - 1, cy2)
        stack.push([cx1, y, cz1, cx2, ye, cz2])
        y = ye + 1
      }
    }
  }

  return rects
}

function buildLayerFillChunkGroups(x1, y1, z1, x2, y2, z2) {
  const groups = []
  const minChunkX = Math.floor(x1 / LAYER_FILL_CHUNK_SIZE)
  const maxChunkX = Math.floor(x2 / LAYER_FILL_CHUNK_SIZE)
  const minChunkZ = Math.floor(z1 / LAYER_FILL_CHUNK_SIZE)
  const maxChunkZ = Math.floor(z2 / LAYER_FILL_CHUNK_SIZE)

  for(let chunkZ = minChunkZ; chunkZ <= maxChunkZ; chunkZ++) {
    for(let chunkX = minChunkX; chunkX <= maxChunkX; chunkX++) {
      const gx1 = Math.max(x1, chunkX * LAYER_FILL_CHUNK_SIZE)
      const gx2 = Math.min(x2, chunkX * LAYER_FILL_CHUNK_SIZE + LAYER_FILL_CHUNK_SIZE - 1)
      const gz1 = Math.max(z1, chunkZ * LAYER_FILL_CHUNK_SIZE)
      const gz2 = Math.min(z2, chunkZ * LAYER_FILL_CHUNK_SIZE + LAYER_FILL_CHUNK_SIZE - 1)
      if(gx1 > gx2 || gz1 > gz2) continue

      const rects = buildLayerFillRects(gx1, y1, gz1, gx2, y2, gz2)
      let blocks = 0
      for(const rect of rects) blocks += rect[6]

      groups.push({
        cx: chunkX,
        cz: chunkZ,
        loadX: gx1,
        loadY: y1,
        loadZ: gz1,
        rects,
        blocks,
      })
    }
  }

  return groups
}

function estimateLayerFillTicks(volume, sizeX, sizeZ, pid) {
  const rectTicks = Math.ceil(volume / LAYER_FILL_LIMIT_PER_CALL / getLayerFillRectsPerTick(pid))
  if(!shouldLoadLayerFillChunks(pid)) return rectTicks
  return rectTicks + Math.ceil(sizeX / LAYER_FILL_CHUNK_SIZE) * Math.ceil(sizeZ / LAYER_FILL_CHUNK_SIZE)
}

function layerFillRect(rect, block) {
  api.setBlockRect([rect[0], rect[1], rect[2]], [rect[3], rect[4], rect[5]], block)
}

function clearLayerFillSelection(pid, silent = false) {
  pos1[pid] = null
  pos2[pid] = null
  layerFillPendingConfirm[pid] = null
  if(!silent) {
    api.sendMessage(pid, "Selection cleared.", { color: "aqua" })
  }
}

///////////////////////////////////////////////////////////
// PATH HELPERS
///////////////////////////////////////////////////////////

function getPathWaypoints(pid) {
  if(!pathWaypoints[pid]) pathWaypoints[pid] = []
  return pathWaypoints[pid]
}

function getPathMarker(index) {
  return index === 0 ? PATH_MARKER_FIRST_BLOCK : PATH_MARKER_BLOCK
}

function restorePathMarker(marker) {
  if(!marker) return
  api.setBlock(marker.x, marker.y, marker.z, marker.orig)
}

function restoreAllPathMarkers(pid) {
  const points = getPathWaypoints(pid)
  for(let i = 0; i < points.length; i++) restorePathMarker(points[i])
}

function addPathWaypoint(pid, x, y, z) {
  const points = getPathWaypoints(pid)
  const exists = points.some((point) => point.x === x && point.y === y && point.z === z)
  if(exists) {
    api.sendMessage(pid, "There is already a waypoint here!", { color: "red" })
    return
  }

  const current = api.getBlock(x, y, z)
  points.push({ x, y, z, orig: current })
  api.setBlock(x, y, z, getPathMarker(points.length - 1))
  api.sendMessage(pid, "Waypoint " + points.length + " set at (" + x + ", " + y + ", " + z + ")", { color: "green" })
}

function removeLastPathWaypoint(pid) {
  const points = getPathWaypoints(pid)
  if(points.length === 0) {
    api.sendMessage(pid, "No waypoints to remove.", { color: "red" })
    return
  }

  const removed = points.pop()
  restorePathMarker(removed)

  if(points.length > 0) {
    const first = points[0]
    api.setBlock(first.x, first.y, first.z, PATH_MARKER_FIRST_BLOCK)
  }

  api.sendMessage(pid, "Waypoint removed. (" + points.length + " left)", { color: "orange" })
}

function clearPathWaypoints(pid, silent = false) {
  restoreAllPathMarkers(pid)

  if(pathPendingA[pid]) {
    restorePathMarker(pathPendingA[pid])
    pathPendingA[pid] = null
  }

  pathWaypoints[pid] = []

  if(!silent) {
    api.sendMessage(pid, "Waypoints cleared.", { color: "aqua" })
  }
}

///////////////////////////////////////////////////////////
// GRADIENT HELPER
///////////////////////////////////////////////////////////

function gradientBlock(pid, bx, by, bz) {
  const start = gradA[pid]
  const end = gradB[pid]
  if(!start || !end) {
    const fallback = GRADIENT[0]
    return fallback[Math.floor(Math.random() * fallback.length)]
  }

  const ab = [end[0] - start[0], end[1] - start[1], end[2] - start[2]]
  const len = norm3(ab)

  let t = 0
  if(len > 0) {
    const ap = [bx - start[0], by - start[1], bz - start[2]]
    t = dot3(ap, ab) / (len * len)
  }

  if(getDither(pid)) {
    const maxShift = 1 / Math.max(1, GRADIENT.length - 1)
    t += noise3(bx, by, bz) * getDitherStrength(pid) * maxShift
  }

  t = clamp(t, 0, 1)
  const index = clamp(Math.round(t * (GRADIENT.length - 1)), 0, GRADIENT.length - 1)
  const stop = GRADIENT[index]
  return stop[Math.floor(Math.random() * stop.length)]
}

///////////////////////////////////////////////////////////
// SHOP EVENTS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  ensurePaletteState(pid)
  initSettingsForPlayer(pid)
  refreshPaletteCategory(pid)
  api.clearInventory(pid)
  api.setItemSlot(pid, 9, "Diamond", 1, {
    customDisplayName: "World Edit Shop",
    customDescription: "Open the WE menu",
  })
  api.openShop(pid, false, CAT_TOOLS)
}

onPlayerBoughtShopItem = (pid, categoryKey, itemKey, item, userInput) => {
  if(categoryKey === CAT_TOOLS) {
    const previousTool = activeTool[pid]
    if(previousTool && previousTool !== itemKey) {
      api.updateShopItemForPlayer(pid, CAT_TOOLS, previousTool, { isSelected: false })
    }

    activeTool[pid] = itemKey
    api.updateShopItemForPlayer(pid, CAT_TOOLS, itemKey, { isSelected: true })

    resetPlayerBuildState(pid)
    refreshSettingsCategory(pid)

    const toolDef = WE_TOOLS.find((tool) => tool.key === itemKey)
    api.sendOverShopInfo(pid, [
      { icon: toolDef.icon, style: { color: "white", fontSize: "18px" } },
      { str: "  " + toolDef.name + " activated!", style: { color: "#ffffff", fontSize: "16px" } },
    ])

    giveItems(pid)
    return
  }

  if(categoryKey === CAT_PALETTES) {
    ensurePaletteState(pid)

    if(itemKey === "palette_target") {
      loadPaletteIntoDraft(pid, userInput)
      refreshPaletteCategory(pid)
      if(activeTool[pid]) refreshSettingsCategory(pid)
      api.sendOverShopInfo(pid, [
        { icon: "fa-solid fa-swatchbook", style: { color: "white", fontSize: "16px" } },
        { str: "  Editing palette -> " + paletteEditor[pid].selected, style: { color: "#ffffff", fontSize: "15px" } },
      ])
      return
    }

    if(itemKey === "palette_add_block") {
      const blockName = (userInput ?? "").trim()
      if(!blockName) {
        api.sendMessage(pid, "Type a block name first.", { color: "red" })
        return
      }
      getPaletteDraft(pid).blocks.push(blockName)
      refreshPaletteCategory(pid)
      api.sendMessage(pid, blockName + " added to the draft palette.", { color: "green" })
      return
    }

    if(itemKey === "palette_remove_block") {
      const draft = getPaletteDraft(pid)
      const blockName = userInput
      const index = draft.blocks.indexOf(blockName)
      if(index === -1) {
        api.sendMessage(pid, "This block is not in the draft palette.", { color: "red" })
        return
      }
      draft.blocks.splice(index, 1)
      refreshPaletteCategory(pid)
      api.sendMessage(pid, blockName + " removed from the draft palette.", { color: "orange" })
      return
    }

    if(itemKey === "palette_save_as") {
      const paletteName = (userInput ?? "").trim()
      const draft = getPaletteDraft(pid)
      if(!paletteName) {
        api.sendMessage(pid, "Type a palette name first.", { color: "red" })
        return
      }
      if(LAYER_FILL_SPECIAL_CHOICES.includes(paletteName)) {
        api.sendMessage(pid, "This palette name is reserved.", { color: "red" })
        return
      }
      if(draft.blocks.length === 0) {
        api.sendMessage(pid, "Draft is empty. Add blocks before saving.", { color: "red" })
        return
      }

      const store = getPaletteStore(pid)
      store[paletteName] = [...draft.blocks]
      loadPaletteIntoDraft(pid, paletteName)
      refreshPaletteCategory(pid)
      if(activeTool[pid]) refreshSettingsCategory(pid)
      api.sendMessage(pid, "Palette saved as \"" + paletteName + "\".", { color: "green" })
      return
    }

    if(itemKey === "palette_apply_selected") {
      const draft = getPaletteDraft(pid)
      if(draft.blocks.length === 0) {
        api.sendMessage(pid, "Draft is empty. Add blocks before overwriting a palette.", { color: "red" })
        return
      }
      getPaletteStore(pid)[draft.selected] = [...draft.blocks]
      refreshPaletteCategory(pid)
      if(activeTool[pid]) refreshSettingsCategory(pid)
      api.sendMessage(pid, "Palette \"" + draft.selected + "\" updated.", { color: "green" })
      return
    }
  }

  if(categoryKey === CAT_SETTINGS) {
    const settingKey = itemKey.includes("__") ? itemKey.split("__")[1] : itemKey
    setSetting(pid, settingKey, userInput)

    api.updateShopItemForPlayer(pid, CAT_SETTINGS, itemKey, {
      description: "Current: " + userInput,
    })

    const toolKey = activeTool[pid]
    const settingDef = TOOL_SETTINGS[toolKey]?.find((setting) => setting.key === settingKey)
    api.sendOverShopInfo(pid, [
      { icon: "fa-solid fa-gear", style: { color: "white", fontSize: "16px" } },
      { str: "  " + (settingDef?.label ?? settingKey) + " -> " + userInput, style: { color: "#ffffff", fontSize: "15px" } },
    ])
  }
}

///////////////////////////////////////////////////////////
// RESET PLAYER TOOL STATE
///////////////////////////////////////////////////////////

function resetPlayerBuildState(pid) {
  pos1[pid] = null
  pos2[pid] = null
  layerFillPendingConfirm[pid] = null
  center[pid] = null
  spikePoint[pid] = null
  planePoints[pid] = []
  planePointIndex[pid] = 0
  gradA[pid] = null
  gradB[pid] = null
  clipboard[pid] = null
  anchor[pid] = null
  clearPathWaypoints(pid, true)
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

function giveItems(pid) {
  const tool = activeTool[pid]

  api.clearInventory(pid)
  api.setItemSlot(pid, 9, "Diamond", 1, {
    customDisplayName: "World Edit Shop",
    customDescription: "Open the WE menu",
  })

  if(tool === "rectangle" || tool === "rocks") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Left: Pos1 | Alt: Pos2",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Replace Tool",
      customDescription: "Click: Replace selection",
    })
    return
  }

  if(tool === "circle") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Click: Set center",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Replace Tool",
      customDescription: "Click: Replace circle",
    })
    return
  }

  if(tool === "sphere") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Click: Set center",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Replace Tool",
      customDescription: "Click: Replace sphere",
    })
    api.setItemSlot(pid, 2, "Stone Pickaxe", 1, {
      customDisplayName: "One-Click Sphere",
      customDescription: "Click: Sphere at target block",
    })
    return
  }

  if(tool === "line") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Left: Pos1 | Alt: Pos2",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Line Tool",
      customDescription: "Click: Generate line",
    })
    return
  }

  if(tool === "plane" || tool === "plane_gradient") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "Plane Tool",
      customDescription: "Click: Set next point (4 needed)",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Generate Plane",
      customDescription: "Click: Build plane",
    })

    if(tool === "plane_gradient") {
      api.setItemSlot(pid, 2, "Blue Paintball", 1, {
        customDisplayName: "Gradient Start",
        customDescription: "Click: Start point [0%]",
      })
      api.setItemSlot(pid, 3, "Yellow Paintball", 1, {
        customDisplayName: "Gradient End",
        customDescription: "Click: End point [100%]",
      })
    }
    return
  }

  if(tool === "spike") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Click: Center | Alt: Spike top",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Spike Tool",
      customDescription: "Click / Alt: Create spike",
    })
    return
  }

  if(tool === "terrain") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "Noise Axe",
      customDescription: "Left: Pos1 | Alt: Pos2",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Generate 3D Terrain",
      customDescription: "Click: 3D relief",
    })
    api.setItemSlot(pid, 2, "Red Paintball", 1, {
      customDisplayName: "Generate 2D Map",
      customDescription: "Click: 2D color map",
    })
    return
  }

  if(tool === "copy_paste") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Axe",
      customDescription: "Left: Pos1 | Alt: Pos2",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Paste Tool",
      customDescription: "Click: Paste at anchor",
    })
    api.setItemSlot(pid, 2, "Red Paintball", 1, {
      customDisplayName: "Set Anchor",
      customDescription: "Click: Set paste anchor point",
    })
    return
  }

  if(tool === "layer_fill") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Layer Axe",
      customDescription: "Left: Point 1 | Alt: Point 2",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Fill Layer",
      customDescription: "Click: Fill the selection",
    })
    api.setItemSlot(pid, 2, "Red Paintball", 1, {
      customDisplayName: "Clear / Cancel",
      customDescription: "Click: Clear points | While filling: Cancel",
    })
    return
  }

  if(tool === "path") {
    api.setItemSlot(pid, 0, "Wood Axe", 1, {
      customDisplayName: "WE Path Axe",
      customDescription: "Click: Add waypoint | Alt: Remove last",
    })
    api.setItemSlot(pid, 1, "Green Paintball", 1, {
      customDisplayName: "Build Path",
      customDescription: "Click: Build path through all waypoints",
    })
    api.setItemSlot(pid, 2, "Red Paintball", 1, {
      customDisplayName: "Clear Waypoints",
      customDescription: "Click: Remove all waypoints",
    })
    api.setItemSlot(pid, 3, "Stone Pickaxe", 1, {
      customDisplayName: "Instant Path",
      customDescription: "Click point A then B for a direct path",
    })
    return
  }

  if(tool === "tree_remover") {
    api.setItemSlot(pid, 0, "Iron Spade", 1, {
      customDisplayName: "Tree Remover",
      customDescription: "Alt click: Remove trees around click",
    })
  }
}

///////////////////////////////////////////////////////////
// CLICK EVENTS
///////////////////////////////////////////////////////////

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  if(held.name === "Diamond") {
    api.openShop(pid, true, CAT_TOOLS)
    return
  }

  const target = api.getPlayerTargetInfo(pid)
  if(!target || !target.position) return

  const [x, y, z] = target.position
  const tool = activeTool[pid]

  if(held.name === "Wood Axe") {
    if(tool === "layer_fill") {
      if(!wasAltClick) {
        pos1[pid] = [x, y, z]
        layerFillPendingConfirm[pid] = null
        api.sendMessage(pid, "Point 1 -> " + x + " " + y + " " + z, { color: "green" })
      } else {
        pos2[pid] = [x, y, z]
        layerFillPendingConfirm[pid] = null
        api.sendMessage(pid, "Point 2 -> " + x + " " + y + " " + z, { color: "yellow" })
      }

      if(pos1[pid] && pos2[pid]) {
        const b = getBounds(pid)
        const sx = b.maxX - b.minX + 1
        const sy = b.maxY - b.minY + 1
        const sz = b.maxZ - b.minZ + 1
        api.sendMessage(pid, "Selection: " + sx + " x " + sy + " x " + sz + " = " + (sx * sy * sz) + " blocks", { color: "aqua" })
      }
      return
    }

    if(tool === "rectangle" || tool === "rocks" || tool === "line" || tool === "copy_paste" || tool === "terrain") {
      if(!wasAltClick) {
        pos1[pid] = [x, y, z]
        clipboard[pid] = null
        anchor[pid] = null
        api.sendMessage(pid, "Pos1 -> " + x + " " + y + " " + z, { color: "green" })
        if(tool === "copy_paste" && pos2[pid]) startCopy(pid)
      } else {
        pos2[pid] = [x, y, z]
        clipboard[pid] = null
        anchor[pid] = null
        api.sendMessage(pid, "Pos2 -> " + x + " " + y + " " + z, { color: "yellow" })
        if(tool === "copy_paste" && pos1[pid]) startCopy(pid)
      }
      return
    }

    if(tool === "circle" || tool === "sphere") {
      center[pid] = [x, y, z]
      api.sendMessage(pid, "Center -> " + x + " " + y + " " + z, { color: "green" })
      return
    }

    if(tool === "spike") {
      if(!wasAltClick) {
        center[pid] = [x, y, z]
        api.sendMessage(pid, "Center set!", { color: "green" })
      }
      return
    }

    if(tool === "plane" || tool === "plane_gradient") {
      if(!planePoints[pid]) planePoints[pid] = []
      if(!planePointIndex[pid]) planePointIndex[pid] = 0

      planePointIndex[pid]++
      const index = planePointIndex[pid]
      planePoints[pid][index - 1] = [x, y, z]
      const colors = ["green", "yellow", "cyan", "purple"]
      api.sendMessage(pid, "Pos" + index + " -> " + x + ", " + y + ", " + z, { color: colors[index - 1] || "white" })
      if(index >= 4) planePointIndex[pid] = 0
      return
    }

    if(tool === "path") {
      if(wasAltClick) removeLastPathWaypoint(pid)
      else addPathWaypoint(pid, x, y, z)
      return
    }
  }

  if(held.name === "Green Paintball") {
    if(tool === "layer_fill") {
      startLayerFill(pid)
      return
    }

    if(tool === "copy_paste") {
      const clip = clipboard[pid]
      if(!clip || !clip.entries || clip.entries.length === 0) {
        api.sendMessage(pid, "Nothing copied yet!", { color: "red" })
        return
      }
      if(!anchor[pid]) {
        api.sendMessage(pid, "No anchor set!", { color: "red" })
        return
      }
      if(isPasting) {
        api.sendMessage(pid, "Already pasting!", { color: "orange" })
        return
      }
      startPaste(pid, x, y, z)
      return
    }

    if(tool === "path") {
      startPathBuild(pid, getPathWaypoints(pid), true)
      return
    }

    if(isBusy()) {
      api.sendMessage(pid, "Already running!", { color: "orange" })
      return
    }

    if(tool === "rectangle" || tool === "rocks") startRect(pid)
    else if(tool === "circle") startCircle(pid)
    else if(tool === "sphere") startSphere(pid)
    else if(tool === "line") startLine(pid)
    else if(tool === "plane") startPlane(pid, false)
    else if(tool === "plane_gradient") startPlane(pid, true)
    else if(tool === "spike") startSpike(pid)
    else if(tool === "terrain") startTerrain(pid, true)
    return
  }

  if(held.name === "Red Paintball") {
    if(tool === "layer_fill") {
      if(isBuilding && bounds?._mode === "layer_fill" && bounds?._pid === pid) {
        cancelLayerFill(pid)
      } else {
        clearLayerFillSelection(pid)
      }
      return
    }

    if(tool === "terrain") {
      if(isBusy()) {
        api.sendMessage(pid, "Already running!", { color: "orange" })
        return
      }
      startTerrain(pid, false)
      return
    }

    if(tool === "copy_paste") {
      anchor[pid] = [x, y, z]
      api.sendMessage(pid, "Anchor set -> " + x + " " + y + " " + z, { color: "red" })
      return
    }

    if(tool === "path") {
      clearPathWaypoints(pid)
      return
    }
  }

  if(held.name === "Stone Pickaxe" && tool === "sphere") {
    if(isBusy()) {
      api.sendMessage(pid, "Already running!", { color: "orange" })
      return
    }
    center[pid] = [x, y, z]
    api.sendMessage(pid, "One-click sphere -> " + x + " " + y + " " + z, { color: "aqua" })
    startSphere(pid)
    return
  }

  if(held.name === "Stone Pickaxe" && tool === "path") {
    if(pathPendingA[pid]) {
      startPathBuild(pid, [pathPendingA[pid], { x, y, z, orig: null }], false)
    } else {
      pathPendingA[pid] = { x, y, z, orig: api.getBlock(x, y, z) }
      api.setBlock(x, y, z, PATH_MARKER_FIRST_BLOCK)
      api.sendMessage(pid, "Point A set at (" + x + ", " + y + ", " + z + ") - click again for point B", { color: "green" })
    }
    return
  }

  if(held.name === "Blue Paintball" && tool === "plane_gradient") {
    gradA[pid] = [x, y, z]
    api.sendMessage(pid, "Gradient START -> " + x + ", " + y + ", " + z, { color: "blue" })
    return
  }

  if(held.name === "Yellow Paintball" && tool === "plane_gradient") {
    gradB[pid] = [x, y, z]
    api.sendMessage(pid, "Gradient END -> " + x + ", " + y + ", " + z, { color: "yellow" })
  }
}

///////////////////////////////////////////////////////////
// ALT ACTIONS
///////////////////////////////////////////////////////////

onPlayerAltAction = (pid, x, y, z, block, targetEId) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const tool = activeTool[pid]

  if(held.name === "Wood Axe" && tool === "spike") {
    spikePoint[pid] = [x, y, z]
    api.sendMessage(pid, "Spike top set!", { color: "green" })
    return
  }

  if(held.name === "Green Paintball" && tool === "spike") {
    if(isBusy()) {
      api.sendMessage(pid, "Already running!", { color: "orange" })
      return
    }
    startSpike(pid)
    return
  }

  if(held.name === "Iron Spade" && tool === "tree_remover") {
    const range = getTreeRange(pid)

    for(let xi = x - range.negX; xi <= x + range.posX; xi++){
      for(let yi = y - range.negY; yi <= y + range.posY; yi++){
        for(let zi = z - range.negZ; zi <= z + range.posZ; zi++){
          const current = baseBlockName(api.getBlock(xi, yi, zi))
          if(TREE_BREAKABLE.includes(current)) api.setBlock(xi, yi, zi, "Air")
        }
      }
    }

    api.sendMessage(pid, "Trees removed!", { color: "green" })
  }
}

///////////////////////////////////////////////////////////
// START FUNCTIONS
///////////////////////////////////////////////////////////

function startRect(pid) {
  const b = getBounds(pid)
  if(!b) {
    api.sendMessage(pid, "Set pos1 and pos2 first!", { color: "red" })
    return
  }

  bounds = b
  bounds._blocks = getBlockList(pid)
  bounds._pid = pid
  bounds._mode = activeTool[pid] === "rocks" ? "rocks" : "rect"

  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalReplaced = 0
  isBuilding = true
  activePid = pid

  const volume = (b.maxX - b.minX + 1) * (b.maxY - b.minY + 1) * (b.maxZ - b.minZ + 1)
  api.sendMessage(pid, "Replace started (" + volume + " blocks)...", { color: "green" })
}

function startCircle(pid) {
  if(!center[pid]) {
    api.sendMessage(pid, "Set a center first!", { color: "red" })
    return
  }

  const radius = getRadius(pid)
  const c = center[pid]

  bounds = {
    minX: c[0] - radius,
    maxX: c[0] + radius,
    minZ: c[2] - radius,
    maxZ: c[2] + radius,
    centerX: c[0],
    centerY: c[1],
    centerZ: c[2],
    r2: radius * radius,
    _mode: "circle",
    _pid: pid,
  }

  circleCurX = bounds.minX
  circleCurZ = bounds.minZ
  totalReplaced = 0
  isBuilding = true
  activePid = pid

  api.sendMessage(pid, "Circle started (r=" + radius + ")...", { color: "green" })
}

function startSphere(pid) {
  if(!center[pid]) {
    api.sendMessage(pid, "Set a center first!", { color: "red" })
    return
  }

  const radius = getRadius(pid)
  const c = center[pid]

  sphereBounds = {
    minX: c[0] - radius,
    maxX: c[0] + radius,
    minY: c[1] - radius,
    maxY: c[1] + radius,
    minZ: c[2] - radius,
    maxZ: c[2] + radius,
    centerX: c[0],
    centerY: c[1],
    centerZ: c[2],
    r2: radius * radius,
  }

  sphereCurX = sphereBounds.minX
  sphereCurY = sphereBounds.minY
  sphereCurZ = sphereBounds.minZ
  totalReplaced = 0
  isBuilding = true
  activePid = pid
  bounds = { _mode: "sphere", _pid: pid }

  api.sendMessage(pid, "Sphere started (r=" + radius + ")...", { color: "green" })
}

function startLine(pid) {
  const p1 = pos1[pid]
  const p2 = pos2[pid]
  if(!p1 || !p2) {
    api.sendMessage(pid, "Set pos1 and pos2 first!", { color: "red" })
    return
  }

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dz = p2[2] - p1[2]
  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz))

  linePoints = []
  if(steps === 0) {
    linePoints.push([p1[0], p1[1], p1[2]])
  } else {
    const sx = dx / steps
    const sy = dy / steps
    const sz = dz / steps

    let lx = p1[0]
    let ly = p1[1]
    let lz = p1[2]

    for(let i = 0; i <= steps; i++){
      linePoints.push([Math.round(lx), Math.round(ly), Math.round(lz)])
      lx += sx
      ly += sy
      lz += sz
    }
  }

  lineOffsets = makeCenteredOffsets(parseInt(getSetting(pid, "thickness") ?? "1", 10))
  lineIndex = 0
  lineOffsetIndex = 0
  isBuilding = true
  activePid = pid
  bounds = { _mode: "line", _pid: pid }

  api.sendMessage(pid, "Line started (" + linePoints.length + " points)", { color: "green" })
}

function startPlane(pid, withGradient) {
  const pts = planePoints[pid]
  if(!pts || pts.length < 4 || pts.some((point) => !point)) {
    api.sendMessage(pid, "Set 4 points first!", { color: "red" })
    return
  }

  const [p1, p2, p3, p4] = pts
  const d12 = norm3([p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]])
  const d43 = norm3([p3[0] - p4[0], p3[1] - p4[1], p3[2] - p4[2]])
  const d14 = norm3([p4[0] - p1[0], p4[1] - p1[1], p4[2] - p1[2]])
  const d23 = norm3([p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]])

  const maxSteps = getMaxSteps(pid)
  planeStepsU = Math.min(Math.ceil(Math.max(d12, d43)) * 2 + 1, maxSteps)
  planeStepsV = Math.min(Math.ceil(Math.max(d14, d23)) * 2 + 1, maxSteps)

  const edgeU = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
  const edgeV = [p4[0] - p1[0], p4[1] - p1[1], p4[2] - p1[2]]
  const normal = normalize3(cross3(edgeU, edgeV))

  if(norm3(normal) === 0) {
    api.sendMessage(pid, "The selected plane is degenerate. Choose 4 non-collinear points.", { color: "red" })
    return
  }

  planeP1 = p1
  planeP2 = p2
  planeP3 = p3
  planeP4 = p4
  planeNormal = normal
  planeVisited = new Set()
  planeIu = 0
  planeIv = 0
  totalReplaced = 0
  isBuilding = true
  activePid = pid
  bounds = { _mode: withGradient ? "plane_gradient" : "plane", _pid: pid }

  api.sendMessage(pid, "Plane started...", { color: "green" })
}

function startSpike(pid) {
  if(!center[pid] || !spikePoint[pid]) {
    api.sendMessage(pid, "Set center + spike top first!", { color: "red" })
    return
  }

  const c = center[pid]
  const top = spikePoint[pid]
  const dx = top[0] - c[0]
  const dy = top[1] - c[1]
  const dz = top[2] - c[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

  if(length === 0) {
    api.sendMessage(pid, "Center and spike top are the same!", { color: "red" })
    return
  }

  blocksToPlace = []
  visited = {}
  currentIndex = 0
  genParams = {
    nx: dx / length,
    ny: dy / length,
    nz: dz / length,
    cx: c[0],
    cy: c[1],
    cz: c[2],
    step: 0,
    steps: Math.ceil(length),
    length,
    pid,
  }

  bounds = { _mode: "spike", _pid: pid }
  isPreparing = true
  activePid = pid
  api.sendMessage(pid, "Preparing spike...", { color: "yellow" })
}

function startTerrain(pid, mode3D) {
  const b = getBounds(pid)
  if(!b) {
    api.sendMessage(pid, "Set pos1 and pos2 first!", { color: "red" })
    return
  }

  terrainBounds = b
  terrainCurX = b.minX
  terrainTotal = 0
  terrainIs3D = mode3D
  terrainRectQueue = []
  terrainIsGen = true
  terrainIsFinal = false
  terrainTimer = 0
  terrainPid = pid
  activePid = pid

  const area = (b.maxX - b.minX + 1) * (b.maxZ - b.minZ + 1)
  api.sendMessage(pid, "Terrain " + (mode3D ? "3D" : "2D") + " started (" + area + " columns)...", { color: "cyan" })
}

function startCopy(pid) {
  if(isBusy()) {
    api.sendMessage(pid, "Another action is already running!", { color: "orange" })
    return
  }

  const b = getBounds(pid)
  if(!b) return

  copyBounds = b
  copyCurX = b.minX
  copyCurY = b.minY
  copyCurZ = b.minZ
  copyBuffer = []
  copyPid = pid
  clipboard[pid] = null
  isCopying = true
  activePid = pid

  const volume = (b.maxX - b.minX + 1) * (b.maxY - b.minY + 1) * (b.maxZ - b.minZ + 1)
  api.sendMessage(pid, "Copying " + volume + " blocks...", { color: "green" })
}

function startPaste(pid, clickX, clickY, clickZ) {
  if(isBusy()) {
    api.sendMessage(pid, "Another action is already running!", { color: "orange" })
    return
  }

  const clip = clipboard[pid]
  const anc = anchor[pid]
  if(!clip || !clip.entries || !clip.sourceMin || !anc) return

  const offsetX = clickX - anc[0]
  const offsetY = clickY - anc[1]
  const offsetZ = clickZ - anc[2]
  const [sourceMinX, sourceMinY, sourceMinZ] = clip.sourceMin

  const originX = sourceMinX + offsetX
  const originY = sourceMinY + offsetY
  const originZ = sourceMinZ + offsetZ

  pasteQueue = clip.entries.map((entry) => ({
    x: originX + entry.dx,
    y: originY + entry.dy,
    z: originZ + entry.dz,
    block: entry.block,
  }))

  totalPasted = 0
  pastePid = pid
  isPasting = true
  activePid = pid

  api.sendMessage(pid, "Pasting " + pasteQueue.length + " blocks...", { color: "red" })
}

function startLayerFill(pid) {
  if(isBusy()) {
    api.sendMessage(pid, "Already running!", { color: "orange" })
    return
  }

  const b = getBounds(pid)
  if(!b) {
    api.sendMessage(pid, "Need 2 points! (axe: click = point 1, alt click = point 2)", { color: "red" })
    return
  }

  const sizeX = b.maxX - b.minX + 1
  const sizeY = b.maxY - b.minY + 1
  const sizeZ = b.maxZ - b.minZ + 1
  const volume = sizeX * sizeY * sizeZ

  if(volume > LAYER_FILL_MAX_BLOCKS) {
    api.sendMessage(pid, "Selection too big! (" + volume + " blocks, max " + LAYER_FILL_MAX_BLOCKS + ")", { color: "red" })
    return
  }

  if(volume > LAYER_FILL_CONFIRM_THRESHOLD) {
    const pending = layerFillPendingConfirm[pid]
    if(!pending || pending.volume !== volume) {
      layerFillPendingConfirm[pid] = { volume, tick: layerFillTickCount }
      api.sendMessage(
        pid,
        "Huge fill: " + volume + " blocks (" + sizeX + " x " + sizeY + " x " + sizeZ + ", " + formatApproxTicks(estimateLayerFillTicks(volume, sizeX, sizeZ, pid)) + "). Click again to confirm!",
        { color: "orange" }
      )
      return
    }
    layerFillPendingConfirm[pid] = null
  }

  const loadChunks = shouldLoadLayerFillChunks(pid)
  const groups = loadChunks
    ? buildLayerFillChunkGroups(b.minX, b.minY, b.minZ, b.maxX, b.maxY, b.maxZ)
    : [{
        cx: null,
        cz: null,
        loadX: b.minX,
        loadY: b.minY,
        loadZ: b.minZ,
        rects: buildLayerFillRects(b.minX, b.minY, b.minZ, b.maxX, b.maxY, b.maxZ),
        blocks: volume,
      }]

  let rectTotal = 0
  for(const group of groups) rectTotal += group.rects.length

  const estimatedTicks = Math.ceil(rectTotal / getLayerFillRectsPerTick(pid)) + (loadChunks ? groups.length : 0)

  layerFillState = {
    groups,
    g: 0,
    i: 0,
    needLoad: loadChunks,
    done: 0,
    total: volume,
    pid,
    lastPct: 0,
    ticks: 0,
    loadChunks,
    blockList: getLayerFillBlockList(pid),
  }

  isBuilding = true
  activePid = pid
  bounds = { _mode: "layer_fill", _pid: pid }

  api.broadcastMessage(
    "Layer fill started! (" + sizeX + " x " + sizeY + " x " + sizeZ + " = " + volume + " blocks, " + rectTotal + " rects" + (loadChunks ? ", " + groups.length + " chunks to load" : "") + ", " + formatApproxTicks(estimatedTicks) + ")",
    { color: "green" }
  )
}

function cancelLayerFill(pid) {
  if(!isBuilding || bounds?._mode !== "layer_fill" || !layerFillState) {
    clearLayerFillSelection(pid)
    return
  }

  const state = layerFillState
  isBuilding = false
  bounds = null
  layerFillState = null
  layerFillPendingConfirm[pid] = null

  api.broadcastMessage(
    "Layer fill cancelled! (" + state.done + "/" + state.total + " blocks placed) Selection kept.",
    { color: "orange" }
  )
}

function finishLayerFill() {
  const state = layerFillState
  isBuilding = false
  bounds = null
  layerFillState = null

  api.broadcastMessage(
    "Layer filled! (" + state.done + " blocks, " + formatApproxTicks(state.ticks) + ") Selection kept: green = refill, red = clear.",
    { color: "green" }
  )
}

function startPathBuild(pid, points, usesWaypoints) {
  if(isBusy()) {
    api.sendMessage(pid, "Already running!", { color: "orange" })
    return
  }

  if(!points || points.length < 2) {
    api.sendMessage(pid, "Need at least 2 waypoints!", { color: "red" })
    return
  }

  if(usesWaypoints) restoreAllPathMarkers(pid)
  if(pathPendingA[pid]) {
    restorePathMarker(pathPendingA[pid])
    pathPendingA[pid] = null
  }

  const width = getPathWidth(pid)
  const mode = getPathMode(pid)
  const radius2 = width * width
  const segments = []

  for(let i = 0; i < points.length - 1; i++){
    const a = points[i]
    const b = points[i + 1]
    const segment = {
      ax: a.x,
      ay: a.y,
      az: a.z,
      bx: b.x,
      by: b.y,
      bz: b.z,
      minX: Math.min(a.x, b.x) - width,
      maxX: Math.max(a.x, b.x) + width,
      minZ: Math.min(a.z, b.z) - width,
      maxZ: Math.max(a.z, b.z) + width,
    }

    if(mode === "tube") {
      segment.minY = Math.min(a.y, b.y) - width
      segment.maxY = Math.max(a.y, b.y) + width
    } else {
      segment.scanTop = Math.min(Math.max(Math.max(a.y, b.y) + PATH_SCAN_MARGIN, PATH_SCAN_BOTTOM), PATH_SCAN_TOP)
      segment.scanBot = Math.max(Math.min(Math.min(a.y, b.y) - PATH_SCAN_MARGIN, PATH_SCAN_TOP), PATH_SCAN_BOTTOM)
    }

    segments.push(segment)
  }

  pathState = {
    pid,
    mode,
    width,
    radius2,
    depth: getPathDepth(pid),
    blockList: getBlockList(pid),
    segments,
    seg: 0,
    x: segments[0].minX,
    y: mode === "tube" ? segments[0].minY : 0,
    z: segments[0].minZ,
    usesWaypoints,
  }

  totalReplaced = 0
  isBuilding = true
  activePid = pid
  bounds = { _mode: "path", _pid: pid }

  api.broadcastMessage(
    "Path build started! (" + points.length + " points, " + segments.length + " segment(s), width " + width + ", mode " + mode + ")",
    { color: "green" }
  )
}

function finishPathBuild() {
  const pid = pathState?.pid
  const usesWaypoints = pathState?.usesWaypoints

  isBuilding = false
  pathState = null
  bounds = null

  if(pid && usesWaypoints) pathWaypoints[pid] = []

  api.broadcastMessage("Path finished! (" + totalReplaced + " blocks replaced)", { color: "green" })
}

///////////////////////////////////////////////////////////
// MAIN TICK
///////////////////////////////////////////////////////////

tick = () => {
  layerFillTickCount++
  for(const pid in layerFillPendingConfirm) {
    const pending = layerFillPendingConfirm[pid]
    if(pending && layerFillTickCount - pending.tick > LAYER_FILL_CONFIRM_TIMEOUT_TICKS) {
      layerFillPendingConfirm[pid] = null
    }
  }

  if(isPreparing) {
    const { nx, ny, nz, cx, cy, cz, steps, length, pid } = genParams
    const stepsThisTick = Math.min(2, steps - genParams.step)
    const angleStep = getSpikeAngleStep(pid)
    const baseRadius = getSpikeBaseRadius(pid)

    for(let s = 0; s < stepsThisTick; s++){
      const i = genParams.step
      const t = i / steps
      const pcx = cx + nx * length * t
      const pcy = cy + ny * length * t
      const pcz = cz + nz * length * t
      const radius = (1 - t) * baseRadius

      for(let angle = 0; angle < 360; angle += angleStep){
        const rad = angle * Math.PI / 180
        const bx = Math.round(pcx + Math.cos(rad) * radius)
        const bz = Math.round(pcz + Math.sin(rad) * radius)
        const by = Math.round(pcy)
        const key = bx + "," + by + "," + bz
        if(!visited[key]) {
          visited[key] = true
          blocksToPlace.push([bx, by, bz])
        }
      }

      genParams.step++
    }

    if(genParams.step >= steps) {
      isPreparing = false
      isBuilding = true
      api.broadcastMessage("Building spike (" + blocksToPlace.length + " blocks)...", { color: "green" })
    }
    return
  }

  if(isCopying) {
    const b = copyBounds
    const perTick = getBlocksPerTick(copyPid)
    let processed = 0

    while(processed < perTick) {
      copyBuffer.push({
        dx: copyCurX - b.minX,
        dy: copyCurY - b.minY,
        dz: copyCurZ - b.minZ,
        block: api.getBlock(copyCurX, copyCurY, copyCurZ),
      })

      processed++
      copyCurZ++

      if(copyCurZ > b.maxZ) {
        copyCurZ = b.minZ
        copyCurX++
        if(copyCurX > b.maxX) {
          copyCurX = b.minX
          copyCurY++
          if(copyCurY > b.maxY) {
            clipboard[copyPid] = {
              entries: copyBuffer,
              sourceMin: [b.minX, b.minY, b.minZ],
            }
            anchor[copyPid] = pos1[copyPid]
            isCopying = false
            api.sendMessage(copyPid, "Copied! Anchor auto-set on pos1. Use the Red Paintball to change it, then Green Paintball to paste.", { color: "green" })
            return
          }
        }
      }
    }

    return
  }

  if(isPasting) {
    const perTick = getBlocksPerTick(pastePid)
    let processed = 0

    while(processed < perTick && pasteQueue.length > 0) {
      const entry = pasteQueue.shift()
      api.setBlock(entry.x, entry.y, entry.z, entry.block)
      totalPasted++
      processed++
    }

    if(pasteQueue.length === 0) {
      isPasting = false
      api.broadcastMessage("Paste finished! (" + totalPasted + " blocks)", { color: "green" })
    }
    return
  }

  if(terrainIsGen || terrainIsFinal) {
    terrainTimer++
    if(terrainTimer <= TERRAIN_TICK_DELAY) return
    terrainTimer = 0

    const b = terrainBounds
    const rectsPerTick = getRectsPerTick(terrainPid)

    while(terrainIsGen && terrainRectQueue.length < TERRAIN_QUEUE_BUFFER) {
      if(terrainCurX > b.maxX) {
        terrainIsGen = false
        terrainIsFinal = true
        break
      }
      enqueueTerrainColumn(terrainCurX, b, terrainPid)
      terrainCurX++
    }

    let dispatched = 0
    while(terrainRectQueue.length > 0 && dispatched < rectsPerTick) {
      const { p1, p2, block } = terrainRectQueue.shift()
      api.setBlockRect(p1, p2, block)
      terrainTotal++
      dispatched++
    }

    if(terrainIsFinal && terrainRectQueue.length === 0) {
      terrainIsFinal = false
      api.broadcastMessage("Terrain " + (terrainIs3D ? "3D" : "2D") + " done! (" + terrainTotal + " rects)", { color: "white" })
    }
    return
  }

  if(!isBuilding) return

  const mode = bounds?._mode
  const pid = bounds?._pid
  const perTick = mode === "layer_fill" ? getLayerFillRectsPerTick(pid) : getBlocksPerTick(pid)

  if(mode === "layer_fill") {
    const state = layerFillState
    if(!state) {
      isBuilding = false
      bounds = null
      return
    }

    state.ticks++

    if(state.needLoad) {
      const group = state.groups[state.g]
      api.getBlock(group.loadX, group.loadY, group.loadZ)
      state.needLoad = false
      return
    }

    let rectsDone = 0
    while(rectsDone < perTick) {
      const group = state.groups[state.g]

      if(state.i >= group.rects.length) {
        state.g++
        state.i = 0
        if(state.g >= state.groups.length) {
          finishLayerFill()
          return
        }
        state.needLoad = state.loadChunks
        if(state.needLoad) return
        continue
      }

      const rect = group.rects[state.i]
      layerFillRect(rect, randFrom(state.blockList))
      state.done += rect[6]
      state.i++
      rectsDone++
    }

    const pct = Math.floor(state.done * 100 / state.total)
    if(Math.floor(pct / 10) > Math.floor(state.lastPct / 10)) {
      let msg = "Fill... " + pct + "% (" + state.done + " blocks"
      if(state.loadChunks) msg += ", chunk " + (state.g + 1) + "/" + state.groups.length
      api.sendMessage(state.pid, msg + ")", { color: "aqua" })
    }
    state.lastPct = pct
    return
  }

  if(mode === "path") {
    const st = pathState
    const segments = st.segments
    let processed = 0

    if(st.mode === "tube") {
      while(processed < perTick) {
        const segment = segments[st.seg]
        const dxs = segment.bx - segment.ax
        const dys = segment.by - segment.ay
        const dzs = segment.bz - segment.az
        const len2 = dxs * dxs + dys * dys + dzs * dzs

        if(len2 > 0) {
          let t = ((st.x - segment.ax) * dxs + (st.y - segment.ay) * dys + (st.z - segment.az) * dzs) / len2
          t = clamp(t, 0, 1)

          const cx = segment.ax + t * dxs
          const cy = segment.ay + t * dys
          const cz = segment.az + t * dzs
          const d2 = (st.x - cx) * (st.x - cx) + (st.y - cy) * (st.y - cy) + (st.z - cz) * (st.z - cz)

          if(d2 <= st.radius2) {
            const current = api.getBlock(st.x, st.y, st.z)
            if(shouldReplaceFn(pid, current, "path")) {
              api.setBlock(st.x, st.y, st.z, randFrom(st.blockList))
              totalReplaced++
            }
          }
        }

        processed++
        st.x++

        if(st.x > segment.maxX) {
          st.x = segment.minX
          st.z++
          if(st.z > segment.maxZ) {
            st.z = segment.minZ
            st.y++
            if(st.y > segment.maxY) {
              st.seg++
              if(st.seg >= segments.length) {
                finishPathBuild()
                return
              }
              const next = segments[st.seg]
              st.x = next.minX
              st.y = next.minY
              st.z = next.minZ
            }
          }
        }
      }
    } else {
      while(processed < perTick) {
        const segment = segments[st.seg]
        const dxs = segment.bx - segment.ax
        const dzs = segment.bz - segment.az
        const len2 = dxs * dxs + dzs * dzs

        if(len2 > 0) {
          let t = ((st.x - segment.ax) * dxs + (st.z - segment.az) * dzs) / len2
          t = clamp(t, 0, 1)

          const cx = segment.ax + t * dxs
          const cz = segment.az + t * dzs
          const d2 = (st.x - cx) * (st.x - cx) + (st.z - cz) * (st.z - cz)

          if(d2 <= st.radius2) {
            let topY = null
            for(let yy = segment.scanTop; yy >= segment.scanBot; yy--) {
              const current = api.getBlock(st.x, yy, st.z)
              if(isSolid(current)) {
                topY = yy
                break
              }
            }

            if(topY !== null) {
              for(let depth = 0; depth < st.depth; depth++) {
                const yy = topY - depth
                const current = api.getBlock(st.x, yy, st.z)
                if(shouldReplaceFn(pid, current, "path")) {
                  api.setBlock(st.x, yy, st.z, randFrom(st.blockList))
                  totalReplaced++
                }
              }
            }
          }
        }

        processed++
        st.x++

        if(st.x > segment.maxX) {
          st.x = segment.minX
          st.z++
          if(st.z > segment.maxZ) {
            st.seg++
            if(st.seg >= segments.length) {
              finishPathBuild()
              return
            }
            const next = segments[st.seg]
            st.x = next.minX
            st.z = next.minZ
          }
        }
      }
    }
    return
  }

  if(mode === "spike") {
    const blockList = getBlockList(pid)
    let placed = 0
    while(placed < perTick && currentIndex < blocksToPlace.length) {
      const [x, y, z] = blocksToPlace[currentIndex]
      api.setBlock(x, y, z, randFrom(blockList))
      currentIndex++
      placed++
    }

    if(currentIndex >= blocksToPlace.length) {
      isBuilding = false
      api.broadcastMessage("Spike finished!", { color: "green" })
    }
    return
  }

  if(mode === "line") {
    const blockList = getBlockList(pid)
    let placed = 0

    while(placed < perTick) {
      if(lineIndex >= linePoints.length) {
        isBuilding = false
        api.broadcastMessage("Line finished!", { color: "green" })
        return
      }

      const point = linePoints[lineIndex]
      const offset = lineOffsets[lineOffsetIndex]
      api.setBlock(point[0] + offset[0], point[1] + offset[1], point[2] + offset[2], randFrom(blockList))

      placed++
      lineOffsetIndex++
      if(lineOffsetIndex >= lineOffsets.length) {
        lineOffsetIndex = 0
        lineIndex++
      }
    }
    return
  }

  if(mode === "plane" || mode === "plane_gradient") {
    const thickness = getThickness(pid)
    let processed = 0

    while(processed < perTick) {
      if(planeIu > planeStepsU) {
        isBuilding = false
        planeVisited = null
        api.broadcastMessage("Plane finished! (" + totalReplaced + " blocks)", { color: "green" })
        return
      }

      const u = planeIu / planeStepsU
      const edgeA = lerp3(planeP1, planeP2, u)
      const edgeB = lerp3(planeP4, planeP3, u)
      const v = planeIv / planeStepsV
      const point = lerp3(edgeA, edgeB, v)

      for(let t = -thickness; t <= thickness; t++) {
        const bx = Math.round(point[0] + planeNormal[0] * t)
        const by = Math.round(point[1] + planeNormal[1] * t)
        const bz = Math.round(point[2] + planeNormal[2] * t)
        const key = bx + "|" + by + "|" + bz
        if(planeVisited.has(key)) continue
        planeVisited.add(key)

        if(shouldReplaceFn(pid, api.getBlock(bx, by, bz))) {
          const block = mode === "plane_gradient" ? gradientBlock(pid, bx, by, bz) : randFrom(getBlockList(pid))
          api.setBlock(bx, by, bz, block)
          totalReplaced++
        }
      }

      processed++
      planeIv++
      if(planeIv > planeStepsV) {
        planeIv = 0
        planeIu++
      }
    }
    return
  }

  if(mode === "sphere") {
    const b = sphereBounds
    const blockList = getBlockList(pid)
    let processed = 0

    while(processed < perTick) {
      const dx = sphereCurX - b.centerX
      const dy = sphereCurY - b.centerY
      const dz = sphereCurZ - b.centerZ
      if(dx * dx + dy * dy + dz * dz <= b.r2 && shouldReplaceFn(pid, api.getBlock(sphereCurX, sphereCurY, sphereCurZ))) {
        api.setBlock(sphereCurX, sphereCurY, sphereCurZ, randFrom(blockList))
        totalReplaced++
      }

      processed++
      sphereCurX++
      if(sphereCurX > b.maxX) {
        sphereCurX = b.minX
        sphereCurZ++
        if(sphereCurZ > b.maxZ) {
          sphereCurZ = b.minZ
          sphereCurY++
          if(sphereCurY > b.maxY) {
            isBuilding = false
            api.broadcastMessage("Sphere finished! (" + totalReplaced + " blocks)", { color: "green" })
            return
          }
        }
      }
    }
    return
  }

  if(mode === "circle") {
    const b = bounds
    const blockList = getBlockList(pid)
    let processed = 0

    while(processed < perTick) {
      const dx = circleCurX - b.centerX
      const dz = circleCurZ - b.centerZ
      if(dx * dx + dz * dz <= b.r2 && shouldReplaceFn(pid, api.getBlock(circleCurX, b.centerY, circleCurZ))) {
        api.setBlock(circleCurX, b.centerY, circleCurZ, randFrom(blockList))
        totalReplaced++
      }

      processed++
      circleCurX++
      if(circleCurX > b.maxX) {
        circleCurX = b.minX
        circleCurZ++
        if(circleCurZ > b.maxZ) {
          isBuilding = false
          api.broadcastMessage("Circle finished! (" + totalReplaced + " blocks)", { color: "green" })
          return
        }
      }
    }
    return
  }

  const b = bounds
  const blockList = b._blocks
  const isRock = mode === "rocks"
  const centerX = (b.minX + b.maxX) / 2
  const centerZ = (b.minZ + b.maxZ) / 2
  const height = Math.max(1, b.maxY - b.minY)
  const baseRadius = Math.max((b.maxX - b.minX) / 2, (b.maxZ - b.minZ) / 2)

  let processed = 0
  while(processed < perTick) {
    let place = true

    if(isRock) {
      const dx = curX - centerX
      const dz = curZ - centerZ
      const dy = curY - b.minY
      const radius = baseRadius * (1 - dy / height) + (Math.random() - 0.5) * baseRadius * 0.5
      place = Math.sqrt(dx * dx + dz * dz) <= radius
    }

    if(place && shouldReplaceFn(pid, api.getBlock(curX, curY, curZ))) {
      api.setBlock(curX, curY, curZ, randFrom(blockList))
      totalReplaced++
    }

    processed++
    curZ++
    if(curZ > b.maxZ) {
      curZ = b.minZ
      curX++
      if(curX > b.maxX) {
        curX = b.minX
        curY++
        if(curY > b.maxY) {
          isBuilding = false
          api.broadcastMessage("Replace finished! (" + totalReplaced + " blocks)", { color: "green" })
          return
        }
      }
    }
  }
}

///////////////////////////////////////////////////////////
// TERRAIN HELPER
///////////////////////////////////////////////////////////

function enqueueTerrainColumn(x, b, pid) {
  if(terrainIs3D) {
    const blockList = getBlockList(pid)
    for(let z = b.minZ; z <= b.maxZ; z++) {
      const value = noise2D(x, z)
      const block = randFrom(blockList)
      const desiredHeight = getHeight(value)
      const topY = clamp(b.minY + desiredHeight - 1, b.minY, b.maxY)
      const columnHeight = topY - b.minY + 1

      if(getSurfaceOnly(pid)) {
        terrainRectQueue.push({ p1: [x, topY, z], p2: [x, topY, z], block })
      } else {
        terrainRectQueue.push({ p1: [x, b.minY, z], p2: [x, topY, z], block, cost: columnHeight })
      }
    }
    return
  }

  let batchStartZ = b.minZ
  let batchBlock = null

  for(let z = b.minZ; z <= b.maxZ + 1; z++) {
    const isLast = z > b.maxZ
    const currentBlock = isLast ? null : getColorBlock(noise2D(x, z))

    const shouldFlush = isLast
      || !batchBlock
      || currentBlock !== batchBlock
      || (z - batchStartZ) >= TERRAIN_MAX_RECT_LENGTH

    if(shouldFlush && batchBlock) {
      terrainRectQueue.push({
        p1: [x, b.minY, batchStartZ],
        p2: [x, b.minY, z - 1],
        block: batchBlock,
      })
      batchBlock = null
      batchStartZ = z
    }

    if(!isLast && !batchBlock) {
      batchBlock = currentBlock
      batchStartZ = z
    }
  }
}
