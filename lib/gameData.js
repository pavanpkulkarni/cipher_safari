// Full puzzle manifest embedded client-side
// (real answers are also validated server-side in api/index.py)

export const PUZZLES = [
  {
    id: 'A', animal: 'Alligator',
    target_season_index: 1, target_shadow_hour: 14,
    required_vine_color: 'Red', target_nest_id: 'Alligator_Pool',
    lines: ['A cranky alligator lost his tooth in the mud,', 'On the longest bright day when the solar rays thud.', 'Count a dozen plus two hours to watch shadows fade,', 'Plug the crimson thick rope where the swamp pool is made!']
  },
  {
    id: 'B', animal: 'Bear',
    target_season_index: 3, target_shadow_hour: 8,
    required_vine_color: 'Blue', target_nest_id: 'Bear_Cave',
    lines: ['A giant brown bear had a rumbling tummy,', 'On the briefest dark day when the blizzards are scummy.', 'He ate eight frozen fish till his hiccups were loud,', 'Snip the deep-ocean string to his cold cavern crowd!']
  },
  {
    id: 'C', animal: 'Crab',
    target_season_index: 1, target_shadow_hour: 14,
    required_vine_color: 'Yellow', target_nest_id: 'Crab_Shore',
    lines: ["A cranky old crab pinched a seagull's pink toe,", 'On the longest bright day when the heat starts to grow.', 'At two tens minus six hours he scuttled away,', 'Drag the banana-rope down to his sandy beach bay!']
  },
  {
    id: 'D', animal: 'Dolphin',
    target_season_index: 0, target_shadow_hour: 6,
    required_vine_color: 'Cyan', target_nest_id: 'Dolphin_Reef',
    lines: ['A clicking grey dolphin blew bubbles of joy,', 'When the daytime and night-time were equal, ahoy!', 'At six in the morning he raced past a ship,', 'Click the sky-colored vine for his tropical trip!']
  },
  {
    id: 'E', animal: 'Elephant',
    target_season_index: 2, target_shadow_hour: 16,
    required_vine_color: 'Amber', target_nest_id: 'Elephant_Wall',
    lines: ['A sneezing young elephant sprayed all the trees,', 'When the autumn winds shake down the crisp orange leaves.', 'At a dozen plus four hours he stomped through the dirt,', 'Plug the copper-gold cord where the mud-baths blurt!']
  },
  {
    id: 'F', animal: 'Frog',
    target_season_index: 0, target_shadow_hour: 7,
    required_vine_color: 'Red', target_nest_id: 'Frog_Lilypad',
    lines: ['A burping green toad tried to swallow a fly,', 'When the daylight and night-time were matched in the sky.', 'He chewed lucky seven fat bugs with a crunch,', 'Run the tomato-rope down to his lilypad lunch!']
  },
  {
    id: 'G', animal: 'Gorilla',
    target_season_index: 1, target_shadow_hour: 12,
    required_vine_color: 'Magenta', target_nest_id: 'Gorilla_Jungle',
    lines: ['A heavy gorilla was pounding his chest,', 'On the longest bright day when the sun rules the nest.', 'When a dozen sweet hours make your shadow turn small,', 'Snap the orchid-string quick to the great jungle wall!']
  },
  {
    id: 'H', animal: 'Hippo',
    target_season_index: 2, target_shadow_hour: 17,
    required_vine_color: 'Blue', target_nest_id: 'Hippo_River',
    lines: ['A wallowing hippo blew bubbles for fun,', 'When the harvest moon waits to displace the hot sun.', 'At two tens minus three hours he sank in the stream,', 'Route the deep-ocean line to his mud-river dream!']
  },
  {
    id: 'I', animal: 'Iguana',
    target_season_index: 1, target_shadow_hour: 13,
    required_vine_color: 'Yellow', target_nest_id: 'Iguana_Branch',
    lines: ['A lazy iguana fell straight from his branch,', 'On the longest bright day of the wild jungle ranch.', 'Thirteen hours of solar beams baked his green skin,', 'Drag the banana-rope down where the warm rocks begin!']
  },
  {
    id: 'J', animal: 'Jaguar',
    target_season_index: 3, target_shadow_hour: 22,
    required_vine_color: 'Amber', target_nest_id: 'Jaguar_Lair',
    lines: ['A shadow-bound jaguar was stalking a boar,', 'On the briefest dark day when the mountain winds roar.', 'Two tens and two hours ticked past in the fright,', 'Plug the copper-gold cord to his cave of the night!']
  },
  {
    id: 'K', animal: 'Kangaroo',
    target_season_index: 0, target_shadow_hour: 9,
    required_vine_color: 'Cyan', target_nest_id: 'Kangaroo_Pouch',
    lines: ['A hopping young kangaroo bounced through the brush,', 'When the spring and the autumn fields match in a rush.', 'Nine hours from midnight he leaped up too high,', 'Snap the sky-colored vine where the outback is dry!']
  },
  {
    id: 'L', animal: 'Lion',
    target_season_index: 1, target_shadow_hour: 18,
    required_vine_color: 'Red', target_nest_id: 'Lion_Den',
    lines: ['The king of the pride had a burp in his throat,', 'On the longest bright day when the summer rays float.', 'At a dozen plus six hours he started to doze,', 'Run the crimson thick rope to his royal repose!']
  },
  {
    id: 'M', animal: 'Monkey',
    target_season_index: 1, target_shadow_hour: 12,
    required_vine_color: 'Yellow', target_nest_id: 'Monkey_Nest',
    lines: ['A goofy wild chimp dropped his favorite red sock,', 'On the longest bright day when the sun rules the block.', 'When a dozen sweet hours make your shadow turn small,', "Snap the banana-vine quick to the tree-climber's hall!"]
  },
  {
    id: 'N', animal: 'Newt',
    target_season_index: 3, target_shadow_hour: 4,
    required_vine_color: 'Blue', target_nest_id: 'Newt_Pond',
    lines: ['A miniature newt swam away from the ice,', 'On the briefest dark day when the winter winds slice.', 'Four hours past midnight he hid in the muck,', 'Route the deep-ocean line for some water-logged luck!']
  },
  {
    id: 'O', animal: 'Owl',
    target_season_index: 3, target_shadow_hour: 24,
    required_vine_color: 'Blue', target_nest_id: 'Owl_Nest',
    lines: ['A dizzy old owl dropped his cake in the dirt,', 'On the briefest dark day when the chilly winds flirt.', 'When the clock strikes two tens and a four in the fright,', 'Plug the deep-ocean string to the king of the night!']
  },
  {
    id: 'P', animal: 'Panda',
    target_season_index: 2, target_shadow_hour: 18,
    required_vine_color: 'Amber', target_nest_id: 'Panda_Grove',
    lines: ['A clumsy fat panda fell out of his tree,', 'When the daylight and night-time were balanced with glee.', 'Ten and eight crunchy stalks turned his teeth into mud,', 'Run the copper-gold cord to his bamboo-grove thud!']
  },
  {
    id: 'Q', animal: 'Quail',
    target_season_index: 0, target_shadow_hour: 5,
    required_vine_color: 'Magenta', target_nest_id: 'Quail_Bush',
    lines: ['A whistling fat quail laid an egg in the weeds,', 'When the morning and evening are equal in deeds.', 'Five hours past midnight she chirped for her mate,', 'Connect orchid-string lines to her nesting bush gate!']
  },
  {
    id: 'R', animal: 'Rhino',
    target_season_index: 1, target_shadow_hour: 15,
    required_vine_color: 'Red', target_nest_id: 'Rhino_Mud',
    lines: ['A mud-covered rhino was scratching his back,', 'On the longest bright day of the safari track.', 'At three times five hours he wallowed in grease,', 'Run the crimson thick rope till his tick-bites decrease!']
  },
  {
    id: 'S', animal: 'Snake',
    target_season_index: 1, target_shadow_hour: 11,
    required_vine_color: 'Yellow', target_nest_id: 'Snake_Hole',
    lines: ['A hissing long snake tied his tail in a bow,', 'On the longest bright day when the sunbeams aglow.', 'At a dozen minus one hours he twisted his head,', 'Slide the banana-vine down to his desert sand bed!']
  },
  {
    id: 'T', animal: 'Tiger',
    target_season_index: 3, target_shadow_hour: 20,
    required_vine_color: 'Amber', target_nest_id: 'Tiger_Thicket',
    lines: ['A stripe-covered tiger sneezed loud in the cold,', 'On the briefest dark day when the frost takes a hold.', 'Two tens of dark hours ticked by on the clock,', 'Plug the copper-gold cord to his frozen woods block!']
  },
  {
    id: 'U', animal: 'Urchin',
    target_season_index: 3, target_shadow_hour: 2,
    required_vine_color: 'Cyan', target_nest_id: 'Urchin_Rock',
    lines: ['A spiky sea urchin rolled off a stone ledge,', "On the briefest dark day by the cold ocean's edge.", 'Just two hours past midnight he sank out of sight,', 'Snap the sky-colored vine for his deep water flight!']
  },
  {
    id: 'V', animal: 'Vulture',
    target_season_index: 2, target_shadow_hour: 12,
    required_vine_color: 'Magenta', target_nest_id: 'Vulture_Peak',
    lines: ['A bald-headed vulture was cleaning his wings,', 'When the autumn equinox equalizes all things.', 'At a dozen straight hours he soared past the cloud,', 'Connect orchid-string loops to his windy peak crowd!']
  },
  {
    id: 'W', animal: 'Whale',
    target_season_index: 0, target_shadow_hour: 8,
    required_vine_color: 'Blue', target_nest_id: 'Whale_Ocean',
    lines: ['A giant blue whale sprayed a fountain of mist,', 'When the day and the night share an identical list.', 'Eight hours of daylight were clear on the sea,', 'Route the deep-ocean line to his current of glee!']
  },
  {
    id: 'X', animal: 'Xerus',
    target_season_index: 1, target_shadow_hour: 10,
    required_vine_color: 'Red', target_nest_id: 'Xerus_Burrow',
    lines: ['A tiny ground squirrel chewed a hard hazelnut,', 'On the longest bright day by his safari hut.', 'Ten hours of sun forced his shadow to shrink,', 'Run the crimson thick rope to his dirt-burrow brink!']
  },
  {
    id: 'Y', animal: 'Yak',
    target_season_index: 3, target_shadow_hour: 6,
    required_vine_color: 'Amber', target_nest_id: 'Yak_Mountain',
    lines: ['A shaggy wild yak slipped right onto his tail,', 'On the briefest dark day of the mountain snow trail.', 'Six hours past midnight he grunted in pain,', 'Plug the copper-gold cord to his high ridge terrain!']
  },
  {
    id: 'Z', animal: 'Zebra',
    target_season_index: 0, target_shadow_hour: 15,
    required_vine_color: 'Yellow', target_nest_id: 'Zebra_Plains',
    lines: ['A striped racing zebra got stuck in the grass,', 'When the spring equinox balanced day in a mass.', 'At three times five hours he galloped ahead,', 'Slide the banana-vine down where the grasslands outspread!']
  }
]

export const VINE_COLORS = ['Red', 'Blue', 'Yellow', 'Amber', 'Magenta', 'Cyan']

export const VINE_COLOR_MAP = {
  Red:     { hex: '#FF2D55', label: 'Crimson',    emoji: '🔴' },
  Blue:    { hex: '#00C3FF', label: 'Deep Ocean', emoji: '🔵' },
  Yellow:  { hex: '#FFE500', label: 'Banana',     emoji: '🟡' },
  Amber:   { hex: '#FF8C00', label: 'Copper-Gold',emoji: '🟠' },
  Magenta: { hex: '#FF00CC', label: 'Orchid',     emoji: '💜' },
  Cyan:    { hex: '#00FFF5', label: 'Sky',         emoji: '🩵' },
}

export const SEASON_NAMES = ['Spring Equinox', 'Summer Solstice', 'Autumn Equinox', 'Winter Solstice']

export const SEASON_COLORS = {
  0: '#4FC3F7', // Spring - sky blue
  1: '#FF7043', // Summer - hot orange
  2: '#FFA726', // Autumn - amber
  3: '#90CAF9', // Winter - icy blue
}

// Decoy animals for each level (pick 2 different animals per level)
const ALL_ANIMALS = ['alligator', 'bear', 'crab', 'dolphin', 'elephant', 'frog', 'gorilla', 'hippo', 'iguana', 'jaguar', 'kangaroo', 'lion', 'monkey', 'newt', 'owl', 'panda', 'quail', 'rhino', 'snake', 'tiger', 'urchin', 'vulture', 'whale', 'xerus', 'yak', 'zebra']

export const DECOY_ANIMALS = Object.fromEntries(
  PUZZLES.map((puzzle, idx) => {
    const targetAnimal = puzzle.animal.toLowerCase()
    const others = ALL_ANIMALS.filter(a => a !== targetAnimal)
    // Pick 2 decoys spaced evenly around the array for variety
    const d1 = others[(idx * 7) % others.length]
    const d2 = others[(idx * 7 + 13) % others.length]
    return [puzzle.id, [d1, d2]]
  })
)
