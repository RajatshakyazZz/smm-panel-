const fs = require('fs');
const path = require('path');

const rawHtml = `<!DOCTYPE html>
<html id="theme_22" lang="en">
<head>
  <title>Services</title>
</head>
<body class="body body-internal">
  <div id="block_193">
    <!-- Dropdown categories -->
    <ul class="dropdown-menu default-dropdown__container">
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="All">All</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="favorites" data-filter-category-name="Favorite services">Favorite services</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="8755" data-filter-category-name="𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ">𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 — 𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞 ✨ ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="10666" data-filter-category-name="𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 [ 𝐍𝐨𝐰 𝐖𝐨𝐫𝐤𝐢𝐧𝐠 ✅ ] [ Fast ]">𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬 [ 𝐍𝐨𝐰 𝐖𝐨𝐫𝐤𝐢𝐧𝐠 ✅ ] [ Fast ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="9860" data-filter-category-name="Instagram Followers [ Extreme Speed 🔥]">Instagram Followers [ Extreme Speed 🔥]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2837" data-filter-category-name="Instagram Likes — Fastest 🔥 ᴺᴱᵂ">Instagram Likes — Fastest 🔥 ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="11808" data-filter-category-name="Instagram Video Views">Instagram Video Views</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2967" data-filter-category-name="Instagram Followers [ Overflow Server ]">Instagram Followers [ Overflow Server ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2710" data-filter-category-name="Instagram Followers [ Perfect Quality ] [ India 🇮🇳 ]">Instagram Followers [ Perfect Quality ] [ India 🇮🇳 ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="9382" data-filter-category-name="Instagram Followers [ Fast Delivery 🚀 ]">Instagram Followers [ Fast Delivery 🚀 ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="22" data-filter-category-name="Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ">Instagram Followers | 𝟭 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="9224" data-filter-category-name="𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]">𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐑𝐞𝐜𝐨𝐦𝐞𝐧𝐝𝐞𝐝🌟]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="15" data-filter-category-name="Instagram Likes &amp; Followers [ 0% Drop ]">Instagram Likes &amp; Followers [ 0% Drop ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="5458" data-filter-category-name="Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ">Instagram Followers [ 100% Indian 🇮🇳 ] [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="106" data-filter-category-name="Instagram Followers [ Fast Delivery ⚡]">Instagram Followers [ Fast Delivery ⚡]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="8289" data-filter-category-name="Facebook Followers [ Fast Speed ]ᴺᴱᵂ">Facebook Followers [ Fast Speed ]ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="5" data-filter-category-name="𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ">𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐑𝐞𝐞𝐥 / 𝐕𝐢𝐝𝐞𝐨 𝐕𝐢𝐞𝐰𝐬 [ 𝐂𝐡𝐞𝐚𝐩𝐞𝐬𝐭 🌟] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2838" data-filter-category-name="Instagram Likes [ 100% Indian Profiles 🇮🇳 ]">Instagram Likes [ 100% Indian Profiles 🇮🇳 ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="7828" data-filter-category-name="Instagram Likes [ Profile Photo Available ] ᴺᴱᵂ">Instagram Likes [ Profile Photo Available ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="7675" data-filter-category-name="Facebook Page &amp; Profile Followers [ Fast Speed✨ ] ᴺᴱᵂ">Facebook Page &amp; Profile Followers [ Fast Speed✨ ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="7069" data-filter-category-name="Instagram Likes [ Cheap">Instagram Likes [ Cheap</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="4453" data-filter-category-name="Instagram Followers [ Best Prices 🥇 ] ᴺᴱᵂ">Instagram Followers [ Best Prices 🥇 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="547" data-filter-category-name="Fameprovider - Top Quality💎🔥">Fameprovider - Top Quality💎🔥</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="4171" data-filter-category-name="🛒 𝗜𝗚 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 • 💥 𝗟𝗼𝘄𝗲𝘀𝘁 𝗣𝗿𝗶𝗰𝗲 • 🚀">🛒 𝗜𝗚 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 • 💥 𝗟𝗼𝘄𝗲𝘀𝘁 𝗣𝗿𝗶𝗰𝗲 • 🚀</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2709" data-filter-category-name="IG Services |- ✨Fast">IG Services |- ✨Fast</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="433" data-filter-category-name="Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |">Instagram Followers | 𝗖𝗛𝗘𝗔𝗣𝗘𝗦𝗧 𝗜𝗡 𝗧𝗛𝗘 𝗠𝗔𝗥𝗞𝗘𝗧 ᴺᴱᵂ |</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="9" data-filter-category-name="𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 𝗟𝗶𝗸𝗲𝘀 [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐐𝐔𝐀🇱🇮𝐓𝐘 ] [ 100% 𝗜𝗡𝗗𝗜𝗔𝗡 🇮🇳 ]  ᴺᴱᵂ">𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 𝗟𝗶𝗸𝗲𝘀 [ 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐐𝐔𝐀🇱🇮𝐓𝐘 ] [ 100% 𝗜𝗡𝗗𝗜𝗔𝗡 🇮🇳 ]  ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="6919" data-filter-category-name="Instagram Reposts [ Cheapest ]">Instagram Reposts [ Cheapest ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="777" data-filter-category-name="Instagram Comments [ Cheapest ] ᴺᴱᵂ">Instagram Comments [ Cheapest ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="778" data-filter-category-name="Instagram Comment Likes [ Provider ] ᴺᴱᵂ">Instagram Comment Likes [ Provider ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="4032" data-filter-category-name="Instagram Post View">Instagram Post View</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2333" data-filter-category-name="-----------𝐅𝐚𝐜𝐞𝐁𝐨𝐨𝐤 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------">-----------𝐅𝐚𝐜𝐞𝐁𝐨𝐨𝐤 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="4595" data-filter-category-name="Facebook Mix Indian [ Fast Speed✨ ] ᴺᴱᵂ">Facebook Mix Indian [ Fast Speed✨ ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="4738" data-filter-category-name="Facebook Post Likes [ Cheapest in the World 🌎 ] ᴺᴱᵂ">Facebook Post Likes [ Cheapest in the World 🌎 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="5894" data-filter-category-name="Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ">Facebook Live Stream Views [ 𝗖𝗵𝗲𝗮𝗽𝗲𝘀𝘁 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="432" data-filter-category-name="Facebook Video Views [ FAST Working ] ᴺᴱᵂ">Facebook Video Views [ FAST Working ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3617" data-filter-category-name="Facebook Post Likes ᴺᴱᵂ">Facebook Post Likes ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3616" data-filter-category-name="Facebook Views [ Impressions + Reach ]">Facebook Views [ Impressions + Reach ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="1724" data-filter-category-name="Facebook Post Likes [ Fast Delivery 🚀 ]">Facebook Post Likes [ Fast Delivery 🚀 ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="776" data-filter-category-name="𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]">𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 Comments [ Best In The Market ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="51" data-filter-category-name="-----------𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------">-----------𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐞𝐬-------------</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="1845" data-filter-category-name="𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ">𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Subscriber [ New After Update ✨] ᴾʳᵒᵛᶦᵈᵉʳ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="53" data-filter-category-name="YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ">YouTube Shorts / Video View ᴾʳᵒᵛᶦᵈᵉʳ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="429" data-filter-category-name="YouTube Native Ads Views [ Recomended ]">YouTube Native Ads Views [ Recomended ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2209" data-filter-category-name="YouTube Likes [ High Speed – Provider ] Refill Button Working 🔥 ᴺᴱᵂ">YouTube Likes [ High Speed – Provider ] Refill Button Working 🔥 ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="431" data-filter-category-name="𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ">𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - Live Stream [ %100 Concurrent ] [ SUPER FAST ] ᴾʳᵒᵛᶦᵈᵉʳ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="428" data-filter-category-name="Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ">Twitter Followers [ Non Drop — Cheap ] [s2] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="2332" data-filter-category-name="Automatic Services">Automatic Services</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3613" data-filter-category-name="Tiktok Followers [ Best Price 💎 ] ᴺᴱᵂ">Tiktok Followers [ Best Price 💎 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3615" data-filter-category-name="TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ">TikTok Likes [ Drop 0% ] [ BASE #2 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3618" data-filter-category-name="[ ⚙ Auto ] Telegram Post View">[ ⚙ Auto ] Telegram Post View</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3619" data-filter-category-name="Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ">Telegram Bot Start [ Cheapest in The Market ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="3620" data-filter-category-name="Threads Services [ MAİN PROVİDER ]">Threads Services [ MAİN PROVİDER ]</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="5025" data-filter-category-name="Instagram Likes [ High Quality - One Click Done 🚀 ] ᴺᴱᵂ">Instagram Likes [ High Quality - One Click Done 🚀 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="6917" data-filter-category-name="TikTok Video Views [ Cheapest ] ᴺᴱᵂ">TikTok Video Views [ Cheapest ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="6918" data-filter-category-name="TikTok Likes [ LQ Profiles ] [ 1 Minutes Completed🚀 ] ᴺᴱᵂ">TikTok Likes [ LQ Profiles ] [ 1 Minutes Completed🚀 ] ᴺᴱᵂ</a></li>
      <li class="default-dropdown__item"><a href="#" data-filter-category-id="8288" data-filter-category-name="Facebook Service [ Fast Speed✨ ] ᴺᴱᵂ">Facebook Service [ Fast Speed✨ ] ᴺᴱᵂ</a></li>
    </ul>
  </div>
</body>
</html>`;

console.log("Parsing script ready");
