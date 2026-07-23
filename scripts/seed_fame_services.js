const fs = require('fs');
const path = require('path');

const categories = [
  { id: 'cat_8755', name: '𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ', icon: 'Instagram', sortOrder: 1, isActive: true },
  { id: 'cat_10666', name: '𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 [ 𝐍𝐨𝐰 𝐖𝐨𝐫𝐤𝐢𝐧𝐠 ✅ ] [ Fast ]', icon: 'Instagram', sortOrder: 2, isActive: true },
  { id: 'cat_9860', name: 'Instagram Followers [ Extreme Speed 🔥]', icon: 'Instagram', sortOrder: 3, isActive: true },
  { id: 'cat_2837', name: 'Instagram Likes — Fastest 🔥 ᴺᴱᵂ', icon: 'Heart', sortOrder: 4, isActive: true },
  { id: 'cat_11808', name: 'Instagram Video Views', icon: 'Video', sortOrder: 5, isActive: true },
  { id: 'cat_2967', name: 'Instagram Followers [ Overflow Server ]', icon: 'Instagram', sortOrder: 6, isActive: true },
  { id: 'cat_2710', name: 'Instagram Followers [ Perfect Quality ] [ India 🇮🇳 ]', icon: 'Instagram', sortOrder: 7, isActive: true },
  { id: 'cat_9382', name: 'Instagram Followers [ Fast Delivery 🚀 ]', icon: 'Instagram', sortOrder: 8, isActive: true },
  { id: 'cat_22', name: 'Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ', icon: 'Instagram', sortOrder: 9, isActive: true },
  { id: 'cat_9224', name: '𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]', icon: 'Video', sortOrder: 10, isActive: true },
  { id: 'cat_15', name: 'Instagram Likes & Followers [ 0% Drop ]', icon: 'Instagram', sortOrder: 11, isActive: true },
  { id: 'cat_5458', name: 'Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ', icon: 'Instagram', sortOrder: 12, isActive: true },
  { id: 'cat_106', name: 'Instagram Followers [ Fast Delivery ⚡]', icon: 'Instagram', sortOrder: 13, isActive: true },
  { id: 'cat_8289', name: 'Facebook Followers [ Fast Speed ]ᴺᴱᵂ', icon: 'Facebook', sortOrder: 14, isActive: true },
  { id: 'cat_5', name: '𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ', icon: 'Video', sortOrder: 15, isActive: true },
  { id: 'cat_2838', name: 'Instagram Likes [ 100% Indian Profiles 🇮🇳 ]', icon: 'Heart', sortOrder: 16, isActive: true },
  { id: 'cat_7828', name: 'Instagram Likes [ Profile Photo Available ] ᴺᴱᵂ', icon: 'Heart', sortOrder: 17, isActive: true },
  { id: 'cat_7675', name: 'Facebook Page & Profile Followers [ Fast Speed✨ ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 18, isActive: true },
  { id: 'cat_7069', name: 'Instagram Likes [ Cheap', icon: 'Heart', sortOrder: 19, isActive: true },
  { id: 'cat_4453', name: 'Instagram Followers [ Best Prices 🥇 ] ᴺᴱᵂ', icon: 'Instagram', sortOrder: 20, isActive: true },
  { id: 'cat_547', name: 'Fameprovider - Top Quality💎🔥', icon: 'Sparkles', sortOrder: 21, isActive: true },
  { id: 'cat_4171', name: '🛒 𝗜𝗚 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 • 💥 𝗟𝗼𝘄𝗲𝘀𝘁 𝗣𝗿𝗶𝗰𝗲 • 🚀', icon: 'Instagram', sortOrder: 22, isActive: true },
  { id: 'cat_2709', name: 'IG Services |- ✨Fast', icon: 'Instagram', sortOrder: 23, isActive: true },
  { id: 'cat_433', name: 'Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |', icon: 'Instagram', sortOrder: 24, isActive: true },
  { id: 'cat_9', name: '𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 𝗟𝗶𝗸𝗲𝘀 [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐐𝐔𝐀🇱🇮𝐓𝐘 ] [ 100% 𝗜𝗡𝗗𝗜𝗔𝗡 🇮🇳 ]  ᴺᴱᵂ', icon: 'Heart', sortOrder: 25, isActive: true },
  { id: 'cat_6919', name: 'Instagram Reposts [ Cheapest ]', icon: 'Repeat', sortOrder: 26, isActive: true },
  { id: 'cat_777', name: 'Instagram Comments [ Cheapest ] ᴺᴱᵂ', icon: 'MessageSquare', sortOrder: 27, isActive: true },
  { id: 'cat_778', name: 'Instagram Comment Likes [ Provider ] ᴺᴱᵂ', icon: 'Heart', sortOrder: 28, isActive: true },
  { id: 'cat_4032', name: 'Instagram Post View', icon: 'Eye', sortOrder: 29, isActive: true },
  { id: 'cat_2333', name: '-----------𝐅𝐚𝐜𝐞𝐁𝐨𝐨𝐤 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------', icon: 'Facebook', sortOrder: 30, isActive: true },
  { id: 'cat_4595', name: 'Facebook Mix Indian [ Fast Speed✨ ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 31, isActive: true },
  { id: 'cat_4738', name: 'Facebook Post Likes [ Cheapest in the World 🌎 ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 32, isActive: true },
  { id: 'cat_5894', name: 'Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 33, isActive: true },
  { id: 'cat_432', name: 'Facebook Video Views [ FAST Working ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 34, isActive: true },
  { id: 'cat_3617', name: 'Facebook Post Likes ᴺᴱᵂ', icon: 'Facebook', sortOrder: 35, isActive: true },
  { id: 'cat_3616', name: 'Facebook Views [ Impressions + Reach ]', icon: 'Facebook', sortOrder: 36, isActive: true },
  { id: 'cat_1724', name: 'Facebook Post Likes [ Fast Delivery 🚀 ]', icon: 'Facebook', sortOrder: 37, isActive: true },
  { id: 'cat_776', name: '𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]', icon: 'Facebook', sortOrder: 38, isActive: true },
  { id: 'cat_51', name: '-----------𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------', icon: 'Youtube', sortOrder: 39, isActive: true },
  { id: 'cat_1845', name: '𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ', icon: 'Youtube', sortOrder: 40, isActive: true },
  { id: 'cat_53', name: 'YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ', icon: 'Youtube', sortOrder: 41, isActive: true },
  { id: 'cat_429', name: 'YouTube Native Ads Views [ Recomended ]', icon: 'Youtube', sortOrder: 42, isActive: true },
  { id: 'cat_2209', name: 'YouTube Likes [ High Speed – Provider ] Refill Button Working 🔥 ᴺᴱᵂ', icon: 'Youtube', sortOrder: 43, isActive: true },
  { id: 'cat_431', name: '𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ', icon: 'Youtube', sortOrder: 44, isActive: true },
  { id: 'cat_428', name: 'Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ', icon: 'Twitter', sortOrder: 45, isActive: true },
  { id: 'cat_2332', name: 'Automatic Services', icon: 'Zap', sortOrder: 46, isActive: true },
  { id: 'cat_3613', name: 'Tiktok Followers [ Best Price 💎 ] ᴺᴱᵂ', icon: 'Video', sortOrder: 47, isActive: true },
  { id: 'cat_3615', name: 'TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ', icon: 'Video', sortOrder: 48, isActive: true },
  { id: 'cat_3618', name: '[ ⚙ Auto ] Telegram Post View', icon: 'Send', sortOrder: 49, isActive: true },
  { id: 'cat_3619', name: 'Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ', icon: 'Send', sortOrder: 50, isActive: true },
  { id: 'cat_3620', name: 'Threads Services [ MAİN PROVİDER ]', icon: 'AtSign', sortOrder: 51, isActive: true },
  { id: 'cat_5025', name: 'Instagram Likes [ High Quality - One Click Done 🚀 ] ᴺᴱᵂ', icon: 'Heart', sortOrder: 52, isActive: true },
  { id: 'cat_6917', name: 'TikTok Video Views [ Cheapest ] ᴺᴱᵂ', icon: 'Video', sortOrder: 53, isActive: true },
  { id: 'cat_6918', name: 'TikTok Likes [ LQ Profiles ] [ 1 Minutes Completed🚀 ] ᴺᴱᵂ', icon: 'Video', sortOrder: 54, isActive: true },
  { id: 'cat_8288', name: 'Facebook Service [ Fast Speed✨ ] ᴺᴱᵂ', icon: 'Facebook', sortOrder: 55, isActive: true }
];

const rawServicesData = [
  // 8755
  { pid: 1775, name: "Instagram Followers [ Max 500K ] | Real Accounts | Cancel Enable | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ", rate: 38.54, min: 100, max: 1000000, refill: false, cancel: true, avg: "29 hours 39 minutes" },
  { pid: 1776, name: "Instagram Followers [ Max 500K ] | Real Accounts | Cancel Enable | Low Drop | 365 Days ♻️ | Instant Start | Day 100K 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ", rate: 44.82, min: 100, max: 1000000, refill: true, cancel: true, avg: "59 hours 47 minutes" },
  { pid: 1777, name: "Instagram Followers [ Max 500K ] | Real Accounts | Cancel Enable | Low Drop | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ", rate: 48.15, min: 100, max: 1000000, refill: true, cancel: true, avg: "1 hour 25 minutes" },

  // 10666
  { pid: 1793, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | Lifetime ♻️ | Speed: 200K/Day 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 [ 𝐍𝐨𝐰 𝐖𝐨𝐫𝐤𝐢𝐧𝐠 ✅ ] [ Fast ]", rate: 49.69, min: 100, max: 1000000, refill: true, cancel: false, avg: "7 hours 59 minutes" },
  { pid: 1799, name: "Instagram Followers [100% Indian 🇮🇳 ] [ Max 500K ] | Old Accounts + Stories | Low Drop | lnstant Start | Lifetime ♻️ | Speed: 100K/Day 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 [ 𝐍𝐨𝐰 𝐖𝐨𝐫𝐤𝐢𝐧𝐠 ✅ ] [ Fast ]", rate: 54.54, min: 100, max: 1000000, refill: true, cancel: false, avg: "3 hours 26 minutes" },

  // 9860
  { pid: 1796, name: "Instagram Followers | Max 1M | HQ Accounts with Posts | Cancel Button Enable | 365 Days Refill ♻️ | Instant Start | Speed: 100K/Day 🚀", cat: "Instagram Followers [ Extreme Speed 🔥]", rate: 35.16, min: 100, max: 100000, refill: true, cancel: true, avg: "1 hour 18 minutes" },
  { pid: 1797, name: "Instagram Followers [ 100% Real People Accounts ] [ Non Drop ] ⚡ 100K/Day | 🚀 One Click Start | ♻️ Lifetime Refill [ 🌟 Recommended ]", cat: "Instagram Followers [ Extreme Speed 🔥]", rate: 36.39, min: 100, max: 1000000, refill: true, cancel: false, avg: "1 hour 46 minutes" },

  // 2837
  { pid: 1057, name: "Instagram Likes [ Max 1M ] | Real Accounts | No Refill ⚠️ | Instant Start | Day 50K 🚀", cat: "Instagram Likes — Fastest 🔥 ᴺᴱᵂ", rate: 3.62, min: 100, max: 10000000, refill: false, cancel: false, avg: "21 minutes" },
  { pid: 1744, name: "Instagram Likes [ Max 10M ] | HQ Accounts | Cancel Enable | Low Drop | 30 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes — Fastest 🔥 ᴺᴱᵂ", rate: 3.71, min: 1, max: 10000000, refill: true, cancel: true, avg: "4 minutes" },
  { pid: 1745, name: "Instagram Likes [ Max 10M ] | HQ Accounts | Cancel Enable | Low Drop | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes — Fastest 🔥 ᴺᴱᵂ", rate: 4.73, min: 1, max: 10000000, refill: true, cancel: true, avg: "47 minutes" },

  // 11808
  { pid: 1800, name: "Instagram Video Views | Max 100M | All Video Link | 𝐒𝐔𝐏𝐄𝐑 𝐅𝐀𝐒𝐓 𝐒𝐏𝐄𝐄𝐃 🔥", cat: "Instagram Video Views", rate: 0.18, min: 100, max: 2147483647, refill: false, cancel: false, avg: "4 minutes" },

  // 2967
  { pid: 1669, name: "Instagram Followers [ Non-Drop ] | 100% Real Accounts | 500K/Day ⚡ | Lifetime Refill ♻️ | [ +30% Extra ] [ Admin Choice ⭐ ]", cat: "Instagram Followers [ Overflow Server ]", rate: 60.81, min: 10, max: 3000000, refill: true, cancel: false, avg: "1 hour 56 minutes" },

  // 2710
  { pid: 1787, name: "Instagram Followers [ India 🇮🇳 ] [ Max 200K ] | 100% Old Accounts with Stories (Perfect Quality) | Low Drop | Instant Start | No Refill ⚠️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ Perfect Quality ] [ India 🇮🇳 ]", rate: 44.44, min: 10, max: 200000, refill: false, cancel: false, avg: "5 hours 4 minutes" },
  { pid: 1665, name: "Instagram Followers [ India 🇮🇳 ] [ Max 300K ] | 100% Old Accounts with Stories (Perfect Quality) | Low Drop | Instant Start |  Lifetime ♻️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ Perfect Quality ] [ India 🇮🇳 ]", rate: 46.63, min: 10, max: 200000, refill: true, cancel: false, avg: "9 hours 14 minutes" },

  // 9382
  { pid: 1788, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | No Refill ⚠️ | Speed: 200K/Day 🚀", cat: "Instagram Followers [ Fast Delivery 🚀 ]", rate: 42.41, min: 100, max: 1000000, refill: false, cancel: false, avg: "2 hours 44 minutes" },
  { pid: 1789, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | 30 Days ♻️ | Speed: 200K/Day 🚀", cat: "Instagram Followers [ Fast Delivery 🚀 ]", rate: 45.95, min: 100, max: 1000000, refill: true, cancel: false, avg: "2 hours 58 minutes" },
  { pid: 1790, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | 60 Days ♻️ | Speed: 200K/Day 🚀", cat: "Instagram Followers [ Fast Delivery 🚀 ]", rate: 49.48, min: 100, max: 1000000, refill: true, cancel: false, avg: "3 hours 38 minutes" },
  { pid: 1791, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | 90 Days ♻️ | Speed: 200K/Day 🚀", cat: "Instagram Followers [ Fast Delivery 🚀 ]", rate: 53.01, min: 100, max: 1000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1792, name: "Instagram Followers [ Max 1M ] | Old Accounts +Posts | Low Drop | Instant Start | 365 Days ♻️ | Speed: 200K/Day 🚀", cat: "Instagram Followers [ Fast Delivery 🚀 ]", rate: 56.54, min: 100, max: 1000000, refill: true, cancel: false, avg: "Instant" },

  // 22
  { pid: 1127, name: "Instagram Followers | Max 500k | Real Quality | Speed 100k Day | Instant | Cancel Enable | No Refill ⚠️", cat: "Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ", rate: 60.81, min: 100, max: 10000000, refill: false, cancel: true, avg: "3 hours 24 minutes" },
  { pid: 1128, name: "Instagram Followers | Max 500k | Real Quality | Speed 100k Day | Instant | Cancel Enable | 365 Days ♻️", cat: "Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ", rate: 61.87, min: 100, max: 10000000, refill: true, cancel: true, avg: "2 hours 23 minutes" },
  { pid: 1132, name: "Instagram Followers | Max 500k | Real Quality | Speed 100k Day | Instant | Cancel Enable | Lifetime Refill ♻️", cat: "Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ", rate: 66.98, min: 100, max: 10000000, refill: true, cancel: true, avg: "2 hours 9 minutes" },

  // 9224
  { pid: 1778, name: "Instagram Video Views + Impressions + Reach | Max: Unlimited | All Video Link | Speed: 10M/Day 🚀 𝐔𝐋𝐓𝐑𝐀 𝐅𝐀𝐒𝐓 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]", rate: 0.16, min: 10, max: 2147483647, refill: false, cancel: false, avg: "2 hours 37 minutes" },
  { pid: 1779, name: "Instagram Video Views | Max Unlimited | All Video Link | Start: 0-2 Minutes | ⚡ 𝗨𝗹𝘁𝗿𝗮 𝗙𝗮𝘀𝘁", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]", rate: 0.17, min: 10, max: 2147483647, refill: false, cancel: false, avg: "3 hours 5 minutes" },
  { pid: 1780, name: "Instagram Video Views | Max 100M | All Video Link | 𝐒𝐔𝐏𝐄𝐑 𝐅𝐀𝐒𝐓 𝐒𝐏𝐄𝐄𝐃 🔥", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]", rate: 0.19, min: 100, max: 2147483647, refill: false, cancel: false, avg: "13 minutes" },

  // 15
  { pid: 1097, name: "Instagram Likes [ Max 1M ] | 100% HQ Accounts | 100% Non Drop | Lifetime ♻️ | Instant Start | Day 200K 🚀", cat: "Instagram Likes & Followers [ 0% Drop ]", rate: 7.00, min: 10, max: 1000000, refill: true, cancel: false, avg: "18 minutes" },
  { pid: 1664, name: "Instagram Followers | Max 1M | Old Accounts | Speed 100k Day | Instant Start | Low Drop | Lifetime Refill ♻️", cat: "Instagram Likes & Followers [ 0% Drop ]", rate: 72.82, min: 100, max: 5000000, refill: true, cancel: false, avg: "3 hours 17 minutes" },
  { pid: 1096, name: "Instagram Followers [ Max 3M ] | HQ Accounts | Instant Start | Cancel Enable | Lifetime ♻️ | 20% Extra delivery | Speed: 500K/Day", cat: "Instagram Likes & Followers [ 0% Drop ]", rate: 66.89, min: 10, max: 3000000, refill: true, cancel: true, avg: "4 hours 33 minutes" },

  // 5458
  { pid: 1747, name: "Instagram Followers [100% Indian 🇮🇳 ] [ Max 500K ] | Old Accounts + Stories | Low Drop | lnstant Start | No Refill ⚠️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ", rate: 39.80, min: 50, max: 500000, refill: false, cancel: false, avg: "2 hours 9 minutes" },
  { pid: 1748, name: "Instagram Followers [100% Indian 🇮🇳 ] [ Max 500K ] | Old Accounts + Stories | Low Drop | lnstant Start | 30 Days ♻️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ", rate: 42.06, min: 50, max: 500000, refill: true, cancel: false, avg: "2 hours 10 minutes" },
  { pid: 1749, name: "Instagram Followers [100% Indian 🇮🇳 ] [ Max 500K ] | Old Accounts + Stories | Low Drop | lnstant Start | Lifetime ♻️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ", rate: 43.87, min: 50, max: 500000, refill: true, cancel: false, avg: "4 hours 2 minutes" },

  // 106
  { pid: 1647, name: "Instagram Followers [ Max 100K ] | Old Accounts +Posts | Cancel Enable | Instant Start | No Refill ⚠️ | Speed: 100K/Day 🚀", cat: "Instagram Followers [ Fast Delivery ⚡]", rate: 46.23, min: 100, max: 1000000, refill: false, cancel: true, avg: "8 hours 32 minutes" },
  { pid: 1772, name: "Instagram Followers [ Max 100K ] | Old Accounts +Posts | Low Drop | Cancel Enable | 30 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Followers [ Fast Delivery ⚡]", rate: 66.71, min: 50, max: 100000, refill: true, cancel: true, avg: "1 hour 31 minutes" },
  { pid: 1773, name: "Instagram Followers [ Max 100K ] | Old Accounts +Posts | Low Drop | Cancel Enable | 365 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Followers [ Fast Delivery ⚡]", rate: 73.61, min: 50, max: 100000, refill: true, cancel: true, avg: "1 hour 52 minutes" },
  { pid: 1774, name: "Instagram Followers [ Max 100K ] | Old Accounts +Posts | Low Drop | Cancel Enable | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Followers [ Fast Delivery ⚡]", rate: 75.91, min: 50, max: 100000, refill: true, cancel: true, avg: "121 hours 36 minutes" },

  // 8289
  { pid: 1770, name: "Facebook Followers [ Max 1M ] | High Quality | Cancel Enable | Low Drop |  Lifetime ♻️  | Instant Start | Day 100K 🚀", cat: "Facebook Followers [ Fast Speed ]ᴺᴱᵂ", rate: 30.78, min: 10, max: 1000000, refill: true, cancel: true, avg: "5 minutes" },

  // 5
  { pid: 1755, name: "Instagram Video Views [ Max Unlimited ] | All Link | Cancel Enable | Day 1M 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ", rate: 0.12, min: 100, max: 2147483647, refill: false, cancel: true, avg: "2 hours 37 minutes" },
  { pid: 1756, name: "Instagram Video Views [ Max Unlimited ] | All Link | Cancel Enable | Day 1M 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ", rate: 0.13, min: 100, max: 2147483647, refill: false, cancel: true, avg: "1 hour 48 minutes" },
  { pid: 1757, name: "Instagram Video Views [ Max Unlimited ] | All Link | Cancel Enable | Day 1M 🚀", cat: "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ", rate: 0.14, min: 100, max: 2147483647, refill: false, cancel: true, avg: "1 hour 2 minutes" },

  // 2838
  { pid: 1668, name: "Instagram Likes [ India 🇮🇳 ] | 100% Indian Profiles | Non Drop | Cancel Enable | Super instant | Lifetime ♻️ | Speed: 500K/Day", cat: "Instagram Likes [ 100% Indian Profiles 🇮🇳 ]", rate: 9.18, min: 50, max: 1000000, refill: true, cancel: true, avg: "21 minutes" },

  // 7828
  { pid: 1767, name: "Instagram Likes [ Max 1M ] | Profile Photo Available | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes [ Profile Photo Available ] ᴺᴱᵂ", rate: 3.21, min: 10, max: 1000000, refill: false, cancel: false, avg: "6 hours 13 minutes" },
  { pid: 1768, name: "Instagram Likes [ Max 10M ] | Profile Photo Available | Low Drop | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes [ Profile Photo Available ] ᴺᴱᵂ", rate: 3.46, min: 10, max: 1000000, refill: true, cancel: false, avg: "1 hour 14 minutes" },

  // 7675
  { pid: 1765, name: "Facebook Followers [ Page & Profile ] [ Max 500K ] | HQ Profiles | Drop %0 | 30 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Page & Profile Followers [ Fast Speed✨ ] ᴺᴱᵂ", rate: 40.82, min: 10, max: 1000000, refill: true, cancel: false, avg: "19 minutes" },
  { pid: 1766, name: "Facebook Followers [ Page & Profile ] [ Max 500K ] | HQ Profiles | Drop %0 | 60 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Page & Profile Followers [ Fast Speed✨ ] ᴺᴱᵂ", rate: 46.01, min: 10, max: 1000000, refill: true, cancel: false, avg: "2 hours 27 minutes" },

  // 7069
  { pid: 1763, name: "Instagram Likes [ Max 5M ] | HQ + Real Accounts | Cancel Enable | Non Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes [ Cheap", rate: 3.78, min: 1, max: 10000000, refill: false, cancel: true, avg: "33 minutes" },
  { pid: 1764, name: "Instagram Likes [ Max 5M ] | HQ + Real Accounts | Non Drop | Cancel Enable | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Likes [ Cheap", rate: 3.90, min: 1, max: 10000000, refill: true, cancel: true, avg: "3 hours 24 minutes" },

  // 4453
  { pid: 1052, name: "Instagram Followers [ Max 500K ] | Real Accounts | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Instagram Followers [ Best Prices 🥇 ] ᴺᴱᵂ", rate: 46.23, min: 100, max: 1000000, refill: false, cancel: false, avg: "9 hours 37 minutes" },
  { pid: 1739, name: "Instagram Followers [ Max 1M ] | Real Accounts | Low Drop | 365 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Instagram Followers [ Best Prices 🥇 ] ᴺᴱᵂ", rate: 66.66, min: 10, max: 10000000, refill: true, cancel: false, avg: "4 hours 22 minutes" },

  // 547
  { pid: 1657, name: "Instagram Likes | HQ Accounts | Non Drop | Lifetime ♻️", cat: "Fameprovider - Top Quality💎🔥", rate: 7.75, min: 10, max: 500000, refill: true, cancel: false, avg: "39 minutes" },
  { pid: 1572, name: "Instagram Video Views [ Max Unlimited ] | All Link | Cancel Enable | Day 1M 🚀", cat: "Fameprovider - Top Quality💎🔥", rate: 0.14, min: 100, max: 2147483647, refill: false, cancel: true, avg: "36 minutes" },
  { pid: 1162, name: "Instagram Followers | Real Accounts | Instant Start | No Refill", cat: "Fameprovider - Top Quality💎🔥", rate: 60.56, min: 100, max: 5000000, refill: false, cancel: false, avg: "52 minutes" },
  { pid: 1560, name: "Instagram Followers | Real Accounts | Low Drop | Lifetime ♻️", cat: "Fameprovider - Top Quality💎🔥", rate: 58.25, min: 100, max: 5000000, refill: true, cancel: false, avg: "6 hours 6 minutes" },
  { pid: 1086, name: "Instagram Shares | Super Fast | Lifetime ♻️", cat: "Fameprovider - Top Quality💎🔥", rate: 1.10, min: 100, max: 100000, refill: true, cancel: false, avg: "1 hour 18 minutes" },
  { pid: 1081, name: "Instagram Story Views | Real Accounts | Instant | Lifetime ♻️", cat: "Fameprovider - Top Quality💎🔥", rate: 9.97, min: 10, max: 50000, refill: true, cancel: false, avg: "Instant" },

  // 4171
  { pid: 1730, name: "Instagram Followers [ Max 100K ] | Cancel Enable | No Refill ⚠️ | Instant Start | 𝐔𝐋𝐓𝐑𝐀 𝐅𝐀𝐒𝐓 🚀", cat: "🛒 𝗜𝗚 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 • 💥 𝗟𝗼𝘄𝗲𝘀𝘁 𝗣𝗿𝗶𝗰𝗲 • 🚀", rate: 37.91, min: 100, max: 100000, refill: false, cancel: true, avg: "1 hour 40 minutes" },

  // 2709
  { pid: 1663, name: "🚀 IG Followers | 💎 Old Accounts | ⚡ Instant Start | ♻️ Lifetime Refill | 📈 100K/Day", cat: "IG Services |- ✨Fast", rate: 25.99, min: 100, max: 100000, refill: true, cancel: false, avg: "3 hours 18 minutes" },
  { pid: 1667, name: "❤️IG Likes |- Lifetime - 500K/Day -|🎖️𝗙𝗮𝘀𝘁𝗲𝘀𝘁 𝗦𝗲𝗿𝘃𝗶𝗰𝗲𝘀 𝗜𝗻 𝗠𝗮𝗿𝗸𝗲𝘁", cat: "IG Services |- ✨Fast", rate: 3.42, min: 10, max: 1000000, refill: true, cancel: false, avg: "30 minutes" },

  // 433
  { pid: 1618, name: "Instagram Followers [ Max 50K ] | 100% Real Accounts | Cancel Enable | No Refill ⚠️ | Instant Start |", cat: "Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |", rate: 15.61, min: 100, max: 50000, refill: false, cancel: true, avg: "19 hours 15 minutes" },
  { pid: 1619, name: "Instagram Followers [ Max 1M ] | 100% Real Accounts | Low Drop | No Refill ⚠️ | Instant Start | Speed: 500K/Day 🚀", cat: "Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |", rate: 30.18, min: 100, max: 1000000, refill: false, cancel: false, avg: "4 hours 58 minutes" },
  { pid: 1620, name: "Instagram Followers [ Max 100K ] | 100% Real Accounts | Cancel Enable | No Refill ⚠️ | Instant Start | 𝐔𝐋𝐓𝐑𝐀 𝐅𝐀𝐒𝐓 🚀", cat: "Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |", rate: 24.84, min: 100, max: 50000, refill: false, cancel: true, avg: "32 hours 12 minutes" },
  { pid: 1621, name: "Instagram Followers [ Max 100K ] | 100% Old Accounts | Low Drop | No Refill ⚠️ | Instant Start | Speed: 50K/Day 🚀", cat: "Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |", rate: 42.15, min: 10, max: 1000000, refill: false, cancel: false, avg: "1 hour 1 minute" },

  // 9
  { pid: 1065, name: "Instagram Likes [ India 🇮🇳 ] [ Max 50K ] | Power Accounts + Stories | Non Drop | No Refill ⚠️ | Instant Start | Day 50K 🚀", cat: "𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 𝗟𝗶𝗸𝗲𝘀 [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐐𝐔𝐀🇱🇮𝐓𝐘 ] [ 100% 𝗜𝗡𝗗𝗜𝗔𝗡 🇮🇳 ]  ᴺᴱᵂ", rate: 8.87, min: 50, max: 1000000, refill: false, cancel: false, avg: "15 minutes" },
  { pid: 1070, name: "Instagram Likes [ India 🇮🇳 ] [ Max 50K ] | Power Accounts + Stories | Non Drop | Lifetime ♻️ | Instant Start | Day 50K 🚀", cat: "𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 𝗟𝗶𝗸𝗲𝘀 [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐐𝐔𝐀🇱🇮𝐓𝐘 ] [ 100% 𝗜𝗡𝗗𝗜𝗔𝗡 🇮🇳 ]  ᴺᴱᵂ", rate: 9.99, min: 50, max: 1000000, refill: true, cancel: false, avg: "37 minutes" },

  // 6919
  { pid: 1760, name: "Instagram Repost [ Worldwide 🌍 ] [ Max 10M ] | 100% Real Accounts | Cancel Enable | Instant Start 🚀", cat: "Instagram Reposts [ Cheapest ]", rate: 34.60, min: 100, max: 10000000, refill: false, cancel: true, avg: "12 minutes" },
  { pid: 1761, name: "Instagram Repost [ Worldwide 🌍 ] [ Max 50K ] | 100% Real Accounts | Cancel Enable | Instant Start 🚀", cat: "Instagram Reposts [ Cheapest ]", rate: 36.76, min: 100, max: 10000000, refill: false, cancel: true, avg: "6 minutes" },
  { pid: 1762, name: "Instagram Repost + Reach [ Worldwide 🌍 ] [ Max 50K ] | 100% Real Accounts | Cancel Enable | Instant Start 🚀", cat: "Instagram Reposts [ Cheapest ]", rate: 37.84, min: 100, max: 10000000, refill: false, cancel: true, avg: "6 minutes" },

  // 777
  { pid: 1626, name: "Instagram Random Comments [ Max 10K ] | 100% Real Accounts | No Refill ⚠️ | Instant Start | Day 10K 🚀", cat: "Instagram Comments [ Cheapest ] ᴺᴱᵂ", rate: 40.55, min: 10, max: 10000, refill: false, cancel: false, avg: "32 minutes" },
  { pid: 1630, name: "Instagram Random Comments [ Max 10K ] | 100% Real Accounts | No Refill ⚠️ | Instant Start | Day 10K 🚀", cat: "Instagram Comments [ Cheapest ] ᴺᴱᵂ", rate: 41.99, min: 10, max: 10000, refill: false, cancel: false, avg: "30 minutes" },
  { pid: 1627, name: "Instagram Custom Comments [ Max 10K ] | 100% Real Accounts | No Refill ⚠️ | Instant Start | Day 10K 🚀", cat: "Instagram Comments [ Cheapest ] ᴺᴱᵂ", rate: 34.75, min: 10, max: 10000, refill: false, cancel: false, avg: "38 minutes" },
  { pid: 1631, name: "Instagram Custom Comments [ Max 10K ] | 100% Real Accounts | No Refill ⚠️ | Instant Start | Day 10K 🚀", cat: "Instagram Comments [ Cheapest ] ᴺᴱᵂ", rate: 56.14, min: 10, max: 10000, refill: false, cancel: false, avg: "56 minutes" },

  // 778
  { pid: 1628, name: "instagram Comment Likes [ Max 1K ] | Order With Comment link | HQ Profiles | Instant Complete 🚀", cat: "Instagram Comment Likes [ Provider ] ᴺᴱᵂ", rate: 92.15, min: 20, max: 1000, refill: false, cancel: false, avg: "9 hours" },
  { pid: 1629, name: "Instagram Comment Likes [ Max 50K ] | Order With Comment link | HQ Profiles | Instant Complete 🚀", cat: "Instagram Comment Likes [ Provider ] ᴺᴱᵂ", rate: 102.50, min: 20, max: 5000, refill: false, cancel: false, avg: "8 hours 40 minutes" },

  // 4032
  { pid: 1729, name: "Instagram Views For Photos [ Max: Unlimited ] | Instant Start | Cancel Enable | No Refill ⚠️ | Speed: 200K/Day 🚀", cat: "Instagram Post View", rate: 1.07, min: 10, max: 100000000, refill: false, cancel: true, avg: "43 minutes" },

  // 2333
  { pid: 1656, name: "Our All Faacebook Services 100% working [ Refill / cancel All suppport Avilable By Bot ]", cat: "-----------𝐅𝐚𝐜𝐞𝐁𝐨𝐨𝐤 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------", rate: 7405547316.66, min: 2147483647, max: 2147483647, refill: true, cancel: true, avg: "Instant" },

  // 4595
  { pid: 1740, name: "Facebook Followers [ Page & Profile ] [ Max 500K ] | HQ Profiles | Drop %0 | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Mix Indian [ Fast Speed✨ ] ᴺᴱᵂ", rate: 37.11, min: 10, max: 1000000, refill: false, cancel: false, avg: "36 minutes" },
  { pid: 1741, name: "Facebook Followers [ Page & Profile ] [ Max 500K ] | HQ Profiles | Drop %0 | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Mix Indian [ Fast Speed✨ ] ᴺᴱᵂ", rate: 44.20, min: 10, max: 1000000, refill: true, cancel: false, avg: "1 hour 43 minutes" },

  // 4738
  { pid: 1742, name: "Facebook Post Likes [ Max 1M ] | HQ Accounts | Cancel Enable | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes [ Cheapest in the World 🌎 ] ᴺᴱᵂ", rate: 26.79, min: 20, max: 1000000, refill: false, cancel: true, avg: "20 minutes" },
  { pid: 1743, name: "Facebook Post Likes [ Max 1M ] | HQ Accounts | Cancel Enable | Low Drop | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes [ Cheapest in the World 🌎 ] ᴺᴱᵂ", rate: 28.22, min: 20, max: 1000000, refill: true, cancel: true, avg: "2 hours 14 minutes" },

  // 5894
  { pid: 1750, name: "Facebook Live Stream Views [ Max 500K ] | 100% Concurrent | 15 Minutes", cat: "Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ", rate: 35.40, min: 10, max: 500000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1751, name: "Facebook Live Stream Views [ Max 500K ] | 100% Concurrent | 30 Minutes", cat: "Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ", rate: 70.79, min: 10, max: 500000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1752, name: "Facebook Live Stream Views [ Max 500K ] | 100% Concurrent | 45 Minutes", cat: "Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ", rate: 106.18, min: 10, max: 500000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1753, name: "Facebook Live Stream Views [ Max 500K ] | 100% Concurrent | 60 Minutes", cat: "Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ", rate: 141.57, min: 10, max: 500000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1754, name: "Facebook Live Stream Views [ Max 500K ] | 100% Concurrent | 90 Minutes", cat: "Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ", rate: 212.36, min: 10, max: 500000, refill: false, cancel: false, avg: "Instant" },

  // 432
  { pid: 1616, name: "Facebook Views [ Max 200M ] | Cancel Enable | 30 Days ♻️ | Instant Start | Day 500K 🚀", cat: "Facebook Video Views [ FAST Working ] ᴺᴱᵂ", rate: 2.38, min: 100, max: 2147483647, refill: true, cancel: true, avg: "1 hour 20 minutes" },
  { pid: 1617, name: "Facebook Views [ Max Unlimited ] | Cancel Enable | 30 Days ♻️ | Instant Start | Day 500K 🚀", cat: "Facebook Video Views [ FAST Working ] ᴺᴱᵂ", rate: 3.01, min: 100, max: 10000000, refill: true, cancel: true, avg: "1 hour 17 minutes" },

  // 3617
  { pid: 1694, name: "Facebook Post Likes [ Max 100K ] | HQ Real Accounts | Cancel Enable | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes ᴺᴱᵂ", rate: 26.89, min: 10, max: 1000000, refill: false, cancel: true, avg: "22 minutes" },
  { pid: 1695, name: "Facebook Post Likes [ Max 1M ] | HQ Real Accounts | Cancel Enable | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes ᴺᴱᵂ", rate: 26.15, min: 10, max: 1000000, refill: false, cancel: true, avg: "6 minutes" },
  { pid: 1696, name: "Facebook Post Likes [ Max 500K ] | HQ Real Accounts | Cancel Enable | 30 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes ᴺᴱᵂ", rate: 44.00, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1697, name: "Facebook Post Likes [ Max 1M ] | HQ Real Accounts | Cancel Enable | 365 Days ♻️ | Instant Start | Day 100K 🚀", cat: "Facebook Post Likes ᴺᴱᵂ", rate: 44.80, min: 10, max: 1000000, refill: true, cancel: true, avg: "7 minutes" },

  // 3616
  { pid: 1690, name: "Facebook Views [ Max 10M ] | All Link | Non Drop | Day 200K > 𝐔𝐥𝐭𝐫𝐚𝐟𝐚𝐬𝐭 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝 ⚡", cat: "Facebook Views [ Impressions + Reach ]", rate: 9.24, min: 100, max: 10000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1691, name: "Facebook Views + Impressions [ Max 10M ] | All Link | Super Instant | Day 50K | Lifetime Guaranteed ♻️", cat: "Facebook Views [ Impressions + Reach ]", rate: 10.27, min: 100, max: 10000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1692, name: "Facebook Views [ Unlimited ] | All Link | Super Instant | Day 50K | Lifetime Guaranteed ♻️", cat: "Facebook Views [ Impressions + Reach ]", rate: 11.78, min: 100, max: 10000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1693, name: "Facebook Views + Reach [ Max 10M ] | All Link | Super Instant | Day 50K | Lifetime Guaranteed ♻️", cat: "Facebook Views [ Impressions + Reach ]", rate: 12.70, min: 100, max: 10000000, refill: true, cancel: false, avg: "Instant" },

  // 1724
  { pid: 1632, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: No ⚠️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 25.30, min: 20, max: 1000000, refill: false, cancel: false, avg: "9 minutes" },
  { pid: 1633, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: 30 Days ♻️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 26.66, min: 20, max: 1000000, refill: true, cancel: false, avg: "9 minutes" },
  { pid: 1634, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: 60 Days ♻️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 27.72, min: 20, max: 1000000, refill: true, cancel: false, avg: "9 minutes" },
  { pid: 1635, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: 90 Days ♻️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 28.79, min: 20, max: 1000000, refill: true, cancel: false, avg: "9 minutes" },
  { pid: 1636, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: 365 Days ♻️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 29.86, min: 20, max: 1000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1637, name: "Facebook Post Likes - [ Mix Accounts | Max: 100K | Drop Rate: Low Drop | Refill: Lifetime ♻️ | Start Time: 0-1 Minutes | Day: 100K 🚀 ]", cat: "Facebook Post Likes [ Fast Delivery 🚀 ]", rate: 30.92, min: 20, max: 1000000, refill: true, cancel: false, avg: "15 minutes" },

  // 776
  { pid: 1622, name: "Facebook Comments [ Random ] [ Max 100K ] | 100% Real Account | No Refill ⚠️ | Instant start | Day 100K", cat: "𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]", rate: 226.29, min: 10, max: 100000, refill: false, cancel: false, avg: "64 hours 15 minutes" },
  { pid: 1623, name: "Facebook Comments [ Custom ] [ Max 100K ] | 100% Real Account | No Refill ⚠️ | Instant start | Day 100K", cat: "𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]", rate: 218.02, min: 10, max: 100000, refill: false, cancel: false, avg: "10 hours 5 minutes" },
  { pid: 1625, name: "Facebook Comments [ Custom ] [ Max 100K ] | 100% Real Account | No Refill ⚠️ | Instant start | Day 100K", cat: "𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]", rate: 226.29, min: 10, max: 100000, refill: false, cancel: false, avg: "51 hours 46 minutes" },

  // 51
  { pid: 1267, name: "All youtube Services Working", cat: "-----------𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------", rate: 8469644476.61, min: 2147483647, max: 2147483647, refill: true, cancel: true, avg: "Instant" },

  // 1845
  { pid: 1644, name: "Youtube Subscribers [ New ] Speed 50-100/day [ Lifetime ♻️ ] 100% Non Drop", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 1659.11, min: 50, max: 5000, refill: true, cancel: false, avg: "47 hours 36 minutes" },
  { pid: 1645, name: "Youtube Subscribers [ New ] Speed 100-200/day [ Lifetime ♻️ ] 100% Non Drop", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 1674.61, min: 50, max: 10000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1646, name: "Youtube Subscribers [ New ] Speed 200-250/day [ Lifetime ♻️ ] 100% Non Drop", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 1729.34, min: 50, max: 10000, refill: true, cancel: false, avg: "Instant" },

  // 53
  { pid: 1652, name: "YouTube Shorts / Video View  [ Non-Drop ]  [ Lifetime Guaranteed ♻️ ] [ Max 100K ] [ 3k to 5k / Day | 𝐒𝐭𝐚𝐛𝐥𝐞 |", cat: "YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ", rate: 97.58, min: 100, max: 100000000, refill: true, cancel: false, avg: "10 hours 39 minutes" },
  { pid: 1653, name: "YouTube Shorts / Video View [ Non-Drop ] [ Lifetime Guaranteed ♻️ ] [ Max 100K ] [ 5k to 7k / Day | 𝐒𝐭𝐚𝐛𝐥𝐞 |", cat: "YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ", rate: 103.70, min: 100, max: 100000000, refill: true, cancel: false, avg: "5 hours 51 minutes" },
  { pid: 1654, name: "YouTube Shorts / Video View [ Non-Drop ] [ Lifetime Guaranteed ♻️ ] [ Max 100K ] [ 7k to 10k / Day | 𝐒𝐭𝐚𝐛𝐥𝐞 |", cat: "YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ", rate: 109.06, min: 100, max: 100000000, refill: true, cancel: false, avg: "1 hour 53 minutes" },

  // 429
  { pid: 1576, name: "YouTube Views [Native Ads/Social Ads] [Min 1M] [Speed: 2M+/day] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 56.62, min: 1000000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1577, name: "YouTube Views [Native Ads/Social Ads] [Min 500k] [Speed: 1M+/day] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 57.75, min: 500000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1578, name: "YouTube Views [Native Ads/Social Ads] [Min 200K] [Speed: 1M+/day] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 60.01, min: 200000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1579, name: "YouTube Views [Native Ads/Social Ads] [Min 100K] [Speed: 1M+/day] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 65.68, min: 100000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1580, name: "YouTube Views [Native Ads/Social Ads] [Min 40k] [Speed: 1M+/day] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 67.94, min: 40000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1581, name: "YouTube Views [Native Ads/Social Ads] [Min 30K] [1M+/Day] [Real Users] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 71.34, min: 30000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1582, name: "YouTube Views [Native Ads/Social Ads] [Min 20K] [500K+/Day] [Real Users] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 73.60, min: 20000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1583, name: "YouTube Views [Native Ads/Social Ads] [Min 10K] [200K+/Day] [Real Users] [Lifetime Guaranteed ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 79.26, min: 10000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1584, name: "YouTube Views [Native Ads/Social Ads] [Min 5K] [200K+/Day] [Real Users] [Lifetime Guarantee ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 82.66, min: 5000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1585, name: "YouTube Views [Native Ads/Social Ads] [Min 3K] [100K+/Day] [Real Users] [Lifetime Guarantee ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 84.92, min: 3000, max: 100000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1586, name: "YouTube Views [Native Ads/Social Ads] [Min 1K] [200K+/Day] [Real Users] [Lifetime Guarantee ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 107.57, min: 1000, max: 1000000, refill: true, cancel: false, avg: "7 hours 21 minutes" },
  { pid: 1587, name: "YouTube Views [Native Ads/Social Ads] [Min 500] [100K+/Day] [Real Users] [Lifetime Guarantee ♻️] 𝗡𝗼𝗻-𝗗𝗿𝗼𝗽", cat: "YouTube Native Ads Views [ Recomended ]", rate: 113.23, min: 500, max: 1000000, refill: true, cancel: false, avg: "7 hours 12 minutes" },

  // 2209
  { pid: 1655, name: "YouTube Likes [ Max 500K ] | HQ Accounts | Non Drop | No Refill ⚠️ | Superinstant | 1K Per Minutes 🔥", cat: "YouTube Likes [ High Speed – Provider ] Refill Button Working 🔥 ᴺᴱᵂ", rate: 94.57, min: 10, max: 10000, refill: false, cancel: false, avg: "10 minutes" },

  // 431
  { pid: 1606, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 15 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 5.69, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1607, name: "Youtube Live Stream Views [Max: 100K] INSTANT [Stay time: 30 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 11.37, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1608, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 60 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 22.04, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1609, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 90 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 34.80, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1610, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 120 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 46.40, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1611, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 180 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 70.75, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1612, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 240 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 93.95, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1613, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 360 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 135.70, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1614, name: "Youtube Live Stream Views [Max: 100K] INSTANT [Stay time: 720 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 287.63, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1615, name: "Youtube Live Stream Views [Max: 100k] INSTANT [Stay time: 1440 Minutes]", cat: "𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ", rate: 575.26, min: 10, max: 100000, refill: false, cancel: false, avg: "Instant" },

  // 428
  { pid: 1573, name: "Twitter Followers [ Max 1M ] | HQ Accounts | Low Drop | Instant Start | No Refill ⚠️ | Speed: 20K/Day", cat: "Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ", rate: 304.72, min: 10, max: 1000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1574, name: "Twitter Followers [ Max 1M ] | HQ Accounts | Low Drop | Instant Start | 10 Days ♻️ | Speed: 20K/Day", cat: "Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ", rate: 412.28, min: 10, max: 1000000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1575, name: "Twitter Followers [ Max 1M ] | HQ Accounts | Low Drop | Instant Start | 30 Days ♻️ | Speed: 20K/Day", cat: "Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ", rate: 675.21, min: 10, max: 1000000, refill: true, cancel: false, avg: "Instant" },

  // 2332
  { pid: 1643, name: "Instagram Video Views [ Max Unlimited ] | All Link | Cancel Enable | Day 1M 🚀", cat: "Automatic Services", rate: 0.14, min: 100, max: 2147483647, refill: false, cancel: true, avg: "Instant" },

  // 3613
  { pid: 1670, name: "TikTok Followers [ Max 1M ] | HQ Accounts | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🔥", cat: "Tiktok Followers [ Best Price 💎 ] ᴺᴱᵂ", rate: 187.10, min: 10, max: 1000000, refill: false, cancel: false, avg: "Instant" },

  // 3615
  { pid: 1682, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 9.14, min: 10, max: 1000000, refill: false, cancel: true, avg: "Instant" },
  { pid: 1683, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 7 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 9.71, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1684, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 15 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 9.94, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1685, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 30 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 10.28, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1686, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 60 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 10.51, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1687, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 90 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 10.74, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1688, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | 365 Days ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 11.05, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1689, name: "TikTok Likes + Views [ Max 1M ] | High Quality Accounts with Posts | Cancel Enable | Drop 0% | Lifetime ♻️ | Instant Start | Day 100K 🚀", cat: "TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ", rate: 11.19, min: 10, max: 1000000, refill: true, cancel: true, avg: "Instant" },

  // 3618
  { pid: 1700, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 1 Post 𝗙𝗔𝗦𝗧", cat: "[ ⚙ Auto ] Telegram Post View", rate: 0.29, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1701, name: "[ ⚙ Auto ] Telegram Post Views [ Max Unlimited ] | Last 1 Post 𝗦𝗟𝗢𝗪", cat: "[ ⚙ Auto ] Telegram Post View", rate: 0.94, min: 10, max: 2147483647, refill: false, cancel: false, avg: "Instant" },
  { pid: 1702, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 5 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 1.43, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1703, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 10 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 2.80, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1704, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 15 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 4.17, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1705, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 20 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 5.60, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1706, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 30 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 8.40, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1707, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 50 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 14.28, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1708, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 100 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 27.98, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1709, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 200 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 55.95, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1710, name: "[ ⚙ Auto ] Telegram Post Views [ Max 50M ] | Last 500 Post", cat: "[ ⚙ Auto ] Telegram Post View", rate: 139.29, min: 10, max: 50000000, refill: false, cancel: false, avg: "Instant" },

  // 3619
  { pid: 1711, name: "Telegram Bot Start [ Max 100K ] | Low Drop | Cancel Enable | No Refill ⚠️ | Instant Start | Speed: 100K/Day 🚀", cat: "Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ", rate: 18.27, min: 10, max: 100000, refill: false, cancel: true, avg: "Instant" },
  { pid: 1712, name: "Telegram Bot Start [ Max 100K ] | Low Drop | Cancel Enable | 30 Days ♻️ | Instant Start | Speed: 100K/Day 🚀", cat: "Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ", rate: 22.84, min: 1, max: 100000, refill: true, cancel: true, avg: "Instant" },
  { pid: 1713, name: "Telegram Bot Start [ Max 100K ] | Low Drop | Cancel Enable | 365 Days ♻️ | Instant Start | Speed: 100K/Day 🚀", cat: "Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ", rate: 26.26, min: 1, max: 100000, refill: true, cancel: true, avg: "Instant" },

  // 3620
  { pid: 1717, name: "Threads Organic Likes [ Max 50K ] | HQ Accounts | Low Drop | No Refill ⚠️ | Start Time:0-2 Hr | Day 350-650 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 856.27, min: 50, max: 50000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1718, name: "Threads Organic Likes [ Max 50K ] | HQ Accounts | Low Drop | 30 Days ♻️ | Start Time:0-2 Hr | Day 350-650 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 1027.53, min: 50, max: 50000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1719, name: "Threads Organic Followers [ Max 50K ] | HQ Accounts | Low Drop | No Refill ⚠️ | Start Time:0-2 Hr | Day 250-500 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 1541.29, min: 100, max: 50000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1720, name: "Threads Organic Repost [ Max 50K ] | HQ Accounts | Low Drop | No Refill ⚠️ | Start Time:0-2 Hr | Day 150-500 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 2104.82, min: 50, max: 50000, refill: false, cancel: false, avg: "Instant" },
  { pid: 1721, name: "Threads Organic Followers [ Max 50K ] | HQ Accounts | Low Drop | 30 Days ♻️ | Start Time:0-2 Hr | Day 250-500 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 1712.54, min: 100, max: 50000, refill: true, cancel: false, avg: "Instant" },
  { pid: 1722, name: "Threads Organic Repost [ Max 50K ] | HQ Accounts | Low Drop | 30 Days ♻️ | Start Time:0-2 Hr | Day 150-500 🚀", cat: "Threads Services [ MAİN PROVİDER ]", rate: 2338.68, min: 50, max: 50000, refill: true, cancel: false, avg: "Instant" },

  // 5025
  { pid: 1746, name: "Instagram Likes [ Max 5M ] | HQ Profiles | Non Drop | Superinstant | No Refill ⚠️ | Speed: 50K/Minutes 🔥", cat: "Instagram Likes [ High Quality - One Click Done 🚀 ] ᴺᴱᵂ", rate: 7.34, min: 50, max: 5000000, refill: false, cancel: false, avg: "Instant" },

  // 6917
  { pid: 1758, name: "TikTok Video Views [ Max Unlimited ] | HQ | No Refill ⚠️ | Instant Start | Day 100M 🚀 𝐔𝐋𝐓𝐑𝐀 𝐅𝐀𝐒𝐓 🚀", cat: "TikTok Video Views [ Cheapest ] ᴺᴱᵂ", rate: 1.18, min: 100, max: 2147483647, refill: false, cancel: false, avg: "Instant" },

  // 6918
  { pid: 1759, name: "TikTok Likes - [ LQ Accounts | Max: 1M | Drop Rate: Low Drop | Refill: No ⚠️ | Cancel Enable | Start Time: 0-1 Minutes | Day: 200K 🚀 ]", cat: "TikTok Likes [ LQ Profiles ] [ 1 Minutes Completed🚀 ] ᴺᴱᵂ", rate: 20.04, min: 10, max: 1000000, refill: false, cancel: true, avg: "Instant" },

  // 8288
  { pid: 1769, name: "Facebook Likes [ Max 1M ] | High Quality | Cancel Enable | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Service [ Fast Speed✨ ] ᴺᴱᵂ", rate: 33.25, min: 10, max: 1000000, refill: false, cancel: true, avg: "Instant" },
  { pid: 1771, name: "Facebook Page Likes +  Followers [ Max 1M ] | High Quality | Cancel Enable | Low Drop | No Refill ⚠️ | Instant Start | Day 100K 🚀", cat: "Facebook Service [ Fast Speed✨ ] ᴺᴱᵂ", rate: 64.63, min: 10, max: 100000, refill: false, cancel: true, avg: "Instant" }
];

// Map into SMMService format
const services = rawServicesData.map((s, index) => {
  const providerRateUSD = Number((s.rate / 87).toFixed(4));
  return {
    id: `srv_${s.pid}`,
    providerServiceId: s.pid,
    name: s.name,
    category: s.cat,
    type: "Default",
    providerRateUSD: providerRateUSD,
    calculatedRateINR: s.rate,
    marginPercent: 0,
    sellingRateINR: s.rate,
    isPriceLocked: true,
    minQuantity: s.min,
    maxQuantity: s.max,
    refillSupported: s.refill,
    cancelSupported: s.cancel,
    description: `⚡ Provider ID: ${s.pid}\n⚡ Average Time: ${s.avg}\n⚡ Refill: ${s.refill ? 'Supported' : 'No Refill'}\n⚡ Cancel: ${s.cancel ? 'Supported' : 'Not Supported'}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

const dbPath = path.join(__dirname, '../smm_panel_db.json');
let dbData = {};

if (fs.existsSync(dbPath)) {
  try {
    dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (err) {
    dbData = {};
  }
}

dbData.categories = categories;
dbData.services = services;

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`Successfully updated ${categories.length} categories and ${services.length} FameProvider services into smm_panel_db.json`);
