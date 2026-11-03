function getGeminiApiKey() {
  const env = window.__ENV__ || {};
  return String(env.GEMINI_API_KEY || "").trim();
}

const CHARACTERS = {
  barnaby: { name: "바나비", role: "파스텔 왕관을 쓴 폭신한 하얀 토끼", quote: "안녕! 나는 바나비야. 같이 영어 동화를 만들어 볼까?", hero: "바나비와 마법 같은 영어 동화를 만들어 보자.", bg: "from-rose-50 to-pink-100" },
  milo: { name: "마일로", role: "소프트 코랄 망토를 두른 꼬마 히어로", quote: "순한 눈망울로 용기를 영어로 말해 보자!", hero: "마일로가 코랄 망토를 휘날리며 다음 장면을 기다려.", bg: "from-orange-50 to-rose-100" },
  dragon: { name: "다이노", role: "딸기 우유색 포인트를 가진 파스텔 민트 아기 공룡", quote: "딸기 우유처럼 달콤한 문장을 한 줄씩 모아 보자!", hero: "다이노가 민트빛 볼을 살랑이며 이야기를 듣고 있어.", bg: "from-emerald-50 to-teal-100" },
  foxy: { name: "퐁이", role: "마법사 모자와 별을 단 꼬마 여우", quote: "모자를 살짝 쓰고, 단어 마법을 같이 걸어 볼까?", hero: "퐁이가 별 모자를 고쳐 쓰며 다음 문장을 속삭여.", bg: "from-amber-50 to-orange-100" }
};

const LEVELS = {
  beginner: { label: "초급", help: "초급 · 기초 어휘와 짧은 단문", pill: "Lv. 초급" },
  intermediate: { label: "중급", help: "중급 · 초등 교과 핵심 어휘가 들어간 문장", pill: "Lv. 중급" },
  advanced: { label: "고급", help: "고급 · 형용사와 복합문으로 응용하는 이야기", pill: "Lv. 고급" }
};

const TEMPLATES = {
  pigs: { title: "아기돼지 삼형제", en: "Three Little Pigs", art: "pigs", cover: "linear-gradient(160deg,#ff9eb5,#ffd0a8)", emoji: "🐷", madlib: "Once upon a time, three little pigs built a [ house ] made of [ bricks ].", choices: ["a brick house", "a candy house", "a cloud house"] },
  alice: { title: "이상한 나라의 앨리스", en: "Alice in Wonderland", art: "alice", cover: "linear-gradient(160deg,#c4b5fd,#f9a8d4)", emoji: "🐇", madlib: "Alice followed the [ white rabbit ] down into a [ wonderland ].", choices: ["a talking flower", "a tiny door", "a tea party"] },
  redhood: { title: "빨간 모자", en: "Little Red Riding Hood", art: "redhood", cover: "linear-gradient(160deg,#86efac,#fde68a)", emoji: "🧺", madlib: "Little Red Riding Hood walked through the [ forest ] with a [ basket ].", choices: ["fresh apples", "a kind wolf", "a map of stars"] },
  goose: { title: "황금거위", en: "Golden Goose", art: "goose", cover: "linear-gradient(160deg,#fde68a,#fdba74)", emoji: "🪿", madlib: "A kind child shared bread and found a [ golden goose ].", choices: ["a golden feather", "a warm pie", "a new friend"] }
};

const CLASSIC_STORIES = {
  pigs: {
    title: "Three Little Pigs",
    story_en: "Once upon a time, three little pigs built houses of straw, sticks, and bricks to stay safe.",
    story_ko: "옛날 옛적에, 아기돼지 삼형제가 안전하게 살기 위해 짚, 나무, 벽돌로 집을 지었어요.",
    image: "images/three_pigs.png"
  },
  alice: {
    title: "Alice in Wonderland",
    story_en: "Once upon a time, Alice followed a white rabbit down a hole into a magical wonderland.",
    story_ko: "옛날 옛적에, 앨리스가 흰 토끼를 따라 굴 속 신비한 이상한 나라로 들어갔어요.",
    image: "images/alice.png"
  },
  redhood: {
    title: "Little Red Riding Hood",
    story_en: "Once upon a time, Little Red Riding Hood walked through the forest to visit her grandmother.",
    story_ko: "옛날 옛적에, 빨간 모자가 할머니를 만나기 위해 아름다운 숲속을 걸어갔어요.",
    image: "images/red_riding_hood.png"
  },
  goose: {
    title: "Golden Goose",
    story_en: "Once upon a time, a kind boy found a golden goose that brought happiness to the kingdom.",
    story_ko: "옛날 옛적에, 착한 소년이 왕국에 행복을 가져다주는 황금거위를 발견했어요.",
    image: "images/golden_goose.png"
  }
};

function resetStoryBook(key) {
  const data = CLASSIC_STORIES[key];
  const tpl = TEMPLATES[key];
  if (!data || !tpl) return;
  $("relayInput").value = data.title;
  currentTemplateImage = data.image;
  state.templateImage = data.image;
  storyPages.length = 0;
  storyPages.push({
    scene: 1,
    text_en: data.story_en,
    text_ko: data.story_ko,
    image: data.image,
    en: sentenceToTokens(data.story_en, data.words),
    kr: data.story_ko
  });
  currentPage = 0;
  state.story = {
    id: "classic-" + key,
    templateKey: key,
    title: data.title,
    kr: tpl.title,
    emoji: tpl.emoji,
    cover: tpl.cover,
    art: tpl.art,
    image: data.image,
    note: tpl.title,
    pages: storyPages,
    published: false,
    level: state.level
  };
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  updateUI();
}

const W = (text, meaning, pron, example) => ({ text, meaning, pron, example });

const STORIES = {
  pigs: {
    beginner: [
      { en: [W("Three"), W("little", "작은", "/LIT-ul/", "a little pig"), W("pigs", "돼지들", "/pigz/", "three pigs"), "want a", W("house", "집", "/hows/", "my house"), "."], kr: "아기 돼지 세 마리는 집을 원해요." },
      { en: [W("They", "그들은", "/thay/", "They smile."), W("build", "지어요", "/bild/", "build a house"), "with", W("bricks", "벽돌", "/briks/", "red bricks"), "."], kr: "그들은 벽돌로 집을 지어요." },
      { en: ["The", W("wolf", "늑대", "/woolf/", "a big wolf"), "cannot", W("blow", "불다", "/bloh/", "blow the house"), "it down."], kr: "늑대는 집을 불어 넘기지 못해요." }
    ],
    intermediate: [
      { en: ["The three little pigs", W("build", "짓다", "/bild/", "build a house"), "houses to stay", W("safe", "안전한", "/sayf/", "stay safe"), "."], kr: "아기 돼지 삼형제는 안전하게 지내려고 집을 지어요." },
      { en: ["The", W("wolf", "늑대", "/woolf/", "the wolf"), W("huffs", "헉헉 불어요", "/hufs/", "huff and puff"), "but the brick house", W("stands", "버텨요", "/standz/", "stands tall"), "."], kr: "늑대가 세게 불어도 벽돌집은 버티어요." },
      { en: ["They", W("share", "나누어요", "/shair/", "share a cake"), "soup and feel", W("brave", "용감한", "/brayv/", "a brave pig"), "."], kr: "그들은 수프를 나누며 용감해졌어요." }
    ],
    advanced: [
      { en: ["Because a", W("storm", "폭풍", "/storm/", "a loud storm"), "was coming, the pigs", W("carefully", "조심스럽게", "/KAIR-fuh-lee/", "carefully built"), "built different houses."], kr: "폭풍이 오고 있어서 돼지들은 서로 다른 집을 정성껏 지었어요." },
      { en: ["The", W("clever", "영리한", "/KLEV-er/", "a clever plan"), "pigs chose", W("strong", "튼튼한", "/strong/", "a strong wall"), "bricks instead of straw."], kr: "영리한 돼지들은 지푸라기 대신 튼튼한 벽돌을 골랐어요." },
      { en: ["After the wolf left, they", W("celebrated", "축하했어요", "/SEL-uh-bray-tid/", "celebrated together"), "their", W("cozy", "포근한", "/KOH-zee/", "a cozy home"), "home."], kr: "늑대가 떠난 뒤, 그들은 포근한 집을 축하했어요." }
    ]
  },
  alice: {
    beginner: [
      { en: [W("Alice", "앨리스", "/AL-iss/", "Alice runs"), "sees a", W("rabbit", "토끼", "/RAB-it/", "a white rabbit"), "."], kr: "앨리스는 토끼를 보아요." },
      { en: ["She", W("follows", "따라가요", "/FOL-ohz/", "follows the rabbit"), "a", W("tiny", "아주 작은", "/TY-nee/", "a tiny door"), "door."], kr: "앨리스는 아주 작은 문을 따라가요." },
      { en: ["The", W("garden", "정원", "/GAR-den/", "a flower garden"), "is", W("magic", "마법의", "/MAJ-ik/", "magic tea"), "."], kr: "정원은 마법 같아요." }
    ],
    intermediate: [
      { en: ["Alice", W("followed", "따라갔어요", "/FOL-ohd/", "followed him"), "the white rabbit into", W("Wonderland", "이상한 나라", "/WUN-der-land/", "in Wonderland"), "."], kr: "앨리스는 하얀 토끼를 따라 이상한 나라에 들어갔어요." },
      { en: ["A", W("polite", "공손한", "/puh-LITE/", "polite rabbit"), "rabbit checked his", W("watch", "시계", "/wotch/", "a gold watch"), "."], kr: "공손한 토끼가 시계를 확인했어요." },
      { en: ["Friends had", W("tea", "차", "/tee/", "tea time"), "and shared", W("kind", "친절한", "/kynd/", "kind words"), "words."], kr: "친구들은 차를 마시며 친절한 말을 나눴어요." }
    ],
    advanced: [
      { en: ["Curious Alice", W("wandered", "거닐었어요", "/WON-derd/", "wandered slowly"), "after the rabbit, although the path looked", W("strange", "이상한", "/straynj/", "a strange path"), "."], kr: "호기심 많은 앨리스는 길이 이상해 보여도 토끼를 따라 거닐었어요." },
      { en: ["The", W("enormous", "거대한", "/ih-NOR-mus/", "an enormous hat"), "flowers whispered riddles in a", W("gentle", "부드러운", "/JEN-tul/", "a gentle voice"), "voice."], kr: "거대한 꽃들이 부드러운 목소리로 수수께끼를 속삭였어요." },
      { en: ["Alice", W("discovered", "발견했어요", "/dis-KUV-erd/", "discovered a key"), "that kindness opens every", W("locked", "잠긴", "/lokt/", "a locked door"), "door."], kr: "앨리스는 친절이 잠긴 문을 모두 연다는 것을 발견했어요." }
    ]
  },
  redhood: {
    beginner: [
      { en: ["Red has a", W("basket", "바구니", "/BAS-kit/", "a food basket"), "."], kr: "빨강이는 바구니가 있어요." },
      { en: ["She", W("walks", "걸어요", "/wawks/", "walks slowly"), "in the", W("forest", "숲", "/FOR-ist/", "a green forest"), "."], kr: "빨강이는 숲을 걸어요." },
      { en: ["Grandma", W("smiles", "웃어요", "/smyles/", "smiles warmly"), "and says", W("hello", "안녕", "/heh-LOH/", "say hello"), "."], kr: "할머니는 웃으며 안녕이라고 말해요." }
    ],
    intermediate: [
      { en: ["Little Red Riding Hood carried", W("fresh", "신선한", "/fresh/", "fresh apples"), "apples for", W("Grandma", "할머니", "/GRAN-mah/", "dear Grandma"), "."], kr: "빨간 모자는 할머니께 드릴 신선한 사과를 들고 갔어요." },
      { en: ["She stayed on the", W("path", "길", "/path/", "the safe path"), "and used a", W("clever", "영리한", "/KLEV-er/", "a clever plan"), "plan."], kr: "빨강이는 길을 지키며 영리한 계획을 썼어요." },
      { en: ["The", W("woodcutter", "나무꾼", "/WOOD-kut-er/", "a kind woodcutter"), "helped, and everyone felt", W("safe", "안전한", "/sayf/", "feel safe"), "."], kr: "나무꾼이 도와서 모두 안전해졌어요." }
    ],
    advanced: [
      { en: ["Although the forest was", W("shadowy", "그늘진", "/SHAD-oh-ee/", "a shadowy path"), ", Red remembered Grandma's", W("advice", "조언", "/ad-VICE/", "good advice"), "."], kr: "숲이 그늘져 있어도 빨강이는 할머니의 조언을 기억했어요." },
      { en: ["She asked", W("careful", "신중한", "/KAIR-ful/", "careful questions"), "questions before she opened the", W("cottage", "오두막", "/KOT-ij/", "a small cottage"), "door."], kr: "오두막 문을 열기 전에 신중하게 질문했어요." },
      { en: ["Bravery and", W("wisdom", "지혜", "/WIZ-dum/", "quiet wisdom"), "brought a", W("happy", "행복한", "/HAP-ee/", "a happy ending"), "ending."], kr: "용기와 지혜가 행복한 결말을 가져왔어요." }
    ]
  },
  goose: {
    beginner: [
      { en: ["A", W("kind", "친절한", "/kynd/", "a kind child"), "child", W("shares", "나눠요", "/shairz/", "shares bread"), "bread."], kr: "친절한 아이가 빵을 나눠요." },
      { en: ["A", W("golden", "황금의", "/GOL-den/", "a golden egg"), W("goose", "거위", "/goos/", "a white goose"), "appears."], kr: "황금 거위가 나타나요." },
      { en: ["Friends", W("laugh", "웃어요", "/laf/", "laugh together"), "and feel", W("happy", "행복한", "/HAP-ee/", "feel happy"), "."], kr: "친구들은 웃으며 행복해해요." }
    ],
    intermediate: [
      { en: ["The child", W("shared", "나눴어요", "/shaird/", "shared lunch"), "lunch with a hungry", W("traveler", "나그네", "/TRAV-uh-ler/", "a tired traveler"), "."], kr: "아이는 배고픈 나그네와 점심을 나눴어요." },
      { en: ["The", W("golden", "황금의", "/GOL-den/", "golden feathers"), "goose brought", W("warm", "따뜻한", "/worm/", "a warm pie"), "pies, not just gold."], kr: "황금 거위는 금뿐 아니라 따뜻한 파이를 가져다주었어요." },
      { en: ["The village learned that", W("kindness", "친절", "/KYND-ness/", "show kindness"), "is the best", W("reward", "보상", "/ri-WORD/", "a sweet reward"), "."], kr: "마을 사람들은 친절이 가장 좋은 보상임을 배웠어요." }
    ],
    advanced: [
      { en: ["Even though the child had little food, sharing it was a", W("generous", "너그러운", "/JEN-er-us/", "a generous heart"), "choice."], kr: "음식이 적어도 나누는 일은 너그러운 선택이었어요." },
      { en: ["The goose", W("glowed", "빛났어요", "/glohd/", "glowed softly"), "softly and", W("granted", "선물했어요", "/GRAN-tid/", "granted a wish"), "a wish for the whole town."], kr: "거위가 부드럽게 빛나며 마을 전체에 소원을 선물했어요." },
      { en: ["People", W("remembered", "기억했어요", "/ri-MEM-berd/", "remembered the day"), "that gentle hearts shine brighter than", W("treasure", "보물", "/TREZH-er/", "hidden treasure"), "."], kr: "사람들은 부드러운 마음이 보물보다 밝게 빛난다는 것을 기억했어요." }
    ]
  }
};

const state = {
  tab: "create",
  prevTab: "create",
  character: "barnaby",
  level: "beginner",
  template: "pigs",
  templateImage: "images/three_pigs.png",
  showTranslation: true,
  page: 0,
  story: null,
  parentUnlocked: false,
  pin: "",
  relayId: null,
  publishId: null,
  vocab: [
    { word: "brave", meaning: "용감한", pron: "/brayv/", example: "The pigs are brave.", from: "아기돼지 삼형제" },
    { word: "kind", meaning: "친절한", pron: "/kynd/", example: "A kind child shares.", from: "황금거위" },
    { word: "forest", meaning: "숲", pron: "/FOR-ist/", example: "Walk in the forest.", from: "빨간 모자" },
    { word: "magic", meaning: "마법의", pron: "/MAJ-ik/", example: "A magic garden.", from: "앨리스" }
  ],
  week: [2, 4, 3, 6, 5, 8, 4],
  books: [
    { id: "space", title: "Pig in Space", kr: "우주 돼지", emoji: "🐷", cover: "linear-gradient(160deg,#818cf8,#67e8f9)", note: "읽는 중 · 50%", pages: null, published: false, art: "space" },
    { id: "bakery", title: "The Dragon Bakery", kr: "드래곤 빵집", emoji: "🦕", cover: "linear-gradient(160deg,#6ee7b7,#fbcfe8)", note: "출판 완료", pages: null, published: true, art: "goose" },
    { id: "cape", title: "Milo Flying Cape", kr: "마일로의 망토", emoji: "🦸", cover: "linear-gradient(160deg,#fb7185,#fdba74)", note: "출판 완료", pages: null, published: true, art: "alice" }
  ],
  community: [
    { id: "c1", author: "하늘", title: "Rainbow Bakery", emoji: "🌈", text: "Milo opened a bakery on a cloud. The first customer was a shy star." },
    { id: "c2", author: "준호", title: "Forest Lanterns", emoji: "🏮", text: "Red Riding Hood hung lanterns so no friend would get lost." },
    { id: "c3", author: "서연", title: "Goose Mail", emoji: "✉️", text: "The golden goose delivered thank-you letters to the whole village." },
    { id: "c4", author: "도윤", title: "Rabbit Clock", emoji: "⏰", text: "Alice and the rabbit stopped time to finish their tea party." }
  ]
};

const storyPages = [];
let currentPage = 0;
let currentTemplateImage = "images/three_pigs.png";
state.storyPages = storyPages;
state.currentPage = currentPage;

const $ = (id) => document.getElementById(id);

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.remove("hidden");
  el.classList.add("toast-in");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2600);
}

function speak(text, button) {
  if (button) {
    button.classList.remove("speak-pop");
    void button.offsetWidth;
    button.classList.add("speak-pop");
  }
  if (!window.speechSynthesis) {
    toast("이 브라우저에서는 소리 내기를 지원하지 않아요.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.92;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function svgBarnaby() {
  return '<svg viewBox="0 0 200 200" class="h-32 w-32" aria-hidden="true"><ellipse cx="62" cy="58" rx="18" ry="42" fill="#fff" stroke="#f7b2c2" stroke-width="4"/><ellipse cx="62" cy="62" rx="9" ry="24" fill="#ffd6e4"/><ellipse cx="138" cy="58" rx="18" ry="42" fill="#fff" stroke="#f7b2c2" stroke-width="4"/><ellipse cx="138" cy="62" rx="9" ry="24" fill="#ffd6e4"/><circle cx="100" cy="118" r="58" fill="#fff7fb" stroke="#f7b2c2" stroke-width="4"/><path d="M76 64h48c6 0 10 6 8 12l-6 12H74l-6-12c-2-6 2-12 8-12z" fill="#ffe08a" stroke="#f0c14d" stroke-width="3"/><circle cx="100" cy="60" r="6" fill="#ff8fab"/><circle cx="70" cy="114" r="9" fill="#ffb7c8"/><circle cx="130" cy="114" r="9" fill="#ffb7c8"/><ellipse cx="82" cy="108" rx="7" ry="9" fill="#3f3a4a"/><ellipse cx="118" cy="108" rx="7" ry="9" fill="#3f3a4a"/><circle cx="84" cy="106" r="2.2" fill="#fff"/><circle cx="120" cy="106" r="2.2" fill="#fff"/><ellipse cx="100" cy="122" rx="5" ry="3.5" fill="#ff8fab"/><path d="M90 130c6 8 14 8 20 0" fill="none" stroke="#3f3a4a" stroke-width="3" stroke-linecap="round"/></svg>';
}

function svgMilo() {
  return '<svg viewBox="0 0 200 200" class="h-32 w-32" aria-hidden="true"><path d="M38 124c10-40 30-56 50-40 6 30-10 60-30 66-16 4-24-6-20-26z" fill="#ff8f9a"/><path d="M162 124c-10-40-30-56-50-40-6 30 10 60 30 66 16 4 24-6 20-26z" fill="#ffb0a4"/><circle cx="100" cy="112" r="54" fill="#ffe8d2" stroke="#f3c7a4" stroke-width="4"/><ellipse cx="78" cy="108" rx="8" ry="10" fill="#3f3a4a"/><ellipse cx="122" cy="108" rx="8" ry="10" fill="#3f3a4a"/><circle cx="80" cy="106" r="3" fill="#fff"/><circle cx="124" cy="106" r="3" fill="#fff"/><circle cx="72" cy="122" r="7" fill="#ffc2c8"/><circle cx="128" cy="122" r="7" fill="#ffc2c8"/><path d="M92 128c5 6 11 6 16 0" fill="none" stroke="#3f3a4a" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="74" r="11" fill="#ffe08a" stroke="#f0c14d" stroke-width="3"/><path d="M100 66l1.8 4.6H107l-3.8 2.8 1.4 4.6L100 75.4 94.4 78l1.4-4.6L92 70.6h5.2z" fill="#fff"/></svg>';
}

function svgDragon() {
  return '<svg viewBox="0 0 200 200" class="h-32 w-32" aria-hidden="true"><ellipse cx="56" cy="108" rx="22" ry="16" fill="#b7f3df" stroke="#7ed9bc" stroke-width="3"/><ellipse cx="144" cy="108" rx="22" ry="16" fill="#b7f3df" stroke="#7ed9bc" stroke-width="3"/><circle cx="100" cy="118" r="56" fill="#c8f6e6" stroke="#7ed9bc" stroke-width="4"/><ellipse cx="100" cy="138" rx="28" ry="20" fill="#ffd6e4"/><ellipse cx="74" cy="76" rx="10" ry="14" fill="#9be7cf" stroke="#6dceb4" stroke-width="3"/><ellipse cx="126" cy="76" rx="10" ry="14" fill="#9be7cf" stroke="#6dceb4" stroke-width="3"/><circle cx="78" cy="110" r="7" fill="#35524a"/><circle cx="122" cy="110" r="7" fill="#35524a"/><circle cx="80" cy="108" r="2.3" fill="#fff"/><circle cx="124" cy="108" r="2.3" fill="#fff"/><circle cx="68" cy="124" r="8" fill="#ffc2d4"/><circle cx="132" cy="124" r="8" fill="#ffc2d4"/><ellipse cx="100" cy="124" rx="6" ry="4" fill="#f3a0b5"/><path d="M90 132c6 8 14 8 20 0" fill="none" stroke="#35524a" stroke-width="3" stroke-linecap="round"/></svg>';
}

function svgFoxy() {
  return '<svg viewBox="0 0 200 200" class="h-32 w-32" aria-hidden="true"><ellipse cx="70" cy="86" rx="16" ry="18" fill="#ffb086" stroke="#f09970" stroke-width="3"/><ellipse cx="130" cy="86" rx="16" ry="18" fill="#ffb086" stroke="#f09970" stroke-width="3"/><path d="M78 42c8 20 36 24 44 2 2 22-8 36-22 40-16-4-24-18-22-42z" fill="#7c6cf0"/><ellipse cx="100" cy="48" rx="18" ry="6" fill="#ffe08a"/><path d="M118 34l2 6 6 1-5 3 2 6-5-4-5 4 2-6-5-3 6-1z" fill="#ffe08a"/><circle cx="100" cy="122" r="52" fill="#ffb086" stroke="#f09970" stroke-width="4"/><ellipse cx="100" cy="138" rx="26" ry="18" fill="#fff6ea"/><ellipse cx="100" cy="130" rx="7" ry="5" fill="#f09970"/><ellipse cx="80" cy="114" rx="6" ry="8" fill="#3f3a4a"/><ellipse cx="120" cy="114" rx="6" ry="8" fill="#3f3a4a"/><circle cx="82" cy="112" r="2" fill="#fff"/><circle cx="122" cy="112" r="2" fill="#fff"/><path d="M92 144c5 6 11 6 16 0" fill="none" stroke="#3f3a4a" stroke-width="3" stroke-linecap="round"/><circle cx="74" cy="128" r="6" fill="#ffc2b3"/><circle cx="126" cy="128" r="6" fill="#ffc2b3"/></svg>';
}

const AVATARS = { barnaby: svgBarnaby, milo: svgMilo, dragon: svgDragon, foxy: svgFoxy };

const GEMINI_IMAGES = {
  magic_wand: "images/barnaby_3d.png",
  rabbit_star: "images/barnaby_3d.png",
  candy_house: "images/barnaby_3d.png",
  flying: "images/milo_3d.png",
  eating_cake: "images/dino_3d.png",
  winking_fox: "images/pong_3d.png"
};

function sceneArt(kind) {
  if (state.story && state.story.image) {
    return '<img src="' + esc(state.story.image) + '" alt="AI 동화 삽화" class="h-56 w-56 rounded-3xl object-cover shadow-md">';
  }
  const map = {
    pigs: '<div class="text-center"><div class="text-6xl">🐷🐷🐷</div><p class="mt-2 text-sm font-extrabold text-slate-600 dark:text-gray-200">따뜻한 벽돌집</p></div>',
    alice: '<div class="text-center"><div class="text-6xl">🐇🫖🌸</div><p class="mt-2 text-sm font-extrabold text-slate-600 dark:text-gray-200">이상한 나라의 다과회</p></div>',
    redhood: '<div class="text-center"><div class="text-6xl">🧺🌲🏡</div><p class="mt-2 text-sm font-extrabold text-slate-600 dark:text-gray-200">포근한 숲길</p></div>',
    goose: '<div class="text-center"><div class="text-6xl">🪿✨🥧</div><p class="mt-2 text-sm font-extrabold text-slate-600 dark:text-gray-200">황금빛 마음</p></div>',
    space: '<div class="text-center"><div class="text-6xl">🚀🐷🌙</div><p class="mt-2 text-sm font-extrabold text-slate-600 dark:text-gray-200">별빛 비행</p></div>'
  };
  return map[kind] || map.pigs;
}

const WORD_BANK = {
  three: { meaning: "세", pron: "/three/" },
  little: { meaning: "작은", pron: "/LIT-ul/" },
  pigs: { meaning: "돼지들", pron: "/pigz/" },
  built: { meaning: "지었어요", pron: "/bilt/" },
  houses: { meaning: "집들", pron: "/HOW-ziz/" },
  straw: { meaning: "짚", pron: "/straw/" },
  sticks: { meaning: "나뭇가지", pron: "/stiks/" },
  bricks: { meaning: "벽돌", pron: "/briks/" },
  safe: { meaning: "안전한", pron: "/sayf/" },
  alice: { meaning: "앨리스", pron: "/AL-iss/" },
  opened: { meaning: "열었어요", pron: "/OH-pend/" },
  tiny: { meaning: "아주 작은", pron: "/TY-nee/" },
  door: { meaning: "문", pron: "/dor/" },
  discovered: { meaning: "발견했어요", pron: "/dis-KUV-erd/" },
  magical: { meaning: "마법의", pron: "/MAJ-i-kul/" },
  garden: { meaning: "정원", pron: "/GAR-den/" },
  followed: { meaning: "따라갔어요", pron: "/FOL-ohd/" },
  white: { meaning: "하얀", pron: "/wite/" },
  rabbit: { meaning: "토끼", pron: "/RAB-it/" },
  hole: { meaning: "굴", pron: "/hohl/" },
  wonderland: { meaning: "이상한 나라", pron: "/WUN-der-land/" },
  walked: { meaning: "걸어갔어요", pron: "/wawkt/" },
  forest: { meaning: "숲", pron: "/FOR-ist/" },
  visit: { meaning: "만나러 가다", pron: "/VIZ-it/" },
  grandmother: { meaning: "할머니", pron: "/GRAN-muh-ther/" },
  carried: { meaning: "들고 갔어요", pron: "/KAIR-eed/" },
  kind: { meaning: "착한", pron: "/kynd/" },
  boy: { meaning: "소년", pron: "/boy/" },
  found: { meaning: "발견했어요", pron: "/fownd/" },
  golden: { meaning: "황금의", pron: "/GOL-den/" },
  goose: { meaning: "거위", pron: "/goos/" },
  brought: { meaning: "가져다주었어요", pron: "/brawt/" },
  happiness: { meaning: "행복", pron: "/HAP-ee-nes/" },
  kingdom: { meaning: "왕국", pron: "/KING-dum/" },
  shared: { meaning: "나눴어요", pron: "/shaird/" },
  home: { meaning: "집", pron: "/hohm/" }
};

const STOP_WORDS = { a: 1, an: 1, the: 1, and: 1, or: 1, to: 1, of: 1, in: 1, on: 1, for: 1, with: 1, her: 1, his: 1, into: 1, down: 1, that: 1, was: 1, were: 1, is: 1, are: 1, once: 1, upon: 1, time: 1, through: 1 };

function sentenceToTokens(sentence, glosses) {
  const lookup = {};
  Object.keys(WORD_BANK).forEach((key) => { lookup[key] = WORD_BANK[key]; });
  (glosses || []).forEach((item) => {
    if (!item || !item.word) return;
    lookup[String(item.word).toLowerCase()] = { meaning: item.meaning || "", pron: item.pron || "", example: item.example || "" };
  });
  const parts = String(sentence || "").match(/[A-Za-z']+|[.,!?]/g) || [String(sentence || "")];
  return parts.map((part) => {
    if (/^[.,!?]$/.test(part)) return part;
    const key = part.toLowerCase();
    if (STOP_WORDS[key]) return part;
    const info = lookup[key];
    if (!info || !info.meaning) return part;
    return { text: part, meaning: info.meaning, pron: info.pron || "", example: info.example || sentence };
  });
}

function tokensToHtml(tokens, interactive) {
  if (!interactive) {
    return '<span class="text-slate-900 dark:text-white">' + esc(plainLine(tokens)) + "</span>";
  }
  let html = "";
  tokens.forEach((part) => {
    const punct = typeof part === "string" && /^[.!?,]+$/.test(part);
    const piece = typeof part === "string"
      ? '<span class="text-slate-800 dark:text-white">' + esc(part) + "</span>"
      : '<button type="button" class="word-btn mx-0.5 border-b-2 border-violet-300 font-extrabold text-violet-700 dark:border-violet-200 dark:text-white" data-action="word" data-word="' + esc(part.text) + '" data-meaning="' + esc(part.meaning) + '" data-pron="' + esc(part.pron) + '" data-example="' + esc(part.example) + '">' + esc(part.text) + "</button>";
    html += (html && !punct ? " " : "") + piece;
  });
  return html;
}

function plainLine(tokens) {
  return tokens.map((part) => (typeof part === "string" ? part : part.text)).join(" ").replace(/\s+([.!?])/g, "$1");
}

function clonePages(template, level) {
  return STORIES[template][level].map((page) => ({
    en: page.en.map((part) => (typeof part === "string" ? part : { text: part.text, meaning: part.meaning, pron: part.pron, example: part.example })),
    kr: page.kr
  }));
}

function spaceStory() {
  return [
    { en: [W("Pig", "돼지", "/pig/", "a brave pig"), "puts on a", W("helmet", "헬멧", "/HEL-met/", "a round helmet"), "."], kr: "돼지가 헬멧을 써요." },
    { en: ["The rocket", W("floats", "떠요", "/flohts/", "floats softly"), "past a", W("moon", "달", "/moon/", "the moon"), "."], kr: "로켓이 달 옆을 떠다녀요." },
    { en: ["Friends", W("wave", "손을 흔들어요", "/wayv/", "wave hello"), "from the", W("stars", "별들", "/starz/", "bright stars"), "."], kr: "친구들이 별에서 손을 흔들어요." }
  ];
}

function buildStory(twist) {
  const tpl = TEMPLATES[state.template];
  const pages = clonePages(state.template, state.level);
  const clean = (twist || "").replace(/\s+/g, " ").trim();
  if (clean) {
    const bit = clean.slice(0, 48);
    pages[pages.length - 1] = {
      en: ["Then the story changes:", W(bit, "내가 고른 장면", "/my turn/", bit), "."],
      kr: "그리고 이야기는 이렇게 바뀌어요. “" + bit + "”"
    };
  }
  return { id: "made-" + Date.now(), title: tpl.en, kr: tpl.title, emoji: tpl.emoji, cover: tpl.cover, art: tpl.art, note: "방금 만든 이야기", pages, published: false, level: state.level };
}

const PORTRAITS = {
  barnaby: { src: "images/barnaby_3d.png", alt: "바나비", frame: "border-purple-100 dark:border-purple-900" },
  milo: { src: "images/milo_3d.png", alt: "마일로", frame: "border-coral-100 dark:border-coral-900" },
  dragon: { src: "images/dino_3d.png", alt: "다이노", frame: "border-mint-100 dark:border-mint-900" },
  foxy: { src: "images/pong_3d.png", alt: "퐁이", frame: "border-amber-100 dark:border-amber-900" }
};

function renderCharacter() {
  const key = CHARACTERS[state.character] ? state.character : "barnaby";
  const c = CHARACTERS[key];
  const photo = PORTRAITS[key];
  const slot = $("avatarSlot");
  slot.className = "mx-auto mt-3 grid h-36 w-36 place-items-center overflow-hidden rounded-full";
  slot.style.backgroundImage = "";
  slot.innerHTML = '<img src="' + photo.src + '" alt="' + photo.alt + '" class="h-32 w-32 rounded-full object-cover shadow-md border-4 ' + photo.frame + '">';
  $("charName").textContent = c.name;
  $("charRole").textContent = c.role;
  $("charQuote").textContent = c.quote;
  $("heroLine").textContent = c.hero;
  document.querySelectorAll(".char-btn").forEach((btn) => btn.classList.toggle("chip-on", btn.dataset.id === key));
}

const LEVEL_ACTIVE = "lvl-btn lvl-on rounded-2xl border border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-md scale-105 transition-all";
const LEVEL_IDLE = "lvl-btn rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-extrabold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700";

function renderLevel() {
  const info = LEVELS[state.level];
  $("levelHelp").textContent = info.help;
  $("levelPill").textContent = info.pill;
  document.querySelectorAll(".lvl-btn").forEach((btn) => {
    const selected = btn.dataset.level === state.level;
    btn.className = selected ? LEVEL_ACTIVE : LEVEL_IDLE;
    btn.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  renderParents();
}

function renderComposer() {
  const tpl = TEMPLATES[state.template];
  const classic = CLASSIC_STORIES[state.template];
  state.templateImage = classic ? classic.image : state.templateImage;
  currentTemplateImage = state.templateImage;
  $("madlib").textContent = tpl.madlib;
  $("choices").innerHTML = tpl.choices.map((choice) => '<button type="button" data-action="choice" data-choice="' + esc(choice) + '" class="rounded-full bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-800 dark:bg-slate-900 dark:text-white">' + esc(choice) + "</button>").join("");
  document.querySelectorAll(".tpl-card").forEach((card) => card.classList.toggle("tpl-on", card.dataset.tpl === state.template));
}

function hideTooltip() { $("tooltip").classList.add("hidden"); }

function showTooltip(btn) {
  const tip = $("tooltip");
  const word = btn.dataset.word;
  tip.innerHTML = '<p class="text-base font-black text-slate-900 dark:text-white">' + esc(word) + '</p><p class="text-sm font-extrabold text-violet-600 dark:text-gray-200">' + esc(btn.dataset.pron) + '</p><p class="mt-1 text-sm font-bold text-slate-700 dark:text-gray-200">' + esc(btn.dataset.meaning) + '</p><p class="mt-1 text-xs font-bold text-slate-500 dark:text-gray-200">예: ' + esc(btn.dataset.example) + '</p><div class="mt-2 flex gap-2"><button type="button" class="rounded-xl bg-violet-100 px-2 py-1 text-xs font-extrabold text-violet-700 dark:bg-slate-700 dark:text-white" data-action="speak" data-speak="' + esc(word) + '">🔊 발음</button><button type="button" class="rounded-xl bg-pink-100 px-2 py-1 text-xs font-extrabold text-pink-700 dark:bg-pink-900 dark:text-white" data-action="save-word" data-word="' + esc(word) + '" data-meaning="' + esc(btn.dataset.meaning) + '" data-pron="' + esc(btn.dataset.pron) + '" data-example="' + esc(btn.dataset.example) + '">단어장 저장</button></div>';
  tip.classList.remove("hidden");
  const rect = btn.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 250)) + "px";
  tip.style.top = Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 180)) + "px";
}

function updateUI() {
  state.storyPages = storyPages;
  state.currentPage = currentPage;
  state.page = currentPage;
  const total = storyPages.length;
  const page = total ? storyPages[currentPage] : null;
  $("pageLabel").textContent = (total ? currentPage + 1 : 1) + " / " + (total || 1);
  const prev = $("prevPage");
  const next = $("nextPage");
  prev.disabled = currentPage === 0;
  next.disabled = total === 0 || currentPage === total - 1;
  prev.style.opacity = prev.disabled ? "0.5" : "1";
  next.style.opacity = next.disabled ? "0.5" : "1";
  if (!page) return;
  const show = state.showTranslation;
  const interactive = !show;
  const title = state.story ? state.story.title : "";
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  $("plainStory").innerHTML = '<div class="rounded-2xl bg-violet-50/70 p-4 dark:bg-slate-900"><p class="text-xs font-extrabold text-violet-400 dark:text-gray-200">Scene ' + page.scene + '</p><p class="mt-1 text-lg font-extrabold leading-relaxed">' + tokensToHtml(page.en, interactive) + '</p><p class="mt-2 text-sm font-bold text-slate-600 dark:text-gray-200 ' + (show ? "" : "hidden") + '">' + esc(page.text_ko) + "</p></div>";
  $("switchUi").classList.toggle("on", show);
  $("transToggle").setAttribute("aria-pressed", String(show));
  const picture = $("storybook-image");
  picture.src = page.image || currentTemplateImage || "images/three_pigs.png";
  picture.alt = title || "동화 삽화";
  $("flipPage").innerHTML = '<p class="text-xs font-extrabold text-amber-700 dark:text-white">' + esc(title) + ' · Scene ' + page.scene + '</p><p class="mt-4 text-xl font-extrabold leading-relaxed text-slate-900 dark:text-white">' + tokensToHtml(page.en, interactive) + '</p><p class="mt-4 text-sm font-bold text-slate-600 dark:text-gray-200 ' + (show ? "" : "hidden") + '">' + esc(page.text_ko) + "</p>";
}

function renderPlain() { updateUI(); }
function renderFlip() { updateUI(); }

function appendStoryPage(page) {
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const image = currentTemplateImage || selected.image;
  if (!state.story) {
    state.story = {
      id: "classic-" + state.template,
      templateKey: state.template,
      title: selected.title,
      kr: tpl.title,
      emoji: tpl.emoji,
      cover: tpl.cover,
      art: tpl.art,
      image: image,
      note: tpl.title,
      pages: storyPages,
      published: false,
      level: state.level
    };
  }
  state.story.pages = storyPages;
  state.story.image = image;
  const textEn = page.text_en || plainLine(page.en || []);
  const textKo = page.text_ko || page.kr || "";
  storyPages.push({
    scene: storyPages.length + 1,
    text_en: textEn,
    text_ko: textKo,
    image: image,
    en: page.en || sentenceToTokens(textEn, []),
    kr: textKo
  });
  currentPage = storyPages.length - 1;
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  updateUI();
  $("flipWrap").scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderVocab() {
  const grid = $("vocabGrid");
  if (!state.vocab.length) {
    grid.innerHTML = '<p class="col-span-full rounded-2xl bg-white p-6 text-sm font-bold text-slate-500 shadow-soft dark:bg-slate-800 dark:text-gray-200">아직 저장한 단어가 없어요. 동화의 밑줄 단어를 눌러 저장해 보세요.</p>';
    return;
  }
  grid.innerHTML = state.vocab.map((card) => '<article class="flash rounded-3xl border border-violet-100 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800"><div class="flex items-start justify-between gap-2"><h3 class="text-xl font-black text-violet-700 dark:text-white">' + esc(card.word) + '</h3><button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-lg dark:bg-slate-700" data-action="speak" data-speak="' + esc(card.word) + '" aria-label="' + esc(card.word) + ' 발음 듣기">🔊</button></div><p class="mt-2 text-sm font-extrabold text-slate-500 dark:text-gray-200">' + esc(card.pron) + '</p><p class="text-base font-black text-slate-800 dark:text-white">' + esc(card.meaning) + '</p><p class="mt-2 text-sm font-bold text-slate-600 dark:text-gray-200">"' + esc(card.example) + '"</p><p class="mt-2 text-xs font-extrabold text-pink-500 dark:text-gray-200">from ' + esc(card.from) + "</p></article>").join("");
}

function shelfBooks() {
  const rows = [];
  for (let i = 0; i < state.books.length; i += 3) rows.push(state.books.slice(i, i + 3));
  $("bookshelf").innerHTML = rows.map((row) => '<div><div class="flex flex-wrap items-end gap-4 px-2">' + row.map((book) => '<button type="button" data-action="publish" data-id="' + esc(book.id) + '" class="book-stand w-28 text-left sm:w-32"><div class="flex h-40 flex-col justify-between rounded-2xl p-3 text-white shadow-lg" style="background:' + book.cover + '"><span class="text-3xl">' + book.emoji + '</span><span class="text-sm font-black leading-tight text-white">' + esc(book.title) + '</span></div><p class="mt-2 text-center text-xs font-extrabold text-slate-700 dark:text-gray-200">' + esc(book.note) + "</p></button>").join("") + '</div><div class="shelf-wood mt-2"></div></div>').join("");
}

function renderParents() {
  const published = state.books.filter((b) => b.published).length;
  const info = LEVELS[state.level];
  const max = Math.max.apply(null, state.week.concat([1]));
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const bars = state.week.map((n, i) => '<div class="flex items-center gap-2"><span class="w-6 text-xs font-extrabold text-slate-500 dark:text-gray-200">' + days[i] + '</span><div class="bar flex-1"><span style="width:' + Math.round((n / max) * 100) + '%"></span></div><span class="w-6 text-xs font-extrabold text-slate-700 dark:text-white">' + n + "</span></div>").join("");
  $("parentBody").innerHTML = '<article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800"><p class="text-3xl font-black text-violet-600 dark:text-white">' + state.vocab.length + '개</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">이번 주 학습 어휘</p><div class="bar mt-4"><span style="width:' + Math.min(100, state.vocab.length * 8) + '%"></span></div></article><article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800"><p class="text-3xl font-black text-pink-500 dark:text-white">' + published + '권</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">출판한 동화</p><div class="bar mt-4"><span style="width:' + Math.min(100, published * 25) + '%"></span></div></article><article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800 lg:col-span-1"><p class="text-3xl font-black text-emerald-500 dark:text-white">' + info.label + '</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">현재 교과 난이도</p><div class="mt-4 space-y-2">' + bars + "</div></article>";
}

function renderCommunity() {
  $("communityGrid").innerHTML = state.community.map((story) => '<article class="rounded-3xl border border-violet-100 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800"><div class="text-4xl">' + story.emoji + '</div><h3 class="mt-2 text-lg font-black text-slate-900 dark:text-white">' + esc(story.title) + '</h3><p class="text-xs font-extrabold text-violet-500 dark:text-gray-200">' + esc(story.author) + '의 이야기</p><p class="mt-2 text-sm font-bold leading-relaxed text-slate-600 dark:text-gray-200">' + esc(story.text) + '</p><button type="button" data-action="open-relay" data-id="' + esc(story.id) + '" class="mt-3 rounded-2xl bg-violet-500 px-3 py-2 text-sm font-extrabold text-white">이어서 쓰기</button></article>').join("");
}

function setTab(tab) {
  if (tab === "parents" && !state.parentUnlocked) {
    state.prevTab = state.tab;
    openPin();
    return;
  }
  state.tab = tab;
  ["create", "vocab", "library", "parents", "community"].forEach((name) => {
    $("panel-" + name).classList.toggle("hidden", name !== tab);
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
  if (tab === "vocab") renderVocab();
  if (tab === "library") shelfBooks();
  if (tab === "parents") renderParents();
  if (tab === "community") renderCommunity();
  hideTooltip();
}

function openPin() {
  state.pin = "";
  $("pinError").classList.add("hidden");
  $("modalPin").classList.remove("hidden");
  $("modalPin").classList.add("flex");
  renderPin();
}

function closePin() {
  $("modalPin").classList.add("hidden");
  $("modalPin").classList.remove("flex");
}

function renderPin() {
  const dots = [0, 1, 2, 3].map((i) => '<span class="grid h-12 w-12 place-items-center rounded-2xl border-2 ' + (state.pin.length > i ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-slate-50") + ' text-xl font-black text-slate-800 dark:border-slate-500 dark:bg-slate-900 dark:text-white">' + (state.pin[i] ? "•" : "") + "</span>").join("");
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "지움", 0, "확인"].map((key) => '<button type="button" data-action="pin" data-key="' + key + '" class="rounded-2xl bg-violet-50 py-3 text-sm font-black text-slate-800 dark:bg-slate-900 dark:text-white">' + key + "</button>").join("");
  $("pinBoxes").innerHTML = '<div id="pinDots" class="flex justify-center gap-2">' + dots + '</div><div class="mt-4 grid grid-cols-3 gap-2">' + keys + "</div>";
}

function pressPin(key) {
  if (key === "지움") state.pin = state.pin.slice(0, -1);
  else if (key === "확인") checkPin();
  else if (state.pin.length < 4) state.pin += String(key);
  if (state.pin.length === 4 && key !== "확인") checkPin();
  else renderPin();
}

function checkPin() {
  if (state.pin === "1234") {
    state.parentUnlocked = true;
    closePin();
    toast("학부모 모드가 열렸어요.");
    setTab("parents");
    return;
  }
  $("pinError").classList.remove("hidden");
  const dots = $("pinDots");
  if (dots) {
    dots.classList.add("shake");
    setTimeout(() => dots.classList.remove("shake"), 400);
  }
  state.pin = "";
  renderPin();
}

function findBook(id) { return state.books.find((book) => book.id === id); }

function ensurePages(book) {
  if (book.pages) return book;
  if (book.id === "space") {
    book.art = "space";
    book.pages = spaceStory();
    return book;
  }
  const key = book.art && STORIES[book.art] ? book.art : "pigs";
  book.pages = clonePages(key, state.level);
  return book;
}

function openPublish(id) {
  const book = ensurePages(findBook(id));
  state.publishId = id;
  $("pubTitle").textContent = book.title;
  $("pubAuthor").textContent = "저자: " + state.nickname;
  $("pubDesc").textContent = book.kr + " · " + book.note;
  $("bookCover").style.background = book.cover;
  $("bookCover").innerHTML = '<span class="text-5xl">' + book.emoji + '</span><span class="mt-3 text-lg font-black leading-tight text-white">' + esc(book.title) + "</span>";
  $("modalPublish").classList.remove("hidden");
  $("modalPublish").classList.add("flex");
}

function closePublish() {
  $("modalPublish").classList.add("hidden");
  $("modalPublish").classList.remove("flex");
}

function asciiLine(text) {
  return text.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

function downloadPdf(book) {
  const lines = [asciiLine(book.title) || "StoryLoom"];
  book.pages.forEach((page, index) => {
    const sentence = asciiLine(plainLine(page.en));
    const chunk = "Page " + (index + 1) + ": " + sentence;
    for (let i = 0; i < chunk.length; i += 70) lines.push(chunk.slice(i, i + 70));
  });
  lines.push("Made with StoryLoom");
  const escaped = lines.map((line) => "(" + line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)") + ") Tj");
  let stream = "BT /F1 16 Tf 50 760 Td " + escaped[0] + " ";
  for (let i = 1; i < escaped.length; i += 1) stream += "/F1 12 Tf 0 -22 Td " + escaped[i] + " ";
  stream += "ET";
  const objects = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n");
  objects.push("4 0 obj << /Length " + stream.length + " >> stream\n" + stream + "\nendstream\nendobj\n");
  objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n");
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += obj;
  });
  const xref = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i += 1) pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer << /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
  const blob = new Blob([pdf], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = (book.title || "storyloom").replace(/\s+/g, "-") + ".pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}

function burst() {
  const icons = ["🎉", "✨", "💖", "🌟", "🎈", "🐰", "⭐"];
  for (let i = 0; i < 26; i += 1) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    bit.textContent = icons[i % icons.length];
    bit.style.left = (Math.random() * 100) + "vw";
    bit.style.animationDelay = (Math.random() * 0.25) + "s";
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 1700);
  }
}

function saveWord(data) {
  const key = data.word.toLowerCase();
  if (state.vocab.some((item) => item.word.toLowerCase() === key)) {
    toast("이미 마법 단어장에 있는 단어예요.");
    return;
  }
  state.vocab.unshift({ word: data.word, meaning: data.meaning, pron: data.pron, example: data.example, from: state.story ? (state.story.kr || state.story.title) : "동화" });
  state.week[6] += 1;
  renderVocab();
  renderParents();
  toast("“" + data.word + "”를 단어장에 저장했어요.");
}

function openRelay(id) {
  const story = state.community.find((item) => item.id === id);
  state.relayId = id;
  $("relayTitle").textContent = story.title;
  $("relayAuthor").textContent = story.author + "가 시작한 이야기";
  $("relayStory").textContent = story.text;
  $("relayMore").value = "";
  $("modalRelay").classList.remove("hidden");
  $("modalRelay").classList.add("flex");
}

function closeRelay() {
  $("modalRelay").classList.add("hidden");
  $("modalRelay").classList.remove("flex");
}

function turnPage(dir) {
  if (dir < 0) {
    if (currentPage > 0) {
      currentPage--;
      updateUI();
    }
    return;
  }
  if (currentPage < storyPages.length - 1) {
    currentPage++;
    updateUI();
  }
}

function applyNickname(raw) {
  const cleaned = String(raw || "").replace(/\s+/g, " ").trim().slice(0, 12);
  state.nickname = cleaned || "꼬마 작가님";
  try { localStorage.setItem("storyloom-nickname", state.nickname); } catch (err) { /* 저장소 없이 이번 화면만 유지 */ }
  $("greetTitle").textContent = "안녕, " + state.nickname + "! ✨";
  $("libraryAuthor").textContent = "저자: " + state.nickname;
  $("parentTitle").textContent = state.nickname + "의 학습 리포트";
  if ($("pubAuthor")) $("pubAuthor").textContent = "저자: " + state.nickname;
}

function openNameModal(isFirst) {
  state.nameFirst = isFirst;
  $("nameTitle").textContent = isFirst ? "안녕! 너의 닉네임(이름)을 입력해 줘! 🎨" : "이름을 바꿀까요?";
  $("nameHelp").textContent = isFirst ? "동화책 표지와 학습 리포트에 네 이름이 들어가요." : "비워 두면 꼬마 작가님으로 남아요.";
  $("nameStart").textContent = isFirst ? "시작하기" : "이렇게 바꿀게요";
  $("nameCancel").classList.toggle("hidden", isFirst);
  $("nameInput").value = isFirst ? "" : (state.nickname === "꼬마 작가님" ? "" : state.nickname);
  $("modalName").classList.remove("hidden");
  $("modalName").classList.add("flex");
  setTimeout(() => $("nameInput").focus(), 30);
}

function closeNameModal() {
  $("modalName").classList.add("hidden");
  $("modalName").classList.remove("flex");
}

function syncThemeButton() {
  const isDark = document.documentElement.classList.contains("dark");
  const btn = $("themeBtn");
  btn.textContent = isDark ? "☀️ 낮모드" : "🌙 밤모드";
  btn.setAttribute("aria-pressed", String(isDark));
  btn.setAttribute("aria-label", isDark ? "낮모드로 전환" : "밤모드로 전환");
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  try { localStorage.setItem("storyloom-theme", isDark ? "dark" : "light"); } catch (err) { /* 파일로 열 때 저장이 막힐 수 있음 */ }
  syncThemeButton();
  renderCharacter();
}

document.body.addEventListener("mouseover", (event) => {
  const word = event.target.closest("[data-action='word']");
  if (word) showTooltip(word);
});

document.body.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) {
    if (!event.target.closest("#tooltip")) hideTooltip();
    return;
  }
  const action = el.dataset.action;
  if (action === "tab") setTab(el.dataset.tab);
  if (action === "character" && CHARACTERS[el.dataset.id]) {
    state.character = el.dataset.id;
    renderCharacter();
    toast(CHARACTERS[state.character].name + "와 이야기를 시작해요.");
  }
  if (action === "level") {
    state.level = el.dataset.level;
    renderLevel();
    toast(LEVELS[state.level].label + " 난이도로 바꿨어요.");
  }
  if (action === "template") {
    state.template = el.dataset.tpl;
    renderComposer();
    resetStoryBook(el.dataset.tpl);
  }
  if (action === "choice") {
    $("relayInput").value = el.dataset.choice;
    $("relayInput").focus();
  }
  if (action === "scroll-create") $("composer").scrollIntoView({ behavior: "smooth", block: "center" });
  if (action === "word") {
    event.stopPropagation();
    showTooltip(el);
  }
  if (action === "speak") {
    event.stopPropagation();
    speak(el.dataset.speak, el);
  }
  if (action === "save-word") {
    event.stopPropagation();
    saveWord(el.dataset);
    hideTooltip();
  }
  if (action === "publish") openPublish(el.dataset.id);
  if (action === "close-publish") closePublish();
  if (action === "open-relay") openRelay(el.dataset.id);
  if (action === "close-relay") closeRelay();
  if (action === "pin") pressPin(el.dataset.key);
});

function showStoryLoading() {
  const picture = state.templateImage || (CLASSIC_STORIES[state.template] && CLASSIC_STORIES[state.template].image) || "images/three_pigs.png";
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  $("plainStory").innerHTML = '<p class="text-lg font-black text-violet-600 dark:text-white">AI가 동화를 쓰는 중... 🎨</p>';
  $("flipPage").innerHTML = '<p class="text-lg font-black text-violet-600 dark:text-white">AI가 동화를 쓰는 중... 🎨</p>';
  $("storybook-image").src = picture;
  $("storybook-image").alt = (CLASSIC_STORIES[state.template] && CLASSIC_STORIES[state.template].title) || "동화를 준비하는 중";
  $("flipWrap").scrollIntoView({ behavior: "smooth", block: "center" });
}

function parseGeminiJson(raw) {
  const cleaned = String(raw || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end < start) throw new Error("JSON 없음");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

async function callGemini(url, prompt) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (parseErr) {
      errorData = { error: { message: "HTTP " + response.status } };
    }
    console.error("Gemini API 호출 실패 상세원인:", errorData);
    const errMessage = (errorData.error && errorData.error.message) || JSON.stringify(errorData);
    throw new Error(errMessage);
  }
  const data = await response.json();
  const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
  return parseGeminiJson(text);
}

function templateFallback(userInput) {
  const key = CLASSIC_STORIES[state.template] ? state.template : "pigs";
  const data = CLASSIC_STORIES[key];
  const word = String(userInput || "").trim() || data.title;
  const lines = {
    pigs: {
      story_en: "The three little pigs found " + word + " and built a safe, happy home.",
      story_ko: "아기돼지 삼형제가 " + word + "을(를) 발견하고 안전한 집을 지었어요."
    },
    alice: {
      story_en: "Alice opened " + word + " and discovered a magical garden.",
      story_ko: "앨리스가 " + word + "을(를) 열고 신비한 정원을 발견했어요."
    },
    redhood: {
      story_en: "Little Red Riding Hood carried " + word + " through the forest to visit her grandmother.",
      story_ko: "빨간 모자가 할머니를 만나러 숲을 지나며 " + word + "을(를) 들고 갔어요."
    },
    goose: {
      story_en: "A kind boy shared " + word + ", and the golden goose brought happiness to the kingdom.",
      story_ko: "착한 소년이 " + word + "을(를) 나누자, 황금거위가 왕국에 행복을 가져다주었어요."
    }
  };
  return {
    story_en: lines[key].story_en,
    story_ko: lines[key].story_ko,
    image: data.image,
    words: []
  };
}

function sampleGeminiStory(userInput) {
  return templateFallback(userInput);
}

async function requestGeminiStory(idea, mode) {
  const userInput = String(idea || "").trim() || "a candy house";
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const promptText = mode === "classic"
    ? `Write exactly one new sentence of a children's fairy tale about "${userInput}". Make it original for young readers. Return strictly JSON format:
   {
 "story_en": "One English sentence for children about ${userInput}",
 "story_ko": "Korean translation of the story",
 "words": [{"word":"rabbit","meaning":"토끼","pron":"/RAB-it/"}]
   }
   words must list 3 to 6 important words from story_en with a Korean meaning and pronunciation. Skip a, the, and, to, of.`
    : `Write exactly one new sentence of a children's fairy tale.
The story is "${selected.title}" (${tpl.title}).
Use the child's idea naturally: "${userInput}".
Stay with this story's characters and setting.
Return strictly JSON format:
   {
 "story_en": "One English sentence in the ${selected.title} story that includes ${userInput}",
 "story_ko": "Korean translation of the story",
 "words": [{"word":"door","meaning":"문","pron":"/dor/"}]
   }
   words must list 3 to 6 important words from story_en with a Korean meaning and pronunciation. Skip a, the, and, to, of.`;
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY가 비어 있습니다. config.js를 확인해 주세요.");
  const urls = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  ];
  for (let i = 0; i < urls.length; i++) {
    try {
      return await callGemini(urls[i], promptText);
    } catch (error) {
      console.error("Gemini 시도 실패 " + (i + 1) + ":", error && error.message ? error.message : error);
    }
  }
  if (mode === "classic") throw new Error("Gemini 연결 실패");
  return templateFallback(userInput);
}

function glossesFrom(payload) {
  const list = [];
  const raw = payload && payload.words;
  if (!Array.isArray(raw)) return list;
  raw.forEach((item) => {
    if (!item) return;
    const word = item.word || item.text;
    if (!word) return;
    list.push({
      word: String(word),
      meaning: item.meaning || item.ko || "",
      pron: item.pron || item.pronunciation || "",
      example: item.example || ""
    });
  });
  return list;
}

function storyFromGemini(payload, imageOverride) {
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  const english = String(payload.story_en || "").trim().split(/\n+/).filter(Boolean).slice(0, 2).join(" ");
  const image = imageOverride || state.templateImage || selected.image;
  state.templateImage = image;
  return {
    id: "gemini-" + Date.now(),
    title: selected.title || tpl.en,
    kr: tpl.title,
    emoji: tpl.emoji,
    cover: tpl.cover,
    art: tpl.art,
    image: image,
    note: "AI가 만든 이야기",
    pages: [{ en: sentenceToTokens(english, glossesFrom(payload)), kr: String(payload.story_ko || "").trim() }],
    published: false,
    level: state.level
  };
}

$("generateBtn").addEventListener("click", async () => {
  const button = $("generateBtn");
  if (button.disabled) return;
  if (!getGeminiApiKey()) {
    toast("GEMINI_API_KEY가 비어 있습니다. .env와 config.js를 확인해 주세요.");
    return;
  }
  const userInput = $("relayInput").value.trim();
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  currentTemplateImage = selected.image;
  state.templateImage = selected.image;
  button.disabled = true;
  showStoryLoading();
  try {
    const payload = await requestGeminiStory(userInput, "compose");
    const story = storyFromGemini(payload, selected.image);
    const page = story.pages[0];
    appendStoryPage({
      scene: state.storyPages.length + 1,
      text_en: plainLine(page.en),
      text_ko: page.kr,
      image: selected.image,
      en: page.en,
      kr: page.kr
    });
    toast("AI 동화가 완성됐어요. 책장을 넘겨 보세요.");
  } catch (error) {
    console.error("Gemini 호출 오류:", error);
    const story = storyFromGemini(templateFallback(userInput), selected.image);
    const page = story.pages[0];
    appendStoryPage({
      scene: state.storyPages.length + 1,
      text_en: plainLine(page.en),
      text_ko: page.kr,
      image: selected.image,
      en: page.en,
      kr: page.kr
    });
  } finally {
    button.disabled = false;
  }
});
$("transToggle").addEventListener("click", () => {
  state.showTranslation = !state.showTranslation;
  updateUI();
});
$("prevPage").addEventListener("click", () => turnPage(-1));
$("nextPage").addEventListener("click", () => turnPage(1));
$("listenBtn").addEventListener("click", () => {
  if (!storyPages.length) return;
  speak(plainLine(storyPages[currentPage].en), $("listenBtn"));
});
$("saveBookBtn").addEventListener("click", () => {
  if (!state.story) return;
  if (!state.books.some((book) => book.id === state.story.id)) {
    state.books.unshift({ id: state.story.id, title: state.story.title, kr: state.story.kr, emoji: state.story.emoji, cover: state.story.cover, note: "내 서재", pages: state.story.pages, published: false, art: state.story.art });
  }
  toast("서재 책장에 올려 두었어요.");
  shelfBooks();
});
$("downloadBtn").addEventListener("click", () => {
  downloadPdf(ensurePages(findBook(state.publishId)));
  toast("영어 동화 PDF를 내려받았어요.");
});
$("shareBtn").addEventListener("click", async () => {
  const book = ensurePages(findBook(state.publishId));
  const message = "StoryLoom에서 만든 영어 동화 “" + book.title + "”를 같이 읽어요!\n" + plainLine(book.pages[0].en);
  try {
    await navigator.clipboard.writeText(message);
    toast("공유 문구를 복사했어요. SNS에 붙여 넣으세요.");
  } catch (err) {
    toast("공유 문구를 준비했어요.");
  }
});
$("cheerBtn").addEventListener("click", () => {
  const book = findBook(state.publishId);
  book.published = true;
  book.note = "출판 완료";
  burst();
  renderParents();
  shelfBooks();
  toast("와! 나만의 영어 동화책이 출판됐어요.");
});
$("relaySubmit").addEventListener("click", () => {
  const line = $("relayMore").value.trim();
  if (!line) {
    toast("이어 쓸 문장을 한 줄 적어 주세요.");
    return;
  }
  const story = state.community.find((item) => item.id === state.relayId);
  story.text += " " + line;
  renderCommunity();
  $("relayStory").textContent = story.text;
  $("relayMore").value = "";
  toast("친구 이야기의 다음 장면이 이어졌어요.");
});
$("pinCancel").addEventListener("click", () => {
  closePin();
  setTab(state.prevTab || "create");
});
$("themeBtn").addEventListener("click", toggleTheme);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideTooltip();
    closePublish();
    closeRelay();
    if (!state.nameFirst) closeNameModal();
  }
  const typing = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
  if (!typing && !$("flipWrap").classList.contains("hidden")) {
    if (event.key === "ArrowRight") turnPage(1);
    if (event.key === "ArrowLeft") turnPage(-1);
  }
});

state.nickname = "꼬마 작가님";
state.nameFirst = true;
try {
  const savedName = localStorage.getItem("storyloom-nickname");
  if (savedName) applyNickname(savedName);
  else openNameModal(true);
} catch (err) {
  openNameModal(true);
}

$("nameStart").addEventListener("click", () => {
  applyNickname($("nameInput").value);
  closeNameModal();
  toast(state.nickname + " 작가님, 동화를 시작해요!");
});
$("nameCancel").addEventListener("click", closeNameModal);
$("nameInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") $("nameStart").click();
});
$("renameBtn").addEventListener("click", () => openNameModal(false));

document.documentElement.classList.remove("dark");
try { localStorage.removeItem("storyloom-theme"); } catch (err) { /* 저장된 밤 모드가 화면을 고정하지 않게 함 */ }
syncThemeButton();

const DEFAULT_PROFILE_IMAGE = "images/fairy.png";
const PROFILE_IMAGE_KEY = "customProfileImage";
const PROFILE_STYLE_KEY = "customProfileStyle";
const DEFAULT_PROFILE_STYLE = { scale: 1, x: 0, y: 0 };

const profileEdit = {
  src: "",
  scale: 1,
  x: 0,
  y: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0
};

function readProfileStyle() {
  try {
    const raw = localStorage.getItem(PROFILE_STYLE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE_STYLE };
    const parsed = JSON.parse(raw);
    return {
      scale: Math.min(3, Math.max(1, Number(parsed.scale) || 1)),
      x: Number(parsed.x) || 0,
      y: Number(parsed.y) || 0
    };
  } catch (err) {
    return { ...DEFAULT_PROFILE_STYLE };
  }
}

function profileTransformCss(style) {
  const scale = style && style.scale ? style.scale : 1;
  const x = style && style.x ? style.x : 0;
  const y = style && style.y ? style.y : 0;
  return "translate(-50%, -50%) translate(" + x + "px, " + y + "px) scale(" + scale + ")";
}

function applyProfileTransform(img, style) {
  if (!img) return;
  img.style.transformOrigin = "center center";
  if (img.id === "profile-edit-preview") {
    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = profileTransformCss(style);
  } else {
    img.style.transform = "translate(" + (style.x || 0) + "px, " + (style.y || 0) + "px) scale(" + (style.scale || 1) + ")";
  }
}

function applyProfileImage(src, style) {
  const photo = $("profile-photo");
  if (!photo) return;
  photo.src = src || DEFAULT_PROFILE_IMAGE;
  applyProfileTransform(photo, style || (src && src !== DEFAULT_PROFILE_IMAGE ? readProfileStyle() : DEFAULT_PROFILE_STYLE));
}

function loadSavedProfileImage() {
  try {
    const saved = localStorage.getItem(PROFILE_IMAGE_KEY);
    if (saved) {
      applyProfileImage(saved, readProfileStyle());
    } else {
      applyProfileImage(DEFAULT_PROFILE_IMAGE, DEFAULT_PROFILE_STYLE);
    }
  } catch (err) {
    applyProfileImage(DEFAULT_PROFILE_IMAGE, DEFAULT_PROFILE_STYLE);
  }
}

function openProfileModal() {
  const modal = $("modalProfile");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeProfileModal() {
  const modal = $("modalProfile");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function openProfileEditModal(src) {
  profileEdit.src = src;
  profileEdit.scale = 1;
  profileEdit.x = 0;
  profileEdit.y = 0;
  const preview = $("profile-edit-preview");
  const zoom = $("zoom-range");
  const modal = $("modalProfileEdit");
  if (!preview || !zoom || !modal) return;
  preview.src = src;
  zoom.value = "100";
  applyProfileTransform(preview, profileEdit);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeProfileEditModal() {
  const modal = $("modalProfileEdit");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  profileEdit.dragging = false;
}

function refreshProfileEditPreview() {
  applyProfileTransform($("profile-edit-preview"), profileEdit);
  const zoom = $("zoom-range");
  if (zoom) zoom.value = String(Math.round(profileEdit.scale * 100));
}

function resetProfileImage() {
  try {
    localStorage.removeItem(PROFILE_IMAGE_KEY);
    localStorage.removeItem(PROFILE_STYLE_KEY);
  } catch (err) { /* 저장소 없이 화면만 기본으로 */ }
  applyProfileImage(DEFAULT_PROFILE_IMAGE, DEFAULT_PROFILE_STYLE);
  toast("기본 요정 이미지로 바꿨어요.");
}

function saveProfileEdit() {
  if (!profileEdit.src) return;
  const style = {
    scale: profileEdit.scale,
    x: profileEdit.x,
    y: profileEdit.y
  };
  try {
    localStorage.setItem(PROFILE_IMAGE_KEY, profileEdit.src);
    localStorage.setItem(PROFILE_STYLE_KEY, JSON.stringify(style));
  } catch (err) {
    toast("프로필 사진을 저장하지 못했어요. 용량이 큰 이미지는 줄여 주세요.");
    return;
  }
  applyProfileImage(profileEdit.src, style);
  closeProfileEditModal();
  toast("프로필 사진을 저장했어요.");
}

function initProfilePhotoUpload() {
  const btn = $("profile-photo-btn");
  const input = $("profile-upload");
  const modal = $("modalProfile");
  const chooseBtn = $("profile-choose");
  const resetBtn = $("profile-reset");
  const cancelBtn = $("profile-cancel");
  const editModal = $("modalProfileEdit");
  const zoom = $("zoom-range");
  const frame = $("profile-edit-frame");
  const saveBtn = $("profile-edit-save");
  const cancelEditBtn = $("profile-edit-cancel");
  const defaultPosBtn = $("profile-edit-default");
  if (!btn || !input || !modal || !chooseBtn || !resetBtn || !cancelBtn || !editModal || !zoom || !frame) return;

  btn.addEventListener("click", openProfileModal);

  chooseBtn.addEventListener("click", () => {
    closeProfileModal();
    input.click();
  });

  resetBtn.addEventListener("click", () => {
    resetProfileImage();
    closeProfileModal();
  });

  cancelBtn.addEventListener("click", closeProfileModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeProfileModal();
  });

  editModal.addEventListener("click", (event) => {
    if (event.target === editModal) closeProfileEditModal();
  });

  zoom.addEventListener("input", () => {
    profileEdit.scale = Math.min(3, Math.max(1, Number(zoom.value) / 100));
    refreshProfileEditPreview();
  });

  $("profile-move-up").addEventListener("click", () => {
    profileEdit.y -= 8;
    refreshProfileEditPreview();
  });
  $("profile-move-down").addEventListener("click", () => {
    profileEdit.y += 8;
    refreshProfileEditPreview();
  });
  $("profile-move-left").addEventListener("click", () => {
    profileEdit.x -= 8;
    refreshProfileEditPreview();
  });
  $("profile-move-right").addEventListener("click", () => {
    profileEdit.x += 8;
    refreshProfileEditPreview();
  });

  defaultPosBtn.addEventListener("click", () => {
    profileEdit.scale = 1;
    profileEdit.x = 0;
    profileEdit.y = 0;
    refreshProfileEditPreview();
  });

  saveBtn.addEventListener("click", saveProfileEdit);
  cancelEditBtn.addEventListener("click", closeProfileEditModal);

  frame.addEventListener("pointerdown", (event) => {
    profileEdit.dragging = true;
    profileEdit.startX = event.clientX;
    profileEdit.startY = event.clientY;
    profileEdit.originX = profileEdit.x;
    profileEdit.originY = profileEdit.y;
    frame.setPointerCapture(event.pointerId);
  });
  frame.addEventListener("pointermove", (event) => {
    if (!profileEdit.dragging) return;
    profileEdit.x = profileEdit.originX + (event.clientX - profileEdit.startX);
    profileEdit.y = profileEdit.originY + (event.clientY - profileEdit.startY);
    refreshProfileEditPreview();
  });
  frame.addEventListener("pointerup", () => { profileEdit.dragging = false; });
  frame.addEventListener("pointercancel", () => { profileEdit.dragging = false; });

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file || !file.type.startsWith("image/")) {
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl) return;
      openProfileEditModal(dataUrl);
    };
    reader.readAsDataURL(file);
    input.value = "";
  });
}

function bootProfilePhoto() {
  loadSavedProfileImage();
  initProfilePhotoUpload();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootProfilePhoto);
} else {
  bootProfilePhoto();
}

renderCharacter();
renderLevel();
renderComposer();
updateUI();
renderVocab();
shelfBooks();
renderParents();
renderCommunity();
