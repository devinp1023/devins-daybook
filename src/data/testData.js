import { CITIES } from './tripConstants'

// Generate a date within a city's stay range
function dateInRange(arrival, departure, dayOffset = 0) {
  const d = new Date(arrival)
  d.setDate(d.getDate() + dayOffset)
  const dep = new Date(departure)
  if (d >= dep) d.setTime(dep.getTime() - 86400000)
  return d.toISOString().slice(0, 10)
}

function ts(dateStr) {
  return new Date(dateStr + 'T12:00:00Z').getTime()
}

export function generateTestData() {
  const entries = []
  let n = 1

  function add(city, country, date, title, sections) {
    entries.push({
      id: `test-${n++}`,
      city,
      country,
      date,
      title,
      sections: {
        activities: { text: '', photoIds: [], ...sections.activities },
        food: { text: '', photoIds: [], ...sections.food },
        people: { text: '', photoIds: [], ...sections.people },
        other: { text: '', photoIds: [], ...sections.other },
      },
      createdAt: ts(date) + n * 1000,
    })
  }

  // Venice (05-27 to 05-29) — 2 entries
  add('Venice', 'IT', '2025-05-27', 'Arrival on the water', {
    activities: { text: 'Water taxi from the airport straight to the hotel. The Grand Canal at sunset is unreal — every building looks like it was painted by someone who had too much wine and too much talent.' },
    food: { text: 'Cicchetti at a tiny bar near Rialto. Baccalà mantecato on a crostini, a spritz in hand, locals shouting over each other. Perfect.' },
    people: {},
    other: { text: 'The sound of water lapping against stone. No cars. Just boats and voices and church bells.' },
  })
  add('Venice', 'IT', '2025-05-28', 'Lost in the alleys', {
    activities: { text: 'Got properly lost for three hours. Every dead end revealed a tiny square with a well and a cat. Found a bookshop where books are stacked in a gondola to protect from floods.' },
    food: {},
    people: { text: 'Met a glass-blower on Murano who has been making chandeliers for forty years. His hands moved like he was conducting an orchestra.' },
    other: {},
  })

  // Florence (05-29 to 06-01) — 3 entries
  add('Florence', 'IT', '2025-05-29', 'Renaissance overload', {
    activities: { text: 'The Uffizi first thing in the morning before the crowds. Botticelli\'s Primavera stopped me in my tracks. Spent twenty minutes just standing there.' },
    food: { text: 'Lampredotto sandwich from a street cart. The kind of food that makes you question every fancy restaurant you\'ve ever been to.' },
    people: {},
    other: {},
  })
  add('Florence', 'IT', '2025-05-30', 'Piazzale Michelangelo at golden hour', {
    activities: { text: 'Climbed up to the Piazzale just before sunset. The whole city spread out below, terracotta roofs glowing orange. The Duomo rising above everything like a crown.' },
    food: {},
    people: {},
    other: { text: 'Bought a leather journal from a shop on Ponte Vecchio. The old man wrapped it in tissue paper like it was something sacred.' },
  })
  add('Florence', 'IT', '2025-05-31', 'The David and the market', {
    activities: { text: 'Saw the David. Photos don\'t prepare you for the scale. Spent the afternoon at San Lorenzo market picking through vintage prints and old maps.' },
    food: { text: 'Ribollita at a trattoria where the waiter called me "caro." Thick, hearty, the kind of soup that fixes things.' },
    people: { text: 'Shared a table with two architecture students from Tokyo. They sketched the Palazzo Pitti while I wrote. We traded notebooks at the end.' },
    other: { text: 'Florence is a city that takes itself seriously and earns it.' },
  })

  // Rome (06-01 to 06-03) — 2 entries
  add('Rome', 'IT', '2025-06-01', 'When in Rome, walk until your feet protest', {
    activities: { text: 'Colosseum in the morning, then wandered through Trastevere. Threw a coin in the Trevi Fountain because you have to, even though you know better.' },
    food: { text: 'Cacio e pepe at a place with no sign on the door. Four ingredients, infinite satisfaction.' },
    people: { text: 'An elderly couple at the next table insisted we try their wine. They\'ve been coming to the same restaurant every Friday for thirty years.' },
    other: {},
  })
  add('Rome', 'IT', '2025-06-02', 'Vatican morning', {
    activities: { text: 'The Sistine Chapel ceiling. You crane your neck until it hurts and then you keep looking because how can you stop.' },
    food: {},
    people: {},
    other: { text: 'Rome layers time like paint on a wall. You can see all of it at once if you look carefully enough.' },
  })

  // Amalfi (06-03 to 06-05) — 2 entries
  add('Amalfi', 'IT', '2025-06-03', 'Cliffs and lemons', {
    activities: { text: 'Bus ride along the coast road. Every turn reveals another impossible view. The driver handles hairpin turns like he\'s done it ten thousand times. He probably has.' },
    food: { text: 'Lemon granita on a terrace overlooking the sea. The lemons here are the size of your head and twice as sweet.' },
    people: {},
    other: {},
  })
  add('Amalfi', 'IT', '2025-06-04', 'Path of the Gods', {
    activities: { text: 'Hiked the Sentiero degli Dei. The trail hugs the cliffside above the clouds. Every step feels earned, every view feels gifted.' },
    food: { text: 'Fresh seafood at a beach restaurant in Positano. Grilled octopus, cold white wine, sand between my toes.' },
    people: { text: 'A family from Naples shared their picnic spot on the trail. Prosciutto, mozzarella, bread, and a view worth more than any museum.' },
    other: { text: 'The Amalfi coast is what happens when geology decides to show off.' },
  })

  // Nice (06-05 to 06-09) — 2 entries
  add('Nice', 'FR', '2025-06-05', 'The Promenade and the blue', {
    activities: { text: 'Walked the Promenade des Anglais end to end. The blue of the Mediterranean here is different — deeper, more certain of itself.' },
    food: { text: 'Socca from a vendor in the old town. Chickpea flatbread, crispy edges, eaten standing up. Simple and perfect.' },
    people: {},
    other: {},
  })
  add('Nice', 'FR', '2025-06-07', 'Day trip to Monaco', {
    activities: { text: 'Monaco is absurd in the best possible way. Supercars parked like they\'re nothing. The casino looks like a wedding cake designed by someone with unlimited budget.' },
    food: {},
    people: {},
    other: { text: 'Stood where the Grand Prix cars race. The streets are narrower than you\'d think. The courage required is wider.' },
  })

  // Lyon (06-09 to 06-12) — 2 entries
  add('Lyon', 'FR', '2025-06-09', 'Capital of gastronomy', {
    activities: { text: 'Explored the traboules — hidden passageways through Renaissance buildings. Lyon keeps its secrets in plain sight, you just have to know which door to push.' },
    food: { text: 'Lunch at a traditional bouchon. Quenelles de brochet, salade Lyonnaise, a carafe of Beaujolais. This city understands that eating is not a task, it\'s an event.' },
    people: {},
    other: {},
  })
  add('Lyon', 'FR', '2025-06-11', 'Geneva day trip', {
    activities: { text: 'Took the train to Geneva. The Jet d\'Eau shoots 140 meters into the air. Walked along the lake, crossed into the old town, watched the precision of everything.' },
    food: { text: 'Swiss chocolate from a shop that has been open since 1875. Some things are old for a reason.' },
    people: { text: 'A watchmaker explained the difference between a movement and a mechanism. His patience was itself a kind of precision.' },
    other: {},
  })

  // Paris (06-12 to 06-17) — 3 entries
  add('Paris', 'FR', '2025-06-12', 'First morning in Paris', {
    activities: { text: 'Walked from the hotel to the Seine before the city fully woke up. The light on the water. The bridges. The bookstalls not yet open, their green boxes still closed like sleeping eyes.' },
    food: { text: 'Croissant from the first boulangerie I found. Still warm. Buttery layers that shatter when you bite. I stood on the sidewalk and ate it like a ceremony.' },
    people: {},
    other: {},
  })
  add('Paris', 'FR', '2025-06-14', 'Montmartre and the view', {
    activities: { text: 'Climbed to Sacré-Cœur. The steps are a performance space — accordion players, portrait artists, tourists becoming part of the scenery they came to see.' },
    food: {},
    people: { text: 'A street artist drew my portrait in charcoal in seven minutes. She said she draws two hundred faces a week and remembers none of them. "But they remember me," she said.' },
    other: { text: 'Paris is a city that has been described so many times it should be boring by now. It isn\'t.' },
  })
  add('Paris', 'FR', '2025-06-16', 'Last day — the Marais', {
    activities: { text: 'Spent the last day in the Marais. Vintage shops, falafel on Rue des Rosiers, the Place des Vosges. A city you leave knowing you\'ll return.' },
    food: { text: 'The best falafel of my life. Not an exaggeration. L\'As du Fallafel lives up to the line out the door.' },
    people: {},
    other: {},
  })

  // Brussels (06-17 to 06-20) — 2 entries
  add('Brussels', 'BE', '2025-06-17', 'Grand Place at night', {
    activities: { text: 'The Grand Place after dark. The guild houses lit up in gold. It feels like standing inside a jewelry box. UNESCO got this one right.' },
    food: { text: 'Belgian waffles from a street vendor. Liège style, caramelized sugar, eaten on a bench. Then frites with andalouse sauce because one indulgence was not enough.' },
    people: {},
    other: {},
  })
  add('Brussels', 'BE', '2025-06-19', 'Antwerp for the day', {
    activities: { text: 'Train to Antwerp. The central station alone is worth the trip — a cathedral of transport. Rubens\' house, the diamond district, a city that mixes old Flemish grandeur with modern edge.' },
    food: {},
    people: {},
    other: { text: 'Antwerp feels like the cool older sibling Brussels doesn\'t want you to meet.' },
  })

  // Amsterdam (06-20 to 06-25) — 3 entries
  add('Amsterdam', 'NL', '2025-06-20', 'Canals and bicycles', {
    activities: { text: 'Rented a bike and immediately understood why everyone here cycles. The canals organize the city like sentences in a well-written paragraph. Every bridge is a punctuation mark.' },
    food: { text: 'Stroopwafel fresh from a market stall, placed over my coffee cup to warm. The caramel goes soft and stretchy. A perfect small invention.' },
    people: {},
    other: {},
  })
  add('Amsterdam', 'NL', '2025-06-22', 'Anne Frank House', {
    activities: { text: 'The Anne Frank House. The steep stairs. The bookcase. The window she couldn\'t look out of. Some places teach you more in silence than others do in a lifetime of talking.' },
    food: {},
    people: {},
    other: { text: 'Walked along the Herengracht afterward. The city felt heavier and lighter at the same time.' },
  })
  add('Amsterdam', 'NL', '2025-06-24', 'Jordaan and the markets', {
    activities: { text: 'Explored the Jordaan neighborhood. Every corner has a cafe with a cat in the window and a sign that says something clever. Found a vintage record shop and lost an hour.' },
    food: { text: 'Indonesian rijsttafel — twelve small dishes, each one a different conversation. The colonial history is complicated but the food is undeniable.' },
    people: { text: 'Met a DJ from Rotterdam on the ferry to Noord. She said Amsterdam is a village pretending to be a city. I think she meant it as a compliment.' },
    other: {},
  })

  // Berlin (06-25 to 06-30) — 3 entries
  add('Berlin', 'DE', '2025-06-25', 'History on every wall', {
    activities: { text: 'East Side Gallery first. A kilometer of history painted on concrete. Then the Memorial to the Murdered Jews of Europe. The stone blocks shift around you like a maze of grief.' },
    food: { text: 'Currywurst from a stand in Kreuzberg. Ketchup, curry powder, a bread roll. Berlin street food doesn\'t try to be fancy. It tries to be good. It succeeds.' },
    people: {},
    other: {},
  })
  add('Berlin', 'DE', '2025-06-27', 'Kreuzberg nights', {
    activities: { text: 'Spent the evening in Kreuzberg. Street art on every surface. Bars in converted warehouses. A city that reinvents itself every decade and remembers every version.' },
    food: { text: 'Döner kebab at 1am. The bread is fresh, the meat is carved to order, the sauces are a state secret. Best late-night food in Europe, and I will argue this point.' },
    people: {},
    other: { text: 'Berlin doesn\'t care if you like it. That\'s what makes you like it.' },
  })
  add('Berlin', 'DE', '2025-06-29', 'Hamburg day trip', {
    activities: { text: 'Train to Hamburg. The Speicherstadt warehouse district reflected in the canals. The Elbphilharmonie rises like a frozen wave. A port city that looks forward while honoring what was shipped.' },
    food: { text: 'Fish sandwich at the harbor market. Smoked eel, pickled herring, a roll that absorbed everything and asked for nothing.' },
    people: {},
    other: {},
  })

  // Munich (06-30 to 07-06) — 3 entries
  add('Munich', 'DE', '2025-06-30', 'Bavarian arrival', {
    activities: { text: 'Arrived in Munich. The Marienplatz Glockenspiel at noon — tourists gather like it\'s a concert. The mechanical figures joust and dance. Kitsch elevated to tradition.' },
    food: { text: 'Weisswurst, sweet mustard, a pretzel the size of a steering wheel. A beer in a glass boot. Bavaria commits fully to everything.' },
    people: {},
    other: {},
  })
  add('Munich', 'DE', '2025-07-03', 'English Garden', {
    activities: { text: 'The English Garden is larger than Central Park and somehow more relaxed. People surf the Eisbach wave in wetsuits while others sunbathe nearby. Munich contains multitudes.' },
    food: {},
    people: { text: 'Shared a bench with a retired professor who told me the history of every tree we could see. "Each one survived two wars," he said. "That makes them braver than most of us."' },
    other: { text: 'Halfway through the trip. The days feel long and the weeks feel short. Time is doing that thing where it folds in on itself.' },
  })
  add('Munich', 'DE', '2025-07-05', 'Last full day', {
    activities: { text: 'Nymphenburg Palace. The gardens go on forever. Sat by the canal and watched swans move through the water like they owned it. They probably do.' },
    food: { text: 'Last dinner: Schweinshaxe at Augustiner. Crispy pork knuckle, potato dumplings, dark beer. A meal that says goodbye properly.' },
    people: { text: 'The waiter noticed my journal and asked if I was a writer. "Just someone trying to remember," I said. He nodded like that was answer enough.' },
    other: { text: 'Tomorrow I fly home. Forty days of stone and water and bread and strangers who became familiar. I came to see Europe. I think it also saw me.' },
  })

  return entries
}
