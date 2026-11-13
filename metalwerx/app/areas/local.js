// The words that are a suburb's own, for its page at /areas/<slug>. Only the
// suburbs here have a page: pages that differ only by a name and a distance
// read as doorway pages to Google, so the rest of ./suburbs.js is listed on
// /areas without one. A new page needs its own paragraphs here, not a copy of
// another suburb's with the name changed (suburbs.test.js checks).
//
// What these say about the yard is what the service, material, price and blog
// pages already say. What they say about a place was checked on 12 Nov 2026:
// Bayswater's precinct on Knox City Council's site, Dandenong's manufacturers
// in the Premier's release of 17 Aug 2022, the yard's street's land use and
// the toll-free drives on OpenStreetMap. A change to how the yard works needs
// making here too.
export const local = {
  hallam: [
    "Our yard is on Wedgewood Road, in Hallam's industrial area, so from anywhere in the suburb you're only a few minutes away. For most loads, the quickest way to sell is to bring them in yourself: we grade the metal, weigh it and pay you by bank transfer the same day.",
    "Being this close, you don't have to save up for a big load. Drop off the copper pipe from a bathroom job, or a bucket of old brass taps, as they turn up, and keep them apart from the rest: clean, sorted metal is paid at a better price than a mixed load.",
    "It's easy to check what a load is worth before you set off. Our scrap prices page lists the average we pay per kilo and per tonne, with the date the prices were last updated, and we confirm the price when your metal is weighed.",
    "Hallam has factories and workshops as well as homes, and we buy from both. A business turning out offcuts can keep a scrap bin on site and call us when it's full, and at home a bin helps when a shed clear-out or a renovation turns up more than a trailer can carry.",
    "Whatever you bring, leave out gas bottles and aerosol cans, drums or tanks that still hold fuel, oil or chemicals, fridges and air conditioners that still hold gas, and anything with asbestos in it. We can't take them into the yard.",
  ],
  dandenong: [
    "From the middle of Dandenong, our yard is a short drive south-east along Lonsdale Street and the Princes Highway. That's close enough to bring a load in yourself, and to come back with a second one the same day if the first trip doesn't take it all.",
    "Many of Dandenong's homes have stood for decades, and renovating one turns up metal worth money: copper pipe and brass fittings from the old plumbing, a hot water system, galvanised roofing and gutters.",
    "Copper and brass pay far more than steel, and both are graded by how clean they are. Cut brass fittings and steel brackets off copper pipe, pull off lagging and tape, take the steel screws and plastic handles off old taps, and keep the brass apart from the copper: a mixed bucket is paid at the lower price.",
    "The steel can all come in together, roofing and gutters included. We sort it by grade at the yard and weigh each grade on its own, so you're paid the right price for every kilo.",
    "Dandenong's centre is full of shops, cafés and restaurants, and a kitchen refit turns out stainless steel. Benches, sinks, shelving and equipment are all welcome, and for a big fit-out we can collect.",
  ],
  "dandenong-south": [
    "Dandenong South is largely factories, warehouses and workshops, and the Victorian Government put the Dandenong area's manufacturers at almost 1,400 in 2022. Between them they turn out a steady stream of offcuts, swarf and worn-out equipment, and that metal is worth selling rather than paying to have it taken away.",
    "For a business, the usual set-up is bins on site, sized to what you produce and swapped on a set day or whenever you call. Every load is weighed at our yard and comes with a weigh ticket for your records.",
    "Sort as you go if you can. Steel, aluminium, stainless and copper in bins of their own earn more than one mixed load, and swarf and turnings need draining of oil before they go in.",
    "If your plant makes food, drink or pharmaceuticals, much of what it retires is stainless steel: tanks, vats, benches and process equipment, often grade 316, which pays more than 304. Strip off steel frames, motors and plastic where you can, as equipment with them still on is paid at a lower rate.",
    "Refitting a factory or moving out? Old racking, machine frames and steel benches can go too: we bring the truck and the gear to load them. And between bin swaps, a ute load is a quick trip, as we're about ten minutes up the road.",
  ],
  "narre-warren": [
    "Narre Warren is next door to Hallam, so our yard is a short, straight run west along the Princes Highway. If it fits in the car, ute or trailer, bringing it in yourself is the quickest way to get paid.",
    "Most of Narre Warren is homes, and most household scrap is steel: old roofing iron and fencing, a dead washing machine, a stove or a hot water system. Often there's something worth more mixed in, such as copper pipe, brass taps or an old air conditioner, so set those aside.",
    "An air conditioner is worth bringing in whole, as it's full of copper pipe and aluminium fins, but only once a licensed technician has recovered its gas. Releasing it is illegal, so units that still hold gas can't come into the yard. If you're replacing a system, ask your installer to recover the gas from the old one.",
    "For a bigger clear-out, a 1 m³ or 2.4 m³ scrap bin on the driveway keeps everything in one place while you work. Call us when it's full, and we'll collect it and pay you for the metal inside.",
    "Not sure what something is? Try a magnet. It sticks to steel but not to aluminium, copper or brass, and those are the metals worth keeping apart.",
  ],
  berwick: [
    "From Berwick, the Princes Highway runs straight west through Narre Warren to our yard in Hallam.",
    "Berwick is one of the older towns in the area, and renovating an older home here turns up the metal that pays best: copper pipe, brass taps and fittings, and sometimes an old hot water system with a copper cylinder inside.",
    "Book a 2.4 m³ scrap bin before the work starts, and throw metal straight in as it comes out: it's far easier than moving a pile of it twice. Call us when it's full, and we'll weigh it at the yard and pay you for what's inside.",
    "Keep a bucket by the bin for copper and another for brass. Old pipe is worth more with its fittings cut off, and taps are worth more without their handles and screws, as clean metal makes the higher grade.",
    "Old aluminium window and door frames have their own, higher price as alloy extrusion, once the glass, rubber seals and steel screws are out. Replacing the windows can turn up a surprising amount of it.",
  ],
  cranbourne: [
    "New estates keep going up around Cranbourne, and building sites throw out metal worth selling. A scrap bin on site, swapped as it fills, keeps roofing offcuts, copper pipe ends and aluminium window frames out of the skip, and every load comes with a weigh ticket.",
    "Ask the trades to use it: the plumber's copper offcuts, the roofer's sheet, the framer's steel and the window installer's aluminium all belong in it. Unlike a skip full of rubbish, a bin of scrap metal is worth something: we pay you for the metal inside.",
    "Further out, towards Cranbourne South and Devon Meadows, the blocks get bigger and so does the scrap: old fencing, steel water tanks, sheds and the odd broken-down implement. If it's too heavy to lift, book a pickup and we'll bring the truck and do the loading.",
    "Before we come, make sure the truck can get close to the pile, drain anything that held fuel or oil, and pull the general rubbish out. Photos help us bring the right truck.",
  ],
  pakenham: [
    "Pakenham is one of the furthest suburbs we cover, out along the Princes Freeway, so it pays to make each trip count: one full trailer rather than three part loads.",
    "The town is growing fast, with new estates going in beside the farms around it. On the farms and rural blocks, old machinery, implements, steel tanks and fencing soon add up to a load worth collecting.",
    "Send us photos, and tell us what's there and how to get to it. We'll give you a price for the metal and let you know about any collection charge before we book the pickup, and we can usually take machinery whole, so there's no need to cut it up.",
    "If you have time, take off the parts that pay more than steel: electric motors, brass fittings and aluminium parts are paid at their own prices once they're off. Drain the oil and fuel from engines, gearboxes and tanks before we arrive, and leave any gas bottles out of the pile.",
    "Builders on the new estates can keep a scrap bin on site for their offcuts and have it swapped as it fills.",
  ],
  bayswater: [
    "Bayswater gives its name to the Bayswater Business Precinct, which Knox City Council says is home to over 5,000 businesses, many of them in manufacturing and construction. It's the second-largest employment precinct in Melbourne's east.",
    "If yours turns out steel, stainless or aluminium offcuts, we can leave scrap bins at your site and collect them on a schedule or whenever you ring. Each one is weighed at our yard, with a ticket for your records, and paid for the same day.",
    "Size doesn't matter. A one-person workshop that fills a bin every month or two can keep one on site and call us when it's full, with no need for regular swaps, and a bigger plant can have a separate bin for each metal, which earns more than a mixed load.",
    "It's a fair run from Bayswater to Hallam, which is another reason a bin beats driving small loads down yourself. The quickest way is EastLink, a toll road. Stud Road is free and a little shorter, with more traffic lights, and outside peak hour it takes only a few minutes longer.",
  ],
  boronia: [
    "Boronia sits at the foot of the Dandenong Ranges, and the drive to our yard is toll-free: Ferntree Gully Road and Stud Road, then the Monash Freeway.",
    "Towards the hills, many blocks slope. Our bins need firm, level ground with room for our truck to get in and out, so if yours slopes, mention it when you book so we can plan where the bin goes.",
    "Household clear-outs here are mostly steel: an old garden shed, fencing, roofing iron, a broken washing machine. Pull out any copper, brass or aluminium first, as they're paid at much higher prices than steel.",
    "Taking down an old shed? Stack the sheets flat and bundle the frame, so it packs tighter in a trailer or bin, and take off any timber, plastic or concrete footings: steel with them still attached is paid at a lower rate.",
    "Coming in yourself? It's a fair drive, so wait until you have a full trailer, with the copper, brass and aluminium in buckets of their own. They're what make the trip pay.",
  ],
  lilydale: [
    "Lilydale is the furthest suburb on our list, out in the Yarra Ranges where the Yarra Valley begins, so it pays to make one trip of it.",
    "Fill a scrap bin at your own pace, over weeks if you like, and have it collected once, or gather everything into one pile and book a single pickup. Any collection charge depends partly on how far we travel, and we'll tell you what it is before we book.",
    "Because it's a long run, send a few photos and a rough idea of how much metal there is before we come out. It lets us bring the right truck and quote properly, and saves a wasted trip.",
    "Properties around Lilydale run from suburban blocks to acreage, and the bigger ones collect bigger scrap: old tanks, fencing, sheds and machinery. We bring the gear to load it, so you don't have to.",
    "The quickest drive is the Maroondah Highway and EastLink, a toll road. Going without the toll, through Croydon and down Stud Road, takes roughly ten minutes longer outside peak hour.",
  ],
};

// What each council asks before a bin goes on its road or nature strip, from
// its skip bin permit page (12 Nov 2026). It closes the page of each suburb
// above in that council.
export const binPermits = {
  "Casey City Council":
    "In Casey, a bin on the nature strip may need a council permit, applied for 14 days ahead and good for 7 to 10 days, unless the bin company holds Casey's yearly one. Tell us where the bin will go when you book.",
  "Greater Dandenong City Council":
    "Greater Dandenong Council wants bins on private land wherever they fit, and only considers a permit for the road when one won't. The resident or the bin company can apply, and a single-use permit lasts three days.",
  "Knox City Council":
    "In Knox, a bin on your own property needs no permit. On the road, nature strip or footpath it does, and Knox City Council only issues those permits to the bin's provider, with at least 14 days' notice for a one-off, so let us know early if the bin has to go on the street.",
  "Cardinia Shire Council":
    "In Cardinia Shire, a bin on the road needs a council permit, which for a home lasts up to a week, and the applicant needs public liability insurance. If the bin can't go on your property, say so when you book.",
  "Yarra Ranges Council":
    "Yarra Ranges Council only gives bin permits to registered bin companies, and won't approve one where the bin can safely go on private property. For a home, a permit lasts up to 7 days.",
};
