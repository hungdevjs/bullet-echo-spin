export const heroSources = [
  ['Alice', 'd/de/Alice_in_lobby.jpg', '20240818202713'],
  ['Alter', '4/49/Alter.png', '20260222180312'],
  ['Angel', '0/0b/Angel_photo_.jpg', '20240818164449'],
  ['Arnie', '6/6d/Arnie_photo.jpg', '20240818164651'],
  ['Bastion', '7/74/Bastion_photo.jpg', '20240818164834'],
  ['Bertha', '3/3a/Bert1.png', '20241021174232'],
  ['Blizzard', '2/27/Bliz1.png', '20241021174507'],
  ['Blot', '2/29/Blot_HD.jpg', '20240818165244'],
  ['Cyclops', 'e/eb/Cyclops_image.jpg', '20240818165426'],
  ['Doc', 'd/de/Doc_photo.jpg', '20240818165827'],
  ['Dragoon', '4/49/Dragoon_photo.jpg', '20240818170011'],
  ['Firefly', '1/14/Firefly_photo.jpg', '20240818170156'],
  ['Freddie', '3/3a/Freddie_photo.jpg', '20240818170304'],
  ['Ghost', 'e/e9/Ghost_picture_.jpg', '20240818170459'],
  ['Graviel', '0/09/Graviel.png', '20260222180309'],
  ['Hurricane', '2/22/Hurricane_picture_.jpg', '20240818170610'],
  ['Levi', '7/7b/Levi_image.jpg', '20240818170716'],
  ['Leviathan', '7/7b/Leviathan_image.jpg', '20240818170855'],
  ['Lynx', '0/0f/Lynx_inage.jpg', '20240818171006'],
  ['Mirage', '6/67/Mirage_photo.jpg', '20240818171132'],
  ['Molly', '7/7f/Molly_in_game_photo.jpg', '20240818133217'],
  ['Ramsay', '1/17/Ramsay_%F0%9F%98%88.jpg', '20240818153910'],
  ['Raven', '6/6a/Raven_image.jpg', '20240818171253'],
  ['Satoshi', '6/67/Satoshi_phooto.jpg', '20240818171410'],
  ['Scratch', 'b/b9/Scratch.png', '20260222180312'],
  ['Shenji', '3/3e/Shen1.png', '20241021173923'],
  ['Slayer', '5/5d/Slayer_photo.jpg', '20240818171645'],
  ['Smog', 'f/f3/Smog_photo.jpg', '20240818171812'],
  ['Sparkle', 'd/de/Sparkle_photo_.jpg', '20240818171922'],
  ['Stalker', '8/86/Stalker_picture_.jpg', '20240818172147'],
  ['Tess', '0/04/Tess%27_in_game_image.jpg', '20240818125343'],
  ['Twinkle', 'a/a8/Twi3.png', '20241128173651'],
  ['Vi', '9/95/Vi1.png', '20260222181423']
].map(([name, file, revision]) => ({
  name,
  image: `heroes/${name.toLowerCase()}.webp`,
  source: `https://static.wikia.nocookie.net/bullet-echo/images/${file}/revision/latest?cb=${revision}`
}))

export const heroes = heroSources.map(({ name, image }) => ({
  name,
  image: `${import.meta.env?.BASE_URL ?? '/'}${image}`
}))
