function getGroqApiKey() {
  const raw =
    (window.__ENV__ && window.__ENV__.GROQ_API_KEY) ||
    (window.CONFIG && window.CONFIG.GROQ_API_KEY) ||
    window.GROQ_API_KEY ||
    "";
  const key = String(raw || "").trim();
  if (!key || key.indexOf("여기에_발급받은") === 0 || key.indexOf("gsk_") !== 0) {
    console.error("API Key null/undefined");
    console.error("Groq API 키가 유효하지 않습니다. gsk_로 시작하는 키를 확인하세요.");
    return "";
  }
  return key;
}

function requireGroqApiKey() {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    console.error("API Key null/undefined");
    alert("API 키 설정 확인 필요");
    return "";
  }
  return apiKey;
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
  pigs: { title: "아기돼지 삼형제", en: "Three Little Pigs", art: "pigs", cover: "linear-gradient(160deg,#ff9eb5,#ffd0a8)", emoji: "🐷", madlib: "Once upon a time, three little pigs built a [ house ] made of [ bricks ].", madlibKo: "옛날 옛적에 아기돼지 삼형제가 ( 집 )을 ( 벽돌 )로 지었어요.", choices: ["a hidden trail", "a mysterious box", "a friendly bird"] },
  alice: { title: "이상한 나라의 앨리스", en: "Alice in Wonderland", art: "alice", cover: "linear-gradient(160deg,#c4b5fd,#f9a8d4)", emoji: "🐇", madlib: "Alice followed the [ white rabbit ] down into a [ wonderland ].", madlibKo: "앨리스는 ( 하얀 토끼 )를 따라 ( 이상한 나라 )로 내려갔어요.", choices: ["a talking flower", "a tiny door", "a tea party"] },
  redhood: { title: "빨간 모자", en: "Little Red Riding Hood", art: "redhood", cover: "linear-gradient(160deg,#86efac,#fde68a)", emoji: "🧺", madlib: "Little Red Riding Hood walked through the [ forest ] with a [ basket ].", madlibKo: "빨간 모자는 ( 바구니 )를 들고 ( 숲 )속을 걸어갔어요.", choices: ["fresh apples", "a kind wolf", "a map of stars"] },
  goose: { title: "황금거위", en: "Golden Goose", art: "goose", cover: "linear-gradient(160deg,#fde68a,#fdba74)", emoji: "🪿", madlib: "A kind child shared bread and found a [ golden goose ].", madlibKo: "착한 아이는 빵을 나누어 주고 ( 황금거위 )를 발견했어요.", choices: ["a golden feather", "a warm pie", "a new friend"] }
};

const CLASSIC_STORIES = {
  pigs: {
    title: "Three Little Pigs",
    story_en: "Once upon a time, three little pigs built houses of straw, sticks, and bricks to stay safe.",
    story_ko: "옛날 옛적에, 아기돼지 삼형제가 안전하게 살기 위해 짚, 나무, 벽돌로 집을 지었어요.",
    image: "images/three_pigs.png",
    words: [
      { word: "pigs", meaning: "돼지들", pron: "/pigz/" },
      { word: "built", meaning: "지었어요", pron: "/bilt/" },
      { word: "houses", meaning: "집들", pron: "/HOW-ziz/" },
      { word: "straw", meaning: "짚", pron: "/straw/" },
      { word: "sticks", meaning: "나뭇가지", pron: "/stiks/" },
      { word: "bricks", meaning: "벽돌", pron: "/briks/" },
      { word: "safe", meaning: "안전한", pron: "/sayf/" }
    ]
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

function makeOpeningPage(key) {
  const data = CLASSIC_STORIES[key];
  if (!data) return null;
  return {
    scene: 1,
    text_en: data.story_en,
    text_ko: data.story_ko,
    image: data.image,
    en: sentenceToTokens(data.story_en, data.words || []),
    kr: data.story_ko,
    isOpening: true
  };
}

function seedClassicSceneOne(key) {
  const storyKey = CLASSIC_STORIES[key] ? key : "pigs";
  const data = CLASSIC_STORIES[storyKey];
  const tpl = TEMPLATES[storyKey];
  if (!data || !tpl) return false;
  const opening = makeOpeningPage(storyKey);
  if (!opening) return false;
  storyPages.length = 0;
  storyPages.push(opening);
  currentPage = 0;
  currentTemplateImage = data.image;
  state.template = storyKey;
  state.templateImage = data.image;
  // 템플릿/새 동화 시작: 서재 원본과 분리 (나중에 같은 제목이면 (2)(3)으로 새 책 저장)
  state.activeBookId = null;
  state.story = {
    id: "classic-" + storyKey,
    libraryId: null,
    activeBookId: null,
    templateKey: storyKey,
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
  state.storyPages = storyPages;
  return true;
}

function ensureClassicOpeningPage() {
  const key = CLASSIC_STORIES[state.template] ? state.template : "pigs";
  if (!storyPages.length) {
    seedClassicSceneOne(key);
    return;
  }
  if (!storyPages[0].isOpening) {
    const opening = makeOpeningPage(key);
    if (!opening) return;
    storyPages.unshift(opening);
    storyPages.forEach((page, index) => { page.scene = index + 1; });
    currentTemplateImage = opening.image;
    state.templateImage = opening.image;
    if (state.story) {
      state.story.pages = storyPages;
      state.story.image = opening.image;
      state.story.templateKey = key;
    }
  }
}

function resetStoryBook(key) {
  const storyKey = CLASSIC_STORIES[key] ? key : null;
  if (!storyKey) return;
  const inputEl = $("relayInput") || $("user-input");
  if (inputEl) inputEl.value = "";
  seedClassicSceneOne(storyKey);
  resetRelayComposerToTemplate();
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  updateUI();
  persistActiveDraft();
  $("flipWrap").scrollIntoView({ behavior: "smooth", block: "center" });
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
  template: null,
  templateImage: "images/three_pigs.png",
  showTranslation: true,
  page: 0,
  story: null,
  activeBookId: null,
  parentUnlocked: false,
  pin: "",
  relayId: null,
  publishId: null,
  usedSuggestions: [],
  lastSuggestions: [],
  relayMadlib: null,
  relayMadlibKo: null,
  suggestionPoolCursor: 0,
  vocab: [],
  week: [0, 0, 0, 0, 0, 0, 0],
  weekStart: "",
  books: [],
  community: []
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
  three: { meaning: "세, 셋", pron: "/three/" },
  little: { meaning: "작은, 어린", pron: "/LIT-ul/" },
  pigs: { meaning: "돼지들", pron: "/pigz/" },
  pig: { meaning: "돼지", pron: "/pig/" },
  built: { meaning: "지었어요, 세웠어요", pron: "/bilt/" },
  houses: { meaning: "집들", pron: "/HOW-ziz/" },
  house: { meaning: "집", pron: "/hows/" },
  straw: { meaning: "짚, 지푸라기", pron: "/straw/" },
  sticks: { meaning: "나뭇가지, 막대기", pron: "/stiks/" },
  bricks: { meaning: "벽돌", pron: "/briks/" },
  safe: { meaning: "안전한", pron: "/sayf/" },
  alice: { meaning: "앨리스", pron: "/AL-iss/" },
  opened: { meaning: "열었어요", pron: "/OH-pend/" },
  open: { meaning: "열다, 열려 있는", pron: "/OH-pen/" },
  tiny: { meaning: "아주 작은", pron: "/TY-nee/" },
  door: { meaning: "문", pron: "/dor/" },
  discovered: { meaning: "발견했어요", pron: "/dis-KUV-erd/" },
  magical: { meaning: "마법의", pron: "/MAJ-i-kul/" },
  magic: { meaning: "마법, 마법의", pron: "/MAJ-ik/" },
  garden: { meaning: "정원", pron: "/GAR-den/" },
  followed: { meaning: "따라갔어요", pron: "/FOL-ohd/" },
  follow: { meaning: "따르다, 따라가다", pron: "/FOL-oh/" },
  white: { meaning: "하얀, 흰", pron: "/wite/" },
  rabbit: { meaning: "토끼", pron: "/RAB-it/" },
  hole: { meaning: "구멍, 굴", pron: "/hohl/" },
  wonderland: { meaning: "이상한 나라, 원더랜드", pron: "/WUN-der-land/" },
  walked: { meaning: "걸어갔어요", pron: "/wawkt/" },
  walk: { meaning: "걷다, 산책하다", pron: "/wawk/" },
  forest: { meaning: "숲", pron: "/FOR-ist/" },
  visit: { meaning: "방문하다, 만나러 가다", pron: "/VIZ-it/" },
  grandmother: { meaning: "할머니", pron: "/GRAN-muh-ther/" },
  grandma: { meaning: "할머니", pron: "/GRAN-mah/" },
  carried: { meaning: "들고 갔어요, 옮겼어요", pron: "/KAIR-eed/" },
  kind: { meaning: "착한, 친절한", pron: "/kynd/" },
  boy: { meaning: "소년, 남자아이", pron: "/boy/" },
  girl: { meaning: "소녀, 여자아이", pron: "/gurl/" },
  found: { meaning: "발견했어요, 찾았어요", pron: "/fownd/" },
  find: { meaning: "찾다, 발견하다", pron: "/fynd/" },
  golden: { meaning: "황금의, 금빛", pron: "/GOL-den/" },
  goose: { meaning: "거위", pron: "/goos/" },
  brought: { meaning: "가져다주었어요", pron: "/brawt/" },
  bring: { meaning: "가져오다", pron: "/bring/" },
  happiness: { meaning: "행복", pron: "/HAP-ee-nes/" },
  happy: { meaning: "행복한, 기쁜", pron: "/HAP-ee/" },
  kingdom: { meaning: "왕국", pron: "/KING-dum/" },
  shared: { meaning: "나눴어요, 공유했어요", pron: "/shaird/" },
  share: { meaning: "나누다, 공유하다", pron: "/shair/" },
  home: { meaning: "집, 고향", pron: "/hohm/" },
  bird: { meaning: "새", pron: "/burd/" },
  wolf: { meaning: "늑대", pron: "/woolf/" },
  map: { meaning: "지도", pron: "/map/" },
  mysterious: { meaning: "신비로운, 수수께끼 같은", pron: "/mis-TEER-ee-us/" },
  cottage: { meaning: "오두막, 작은 집", pron: "/KOT-ij/" },
  squirrel: { meaning: "다람쥐", pron: "/SKWIR-ul/" },
  friend: { meaning: "친구", pron: "/frend/" },
  friends: { meaning: "친구들", pron: "/frendz/" },
  path: { meaning: "길, 오솔길", pron: "/path/" },
  brave: { meaning: "용감한", pron: "/brayv/" },
  soft: { meaning: "부드러운", pron: "/soft/" },
  warm: { meaning: "따뜻한", pron: "/worm/" },
  glow: { meaning: "빛나다, 빛", pron: "/gloh/" },
  glowed: { meaning: "빛났어요", pron: "/glohd/" },
  suddenly: { meaning: "갑자기", pron: "/SUD-un-lee/" },
  then: { meaning: "그러자, 그때", pron: "/then/" },
  next: { meaning: "다음에, 다음의", pron: "/nekst/" },
  sun: { meaning: "해, 태양", pron: "/sun/" },
  moon: { meaning: "달", pron: "/moon/" },
  star: { meaning: "별", pron: "/star/" },
  stars: { meaning: "별들", pron: "/starz/" },
  as: { meaning: "~할 때, ~하면서", pron: "/az/" },
  once: { meaning: "한번, 옛날에", pron: "/wuns/" },
  upon: { meaning: "~위에, ~하자마자", pron: "/uh-PON/" },
  time: { meaning: "시간, 때", pron: "/tyme/" },
  red: { meaning: "빨간, 붉은", pron: "/red/" },
  riding: { meaning: "타고 가는, 승마의", pron: "/RY-ding/" },
  hood: { meaning: "후드, 모자", pron: "/hood/" },
  through: { meaning: "~을 통과하여, ~을 지나", pron: "/throo/" },
  her: { meaning: "그녀의, 그녀를", pron: "/hur/" },
  his: { meaning: "그의", pron: "/hiz/" },
  a: { meaning: "하나의, ~라는 (관사)", pron: "/uh/" },
  an: { meaning: "하나의 (모음 앞 관사)", pron: "/an/" },
  the: { meaning: "그, 그 특정한 (관사)", pron: "/thuh/" },
  and: { meaning: "그리고, ~와", pron: "/and/" },
  or: { meaning: "또는, ~이나", pron: "/or/" },
  to: { meaning: "~로, ~하기 위해", pron: "/too/" },
  of: { meaning: "~의", pron: "/uv/" },
  in: { meaning: "~안에, ~에서", pron: "/in/" },
  on: { meaning: "~위에, ~에", pron: "/on/" },
  for: { meaning: "~을 위해, ~동안", pron: "/for/" },
  with: { meaning: "~와 함께, ~으로", pron: "/with/" },
  into: { meaning: "~안으로", pron: "/IN-too/" },
  down: { meaning: "아래로, 아래로의", pron: "/down/" },
  up: { meaning: "위로, 올라가서", pron: "/up/" },
  out: { meaning: "밖으로", pron: "/owt/" },
  at: { meaning: "~에, ~에서", pron: "/at/" },
  by: { meaning: "~옆에, ~에 의해", pron: "/by/" },
  from: { meaning: "~로부터", pron: "/frum/" },
  but: { meaning: "그러나, 하지만", pron: "/but/" },
  so: { meaning: "그래서, 매우", pron: "/soh/" },
  if: { meaning: "만약 ~라면", pron: "/if/" },
  when: { meaning: "~할 때, 언제", pron: "/wen/" },
  where: { meaning: "~한 곳에, 어디에", pron: "/wair/" },
  who: { meaning: "누가, ~하는 사람", pron: "/hoo/" },
  what: { meaning: "무엇, 무슨", pron: "/wut/" },
  why: { meaning: "왜", pron: "/wy/" },
  how: { meaning: "어떻게", pron: "/how/" },
  was: { meaning: "~였다, ~이었다 (과거)", pron: "/wuz/" },
  were: { meaning: "~였다 (복수/과거)", pron: "/wur/" },
  is: { meaning: "~이다", pron: "/iz/" },
  are: { meaning: "~이다 (복수)", pron: "/ar/" },
  be: { meaning: "~이다, ~되다", pron: "/bee/" },
  been: { meaning: "~이었던 (완료)", pron: "/bin/" },
  have: { meaning: "가지다, ~했다", pron: "/hav/" },
  has: { meaning: "가지고 있다", pron: "/haz/" },
  had: { meaning: "가졌다, ~했었다", pron: "/had/" },
  not: { meaning: "~아니다, ~않다", pron: "/not/" },
  no: { meaning: "아니다, 없는", pron: "/noh/" },
  yes: { meaning: "네, 예", pron: "/yes/" },
  very: { meaning: "매우, 아주", pron: "/VER-ee/" },
  too: { meaning: "너무, 또한", pron: "/too/" },
  also: { meaning: "또한, 역시", pron: "/AWL-soh/" },
  just: { meaning: "바로, 단지", pron: "/just/" },
  only: { meaning: "오직, 단지", pron: "/OHN-lee/" },
  all: { meaning: "모든, 전부", pron: "/awl/" },
  some: { meaning: "어떤, 몇몇의", pron: "/sum/" },
  any: { meaning: "어떤, 아무런", pron: "/EN-ee/" },
  there: { meaning: "거기, 그곳에", pron: "/thair/" },
  here: { meaning: "여기, 이곳에", pron: "/heer/" },
  now: { meaning: "지금", pron: "/now/" },
  soon: { meaning: "곧, 머지않아", pron: "/soon/" },
  big: { meaning: "큰", pron: "/big/" },
  small: { meaning: "작은", pron: "/smawl/" },
  new: { meaning: "새로운", pron: "/noo/" },
  old: { meaning: "오래된, 늙은", pron: "/ohld/" },
  good: { meaning: "좋은", pron: "/good/" },
  bad: { meaning: "나쁜", pron: "/bad/" },
  long: { meaning: "긴, 오래", pron: "/lawng/" },
  short: { meaning: "짧은", pron: "/short/" },
  beautiful: { meaning: "아름다운", pron: "/BYOO-ti-ful/" },
  dark: { meaning: "어두운", pron: "/dark/" },
  light: { meaning: "빛, 가벼운, 밝은", pron: "/lyte/" },
  night: { meaning: "밤", pron: "/nite/" },
  day: { meaning: "낮, 하루", pron: "/day/" },
  morning: { meaning: "아침", pron: "/MOR-ning/" },
  evening: { meaning: "저녁", pron: "/EEV-ning/" },
  came: { meaning: "왔어요", pron: "/kaym/" },
  come: { meaning: "오다", pron: "/kum/" },
  went: { meaning: "갔어요", pron: "/went/" },
  go: { meaning: "가다", pron: "/goh/" },
  see: { meaning: "보다", pron: "/see/" },
  saw: { meaning: "봤어요", pron: "/saw/" },
  look: { meaning: "보다, 살펴보다", pron: "/look/" },
  looked: { meaning: "봤어요, 살펴봤어요", pron: "/lookt/" },
  said: { meaning: "말했어요", pron: "/sed/" },
  say: { meaning: "말하다", pron: "/say/" },
  tell: { meaning: "말하다, 이야기하다", pron: "/tel/" },
  asked: { meaning: "물었어요", pron: "/askt/" },
  ran: { meaning: "달렸어요", pron: "/ran/" },
  run: { meaning: "달리다", pron: "/run/" },
  jumped: { meaning: "뛰었어요", pron: "/jumpt/" },
  lived: { meaning: "살았어요", pron: "/livd/" },
  live: { meaning: "살다, 살다", pron: "/liv/" },
  made: { meaning: "만들었어요", pron: "/mayd/" },
  make: { meaning: "만들다", pron: "/mayk/" },
  took: { meaning: "가져갔어요, 데려갔어요", pron: "/took/" },
  take: { meaning: "가져가다, 데려가다", pron: "/tayk/" },
  gave: { meaning: "주었어요", pron: "/gayv/" },
  give: { meaning: "주다", pron: "/giv/" },
  put: { meaning: "놓다, 두다", pron: "/put/" },
  help: { meaning: "돕다, 도움", pron: "/help/" },
  helped: { meaning: "도와주었어요", pron: "/helpt/" },
  love: { meaning: "사랑하다, 좋아하다", pron: "/luv/" },
  like: { meaning: "좋아하다, ~처럼", pron: "/lyke/" },
  want: { meaning: "원하다", pron: "/wont/" },
  need: { meaning: "필요하다", pron: "/need/" },
  can: { meaning: "~할 수 있다", pron: "/kan/" },
  could: { meaning: "~할 수 있었다", pron: "/kood/" },
  will: { meaning: "~할 것이다", pron: "/wil/" },
  would: { meaning: "~할 것이다/했을 것이다", pron: "/wood/" },
  should: { meaning: "~해야 한다", pron: "/shood/" },
  must: { meaning: "~해야 한다, 틀림없이", pron: "/must/" },
  secret: { meaning: "비밀, 비밀의", pron: "/SEE-krit/" },
  lantern: { meaning: "랜턴, 등불", pron: "/LAN-tern/" },
  trail: { meaning: "오솔길, 흔적", pron: "/trayl/" },
  box: { meaning: "상자", pron: "/boks/" },
  noise: { meaning: "소리, 소음", pron: "/noyz/" },
  bridge: { meaning: "다리", pron: "/brij/" },
  tree: { meaning: "나무", pron: "/tree/" },
  boat: { meaning: "배", pron: "/boht/" },
  river: { meaning: "강", pron: "/RIV-er/" },
  mountain: { meaning: "산", pron: "/MOWN-tun/" },
  village: { meaning: "마을", pron: "/VIL-ij/" },
  mother: { meaning: "어머니", pron: "/MUTH-er/" },
  father: { meaning: "아버지", pron: "/FAH-ther/" },
  child: { meaning: "아이", pron: "/chyld/" },
  children: { meaning: "아이들", pron: "/CHIL-dren/" },
  people: { meaning: "사람들", pron: "/PEE-pul/" },
  strong: { meaning: "강한, 튼튼한", pron: "/strong/" },
  clever: { meaning: "똑똑한, 영리한", pron: "/KLEV-er/" },
  helpful: { meaning: "도움이 되는", pron: "/HELP-ful/" },
  strange: { meaning: "이상한, 낯선", pron: "/straynj/" },
  glowing: { meaning: "빛나는", pron: "/GLOH-ing/" },
  hidden: { meaning: "숨겨진", pron: "/HID-en/" },
  rainbow: { meaning: "무지개", pron: "/RAYN-boh/" },
  riddle: { meaning: "수수께끼", pron: "/RID-ul/" },
  young: { meaning: "어린, 젊은", pron: "/yung/" },
  younger: { meaning: "더 어린", pron: "/YUNG-ger/" },
  youngest: { meaning: "가장 어린, 막내", pron: "/YUNG-gist/" },
  oldest: { meaning: "가장 나이 많은, 맏이", pron: "/OHL-dist/" },
  elder: { meaning: "손위, 연장자", pron: "/EL-der/" },
  brother: { meaning: "형제, 오빠/남동생", pron: "/BRUH-ther/" },
  brothers: { meaning: "형제들", pron: "/BRUH-therz/" },
  sister: { meaning: "자매, 언니/여동생", pron: "/SIS-ter/" },
  sisters: { meaning: "자매들", pron: "/SIS-terz/" }
};

const PRONOUN_BANK = {
  it: { meaning: "그것", pron: "/it/" },
  its: { meaning: "그것의", pron: "/its/" },
  they: { meaning: "그들", pron: "/thay/" },
  them: { meaning: "그들을", pron: "/them/" },
  their: { meaning: "그들의", pron: "/thair/" },
  he: { meaning: "그(남자/동물)", pron: "/hee/" },
  him: { meaning: "그를", pron: "/him/" },
  his: { meaning: "그의", pron: "/hiz/" },
  she: { meaning: "그녀", pron: "/shee/" },
  her: { meaning: "그녀의/그녀를", pron: "/hur/" },
  we: { meaning: "우리", pron: "/wee/" },
  us: { meaning: "우리를", pron: "/us/" },
  our: { meaning: "우리의", pron: "/owr/" },
  you: { meaning: "너/당신", pron: "/yoo/" },
  your: { meaning: "너의/당신의", pron: "/yor/" },
  this: { meaning: "이것", pron: "/this/" },
  that: { meaning: "저것/그것", pron: "/that/" },
  these: { meaning: "이것들", pron: "/theez/" },
  those: { meaning: "저것들", pron: "/thohz/" }
};

const STOP_WORDS = {};

function buildWordLookup(glosses) {
  const lookup = {};
  Object.keys(WORD_BANK).forEach((key) => { lookup[key] = WORD_BANK[key]; });
  Object.keys(PRONOUN_BANK).forEach((key) => { lookup[key] = PRONOUN_BANK[key]; });
  (glosses || []).forEach((item) => {
    if (!item || !item.word) return;
    lookup[String(item.word).toLowerCase()] = {
      meaning: item.meaning || "",
      pron: item.pron || "",
      example: item.example || ""
    };
  });
  return lookup;
}

function findPronounAntecedent(pronoun, textBefore) {
  const skip = { a: 1, an: 1, the: 1, and: 1, or: 1, to: 1, of: 1, in: 1, on: 1, for: 1, with: 1, into: 1, from: 1, at: 1, by: 1, as: 1, but: 1, was: 1, were: 1, is: 1, are: 1 };
  const words = String(textBefore || "").match(/[A-Za-z']+/g) || [];
  for (let i = words.length - 1; i >= 0; i--) {
    const raw = words[i];
    const key = raw.toLowerCase();
    if (PRONOUN_BANK[key] || skip[key]) continue;
    if (WORD_BANK[key] || /^[A-Z]/.test(raw)) {
      return {
        en: raw,
        ko: (WORD_BANK[key] && WORD_BANK[key].meaning) || raw
      };
    }
  }
  return null;
}

function guessWordMeaning(key) {
  const word = String(key || "").toLowerCase();
  if (!word) return "이 영어 단어";
  if (word.endsWith("ly") && WORD_BANK[word.slice(0, -2)]) {
    return WORD_BANK[word.slice(0, -2)].meaning + " (부사: ~하게)";
  }
  if (word.endsWith("ing") && WORD_BANK[word.slice(0, -3)]) {
    return WORD_BANK[word.slice(0, -3)].meaning + " (~하는 중)";
  }
  if (word.endsWith("ed") && WORD_BANK[word.slice(0, -2)]) {
    return WORD_BANK[word.slice(0, -2)].meaning + " (과거)";
  }
  if (word.endsWith("s") && WORD_BANK[word.slice(0, -1)]) {
    return WORD_BANK[word.slice(0, -1)].meaning + " (복수/3인칭)";
  }
  return "「" + word + "」의 뜻 (문맥에서 확인해 보세요)";
}

function resolveWordInfo(key, lookup) {
  const k = String(key || "").toLowerCase();
  return (lookup && lookup[k]) || PRONOUN_BANK[k] || WORD_BANK[k] || {
    meaning: guessWordMeaning(k),
    pron: "/" + k + "/"
  };
}

function wordTokenFromText(text, sentence, lookup, fullText) {
  const part = String(text || "");
  const key = part.toLowerCase();
  const info = resolveWordInfo(key, lookup);
  const token = {
    text: part,
    meaning: info.meaning || guessWordMeaning(key),
    pron: info.pron || ("/" + key + "/"),
    example: info.example || sentence || part,
    context: ""
  };
  if (PRONOUN_BANK[key]) {
    token.meaning = PRONOUN_BANK[key].meaning;
    token.pron = PRONOUN_BANK[key].pron;
    const haystack = String(fullText || sentence || "");
    const sent = String(sentence || "");
    const hayLower = haystack.toLowerCase();
    const sentLower = sent.toLowerCase();
    let before = sent;
    const sentPos = hayLower.indexOf(sentLower.slice(0, Math.min(24, sentLower.length)) || key);
    const localIdx = sentLower.indexOf(key);
    if (sentPos >= 0 && localIdx >= 0) {
      before = haystack.slice(0, sentPos + localIdx);
    } else if (localIdx >= 0) {
      before = sent.slice(0, localIdx);
    } else {
      before = haystack;
    }
    const ant = findPronounAntecedent(key, before);
    if (ant) {
      token.context = '이 문장에서 "' + ant.en + '"(' + ant.ko + ")를 가리켜요.";
    } else {
      token.context = "앞에서 나온 사람·동물·사물을 가리키는 말이에요.";
    }
  }
  return token;
}

function isPunctuationToken(part) {
  return /^["""''‘’“”.,!?;:…]+$/.test(String(part || ""));
}

function sentenceToTokens(sentence, glosses, fullText) {
  const lookup = buildWordLookup(glosses);
  const full = String(sentence || "");
  // 단어와 따옴표·문장부호를 분리한 뒤, 부호는 앞/뒤 단어에 붙여 단독 줄바꿈을 막음
  const parts = full.match(/[A-Za-z']+|["""''‘’“”.,!?;:…]+|[^\sA-Za-z"""''‘’“”.,!?;:…]+/g) || [full];
  const tokens = [];
  parts.forEach((part) => {
    if (isPunctuationToken(part)) {
      if (!tokens.length) {
        tokens.push({ lead: part, text: "", meaning: "", pron: "", example: "", context: "", isPunctOnly: true });
        return;
      }
      const prev = tokens[tokens.length - 1];
      if (prev && typeof prev === "object") {
        if (prev.isPunctOnly && !prev.text) {
          prev.lead = (prev.lead || "") + part;
        } else {
          prev.trail = (prev.trail || "") + part;
        }
      } else {
        tokens[tokens.length - 1] = String(prev) + part;
      }
      return;
    }
    if (/[^A-Za-z']/.test(part) && !/[A-Za-z]/.test(part)) {
      if (tokens.length && tokens[tokens.length - 1] && typeof tokens[tokens.length - 1] === "object") {
        tokens[tokens.length - 1].trail = (tokens[tokens.length - 1].trail || "") + part;
      } else {
        tokens.push(part);
      }
      return;
    }
    const token = wordTokenFromText(part, full, lookup, fullText || full);
    token.lead = "";
    token.trail = "";
    // 앞에 남은 단독 따옴표(opening)가 있으면 이 단어에 결합
    if (tokens.length) {
      const prev = tokens[tokens.length - 1];
      if (prev && typeof prev === "object" && prev.isPunctOnly && prev.lead && !prev.text) {
        token.lead = prev.lead;
        tokens.pop();
      }
    }
    tokens.push(token);
  });
  return tokens.filter((token) => !(token && token.isPunctOnly && !token.text && !token.trail));
}

function wordButtonHtml(part) {
  const token = typeof part === "string" ? wordTokenFromText(part, part) : part;
  if (!token || (!token.text && (token.lead || token.trail))) {
    return '<span class="word-punct">' + esc((token && (token.lead || "")) + (token && (token.trail || ""))) + "</span>";
  }
  // button 대신 span으로 두어 문장 안 텍스트 선택이 깨지지 않게 함
  // 따옴표·부호는 단어 옆에 붙이되(nbsp), 문장 전체 nowrap은 쓰지 않아 카드 폭 안에서 줄바꿈됨
  return (
    '<span class="word-cluster">' +
      (token.lead ? '<span class="word-punct">' + esc(token.lead) + "</span>" : "") +
      '<span role="button" tabindex="0" class="word-btn border-b-2 border-violet-300 font-extrabold text-violet-700 dark:border-violet-200 dark:text-white" data-action="word" data-word="' + esc(token.text) + '" data-meaning="' + esc(token.meaning) + '" data-pron="' + esc(token.pron) + '" data-example="' + esc(token.example) + '" data-context="' + esc(token.context || "") + '" data-sentence="' + esc(token.example || "") + '">' + esc(token.text) + "</span>" +
      (token.trail ? '<span class="word-punct">\u00A0' + esc(token.trail).replace(/^\s+/, "") + "</span>" : "") +
    "</span>"
  );
}

function tokensToHtml(tokens, interactive) {
  if (!interactive) {
    return '<span class="text-slate-900 dark:text-white">' + esc(plainLine(tokens)) + "</span>";
  }
  let html = "";
  const sentence = plainLine(tokens);
  tokens.forEach((part) => {
    if (typeof part === "string") {
      if (isPunctuationToken(part)) {
        // 단독 부호는 앞 클러스터에 붙일 수 없으면 nowrap으로 출력
        html += '<span class="word-punct">' + esc(part) + "</span>";
        return;
      }
      const bits = part.match(/[A-Za-z']+|["""''‘’“”.,!?;:…]+|\s+/g) || [part];
      bits.forEach((bit) => {
        if (/^\s+$/.test(bit)) {
          html += " ";
          return;
        }
        if (isPunctuationToken(bit)) {
          html += '<span class="word-punct">' + esc(bit) + "</span>";
          return;
        }
        html += (html && !/[>\s]$/.test(html) ? " " : "") + wordButtonHtml(wordTokenFromText(bit, sentence, null, sentence));
      });
      return;
    }
    html += (html && !/[>\s]$/.test(html) ? " " : "") + wordButtonHtml(part);
  });
  return html;
}

function isValidEnglishSentence(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  // 따옴표·공백·부호만 남은 조각은 문장으로 보지 않음
  if (!/[A-Za-z]/.test(value)) return false;
  if (/^["""''‘’“”\s.,!?;:…\-–—]+$/.test(value)) return false;
  return true;
}

function splitEnglishSentences(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  const matches = raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return (matches || [raw])
    .map((s) => s.trim())
    .filter(isValidEnglishSentence);
}

function splitKoreanSentences(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  const parts = raw.split(/(?<=[.!?다요죠네까]+)\s+/).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : [raw];
}

function glossesFromPage(page) {
  const glosses = [];
  (page.en || []).forEach((part) => {
    if (part && typeof part === "object" && part.text && part.meaning) {
      glosses.push({
        word: part.text,
        meaning: part.meaning,
        pron: part.pron || "",
        example: part.example || ""
      });
    }
  });
  (page.words || []).forEach((item) => {
    if (item && item.word) glosses.push(item);
  });
  return glosses;
}

function renderInteractiveStoryHtml(page, interactive) {
  const enText = page.text_en || plainLine(page.en || []);
  const koText = page.text_ko || page.kr || "";
  if (!interactive) {
    return '<span class="text-slate-900 dark:text-white">' + esc(enText) + "</span>";
  }
  const glosses = glossesFromPage(page);
  const enSentences = splitEnglishSentences(enText);
  const koSentences = splitKoreanSentences(koText);
  if (!enSentences.length) {
    if (!isValidEnglishSentence(enText)) {
      return '<span class="text-slate-900 dark:text-white">' + esc(enText) + "</span>";
    }
    return (
      '<span class="story-sentence mb-3 block leading-relaxed" data-action="sentence-body" data-en="' + esc(enText) + '" data-ko="' + esc(koText || "") + '">' +
      tokensToHtml(page.en || sentenceToTokens(enText, glosses, enText), true) +
      ' <button type="button" class="sentence-tip-btn ml-1 align-middle" data-action="sentence-tip" data-en="' + esc(enText) + '" data-ko="' + esc(koText || "") + '">문장 해석</button>' +
      "</span>"
    );
  }
  return enSentences.map((sentence, index) => {
    if (!isValidEnglishSentence(sentence)) return "";
    const ko = koSentences[index] || koText || "이 문장의 전체 뜻을 확인해 보세요.";
    const tokens = sentenceToTokens(sentence, glosses, enText);
    return (
      '<span class="story-sentence mb-3 block leading-relaxed" data-action="sentence-body" data-en="' + esc(sentence) + '" data-ko="' + esc(ko) + '">' +
      tokensToHtml(tokens, true) +
      ' <button type="button" class="sentence-tip-btn ml-1 align-middle" data-action="sentence-tip" data-en="' + esc(sentence) + '" data-ko="' + esc(ko) + '">문장 해석</button>' +
      "</span>"
    );
  }).join("");
}

function lookupPhraseMeaning(text) {
  const words = String(text || "").match(/[A-Za-z']+/g) || [];
  if (!words.length) return "선택한 부분을 확인해 보세요.";
  if (words.length === 1) {
    return resolveWordInfo(words[0].toLowerCase()).meaning;
  }
  return words.map((word) => resolveWordInfo(word.toLowerCase()).meaning).join(" · ");
}

function plainLine(tokens) {
  return (tokens || []).map((part) => {
    if (typeof part === "string") return part;
    if (!part) return "";
    return String(part.lead || "") + String(part.text || "") + String(part.trail || "");
  }).join(" ").replace(/\s+(["""''‘’“”.,!?])/g, "$1");
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

function extractSuggestionsList(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (item == null) return "";
      if (typeof item === "string" || typeof item === "number") return String(item).trim();
      if (typeof item === "object") {
        return String(item.word || item.text || item.keyword || item.suggestion || item.label || "").trim();
      }
      return String(item).trim();
    }).filter(Boolean);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        return extractSuggestionsList(JSON.parse(trimmed));
      } catch (err) { /* 아래에서 분리 */ }
    }
    return trimmed.split(/[,|/\n]+/).map((part) => part.replace(/^["'\s]+|["'\s]+$/g, "").trim()).filter(Boolean);
  }
  if (typeof raw === "object") return extractSuggestionsList(Object.values(raw));
  return [];
}

const SAFE_SUGGESTION_POOL = [
  "a hidden trail",
  "a mysterious box",
  "a friendly bird",
  "a strange noise",
  "open a secret door",
  "a glowing lantern",
  "a clever riddle",
  "a rainbow bridge",
  "a helpful squirrel",
  "follow a lantern",
  "a tiny boat",
  "climb a tall tree"
];

const THEME_SUGGESTION_POOLS = {
  pigs: [
    "a straw house", "a stick bridge", "a brick wall", "a sneaky wolf",
    "a warm chimney", "a clever trap", "a muddy path", "a brave plan",
    "a friendly neighbor", "a secret tunnel", "a loud huff", "a safe shelter"
  ],
  alice: [
    "a talking flower", "a tiny door", "a tea party", "a pocket watch",
    "a curious key", "a shrinking potion", "a smiling cat", "a garden maze",
    "a painted rose", "a looking glass", "a mad hat", "a soft pillow cloud"
  ],
  redhood: [
    "fresh apples", "a kind wolf", "a map of stars", "a forest path",
    "a picnic basket", "a red cape", "grandmother's cottage", "a glowing lantern",
    "a helpful woodcutter", "a berry bush", "a winding trail", "a warm quilt"
  ],
  goose: [
    "a golden feather", "a warm pie", "a new friend", "a kind farmer",
    "a shiny egg", "a village fair", "a gentle pond", "a magic whistle",
    "a bread crumb", "a royal parade", "a soft nest", "a lucky coin"
  ]
};

const THEME_RELAY_MADLIBS = {
  pigs: "Then the pigs noticed a [ clue ] near the [ house ] and decided to [ explore ].",
  alice: "After that, Alice found a [ wonder ] beside a [ door ] and chose to [ follow ].",
  redhood: "Next, Little Red Riding Hood saw a [ surprise ] on the [ path ] and went to [ help ].",
  goose: "Then the golden goose brought a [ gift ] to the [ friend ] and began to [ celebrate ]."
};

const THEME_RELAY_MADLIBS_KO = {
  pigs: "그러자 돼지들은 ( 단서 )를 ( 집 ) 근처에서 발견하고 ( 탐험 )하기로 했어요.",
  alice: "그 뒤 앨리스는 ( 문 ) 옆에서 ( 신비한 것 )을 발견하고 ( 따라가 )기로 했어요.",
  redhood: "다음으로 빨간 모자는 ( 길 ) 위에서 ( 놀라운 일 )을 보고 ( 도우러 ) 갔어요.",
  goose: "그러자 황금거위는 ( 친구 )에게 ( 선물 )을 전하고 ( 축하 )하기 시작했어요."
};

const RELAY_PROMPT_ADDENDUM = "\n\n[RELAY FILL-IN FOR THE NEXT TURN]\nAfter writing the scene, ALSO return these keys in the SAME JSON object:\n- relay_prompt: ONE English fill-in-the-blank sentence that continues RIGHT AFTER the ending of your english scene. Use exactly two blanks in the form [ phrase ]. Example: Following the silver watch's whisper, Alice stepped toward [ a hidden glade ] and noticed [ a glowing river ].\n- relay_prompt_ko: Natural Korean translation of relay_prompt in warm spoken style (~어요). Represent blanks as ( 한글 ). Example: 은색 시계의 속삭임을 따라, 앨리스는 ( 숨은 숲 공터 )로 걸어가 ( 빛나는 강 )을 발견했어요.\n- suggestions: exactly 3 short English phrases (2-4 words) that fit those blanks and continue the plot (no repeats from the scene).\nNever include the previous scene quoted verbatim inside relay_prompt.";

function getThemeSuggestionPool() {
  const key = TEMPLATES[state.template] ? state.template : "pigs";
  return (THEME_SUGGESTION_POOLS[key] || SAFE_SUGGESTION_POOL).concat(SAFE_SUGGESTION_POOL);
}

function normalizeSuggestionKey(phrase) {
  return String(phrase || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function ensureUsedSuggestions() {
  if (!Array.isArray(state.usedSuggestions)) state.usedSuggestions = [];
  return state.usedSuggestions;
}

function markSuggestionUsed(phrase) {
  const value = String(phrase || "").trim();
  const key = normalizeSuggestionKey(value);
  if (!key || key.length < 2) return;
  const list = ensureUsedSuggestions();
  if (!list.some((item) => normalizeSuggestionKey(item) === key)) {
    list.push(value);
  }
}

function isSuggestionAlreadyUsed(phrase) {
  const key = normalizeSuggestionKey(phrase);
  if (!key) return true;
  return ensureUsedSuggestions().some((item) => normalizeSuggestionKey(item) === key);
}

function getFullStoryWordSet(extraText) {
  const text = (collectFullStoryEnglish().join(" ") + " " + String(extraText || "")).toLowerCase();
  return new Set(text.match(/[a-z]{3,}/g) || []);
}

function isCompleteSuggestionPhrase(phrase) {
  const value = String(phrase || "").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length < 2 || parts.length > 4) return false;
  if (/^(a|an)\s+(built|strong|soft|discovered|found|happy|big|little|new|old|good|bad|brave|kind|brick|house)$/i.test(value)) {
    return false;
  }
  if (/^(a|an)\s+[a-z]+(ed|en)$/i.test(value) && parts.length === 2) return false;
  return true;
}

function suggestionOverlapsStory(phrase, wordSet) {
  const stop = { the: 1, and: 1, for: 1, with: 1, from: 1, into: 1, open: 1, find: 1, a: 1, an: 1 };
  const tokens = String(phrase || "").toLowerCase().match(/[a-z]{3,}/g) || [];
  // 구 전체의 content 단어가 이미 이야기에 많이 겹치면 제외
  const content = tokens.filter((token) => !stop[token]);
  if (!content.length) return false;
  const hits = content.filter((token) => wordSet.has(token)).length;
  return hits >= Math.max(1, Math.ceil(content.length * 0.66));
}

function nextThemeFallbackSuggestions(count) {
  const pool = getThemeSuggestionPool();
  const picked = [];
  let guard = 0;
  while (picked.length < count && guard < pool.length * 2) {
    const idx = (state.suggestionPoolCursor || 0) % pool.length;
    state.suggestionPoolCursor = idx + 1;
    const phrase = pool[idx];
    guard += 1;
    if (!phrase) continue;
    if (isSuggestionAlreadyUsed(phrase)) continue;
    if (picked.some((item) => normalizeSuggestionKey(item) === normalizeSuggestionKey(phrase))) continue;
    picked.push(phrase);
  }
  while (picked.length < count) {
    picked.push(["a magic surprise", "a gentle breeze", "a secret smile"][picked.length] || "a new adventure");
  }
  return picked;
}

function filterSuggestionsAgainstFullStory(suggestions, english, userInput) {
  const wordSet = getFullStoryWordSet([english || "", userInput || ""].join(" "));
  const out = [];
  const pushUnique = (phrase) => {
    const value = String(phrase || "").trim();
    if (!value) return;
    if (!isCompleteSuggestionPhrase(value)) return;
    if (isSuggestionAlreadyUsed(value)) return;
    if (suggestionOverlapsStory(value, wordSet)) return;
    if (out.some((item) => normalizeSuggestionKey(item) === normalizeSuggestionKey(value))) return;
    out.push(value);
  };
  extractSuggestionsList(suggestions).forEach(pushUnique);
  getThemeSuggestionPool().forEach(pushUnique);
  if (out.length < 3) {
    nextThemeFallbackSuggestions(3 - out.length).forEach(pushUnique);
  }
  while (out.length < 3) {
    out.push(["a hidden trail", "a mysterious box", "a friendly bird"][out.length] || "a magic surprise");
  }
  return out.slice(0, 3);
}

function inventSuggestionsFromScene(english, userInput) {
  return filterSuggestionsAgainstFullStory([], english, userInput);
}

function normalizeSuggestions(raw, english, userInput) {
  const list = filterSuggestionsAgainstFullStory(raw, english, userInput);
  // API가 비었거나 전부 걸러진 경우 테마 풀에서 확실히 3개
  if (!list.length) return nextThemeFallbackSuggestions(3);
  return list;
}

function getCleanRelayMadlib() {
  const key = TEMPLATES[state.template] ? state.template : "pigs";
  // Scene 2+ 진행 중이면 테마별 빈칸 릴레이 문장, Scene 1만이면 템플릿 기본 madlib
  if (storyPages.length > 1) {
    return THEME_RELAY_MADLIBS[key] || THEME_RELAY_MADLIBS.pigs;
  }
  const tpl = TEMPLATES[key] || TEMPLATES.pigs;
  return tpl.madlib;
}

function getCleanRelayMadlibKo() {
  const key = TEMPLATES[state.template] ? state.template : "pigs";
  if (storyPages.length > 1) {
    return THEME_RELAY_MADLIBS_KO[key] || THEME_RELAY_MADLIBS_KO.pigs;
  }
  const tpl = TEMPLATES[key] || TEMPLATES.pigs;
  return tpl.madlibKo || THEME_RELAY_MADLIBS_KO[key] || "";
}

function buildRelayMadlibFromScene(english) {
  // API 실패 시: 직전 장면 키워드를 살짝 이어 받는 로컬 빈칸 문장 (긴 인용문 금지)
  const tip = formatCleanEnglishText(english || "");
  const key = TEMPLATES[state.template] ? state.template : "pigs";
  if (!tip) return getCleanRelayMadlib();
  const starters = {
    pigs: "Following that moment, the pigs hurried toward",
    alice: "Following that whisper, Alice stepped toward",
    redhood: "Following that clue, Little Red Riding Hood walked toward",
    goose: "Following that gift, the golden goose led everyone toward"
  };
  const start = starters[key] || "Following that moment, the friends moved toward";
  return start + " [ a hidden path ] and noticed [ a soft glowing light ].";
}

function buildRelayMadlibKoFromScene(english, madlibEn) {
  if (madlibEn && /\[/.test(madlibEn)) {
    // 영어 빈칸 구조만 맞춘 간단한 한국어 폴백
    const key = TEMPLATES[state.template] ? state.template : "pigs";
    const startersKo = {
      pigs: "그 순간을 따라, 돼지들은",
      alice: "그 속삭임을 따라, 앨리스는",
      redhood: "그 단서를 따라, 빨간 모자는",
      goose: "그 선물을 따라, 황금거위는"
    };
    return (startersKo[key] || "그 순간을 따라, 친구들은") + " ( 숨겨진 길 ) 쪽으로 가서 ( 부드러운 빛 )을 발견했어요.";
  }
  return getCleanRelayMadlibKo();
}

function isLegacyJustNowMadlib(text) {
  return /^\s*Just now:/i.test(String(text || "")) || /What happens next\?/i.test(String(text || ""));
}

function getDefaultTemplateChoices() {
  const key = TEMPLATES[state.template] ? state.template : "pigs";
  const tpl = TEMPLATES[key] || TEMPLATES.pigs;
  return (tpl.choices || []).map((item) => normalizeSuggestionKey(item));
}

function isDefaultTemplateSuggestions(list) {
  const incoming = (Array.isArray(list) ? list : [])
    .map((item) => normalizeSuggestionKey(item))
    .filter(Boolean)
    .slice(0, 3);
  if (!incoming.length) return true;
  const defaults = getDefaultTemplateChoices();
  if (!defaults.length) return false;
  // 초기 템플릿 추천(예: a talking flower)과 같으면 stale로 간주
  const overlap = incoming.filter((item) => defaults.indexOf(item) >= 0).length;
  return overlap >= Math.min(2, incoming.length);
}

function shouldRefreshRelaySuggestions(list) {
  if (!Array.isArray(list) || !list.length) return true;
  if (storyPages.length <= 1) return false;
  return isDefaultTemplateSuggestions(list);
}

function sanitizeRelayMadlibText(text) {
  const value = String(text || "").trim();
  if (!value || isLegacyJustNowMadlib(value)) return getCleanRelayMadlib();
  return value;
}

function pairedRelayMadlibKoForEnglish(enText) {
  const en = String(enText || "").trim();
  if (!en) return getCleanRelayMadlibKo();
  const tplKeys = Object.keys(TEMPLATES);
  for (let i = 0; i < tplKeys.length; i++) {
    const tpl = TEMPLATES[tplKeys[i]];
    if (tpl && en === tpl.madlib && tpl.madlibKo) return tpl.madlibKo;
  }
  const themeKeys = Object.keys(THEME_RELAY_MADLIBS);
  for (let i = 0; i < themeKeys.length; i++) {
    const key = themeKeys[i];
    if (en === THEME_RELAY_MADLIBS[key] && THEME_RELAY_MADLIBS_KO[key]) {
      return THEME_RELAY_MADLIBS_KO[key];
    }
  }
  return buildRelayMadlibKoFromScene("", en);
}

function isRelayPairLikelyMismatched(enText, koText) {
  const en = String(enText || "").trim();
  const ko = String(koText || "").trim();
  if (!en || !ko) return true;
  const expected = pairedRelayMadlibKoForEnglish(en);
  const tplKeys = Object.keys(TEMPLATES);
  for (let i = 0; i < tplKeys.length; i++) {
    const tpl = TEMPLATES[tplKeys[i]];
    if (tpl && en === tpl.madlib) {
      return normalizeSuggestionKey(ko) !== normalizeSuggestionKey(expected);
    }
  }
  const themeKeys = Object.keys(THEME_RELAY_MADLIBS);
  for (let i = 0; i < themeKeys.length; i++) {
    if (en === THEME_RELAY_MADLIBS[themeKeys[i]]) {
      return normalizeSuggestionKey(ko) !== normalizeSuggestionKey(expected);
    }
  }
  // 고정 문장이 아닌 API/로컬 문장: 영어는 After that인데 한글은 속삭임 등 다른 폴백이면 불일치
  if (/^After that,/i.test(en) && /속삭임|Following that whisper/i.test(ko)) return true;
  if (/^Following that/i.test(en) && /After that, Alice found/i.test(ko) === false && /그 뒤 앨리스는 \( 문 \)/.test(ko)) return true;
  return false;
}

function setRelayMadlibPair(enText, koText) {
  // 영어·한글을 항상 한 쌍으로만 갱신 (한쪽만 남기지 않음)
  const en = sanitizeRelayMadlibText(enText);
  let ko = String(koText || "").trim();
  if (!ko || isRelayPairLikelyMismatched(en, ko)) {
    ko = pairedRelayMadlibKoForEnglish(en);
  }
  state.relayMadlib = en;
  state.relayMadlibKo = ko;
  const el = $("madlib");
  const koEl = $("madlibKo");
  if (el) el.textContent = state.relayMadlib;
  if (koEl) koEl.textContent = state.relayMadlibKo || "";
}

function setRelayMadlibText(text, koText) {
  setRelayMadlibPair(text, koText);
}

function fillRelayInputWithChoice(choice) {
  const value = String(choice || "");
  markSuggestionUsed(value);
  const inputEl = $("relayInput") || document.getElementById("user-input") || $("user-input");
  if (!inputEl) return;
  inputEl.value = value;
  inputEl.focus();
  persistRelayStateEverywhere();
}

function getSuggestionsContainer() {
  return (
    $("choices") ||
    document.getElementById("suggestions-container") ||
    document.querySelector("#choices") ||
    document.querySelector(".suggestion-buttons")
  );
}

function renderChoiceButtons(suggestions, english, userInput) {
  const box = getSuggestionsContainer();
  if (!box) {
    console.warn("[StoryLoom] 추천 단어 컨테이너(#choices)를 찾지 못했습니다.");
    return;
  }
  const list = normalizeSuggestions(suggestions, english, userInput);
  box.innerHTML = "";
  list.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rounded-full bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-800 dark:bg-slate-900 dark:text-white";
    btn.textContent = choice;
    btn.setAttribute("data-action", "choice");
    btn.setAttribute("data-choice", choice);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      fillRelayInputWithChoice(choice);
    });
    box.appendChild(btn);
  });
  state.lastSuggestions = list.slice();
  console.log("[StoryLoom] 추천 단어 버튼 교체 완료:", list);
}

function persistRelayStateEverywhere() {
  persistActiveDraft();
  if (isCurrentStoryInLibrary()) {
    syncActiveStoryToLibrary({ silent: true, createIfMissing: false });
  }
}

function updateRelayComposerFromLatestScene(options) {
  const opts = options || {};
  const latest = storyPages.length ? storyPages[storyPages.length - 1] : null;
  const english = opts.english || (latest && (latest.text_en || plainLine(latest.en || []))) || "";
  const userInput = opts.userInput || "";
  if (userInput) markSuggestionUsed(userInput);
  const apiEn = opts.madlib && String(opts.madlib).trim() && !isLegacyJustNowMadlib(opts.madlib)
    ? String(opts.madlib).trim()
    : "";
  const apiKo = opts.madlibKo && String(opts.madlibKo).trim()
    ? String(opts.madlibKo).trim()
    : "";
  let madlib;
  let madlibKo;
  if (apiEn && apiKo) {
    // API가 준 영어·한글을 한 쌍으로 동시 반영
    madlib = sanitizeRelayMadlibText(apiEn);
    madlibKo = apiKo;
  } else if (apiEn) {
    madlib = sanitizeRelayMadlibText(apiEn);
    madlibKo = pairedRelayMadlibKoForEnglish(madlib);
  } else if (opts.preferLocalContextual || storyPages.length > 1) {
    madlib = buildRelayMadlibFromScene(english);
    madlibKo = buildRelayMadlibKoFromScene(english, madlib);
  } else {
    madlib = getCleanRelayMadlib();
    madlibKo = pairedRelayMadlibKoForEnglish(madlib);
  }
  if (isRelayPairLikelyMismatched(madlib, madlibKo)) {
    madlibKo = pairedRelayMadlibKoForEnglish(madlib);
  }
  setRelayMadlibPair(madlib, madlibKo);
  let rawSuggestions = opts.suggestions != null
    ? opts.suggestions
    : (state.lastSuggestions || []);
  // 진행 중인데 기본 템플릿 추천이 남아 있으면 마지막 장면 기준으로 즉시 교체
  if (opts.forceRefresh || shouldRefreshRelaySuggestions(rawSuggestions)) {
    rawSuggestions = inventSuggestionsFromScene(english, userInput);
  }
  renderChoiceButtons(rawSuggestions, english, userInput);
  persistRelayStateEverywhere();
}

function updateSuggestionButtonsFromApi(parsedData, english, userInput) {
  const suggestions = parsedData && parsedData.relay_prompt
    ? (parsedData._apiSuggestions || parsedData.suggestions)
    : (parsedData && parsedData.suggestions != null
      ? parsedData.suggestions
      : (parsedData && parsedData._apiSuggestions != null
        ? parsedData._apiSuggestions
        : (parsedData && Array.isArray(parsedData) ? parsedData : [])));
  console.log("Groq Response Suggestions:", suggestions);
  const relayEn = parsedData && (parsedData.relay_prompt || parsedData.relayPrompt || parsedData.madlib);
  const relayKo = parsedData && (parsedData.relay_prompt_ko || parsedData.relayPromptKo || parsedData.madlib_ko || parsedData.madlibKo);
  // 새 장면마다 영어·한글 추천 문장을 동시에 교체
  updateRelayComposerFromLatestScene({
    english: english || (parsedData && parsedData.english) || "",
    madlib: relayEn || "",
    madlibKo: relayKo || "",
    suggestions: suggestions,
    userInput: userInput || "",
    preferLocalContextual: !(relayEn && relayKo),
    forceRefresh: !suggestions || !extractSuggestionsList(suggestions).length
  });
}

function resetRelayComposerToTemplate() {
  const selectedKey = TEMPLATES[state.template] ? state.template : null;
  const tpl = selectedKey ? TEMPLATES[selectedKey] : TEMPLATES.pigs;
  state.usedSuggestions = [];
  state.suggestionPoolCursor = 0;
  state.lastSuggestions = (tpl.choices || []).slice();
  setRelayMadlibPair(tpl.madlib, tpl.madlibKo || getCleanRelayMadlibKo());
  renderChoiceButtons(tpl.choices || [], "", "");
  persistActiveDraft();
}

function refreshRelayComposerAfterRestore() {
  const latest = storyPages.length ? storyPages[storyPages.length - 1] : null;
  const latestEn = latest ? (latest.text_en || plainLine(latest.en || [])) : "";
  if (storyPages.length <= 1) {
    resetRelayComposerToTemplate();
    return;
  }
  state.relayMadlib = getCleanRelayMadlib();
  updateRelayComposerFromLatestScene({
    english: latestEn,
    madlib: state.relayMadlib,
    suggestions: state.lastSuggestions,
    forceRefresh: shouldRefreshRelaySuggestions(state.lastSuggestions)
  });
}

function renderComposer() {
  const selectedKey = TEMPLATES[state.template] ? state.template : null;
  const tpl = selectedKey ? TEMPLATES[selectedKey] : TEMPLATES.pigs;
  const classic = selectedKey ? CLASSIC_STORIES[selectedKey] : null;
  if (classic) {
    state.templateImage = classic.image;
    currentTemplateImage = state.templateImage;
  }
  if (storyPages.length > 1) {
    const latest = storyPages[storyPages.length - 1];
    const latestEn = latest ? (latest.text_en || plainLine(latest.en || [])) : "";
    const stale = !state.relayMadlib || isLegacyJustNowMadlib(state.relayMadlib)
      || isRelayPairLikelyMismatched(state.relayMadlib, state.relayMadlibKo);
    if (stale) {
      state.relayMadlib = buildRelayMadlibFromScene(latestEn);
      state.relayMadlibKo = buildRelayMadlibKoFromScene(latestEn, state.relayMadlib);
    }
    updateRelayComposerFromLatestScene({
      english: latestEn,
      madlib: state.relayMadlib,
      madlibKo: state.relayMadlibKo,
      suggestions: state.lastSuggestions,
      forceRefresh: shouldRefreshRelaySuggestions(state.lastSuggestions),
      preferLocalContextual: stale
    });
  } else {
    setRelayMadlibPair(tpl.madlib, tpl.madlibKo || getCleanRelayMadlibKo());
    renderChoiceButtons(tpl.choices || [], "", "");
  }
  syncTemplateCardHighlight(selectedKey);
}

function syncTemplateCardHighlight(selectedKey) {
  const key = selectedKey != null
    ? selectedKey
    : (TEMPLATES[state.template] || CLASSIC_STORIES[state.template] ? state.template : null);
  document.querySelectorAll(".tpl-card").forEach((card) => {
    card.classList.toggle("tpl-on", !!key && card.dataset.tpl === key);
  });
}

function stripBookTitleCopyNumber(title) {
  return String(title || "").replace(/\s*\(\d+\)\s*$/, "").trim();
}

function resolveTemplateKeyFromBook(book) {
  if (!book) return null;
  const direct = book.templateKey || book.art;
  if (direct && (TEMPLATES[direct] || CLASSIC_STORIES[direct])) return direct;
  const titleKey = normalizeBookTitleKey(stripBookTitleCopyNumber(book.title));
  const krKey = normalizeBookTitleKey(stripBookTitleCopyNumber(book.kr));
  const keys = Object.keys(TEMPLATES);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const tpl = TEMPLATES[key];
    const classic = CLASSIC_STORIES[key];
    const candidates = [
      tpl && tpl.en,
      tpl && tpl.title,
      classic && classic.title
    ].filter(Boolean).map((text) => normalizeBookTitleKey(stripBookTitleCopyNumber(text)));
    if (titleKey && candidates.indexOf(titleKey) >= 0) return key;
    if (krKey && candidates.indexOf(krKey) >= 0) return key;
  }
  return null;
}

function allocateUniqueLibraryTitles(baseTitle, baseKr) {
  const books = Array.isArray(state.books) && state.books.length
    ? state.books
    : loadBooksFromStorage();
  const rootTitle = stripBookTitleCopyNumber(baseTitle) || String(baseTitle || "My Story").trim() || "My Story";
  const rootKr = stripBookTitleCopyNumber(baseKr) || String(baseKr || "").trim();
  const used = {};
  (books || []).forEach((book) => {
    if (!book || book.id === FRIENDS_OMNIBUS_ID) return;
    const key = normalizeBookTitleKey(book.title);
    if (key) used[key] = true;
  });
  if (!used[normalizeBookTitleKey(rootTitle)]) {
    return { title: rootTitle, kr: rootKr };
  }
  let n = 2;
  while (used[normalizeBookTitleKey(rootTitle + " (" + n + ")")]) n += 1;
  return {
    title: rootTitle + " (" + n + ")",
    kr: rootKr ? (rootKr + " (" + n + ")") : rootKr
  };
}

const tipState = { open: false, key: "", mode: "" };
const aiGlossCache = Object.create(null);
let pendingSelection = { text: "", rect: null };
let interpretChipTimer = null;
let wordClickTimer = null;

function isTooltipVisible() {
  const tip = $("tooltip");
  return tip && !tip.classList.contains("hidden");
}

function clearWordTipHighlight() {
  document.querySelectorAll(".word-btn.is-tip-open").forEach((el) => el.classList.remove("is-tip-open"));
}

function hideTooltip() {
  const tip = $("tooltip");
  if (tip) tip.classList.add("hidden");
  tipState.open = false;
  tipState.key = "";
  tipState.mode = "";
  clearWordTipHighlight();
}

function placeTooltipNear(rect, clientX, clientY) {
  const tip = $("tooltip");
  const width = 300;
  const height = 220;
  let left = typeof clientX === "number" ? clientX + 12 : rect.left;
  let top = typeof clientY === "number" ? clientY + 16 : (rect.bottom + 8);
  if (typeof clientX !== "number") left = rect.left;
  left = Math.max(8, Math.min(left, window.innerWidth - width));
  top = Math.max(8, Math.min(top, window.innerHeight - height));
  tip.style.left = left + "px";
  tip.style.top = top + "px";
}

function isWeakMeaning(meaning) {
  const m = String(meaning || "").trim();
  if (!m) return true;
  return /문맥에서 확인해|이 영어 단어|작은 기능어|뜻을 확인해|뜻 \(문맥|「[^」]+」의 뜻/.test(m);
}

function fillTooltipContent(word, meaning, pron, example, contextNote, mode, loading) {
  const tip = $("tooltip");
  const title = mode === "sentence" ? "문장 해석" : (mode === "selection" ? "선택 영역 해석" : "단어 뜻");
  let html = '<div class="tip-head"><p class="tip-label">' + title + '</p>';
  html += '<button type="button" class="tip-close" data-action="close-tip" aria-label="닫기">✕</button></div>';
  if (loading) {
    html += '<p class="tip-meaning tip-loading">AI가 뜻을 찾는 중…</p>';
    html += '<p class="tip-word">' + esc(word) + "</p>";
  } else if (mode === "word" || mode === "selection") {
    html += '<p class="tip-meaning">' + esc(meaning) + "</p>";
    html += '<p class="tip-word">' + esc(word) + "</p>";
  } else {
    html += '<p class="tip-word">' + esc(word) + "</p>";
    html += '<p class="tip-meaning">' + esc(meaning) + "</p>";
  }
  if (!loading && pron) html += '<p class="tip-pron">' + esc(pron) + "</p>";
  if (!loading && contextNote) {
    html += '<p class="tip-note">💡 ' + esc(contextNote) + "</p>";
  }
  if (!loading && example && mode === "word") {
    html += '<p class="tip-example">예: ' + esc(example) + "</p>";
  }
  if (!loading && mode === "word") {
    html += '<div class="mt-2 flex gap-2"><button type="button" class="rounded-xl bg-violet-100 px-2 py-1 text-xs font-extrabold text-violet-700 dark:bg-slate-700 dark:text-white" data-action="speak" data-speak="' + esc(word) + '">🔊 발음</button><button type="button" class="rounded-xl bg-pink-100 px-2 py-1 text-xs font-extrabold text-pink-700 dark:bg-pink-900 dark:text-white" data-action="save-word" data-word="' + esc(word) + '" data-meaning="' + esc(meaning) + '" data-pron="' + esc(pron) + '" data-example="' + esc(example || word) + '">단어장 저장</button></div>';
  } else if (!loading) {
    html += '<div class="mt-2"><button type="button" class="rounded-xl bg-violet-100 px-2 py-1 text-xs font-extrabold text-violet-700 dark:bg-slate-700 dark:text-white" data-action="speak" data-speak="' + esc(word) + '">🔊 읽어 주기</button></div>';
  }
  tip.innerHTML = html;
  tip.classList.remove("hidden");
  tip.classList.remove("tip-pop");
  void tip.offsetWidth;
  tip.classList.add("tip-pop");
  tipState.open = true;
  tipState.mode = mode || "word";
}

function tipKeyForWord(btn) {
  return "word:" + String(btn.dataset.word || "").toLowerCase();
}

function tipKeyForSentence(btn) {
  return "sentence:" + String(btn.dataset.en || "").slice(0, 80).toLowerCase();
}

function tipKeyForSelection(text) {
  return "selection:" + String(text || "").toLowerCase();
}

function getInterpretChip() {
  let chip = document.getElementById("interpretChip");
  if (chip) return chip;
  chip = document.createElement("button");
  chip.type = "button";
  chip.id = "interpretChip";
  chip.className = "interpret-chip hidden";
  chip.dataset.action = "interpret-selection";
  chip.textContent = "해석하기";
  document.body.appendChild(chip);
  return chip;
}

function hideInterpretChip() {
  const chip = document.getElementById("interpretChip");
  if (chip) chip.classList.add("hidden");
  pendingSelection = { text: "", rect: null };
}

function showInterpretChip(text, rect, clientX, clientY) {
  const chip = getInterpretChip();
  pendingSelection = { text: text, rect: rect };
  const left = Math.max(8, Math.min((typeof clientX === "number" ? clientX : rect.left) + 8, window.innerWidth - 110));
  const top = Math.max(8, Math.min((typeof clientY === "number" ? clientY : rect.bottom) + 10, window.innerHeight - 44));
  chip.style.left = left + "px";
  chip.style.top = top + "px";
  chip.classList.remove("hidden");
}

function cacheAiGloss(word, sentence, gloss) {
  const key = String(word || "").toLowerCase() + "::" + String(sentence || "").slice(0, 100).toLowerCase();
  aiGlossCache[key] = gloss;
  const bankKey = String(word || "").toLowerCase();
  if (bankKey && gloss && gloss.meaning) {
    WORD_BANK[bankKey] = {
      meaning: gloss.meaning,
      pron: gloss.pron || ("/" + bankKey + "/")
    };
  }
  return gloss;
}

function readAiGlossCache(word, sentence) {
  const key = String(word || "").toLowerCase() + "::" + String(sentence || "").slice(0, 100).toLowerCase();
  return aiGlossCache[key] || null;
}

async function fetchAiWordGloss(word, sentence) {
  const cached = readAiGlossCache(word, sentence);
  if (cached) return cached;
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;
  const systemPrompt = "You are a children's English dictionary API that MUST respond ONLY with a valid JSON object.\nReturn JSON with keys: meaning (short accurate Korean gloss, comma-separated if multiple), role (one friendly Korean sentence about how the word is used in THIS sentence, e.g. '~할 때', '뻗은'), pron (simple IPA-like pronunciation like /as/).\nVocabulary consistency: youngest -> \"가장 어린\" or fairy-tale sibling sense \"막내\"; NEVER \"가장 작은\". younger -> \"더 어린\". young -> \"어린\".\nNo markdown. No extra keys.";
  const userMessage = "Word: " + word + "\nSentence: " + sentence + "\nExplain the word's Korean meaning and its role in this sentence for an elementary learner.";
  const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];
  let lastError = null;
  for (let i = 0; i < models.length; i++) {
    try {
      const data = await callGroqChatJson(apiKey, models[i], systemPrompt, userMessage, 0.2);
      const meaning = String((data && (data.meaning || data.korean || data.gloss)) || "").trim();
      const role = String((data && (data.role || data.context || data.note)) || "").trim();
      const pron = String((data && data.pron) || ("/" + String(word).toLowerCase() + "/")).trim();
      if (!meaning) throw new Error("empty meaning");
      const fixedMeaning = /\byoungest\b/i.test(String(word || ""))
        ? String(meaning).replace(/가장 작은/g, "가장 어린")
        : meaning;
      const fixedRole = /\byoungest\b/i.test(String(word || "") + " " + String(sentence || ""))
        ? String(role || "").replace(/가장 작은/g, "가장 어린")
        : role;
      return cacheAiGloss(word, sentence, { meaning: fixedMeaning, role: fixedRole, pron: pron });
    } catch (err) {
      lastError = err;
      console.warn("[StoryLoom] AI 단어 뜻 실패:", models[i], err && err.message);
    }
  }
  console.warn("[StoryLoom] AI 단어 뜻 최종 실패:", lastError);
  return null;
}

async function fetchAiPhraseGloss(phrase, pageContext) {
  const cacheKey = "phrase::" + String(phrase || "").toLowerCase().slice(0, 160);
  if (aiGlossCache[cacheKey]) return aiGlossCache[cacheKey];
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;
  const systemPrompt = "You are a children's English reading helper API that MUST respond ONLY with a valid JSON object.\nReturn JSON with keys: translation (natural Korean translation of the selected English), note (one short friendly Korean explanation).\nVocabulary consistency: translate youngest as \"가장 어린\" or \"막내\" (fairy-tale siblings). NEVER use \"가장 작은\" for youngest.\nNo markdown.";
  const userMessage = "Selected English: " + phrase + "\nStory context: " + (pageContext || "") + "\nTranslate for an elementary Korean learner.";
  const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];
  for (let i = 0; i < models.length; i++) {
    try {
      const data = await callGroqChatJson(apiKey, models[i], systemPrompt, userMessage, 0.3);
      const translation = String((data && (data.translation || data.korean || data.meaning)) || "").trim();
      const note = String((data && (data.note || data.role || data.context)) || "").trim();
      if (!translation) throw new Error("empty translation");
      const gloss = {
        meaning: enforceYoungestGlossary(phrase, translation),
        role: note || "선택한 구절의 해석이에요.",
        pron: ""
      };
      aiGlossCache[cacheKey] = gloss;
      return gloss;
    } catch (err) {
      console.warn("[StoryLoom] AI 구절 해석 실패:", models[i], err && err.message);
    }
  }
  return null;
}

async function showTooltip(btn, forceAi) {
  const key = tipKeyForWord(btn);
  if (!forceAi && isTooltipVisible() && tipState.key === key) {
    hideTooltip();
    return;
  }
  const word = btn.dataset.word || "";
  const sentence = btn.dataset.sentence || btn.dataset.example || "";
  const resolved = resolveWordInfo(word);
  let meaning = (!isWeakMeaning(btn.dataset.meaning) ? btn.dataset.meaning : "") || resolved.meaning;
  let pron = btn.dataset.pron || resolved.pron || "";
  let contextNote = btn.dataset.context || "";
  tipState.key = key;
  clearWordTipHighlight();
  btn.classList.add("is-tip-open");
  placeTooltipNear(btn.getBoundingClientRect());

  const needsAi = forceAi || isWeakMeaning(meaning);
  if (needsAi) {
    fillTooltipContent(word, meaning || "찾는 중…", pron, sentence, contextNote, "word", true);
    tipState.key = key;
    const ai = await fetchAiWordGloss(word, sentence);
    if (tipState.key !== key) return;
    if (ai) {
      meaning = ai.meaning;
      pron = ai.pron || pron;
      contextNote = ai.role || contextNote;
      btn.dataset.meaning = meaning;
      btn.dataset.pron = pron;
      if (ai.role) btn.dataset.context = ai.role;
    } else if (isWeakMeaning(meaning)) {
      meaning = "뜻을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.";
    }
  }
  fillTooltipContent(word, meaning, pron, sentence, contextNote, "word", false);
  tipState.key = key;
  placeTooltipNear(btn.getBoundingClientRect());
  // 뜻/문맥을 실제로 열어 본 경우 학습 포인트 +2 (같은 단어는 하루 1회)
  if (!isWeakMeaning(meaning)) recordWordViewScore(word);
}

function showSentenceTooltip(btn) {
  const key = tipKeyForSentence(btn);
  if (isTooltipVisible() && tipState.key === key) {
    hideTooltip();
    return;
  }
  const en = btn.dataset.en || "";
  const ko = btn.dataset.ko || "이 문장의 뜻을 확인해 보세요.";
  fillTooltipContent(en, ko, "", "", "이 문장 전체의 한국어 뜻이에요.", "sentence");
  tipState.key = key;
  placeTooltipNear(btn.getBoundingClientRect());
}

function matchSelectionToPageKorean(selectedText) {
  const page = storyPages[currentPage];
  if (!page) return "";
  const enText = page.text_en || plainLine(page.en || []);
  const koText = page.text_ko || page.kr || "";
  const selected = String(selectedText || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!selected) return "";
  const enSentences = splitEnglishSentences(enText);
  const koSentences = splitKoreanSentences(koText);
  for (let i = 0; i < enSentences.length; i++) {
    const sent = enSentences[i].replace(/\s+/g, " ").trim().toLowerCase();
    if (sent === selected || sent.includes(selected) || selected.includes(sent.replace(/[.!?]+$/, ""))) {
      return koSentences[i] || koText;
    }
  }
  const fullEn = enText.replace(/\s+/g, " ").trim().toLowerCase();
  if (fullEn === selected || (selected.length > 20 && fullEn.includes(selected))) {
    return koText;
  }
  return "";
}

function maybeShowInterpretChip(event) {
  if (state.showTranslation) {
    hideInterpretChip();
    return;
  }
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    hideInterpretChip();
    return;
  }
  const text = String(sel.toString() || "").replace(/\s+/g, " ").trim();
  if (!text || text.length < 2) {
    hideInterpretChip();
    return;
  }
  const node = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
  if (!node || (!node.closest("#plainStory") && !node.closest("#flipPage"))) {
    hideInterpretChip();
    return;
  }
  // 단어 하나만 살짝 선택된 단순 클릭은 칩을 띄우지 않음 (더블클릭/클릭 툴팁 사용)
  const words = text.match(/[A-Za-z']+/g) || [];
  if (words.length <= 1 && !/\s/.test(text)) {
    hideInterpretChip();
    return;
  }
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  showInterpretChip(
    text,
    rect,
    event && typeof event.clientX === "number" ? event.clientX : undefined,
    event && typeof event.clientY === "number" ? event.clientY : undefined
  );
}

async function runInterpretSelection() {
  const text = String(pendingSelection.text || "").trim();
  if (!text) {
    hideInterpretChip();
    return;
  }
  const key = tipKeyForSelection(text);
  const rect = pendingSelection.rect || { left: 24, bottom: 120, top: 100 };
  hideInterpretChip();
  fillTooltipContent(text, "해석 중…", "", text, "", "selection", true);
  tipState.key = key;
  placeTooltipNear(rect);

  const page = storyPages[currentPage];
  const pageKo = matchSelectionToPageKorean(text);
  const pageEn = page ? (page.text_en || plainLine(page.en || [])) : "";
  let meaning = pageKo;
  let note = pageKo ? "선택한 구절이 문장과 맞아, 장면 한국어를 보여 드려요." : "";

  if (!meaning) {
    const ai = await fetchAiPhraseGloss(text, pageEn);
    if (tipState.key !== key) return;
    if (ai) {
      meaning = ai.meaning;
      note = ai.role || "선택한 구절의 AI 해석이에요.";
    } else {
      meaning = lookupPhraseMeaning(text);
      note = "사전 뜻으로 이어서 보여 드려요.";
    }
  }
  fillTooltipContent(text, meaning, "", text, note, "selection", false);
  tipState.key = key;
  placeTooltipNear(rect);
}

function formatCleanEnglishText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:…"""''‘’“”])/g, "$1")
    .replace(/([("""''‘’“”])\s+/g, "$1")
    .trim();
}

function renderFlipBookPageHtml(page) {
  const enRaw = page.text_en || plainLine(page.en || []);
  const koRaw = page.text_ko || page.kr || "";
  const en = formatCleanEnglishText(enRaw);
  const ko = String(koRaw || "").replace(/\s+/g, " ").trim();
  return (
    '<div class="flip-book-body">' +
      '<p class="flip-book-en">' + esc(en || "(이 장면의 영어 문장이 아직 없어요)") + "</p>" +
      (ko ? '<p class="flip-book-ko">' + esc(ko) + "</p>" : '<p class="flip-book-ko is-empty">한국어 해석을 준비 중이에요.</p>') +
    "</div>"
  );
}

function updateUI() {
  state.storyPages = storyPages;
  state.currentPage = currentPage;
  state.page = currentPage;
  const total = storyPages.length;
  const page = total ? storyPages[currentPage] : null;
  if (total) persistActiveDraft();
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
  // 스마트 이중 해석: 기존 인터랙티브(단어 클릭 + 토글) 유지
  const dualHtml = renderInteractiveStoryHtml(page, interactive);
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  $("plainStory").innerHTML = '<div class="rounded-2xl bg-violet-50/70 p-4 dark:bg-slate-900"><p class="text-xs font-extrabold text-violet-400 dark:text-gray-200">Scene ' + page.scene + '</p><div class="mt-1 text-lg font-extrabold leading-relaxed">' + dualHtml + '</div><p class="mt-2 text-sm font-bold text-slate-600 dark:text-gray-200 ' + (show ? "" : "hidden") + '">' + esc(page.text_ko || page.kr || "") + "</p></div>";
  $("switchUi").classList.toggle("on", show);
  $("transToggle").setAttribute("aria-pressed", String(show));
  const picture = $("storybook-image");
  picture.src = page.image || currentTemplateImage || "images/three_pigs.png";
  picture.alt = title || "동화 삽화";
  // 인터랙티브 동화책: 문장 해석 버튼 없이 영어 + 한국어 항상 표시
  $("flipPage").innerHTML =
    '<p class="text-xs font-extrabold text-amber-700 dark:text-white">' + esc(title) + " · Scene " + page.scene + "</p>" +
    '<div class="mt-4">' + renderFlipBookPageHtml(page) + "</div>";
}

function renderPlain() { updateUI(); }
function renderFlip() { updateUI(); }

function appendStoryPage(page) {
  ensureClassicOpeningPage();
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const image = page.image || currentTemplateImage || selected.image;
  if (!state.story) {
    state.story = {
      id: "classic-" + (state.template || "pigs"),
      templateKey: state.template || "pigs",
      title: selected.title,
      kr: tpl.title,
      emoji: tpl.emoji,
      cover: tpl.cover,
      art: tpl.art,
      image: selected.image,
      note: tpl.title,
      pages: storyPages,
      published: false,
      level: state.level
    };
  }
  linkActiveStoryToExistingLibraryBook();
  state.story.pages = storyPages;
  state.story.image = selected.image;
  const textEn = page.text_en || plainLine(page.en || []);
  const textKo = page.text_ko || page.kr || "";
  // Scene 1(오프닝)은 절대 덮어쓰지 않고 항상 뒤에 새 장면을 추가
  storyPages.push({
    scene: storyPages.length + 1,
    text_en: textEn,
    text_ko: textKo,
    image: image,
    en: page.en || sentenceToTokens(textEn, []),
    kr: textKo,
    isOpening: false
  });
  currentPage = storyPages.length - 1;
  $("reader").classList.remove("hidden");
  $("flipWrap").classList.remove("hidden");
  updateUI();
  $("flipWrap").scrollIntoView({ behavior: "smooth", block: "center" });
  // 이어쓰기: 기존 책 갱신 / 새 동화: 고유 제목으로 새 책 생성
  if (isCurrentStoryInLibrary()) {
    syncActiveStoryToLibrary({ silent: true, createIfMissing: false });
  } else if (storyPages.length > 1) {
    syncActiveStoryToLibrary({ silent: true, createIfMissing: true });
    updateUI();
  }
  persistActiveDraft();
}

const VOCAB_STORAGE_KEY = "storyloom-vocab";
const DEFAULT_VOCAB = [
  { word: "brave", meaning: "용감한", pron: "/brayv/", example: "The pigs are brave.", from: "아기돼지 삼형제" },
  { word: "kind", meaning: "친절한", pron: "/kynd/", example: "A kind child shares.", from: "황금거위" },
  { word: "forest", meaning: "숲", pron: "/FOR-ist/", example: "Walk in the forest.", from: "빨간 모자" },
  { word: "magic", meaning: "마법의", pron: "/MAJ-ik/", example: "A magic garden.", from: "앨리스" }
];

function normalizeVocabItem(item) {
  if (!item || !item.word) return null;
  return {
    word: String(item.word),
    meaning: String(item.meaning || ""),
    pron: String(item.pron || ""),
    example: String(item.example || ""),
    from: String(item.from || "동화")
  };
}

function loadVocabFromStorage() {
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (raw == null) return DEFAULT_VOCAB.map((item) => normalizeVocabItem(item));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_VOCAB.map((item) => normalizeVocabItem(item));
    return parsed.map(normalizeVocabItem).filter(Boolean);
  } catch (err) {
    return DEFAULT_VOCAB.map((item) => normalizeVocabItem(item));
  }
}

function persistVocab() {
  try {
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(state.vocab || []));
  } catch (err) { /* file:// 등에서 저장이 막힐 수 있음 */ }
}

function renderVocab() {
  const grid = $("vocabGrid");
  if (!state.vocab.length) {
    grid.innerHTML = '<p class="col-span-full rounded-2xl bg-white p-6 text-sm font-bold text-slate-500 shadow-soft dark:bg-slate-800 dark:text-gray-200">아직 저장한 단어가 없어요! 동화를 읽으며 밑줄 단어를 눌러 저장해 보세요 ✨</p>';
    return;
  }
  grid.innerHTML = state.vocab.map((card) => (
    '<article class="flash vocab-card relative rounded-3xl border border-violet-100 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800" data-vocab-word="' + esc(card.word) + '">' +
      '<div class="flex items-start justify-between gap-2">' +
        '<h3 class="text-xl font-black text-violet-700 dark:text-white">' + esc(card.word) + "</h3>" +
        '<button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-lg dark:bg-slate-700" data-action="speak" data-speak="' + esc(card.word) + '" aria-label="' + esc(card.word) + ' 발음 듣기">🔊</button>' +
      "</div>" +
      '<p class="mt-2 text-sm font-extrabold text-slate-500 dark:text-gray-200">' + esc(card.pron) + "</p>" +
      '<p class="text-base font-black text-slate-800 dark:text-white">' + esc(card.meaning) + "</p>" +
      '<p class="mt-2 text-sm font-bold text-slate-600 dark:text-gray-200">"' + esc(card.example) + '"</p>' +
      '<p class="mt-2 text-xs font-extrabold text-pink-500 dark:text-gray-200">from ' + esc(card.from) + "</p>" +
      '<button type="button" class="vocab-complete-btn" data-action="complete-vocab" data-word="' + esc(card.word) + '" aria-label="' + esc(card.word) + ' 학습 완료">학습 완료 ✨</button>' +
    "</article>"
  )).join("");
}

function removeVocabWord(word, cardEl) {
  const key = String(word || "").toLowerCase();
  if (!key) return;
  const finish = () => {
    state.vocab = state.vocab.filter((item) => item.word.toLowerCase() !== key);
    persistVocab();
    renderVocab();
    renderParents();
    toast("“" + word + "” 학습 완료! 단어장에서 빼 두었어요.");
  };
  if (cardEl) {
    cardEl.classList.remove("flash-removing");
    cardEl.classList.add("flash-bounce-out");
    cardEl.style.pointerEvents = "none";
    setTimeout(finish, 420);
  } else {
    finish();
  }
}

function isFriendsOmnibusBook(book) {
  return !!(book && (book.id === FRIENDS_OMNIBUS_ID || book.coverStyle === "friends-quilt"));
}

function bookStatusLabel(book) {
  if (isFriendsOmnibusBook(book)) return "친구들의 선물 🎁";
  return book && book.published ? "출판 완료" : "작성 중";
}

function bookStatusClass(book) {
  if (isFriendsOmnibusBook(book)) return "book-status is-gift";
  return book && book.published ? "book-status is-published" : "book-status is-draft";
}

const FRIENDS_OMNIBUS_ID = "friends-omnibus";
const BOOKS_STORAGE_KEY = "storyloom-books-v2";
const FRIEND_COVER_COLORS = {
  barnaby: "#f3e8ff", // purple-100 (바나비 프로필 테두리)
  milo: "#ffe4e1", // coral-100 (마일로)
  dragon: "#d1fae5", // mint-100 (다이노)
  foxy: "#fef3c7" // amber-100 (퐁이)
};

function friendsQuiltCoverHtml(sizeClass) {
  return (
    '<div class="friends-quilt ' + (sizeClass || "") + '" aria-hidden="true">' +
      '<div class="friends-quilt-grid">' +
        '<div class="friends-quilt-cell" style="background:' + FRIEND_COVER_COLORS.barnaby + '"><span>🐰</span></div>' +
        '<div class="friends-quilt-cell" style="background:' + FRIEND_COVER_COLORS.milo + '"><span>🐱</span></div>' +
        '<div class="friends-quilt-cell" style="background:' + FRIEND_COVER_COLORS.dragon + '"><span>🦕</span></div>' +
        '<div class="friends-quilt-cell" style="background:' + FRIEND_COVER_COLORS.foxy + '"><span>🦊</span></div>' +
      "</div>" +
      '<div class="friends-quilt-caption"><span class="friends-quilt-caption-text">Story Friends Omnibus</span></div>' +
    "</div>"
  );
}

function makeOmnibusPages() {
  const episodes = [
    {
      en: "Barnaby the soft rabbit found a glowing crown and shared a warm hello with every friend.",
      ko: "폭신한 토끼 바나비가 반짝이는 왕관을 발견하고, 친구들마다 따뜻한 인사를 나눴어요."
    },
    {
      en: "Milo put on his coral cape and bravely helped a shy star cross a tiny rainbow bridge.",
      ko: "마일로는 코랄 망토를 두르고, 수줍은 별이 작은 무지개 다리를 건너도록 용감하게 도와주었어요."
    },
    {
      en: "Dino the pastel mint dinosaur baked sweet strawberry milk cookies for a picnic under soft clouds.",
      ko: "파스텔 민트 공룡 다이노는 부드러운 구름 아래 소풍을 위해 달콤한 딸기 우유 쿠키를 구웠어요."
    },
    {
      en: "Foxy tipped his magic hat, whispered a kind spell, and the secret story sparkled for everyone.",
      ko: "퐁이가 마법 모자를 고쳐 쓰고 다정한 주문을 속삭이자, 비밀 이야기가 모두를 위해 반짝였어요."
    }
  ];
  return episodes.map((ep, index) => {
    const textEn = ep.en;
    const textKo = ep.ko;
    return {
      scene: index + 1,
      text_en: textEn,
      text_ko: textKo,
      en: sentenceToTokens(textEn, []),
      kr: textKo,
      image: index === 0 ? "images/barnaby_3d.png"
        : (index === 1 ? "images/milo_3d.png"
          : (index === 2 ? "images/dino_3d.png" : "images/pong_3d.png"))
    };
  });
}

function makeOmnibusBook() {
  return {
    id: FRIENDS_OMNIBUS_ID,
    title: "Story Friends Omnibus",
    kr: "동화 친구들의 비밀 이야기",
    emoji: "✨",
    cover: "friends-quilt",
    coverStyle: "friends-quilt",
    note: "친구들의 선물 🎁",
    pages: makeOmnibusPages(),
    published: false,
    art: "friends",
    isStarter: true
  };
}

// 예전 서재 더미(초기 세팅용)만 제거. 사용자가 '서재에 넣기'로 만든 책은 제목과 무관하게 유지.
function isOneTimeLibraryDummy(book) {
  if (!book || !book.id) return true;
  if (book.userCreated) return false;
  if (book.id === FRIENDS_OMNIBUS_ID) return false;
  // 자유 창작/AI로 생긴 id는 항상 유지
  if (/^(user-|made-|gemini-)/.test(String(book.id))) return false;
  if (book.id === "space" || book.id === "bakery" || book.id === "cape") return true;
  // 예전 자동 시드 classic-* (userCreated 없음)만 제거
  if (/^classic-/.test(String(book.id))) return true;
  if (book.isStarter) return true;
  return false;
}

function cloneStoryPagesForLibrary(pages) {
  const source = Array.isArray(pages) ? pages : [];
  return source.map((page, index) => {
    const textEn = page && (page.text_en || plainLine(page.en || [])) || "";
    const textKo = page && (page.text_ko || page.kr) || "";
    const enTokens = Array.isArray(page && page.en)
      ? page.en.map((part) => (
        typeof part === "string"
          ? part
          : {
            text: part.text,
            meaning: part.meaning,
            pron: part.pron,
            example: part.example,
            context: part.context || ""
          }
      ))
      : sentenceToTokens(textEn, []);
    return {
      scene: (page && page.scene) || (index + 1),
      text_en: textEn,
      text_ko: textKo,
      image: (page && page.image) || "",
      en: enTokens,
      kr: textKo,
      isOpening: !!(page && page.isOpening)
    };
  });
}

const ACTIVE_DRAFT_KEY = "storyloom_active_draft";

function serializeActiveDraft() {
  if (!storyPages.length) return null;
  const story = state.story || {};
  return {
    version: 2,
    savedAt: Date.now(),
    template: state.template || story.templateKey || null,
    templateImage: state.templateImage || currentTemplateImage || "",
    character: state.character || null,
    level: state.level || "beginner",
    activeBookId: state.activeBookId || story.libraryId || story.activeBookId || null,
    currentPage: currentPage,
    showTranslation: !!state.showTranslation,
    relayMadlib: state.relayMadlib || "",
    relayMadlibKo: state.relayMadlibKo || "",
    lastSuggestions: Array.isArray(state.lastSuggestions) ? state.lastSuggestions.slice(0, 3) : [],
    usedSuggestions: Array.isArray(state.usedSuggestions) ? state.usedSuggestions.slice() : [],
    suggestionPoolCursor: Number(state.suggestionPoolCursor) || 0,
    story: {
      id: story.id || null,
      libraryId: story.libraryId || state.activeBookId || null,
      title: story.title || "",
      kr: story.kr || "",
      emoji: story.emoji || "",
      cover: story.cover || "",
      coverImage: story.coverImage || story.image || "",
      art: story.art || null,
      image: story.image || "",
      templateKey: story.templateKey || state.template || null,
      userCreated: !!story.userCreated
    },
    scenes: cloneStoryPagesForLibrary(storyPages)
  };
}

function persistActiveDraft() {
  try {
    const draft = serializeActiveDraft();
    if (!draft) return false;
    localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.warn("[StoryLoom] 자유 창작 draft 저장 실패:", err && err.message);
    return false;
  }
}

function clearActiveDraft() {
  try { localStorage.removeItem(ACTIVE_DRAFT_KEY); } catch (err) { /* ignore */ }
}

function applyPagesToWorkspace(pages, options) {
  const opts = options || {};
  const nextPages = cloneStoryPagesForLibrary(pages);
  if (!nextPages.length) return false;
  storyPages.length = 0;
  nextPages.forEach((page) => storyPages.push(page));
  const wantedPage = Number(opts.currentPage);
  currentPage = Number.isFinite(wantedPage)
    ? Math.max(0, Math.min(nextPages.length - 1, wantedPage))
    : (nextPages.length - 1);
  state.storyPages = storyPages;
  state.currentPage = currentPage;
  state.page = currentPage;
  return true;
}

function restoreActiveDraft() {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    if (!draft || !Array.isArray(draft.scenes) || !draft.scenes.length) return false;
    if (!applyPagesToWorkspace(draft.scenes, { currentPage: draft.currentPage })) return false;

    state.template = draft.template || (draft.story && draft.story.templateKey) || state.template;
    state.templateImage = draft.templateImage || state.templateImage || currentTemplateImage;
    currentTemplateImage = state.templateImage;
    if (draft.character && CHARACTERS[draft.character]) state.character = draft.character;
    if (draft.level && LEVELS[draft.level]) state.level = draft.level;
    if (typeof draft.showTranslation === "boolean") state.showTranslation = draft.showTranslation;

    state.usedSuggestions = Array.isArray(draft.usedSuggestions) ? draft.usedSuggestions.slice() : [];
    state.suggestionPoolCursor = Number(draft.suggestionPoolCursor) || 0;
    state.lastSuggestions = Array.isArray(draft.lastSuggestions) ? draft.lastSuggestions.slice(0, 3) : [];
    if (storyPages.length > 1) {
      const latest = storyPages[storyPages.length - 1];
      const latestEn = latest.text_en || plainLine(latest.en || []);
      const savedEn = sanitizeRelayMadlibText(draft.relayMadlib || "");
      const savedKo = String(draft.relayMadlibKo || "").trim();
      const staleMadlib = !draft.relayMadlib || isLegacyJustNowMadlib(draft.relayMadlib)
        || isRelayPairLikelyMismatched(savedEn, savedKo);
      if (staleMadlib) {
        state.relayMadlib = buildRelayMadlibFromScene(latestEn);
        state.relayMadlibKo = buildRelayMadlibKoFromScene(latestEn, state.relayMadlib);
      } else {
        state.relayMadlib = savedEn;
        state.relayMadlibKo = savedKo;
      }
      if (shouldRefreshRelaySuggestions(state.lastSuggestions)) {
        state.lastSuggestions = inventSuggestionsFromScene(latestEn, "");
      }
    } else {
      const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
      state.relayMadlib = sanitizeRelayMadlibText(draft.relayMadlib || tpl.madlib || "");
      state.relayMadlibKo = pairedRelayMadlibKoForEnglish(state.relayMadlib)
        || String(draft.relayMadlibKo || tpl.madlibKo || getCleanRelayMadlibKo());
    }

    const activeId = draft.activeBookId || (draft.story && draft.story.libraryId) || null;
    state.activeBookId = activeId;
    state.story = {
      id: (draft.story && draft.story.id) || activeId || ("classic-" + (state.template || "pigs")),
      libraryId: activeId || (draft.story && draft.story.libraryId) || null,
      activeBookId: activeId,
      title: (draft.story && draft.story.title) || "",
      kr: (draft.story && draft.story.kr) || "",
      emoji: (draft.story && draft.story.emoji) || "",
      cover: (draft.story && draft.story.cover) || "",
      coverImage: (draft.story && draft.story.coverImage) || "",
      art: (draft.story && draft.story.art) || null,
      image: (draft.story && draft.story.image) || state.templateImage || "",
      templateKey: (draft.story && draft.story.templateKey) || state.template || null,
      userCreated: !!(draft.story && draft.story.userCreated) || !!activeId,
      pages: storyPages,
      published: false,
      level: state.level
    };
    if (activeId) bindActiveBookId(activeId);
    // 명시적 bookId가 있을 때만 이어쓰기 연결 (제목만 같다고 원본에 붙이지 않음)
    linkActiveStoryToExistingLibraryBook();

    $("reader").classList.remove("hidden");
    $("flipWrap").classList.remove("hidden");
    return true;
  } catch (err) {
    console.warn("[StoryLoom] 자유 창작 draft 복원 실패:", err && err.message);
    return false;
  }
}

function loadBookIntoCreateWorkspace(bookId) {
  const book = ensurePages(findBook(bookId));
  if (!book || isOmnibusReaderBook(book)) {
    toast("이어서 쓸 수 있는 동화가 아니에요.");
    return false;
  }
  const sourcePages = Array.isArray(book.pages) && book.pages.length
    ? book.pages
    : (Array.isArray(book.scenes) ? book.scenes : []);
  if (!applyPagesToWorkspace(sourcePages, { currentPage: sourcePages.length - 1 })) {
    toast("불러올 장면이 없어요.");
    return false;
  }

  const templateKey = resolveTemplateKeyFromBook(book) || book.templateKey || book.art || state.template;
  if (templateKey && (TEMPLATES[templateKey] || CLASSIC_STORIES[templateKey])) {
    state.template = templateKey;
  }
  const classic = CLASSIC_STORIES[state.template];
  state.templateImage = (classic && classic.image) || book.coverImage || extractCoverImage(book) || state.templateImage;
  currentTemplateImage = state.templateImage;
  if (book.character && CHARACTERS[book.character]) state.character = book.character;

  bindActiveBookId(book.id);
  state.story = {
    id: book.id,
    libraryId: book.id,
    activeBookId: book.id,
    title: book.title,
    kr: book.kr,
    emoji: book.emoji,
    cover: book.cover,
    coverImage: book.coverImage || extractCoverImage(book) || "",
    art: book.art || state.template || null,
    image: state.templateImage,
    templateKey: state.template || book.templateKey || null,
    userCreated: true,
    pages: storyPages,
    published: !!book.published,
    level: state.level
  };

  closeSampleReader();
  setTab("create");
  renderCharacter();
  renderLevel();
  syncTemplateCardHighlight(state.template);
  const latest = storyPages[storyPages.length - 1];
  const latestEn = latest ? (latest.text_en || plainLine(latest.en || [])) : "";
  if (storyPages.length <= 1 && !(book.relayState && book.relayState.suggestions && book.relayState.suggestions.length)) {
    resetRelayComposerToTemplate();
  } else {
    // 서재에 저장된 마지막 추천어/사용 이력 복원 (없으면 마지막 장면 기준 새로 생성)
    applyRelayStateFromBook(book, latestEn);
  }
  updateUI();
  syncTemplateCardHighlight(state.template);
  persistActiveDraft();
  $("flipWrap").scrollIntoView({ behavior: "smooth", block: "center" });
  toast("서재의 동화를 불러왔어요. 이어서 써 보세요! ✨");
  return true;
}

function hashString(text) {
  const source = String(text || "");
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) - hash) + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function extractCoverImage(book) {
  if (!book) return "";
  const candidates = [
    book.coverImage,
    book.imageUrl,
    book.image,
    book.thumbnail
  ];
  for (let i = 0; i < candidates.length; i++) {
    const value = String(candidates[i] || "").trim();
    if (value && value !== "friends-quilt") return value;
  }
  if (Array.isArray(book.pages)) {
    for (let i = 0; i < book.pages.length; i++) {
      const pageImage = book.pages[i] && book.pages[i].image;
      if (pageImage) return String(pageImage);
    }
  }
  const key = book.templateKey || book.art;
  if (key && CLASSIC_STORIES[key] && CLASSIC_STORIES[key].image) {
    return CLASSIC_STORIES[key].image;
  }
  return "";
}

function resolveThemeByKeywords(titleText) {
  const text = String(titleText || "").toLowerCase();
  const rules = [
    {
      test: /(돼지|pig|pigs)/i,
      emoji: "🐷",
      cover: "linear-gradient(160deg,#ff9eb5,#ffd0a8)"
    },
    {
      test: /(앨리스|alice|wonderland|시계|토끼|rabbit|teapot|tea)/i,
      emoji: "🫖",
      altEmoji: "🕰️",
      cover: "linear-gradient(160deg,#c4b5fd,#f9a8d4)"
    },
    {
      test: /(빨간\s*모자|red riding|riding hood|늑대|wolf|숲|forest)/i,
      emoji: "🧺",
      altEmoji: "🍎",
      cover: "linear-gradient(160deg,#86efac,#fde68a)"
    },
    {
      test: /(황금거위|golden goose|goose|거위|오리|duck|새|swan|bird)/i,
      emoji: "🪿",
      altEmoji: "🦢",
      cover: "linear-gradient(160deg,#fde68a,#fdba74)"
    },
    {
      test: /(우주|space|별|star|달|moon|로켓|rocket)/i,
      emoji: "🚀",
      altEmoji: "🌟",
      cover: "linear-gradient(160deg,#93c5fd,#c7d2fe)"
    },
    {
      test: /(바다|ocean|sea|인어|mermaid|물고기|fish|whale)/i,
      emoji: "🐳",
      cover: "linear-gradient(160deg,#67e8f9,#a7f3d0)"
    },
    {
      test: /(공룡|dino|dinosaur|dragon|드래곤|마법|magic|wizard|spell)/i,
      emoji: "🐉",
      altEmoji: "🪄",
      cover: "linear-gradient(160deg,#f9a8d4,#ddd6fe)"
    }
  ];
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].test.test(text)) {
      const pickAlt = rules[i].altEmoji && (hashString(text) % 2 === 1);
      return {
        emoji: pickAlt ? rules[i].altEmoji : rules[i].emoji,
        cover: rules[i].cover,
        matched: true
      };
    }
  }
  return null;
}

function resolveHashCoverTheme(seedText) {
  const palettes = [
    { emoji: "📖", cover: "linear-gradient(160deg,#fecdd3,#fed7aa)" }, // peach
    { emoji: "🏰", cover: "linear-gradient(160deg,#a7f3d0,#bbf7d0)" }, // mint
    { emoji: "🌈", cover: "linear-gradient(160deg,#93c5fd,#c4b5fd)" }, // sky
    { emoji: "🦄", cover: "linear-gradient(160deg,#e9d5ff,#fbcfe8)" }, // lavender
    { emoji: "🧸", cover: "linear-gradient(160deg,#fde68a,#fcd34d)" }  // lemon
  ];
  return palettes[hashString(seedText) % palettes.length];
}

function resolveBookCoverTheme(book) {
  const title = String((book && book.title) || "");
  const kr = String((book && book.kr) || "");
  const seed = [title, kr, (book && book.id) || "", (book && book.templateKey) || ""].join("|");
  const coverImage = extractCoverImage(book);
  const keywordTheme = resolveThemeByKeywords(title + " " + kr);
  const hashTheme = resolveHashCoverTheme(seed);
  const theme = keywordTheme || hashTheme;
  return {
    emoji: theme.emoji,
    cover: theme.cover,
    coverImage: coverImage,
    coverStyle: ""
  };
}

function captureRelayState() {
  return {
    suggestions: Array.isArray(state.lastSuggestions) ? state.lastSuggestions.slice(0, 3) : [],
    usedSuggestions: Array.isArray(state.usedSuggestions) ? state.usedSuggestions.slice() : [],
    relayTemplate: state.relayMadlib || "",
    relayMadlib: state.relayMadlib || "",
    relayMadlibKo: state.relayMadlibKo || "",
    relayTemplateKo: state.relayMadlibKo || "",
    suggestionPoolCursor: Number(state.suggestionPoolCursor) || 0
  };
}

function normalizeRelayState(raw) {
  if (!raw || typeof raw !== "object") return null;
  const suggestions = Array.isArray(raw.suggestions)
    ? raw.suggestions.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 3)
    : (Array.isArray(raw.lastSuggestions)
      ? raw.lastSuggestions.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 3)
      : []);
  const usedSuggestions = Array.isArray(raw.usedSuggestions)
    ? raw.usedSuggestions.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  let relayTemplate = String(raw.relayTemplate || raw.relayMadlib || "").trim();
  if (!relayTemplate || isLegacyJustNowMadlib(relayTemplate)) {
    relayTemplate = getCleanRelayMadlib();
  }
  let relayMadlibKo = String(raw.relayMadlibKo || raw.relayTemplateKo || "").trim();
  if (!relayMadlibKo) relayMadlibKo = getCleanRelayMadlibKo();
  return {
    suggestions: suggestions,
    usedSuggestions: usedSuggestions,
    relayTemplate: relayTemplate,
    relayMadlib: relayTemplate,
    relayMadlibKo: relayMadlibKo,
    relayTemplateKo: relayMadlibKo,
    suggestionPoolCursor: Number(raw.suggestionPoolCursor) || 0
  };
}

function applyRelayStateFromBook(book, latestEnglish) {
  const saved = normalizeRelayState(book && (book.relayState || book.relay));
  const fallbackEn = latestEnglish || "";
  state.usedSuggestions = (saved && saved.usedSuggestions) ? saved.usedSuggestions.slice() : [];
  state.suggestionPoolCursor = (saved && saved.suggestionPoolCursor) || 0;
  const savedSuggestions = saved && saved.suggestions ? saved.suggestions.slice(0, 3) : [];
  const needsRefresh = shouldRefreshRelaySuggestions(savedSuggestions);
  state.lastSuggestions = needsRefresh
    ? inventSuggestionsFromScene(fallbackEn, "")
    : savedSuggestions;
  const savedMadlib = sanitizeRelayMadlibText(
    (saved && saved.relayTemplate) || ""
  );
  const savedKo = saved && saved.relayMadlibKo ? String(saved.relayMadlibKo).trim() : "";
  const useContextual = needsRefresh || !saved || !saved.relayTemplate
    || isLegacyJustNowMadlib(saved.relayTemplate)
    || isRelayPairLikelyMismatched(savedMadlib, savedKo);
  if (useContextual) {
    state.relayMadlib = buildRelayMadlibFromScene(fallbackEn);
    state.relayMadlibKo = buildRelayMadlibKoFromScene(fallbackEn, state.relayMadlib);
  } else {
    state.relayMadlib = savedMadlib;
    state.relayMadlibKo = savedKo || pairedRelayMadlibKoForEnglish(savedMadlib);
  }
  updateRelayComposerFromLatestScene({
    english: fallbackEn,
    madlib: state.relayMadlib,
    madlibKo: state.relayMadlibKo,
    suggestions: state.lastSuggestions,
    forceRefresh: needsRefresh,
    preferLocalContextual: useContextual
  });
  return !needsRefresh;
}

function normalizeStoredBook(book) {
  if (!book || !book.id || !book.title) return null;
  // 통합본은 절대 정규화/테마 덮어쓰기 하지 않음
  if (book.id === FRIENDS_OMNIBUS_ID || book.coverStyle === "friends-quilt") return null;
  const published = !!book.published;
  const pages = Array.isArray(book.pages) ? cloneStoryPagesForLibrary(book.pages) : null;
  const themed = resolveBookCoverTheme({
    id: book.id,
    title: book.title,
    kr: book.kr,
    templateKey: book.templateKey || book.art || null,
    art: book.art || null,
    pages: pages,
    coverImage: book.coverImage,
    imageUrl: book.imageUrl,
    image: book.image,
    thumbnail: book.thumbnail
  });
  const relayState = normalizeRelayState(book.relayState || book.relay) || null;
  return {
    id: String(book.id),
    title: String(book.title),
    kr: String(book.kr || ""),
    emoji: themed.emoji,
    cover: themed.cover,
    coverImage: themed.coverImage || "",
    coverStyle: "",
    note: published ? "출판 완료" : "작성 중",
    pages: pages,
    published: published,
    art: book.art || null,
    templateKey: book.templateKey || null,
    character: book.character || null,
    userCreated: !!book.userCreated || /^(user-|made-|gemini-)/.test(String(book.id)),
    relayState: relayState,
    isStarter: false
  };
}

function normalizeBookTitleKey(title) {
  return String(title || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function bookSceneCount(book) {
  if (!book) return 0;
  if (Array.isArray(book.pages)) return book.pages.length;
  if (Array.isArray(book.scenes)) return book.scenes.length;
  return 0;
}

function bookIdentityKey(book) {
  if (!book) return "";
  const titleKey = normalizeBookTitleKey(book.title);
  const krKey = normalizeBookTitleKey(book.kr);
  const templateKey = String(book.templateKey || book.art || "").toLowerCase();
  // 같은 영문 제목이면 동일 동화로 취급 (Alice in Wonderland 중복 정리용)
  if (titleKey) return "title:" + titleKey;
  if (templateKey) return "tpl:" + templateKey;
  if (krKey) return "kr:" + krKey;
  return book.id ? "id:" + book.id : "";
}

function preferRicherBook(a, b) {
  const aCount = bookSceneCount(a);
  const bCount = bookSceneCount(b);
  if (aCount !== bCount) return aCount >= bCount ? a : b;
  // 장면 수가 같으면 더 최근에 가까운 id(뒤에 온 값) 유지
  return b || a;
}

function dedupeLibraryBooks(list) {
  const byId = {};
  (Array.isArray(list) ? list : []).forEach((book) => {
    if (!book || !book.id) return;
    byId[book.id] = byId[book.id] ? preferRicherBook(byId[book.id], book) : book;
  });
  const uniqueById = Object.keys(byId).map((id) => byId[id]);
  const byIdentity = {};
  uniqueById.forEach((book) => {
    const key = bookIdentityKey(book) || ("id:" + book.id);
    byIdentity[key] = byIdentity[key] ? preferRicherBook(byIdentity[key], book) : book;
  });
  return Object.keys(byIdentity).map((key) => byIdentity[key]);
}

function ensureOmnibusFirst(list) {
  const cleaned = (Array.isArray(list) ? list : [])
    .map(normalizeStoredBook)
    .filter((book) => book && book.id !== FRIENDS_OMNIBUS_ID && !isOneTimeLibraryDummy(book));
  const deduped = dedupeLibraryBooks(cleaned);
  return [makeOmnibusBook()].concat(deduped);
}

function sanitizeBooksList(list) {
  return ensureOmnibusFirst(list);
}

function persistBooks() {
  try {
    const toSave = dedupeLibraryBooks(
      (state.books || [])
        .filter((book) => book && book.id !== FRIENDS_OMNIBUS_ID)
        .map((book) => normalizeStoredBook(book))
        .filter(Boolean)
    );
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify({ version: 4, books: toSave }));
  } catch (err) {
    console.warn("[StoryLoom] 서재 저장 실패:", err && err.message);
  }
}

function loadBooksFromStorage() {
  try {
    const raw = localStorage.getItem(BOOKS_STORAGE_KEY);
    if (!raw) return ensureOmnibusFirst([]);
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : (parsed && parsed.books);
    return ensureOmnibusFirst(list);
  } catch (err) {
    return ensureOmnibusFirst([]);
  }
}

function findMatchingLibraryBook(hint) {
  const books = Array.isArray(state.books) && state.books.length
    ? state.books
    : loadBooksFromStorage();
  if (!hint) return null;
  if (hint.id) {
    const byId = books.find((book) => book && book.id === hint.id && book.id !== FRIENDS_OMNIBUS_ID);
    if (byId) return byId;
  }
  if (hint.libraryId) {
    const byLibraryId = books.find((book) => book && book.id === hint.libraryId);
    if (byLibraryId) return byLibraryId;
  }
  const identity = bookIdentityKey(hint);
  if (identity) {
    const byIdentity = books.find((book) => book && book.id !== FRIENDS_OMNIBUS_ID && bookIdentityKey(book) === identity);
    if (byIdentity) return byIdentity;
  }
  const templateKey = String(hint.templateKey || hint.art || "").toLowerCase();
  if (templateKey) {
    const byTemplate = books.find((book) => {
      if (!book || book.id === FRIENDS_OMNIBUS_ID) return false;
      return String(book.templateKey || book.art || "").toLowerCase() === templateKey;
    });
    if (byTemplate) return byTemplate;
  }
  return null;
}

function bindActiveBookId(bookId) {
  if (!bookId || bookId === FRIENDS_OMNIBUS_ID) return;
  state.activeBookId = bookId;
  if (!state.story) state.story = {};
  state.story.libraryId = bookId;
  state.story.id = bookId;
  state.story.activeBookId = bookId;
}

function linkActiveStoryToExistingLibraryBook() {
  if (!state.story) return null;
  // 이어쓰기 모드에서만 명시적 bookId로 연결 (제목/템플릿 자동 매칭으로 원본을 덮지 않음)
  const explicitIds = [
    state.activeBookId,
    state.story.libraryId,
    state.story.activeBookId
  ].filter((id) => id && id !== FRIENDS_OMNIBUS_ID && !/^classic-/.test(String(id)));
  for (let i = 0; i < explicitIds.length; i++) {
    const found = findBook(explicitIds[i]);
    if (found) {
      bindActiveBookId(found.id);
      return found;
    }
  }
  return null;
}

function isCurrentStoryInLibrary() {
  if (state.activeBookId && findBook(state.activeBookId)) return true;
  if (state.story && state.story.libraryId && findBook(state.story.libraryId)) return true;
  return false;
}

function resolveActiveLibraryId(createIfMissing) {
  const linked = linkActiveStoryToExistingLibraryBook();
  if (linked) return linked.id;
  if (state.activeBookId && findBook(state.activeBookId)) return state.activeBookId;
  if (state.story && state.story.libraryId && findBook(state.story.libraryId)) {
    return state.story.libraryId;
  }
  if (state.story && state.story.id && /^(user-|made-|gemini-)/.test(String(state.story.id)) && findBook(state.story.id)) {
    return state.story.id;
  }
  if (createIfMissing) return "user-" + Date.now();
  return null;
}

function buildLibraryBookFromCurrentStory(options) {
  const opts = options || {};
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const classic = CLASSIC_STORIES[state.template] || null;
  const story = state.story || {};
  const pages = cloneStoryPagesForLibrary(storyPages.length ? storyPages : (story.pages || []));
  if (!pages.length) return null;
  const characterKey = state.character || (story.character || null);
  const libraryId = resolveActiveLibraryId(opts.createIfMissing !== false);
  if (!libraryId) return null;
  const existing = findBook(libraryId);
  const isNewBook = !existing;
  let title = story.title || (classic && classic.title) || tpl.en || "My Story";
  let kr = story.kr || tpl.title || "내가 만든 동화";
  if (isNewBook) {
    const unique = allocateUniqueLibraryTitles(
      title || (classic && classic.title) || tpl.en || "My Story",
      kr || tpl.title || "내가 만든 동화"
    );
    title = unique.title;
    kr = unique.kr;
    if (!state.story) state.story = {};
    state.story.title = title;
    state.story.kr = kr;
  }
  const draft = {
    id: libraryId,
    title: title,
    kr: kr,
    templateKey: story.templateKey || state.template || null,
    art: story.art || tpl.art || null,
    pages: pages,
    coverImage: story.coverImage || story.imageUrl || story.image || "",
    imageUrl: story.imageUrl || "",
    image: story.image || currentTemplateImage || (classic && classic.image) || "",
    thumbnail: story.thumbnail || ""
  };
  const themed = resolveBookCoverTheme(draft);
  const relayState = captureRelayState();
  return {
    id: libraryId,
    title: title,
    kr: kr,
    emoji: themed.emoji,
    cover: themed.cover,
    coverImage: themed.coverImage || "",
    coverStyle: "",
    note: "작성 중",
    pages: pages,
    scenes: pages,
    published: false,
    art: story.art || tpl.art || null,
    templateKey: story.templateKey || state.template || null,
    character: characterKey,
    userCreated: true,
    activeBookId: libraryId,
    relayState: relayState,
    isStarter: false
  };
}

function upsertBookIntoLibrary(book) {
  if (!book || !book.id) return { updated: false, book: null };
  state.books = loadBooksFromStorage();
  // id로만 갱신 — 제목/템플릿 자동 매칭으로 다른 책을 덮어쓰지 않음
  const existingIndex = state.books.findIndex((item) => item && item.id === book.id);
  let updated = false;
  if (existingIndex >= 0) {
    const previous = state.books[existingIndex];
    const wasPublished = !!(previous && previous.published);
    book.published = wasPublished;
    book.note = wasPublished ? "출판 완료" : "작성 중";
    book.id = previous.id;
    state.books[existingIndex] = book;
    updated = true;
  } else {
    state.books.splice(1, 0, book);
    updated = false;
  }
  state.books = ensureOmnibusFirst(state.books);
  persistBooks();
  shelfBooks();
  bindActiveBookId(book.id);
  return { updated: updated, book: book };
}

function syncActiveStoryToLibrary(options) {
  const opts = options || {};
  const createIfMissing = opts.createIfMissing !== false;
  if (!storyPages.length && !(state.story && state.story.pages && state.story.pages.length)) {
    if (!opts.silent) toast("먼저 동화 장면을 만들어 주세요.");
    return { ok: false, updated: false };
  }
  // 자동 동기화는 이미 등록된 책만
  if (!createIfMissing && !isCurrentStoryInLibrary()) {
    return { ok: false, updated: false };
  }
  const book = buildLibraryBookFromCurrentStory({ createIfMissing: createIfMissing });
  if (!book) {
    if (!opts.silent) toast("서재에 넣을 동화 내용이 없어요.");
    return { ok: false, updated: false };
  }
  if (!state.story) state.story = {};
  state.story.pages = storyPages;
  state.story.userCreated = true;
  state.story.cover = book.cover;
  state.story.coverImage = book.coverImage || "";
  state.story.emoji = book.emoji;
  state.story.character = book.character;
  state.story.title = book.title;
  state.story.kr = book.kr;
  state.story.templateKey = book.templateKey;
  const result = upsertBookIntoLibrary(book);
  persistActiveDraft();
  return { ok: true, updated: result.updated, book: result.book };
}

function saveCurrentStoryToLibrary() {
  const result = syncActiveStoryToLibrary({ silent: true, createIfMissing: true });
  return !!(result && result.ok);
}

function bookCoverHtml(book, mode) {
  if (book && (book.coverStyle === "friends-quilt" || book.cover === "friends-quilt" || book.id === FRIENDS_OMNIBUS_ID)) {
    return friendsQuiltCoverHtml(mode === "modal" ? "is-modal" : "is-shelf");
  }
  const emoji = (book && book.emoji) || "📖";
  const title = (book && book.title) || "My Story";
  const image = (book && (book.coverImage || extractCoverImage(book))) || "";
  const isModal = mode === "modal";
  if (image) {
    return (
      '<div class="book-cover-with-image' + (isModal ? " is-modal" : "") + '">' +
        '<div class="book-cover-thumb-wrap">' +
          '<img src="' + esc(image) + '" alt="" class="book-cover-thumb" loading="lazy">' +
        "</div>" +
        '<div class="book-cover-meta">' +
          '<span class="book-cover-emoji">' + emoji + "</span>" +
          '<span class="book-cover-title">' + esc(title) + "</span>" +
        "</div>" +
      "</div>"
    );
  }
  if (isModal) {
    return (
      '<div class="book-cover-emoji-only is-modal">' +
        '<span class="book-cover-emoji">' + emoji + "</span>" +
        '<span class="book-cover-title">' + esc(title) + "</span>" +
      "</div>"
    );
  }
  return (
    '<div class="book-cover-emoji-only">' +
      '<span class="book-cover-emoji">' + emoji + "</span>" +
      '<span class="book-cover-title">' + esc(title) + "</span>" +
    "</div>"
  );
}

function shelfBooks() {
  const rows = [];
  for (let i = 0; i < state.books.length; i += 3) rows.push(state.books.slice(i, i + 3));
  $("bookshelf").innerHTML = rows.map((row) => '<div><div class="flex flex-wrap items-end gap-4 px-2">' + row.map((book) => {
    const status = bookStatusLabel(book);
    const kr = book.kr || "";
    const isQuilt = book.coverStyle === "friends-quilt" || book.cover === "friends-quilt" || book.id === FRIENDS_OMNIBUS_ID;
    const coverInner = bookCoverHtml(book, "shelf");
    const hasImage = !isQuilt && !!(book.coverImage || extractCoverImage(book));
    const pastel = book.cover || "linear-gradient(160deg,#c4b5fd,#f9a8d4)";
    const coverStyle = isQuilt ? "" : ' style="background:' + pastel + '"';
    const coverClass = isQuilt
      ? "book-cover-shell h-40 overflow-hidden rounded-2xl shadow-lg"
      : ("book-cover-card h-40 overflow-hidden rounded-2xl shadow-lg" + (hasImage ? " has-image" : " flex flex-col justify-between p-3 text-white"));
    const action = isFriendsOmnibusBook(book) ? "read-sample" : "read-library";
    return (
      '<button type="button" data-action="' + action + '" data-id="' + esc(book.id) + '" class="book-stand w-28 text-left sm:w-32">' +
        '<div class="' + coverClass + '"' + coverStyle + ">" + coverInner + "</div>" +
        (kr ? '<p class="mt-1.5 text-center text-[11px] font-extrabold text-slate-500 dark:text-gray-300">' + esc(kr) + "</p>" : "") +
        '<p class="mt-1 text-center"><span class="' + bookStatusClass(book) + '">' + esc(status) + "</span></p>" +
      "</button>"
    );
  }).join("") + '</div><div class="shelf-wood mt-2"></div></div>').join("");
}

const WEEK_ACTIVITY_KEY = "storyloom-week-activity";
const WEEK_VOCAB_COUNT_KEY = "storyloom-week-vocab-count";
const LEARNING_POINTS = {
  vocab: 1,
  word_view: 2,
  story: 1, // 자유 창작 AI 릴레이 작문
  relay: 1, // 하위 호환
  community: 1, // 커뮤니티 이어쓰기
  publish: 5
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function resolveLevelKey(level) {
  return LEVELS[level] ? level : (LEVELS[state.level] ? state.level : "beginner");
}

function weekActivityStorageKey(level) {
  return WEEK_ACTIVITY_KEY + ":" + resolveLevelKey(level);
}

function getMondayDateKey(baseDate) {
  const source = baseDate instanceof Date ? baseDate : new Date();
  const date = new Date(source.getFullYear(), source.getMonth(), source.getDate());
  const day = date.getDay(); // 0=일 ... 6=토
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
}

function todayDateKey(baseDate) {
  const source = baseDate instanceof Date ? baseDate : new Date();
  return source.getFullYear() + "-" + pad2(source.getMonth() + 1) + "-" + pad2(source.getDate());
}

function todayWeekdayIndex(baseDate) {
  const day = (baseDate instanceof Date ? baseDate : new Date()).getDay();
  return (day + 6) % 7; // 월=0 ... 일=6
}

function emptyWeekCounts() {
  return [0, 0, 0, 0, 0, 0, 0];
}

function normalizeWeekCounts(counts) {
  const next = emptyWeekCounts();
  if (!Array.isArray(counts)) return next;
  for (let i = 0; i < 7; i++) {
    const n = Number(counts[i]);
    next[i] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }
  return next;
}

function parseWeekActivityPayload(raw, weekStart) {
  if (!raw) return { weekStart: weekStart, counts: emptyWeekCounts(), viewedWords: {} };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.weekStart !== weekStart) {
      return { weekStart: weekStart, counts: emptyWeekCounts(), viewedWords: {} };
    }
    return {
      weekStart: weekStart,
      counts: normalizeWeekCounts(parsed.counts),
      viewedWords: parsed.viewedWords && typeof parsed.viewedWords === "object" ? parsed.viewedWords : {}
    };
  } catch (err) {
    return { weekStart: weekStart, counts: emptyWeekCounts(), viewedWords: {} };
  }
}

function migrateLegacyWeekActivity(weekStart) {
  try {
    const legacy = localStorage.getItem(WEEK_ACTIVITY_KEY);
    if (!legacy) return;
    const parsed = parseWeekActivityPayload(legacy, weekStart);
    const beginnerKey = weekActivityStorageKey("beginner");
    if (!localStorage.getItem(beginnerKey) && parsed.weekStart === weekStart) {
      localStorage.setItem(beginnerKey, JSON.stringify(parsed));
    }
    localStorage.removeItem(WEEK_ACTIVITY_KEY);
  } catch (err) { /* ignore */ }
}

function loadWeekActivity(level) {
  const weekStart = getMondayDateKey();
  migrateLegacyWeekActivity(weekStart);
  try {
    const raw = localStorage.getItem(weekActivityStorageKey(level));
    return parseWeekActivityPayload(raw, weekStart);
  } catch (err) {
    return { weekStart: weekStart, counts: emptyWeekCounts(), viewedWords: {} };
  }
}

function persistWeekActivity(level) {
  const lvl = resolveLevelKey(level);
  try {
    localStorage.setItem(weekActivityStorageKey(lvl), JSON.stringify({
      weekStart: state.weekStart || getMondayDateKey(),
      counts: normalizeWeekCounts(state.week),
      viewedWords: state.weekViewedWords || {}
    }));
  } catch (err) { /* file:// 등에서 저장이 막힐 수 있음 */ }
}

function syncWeekActivityFromStorage(level) {
  const lvl = resolveLevelKey(level);
  const data = loadWeekActivity(lvl);
  state.weekLevel = lvl;
  state.weekStart = data.weekStart;
  state.week = data.counts.slice();
  state.weekViewedWords = data.viewedWords || {};
  return state.week;
}

function loadWeekVocabCount() {
  const weekStart = getMondayDateKey();
  try {
    const raw = localStorage.getItem(WEEK_VOCAB_COUNT_KEY);
    if (!raw) return { weekStart: weekStart, count: 0 };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.weekStart !== weekStart) return { weekStart: weekStart, count: 0 };
    const count = Math.max(0, Math.floor(Number(parsed.count) || 0));
    return { weekStart: weekStart, count: count };
  } catch (err) {
    return { weekStart: weekStart, count: 0 };
  }
}

function persistWeekVocabCount() {
  try {
    localStorage.setItem(WEEK_VOCAB_COUNT_KEY, JSON.stringify({
      weekStart: state.weekVocabWeekStart || getMondayDateKey(),
      count: Math.max(0, Math.floor(Number(state.weekVocabCount) || 0))
    }));
  } catch (err) { /* ignore */ }
}

function syncWeekVocabCountFromStorage() {
  const data = loadWeekVocabCount();
  state.weekVocabWeekStart = data.weekStart;
  state.weekVocabCount = data.count;
  return data.count;
}

function bumpWeekVocabCount() {
  syncWeekVocabCountFromStorage();
  state.weekVocabCount = (Number(state.weekVocabCount) || 0) + 1;
  persistWeekVocabCount();
  return state.weekVocabCount;
}

function recordLearningPoints(points, kind) {
  const add = Math.max(0, Math.floor(Number(points) || 0));
  if (!add) return null;
  syncWeekActivityFromStorage(state.level);
  const idx = todayWeekdayIndex();
  state.week[idx] = (Number(state.week[idx]) || 0) + add;
  persistWeekActivity(state.level);
  if (state.tab === "parents" && state.parentUnlocked) renderParents();
  return { kind: kind || "activity", points: add, dayIndex: idx, count: state.week[idx], level: state.level };
}

function recordLearningActivity(kind) {
  const points = LEARNING_POINTS[kind] != null ? LEARNING_POINTS[kind] : 1;
  return recordLearningPoints(points, kind);
}

function recordWordViewScore(word) {
  const key = String(word || "").toLowerCase().trim();
  if (!key) return null;
  syncWeekActivityFromStorage(state.level);
  const stamp = todayDateKey() + "::" + key;
  if (!state.weekViewedWords) state.weekViewedWords = {};
  if (state.weekViewedWords[stamp]) return null;
  state.weekViewedWords[stamp] = true;
  persistWeekActivity(state.level);
  return recordLearningPoints(LEARNING_POINTS.word_view, "word_view");
}

function weekPointsTotal(week) {
  return normalizeWeekCounts(week).reduce((sum, n) => sum + n, 0);
}

function renderParents() {
  syncWeekActivityFromStorage(state.level);
  syncWeekVocabCountFromStorage();
  const published = state.books.filter((b) => b.published).length;
  const info = LEVELS[state.level];
  const week = normalizeWeekCounts(state.week);
  const totalPoints = weekPointsTotal(week);
  const vocabLearned = Math.max(0, Math.floor(Number(state.weekVocabCount) || 0));
  const max = Math.max.apply(null, week.concat([1]));
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const bars = week.map((n, i) => '<div class="flex items-center gap-2"><span class="w-6 text-xs font-extrabold text-slate-500 dark:text-gray-200">' + days[i] + '</span><div class="bar flex-1"><span style="width:' + Math.round((n / max) * 100) + '%"></span></div><span class="w-8 text-right text-xs font-extrabold text-slate-700 dark:text-white">' + n + "</span></div>").join("");
  $("parentBody").innerHTML =
    '<article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800"><p class="text-3xl font-black text-violet-600 dark:text-white">' + vocabLearned + '개</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">이번 주 학습 어휘</p><p class="mt-1 text-xs font-bold text-slate-400 dark:text-gray-300">학습 완료로 지워도 누적돼요</p><div class="bar mt-4"><span style="width:' + Math.min(100, vocabLearned * 8) + '%"></span></div></article>' +
    '<article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800"><p class="text-3xl font-black text-pink-500 dark:text-white">' + published + '권</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">출판한 동화</p><div class="bar mt-4"><span style="width:' + Math.min(100, published * 25) + '%"></span></div></article>' +
    '<article class="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-800 lg:col-span-1"><p class="text-3xl font-black text-emerald-500 dark:text-white">' + totalPoints + '점</p><p class="mt-1 text-sm font-extrabold text-slate-700 dark:text-gray-200">이번 주 학습 포인트 · ' + esc(info.label) + '</p><div class="mt-4 space-y-2">' + bars + '</div><div class="parent-points-guide mt-4"><p class="parent-points-guide-title">학습 포인트 산정 기준</p><p class="parent-points-guide-text">단어 추가 +1점<br>단어 이해 +2점<br>릴레이 작문 +1점<br>커뮤니티 이어쓰기 +1점<br>책 출판 +5점</p></div></article>';
}

const COMMUNITY_STORAGE_KEY = "storyloom-community-v1";
const RELAY_GROQ_MODELS = ["qwen/qwen3-32b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"];
const DEFAULT_COMMUNITY = [
  {
    id: "c1",
    author: "하늘",
    title: "Rainbow Bakery",
    emoji: "🌈",
    text: "Milo opened a bakery on a cloud. The first customer was a shy star.",
    koText: "마일로는 구름 위에 빵집을 열었어요. 첫 손님은 수줍은 별이었어요."
  },
  {
    id: "c2",
    author: "준호",
    title: "Forest Lanterns",
    emoji: "🏮",
    text: "Red Riding Hood hung lanterns so no friend would get lost.",
    koText: "빨간 모자는 친구들이 길을 잃지 않도록 숲속에 등불을 걸어 두었어요."
  },
  {
    id: "c3",
    author: "서연",
    title: "Goose Mail",
    emoji: "✉️",
    text: "The golden goose delivered thank-you letters to the whole village.",
    koText: "황금거위는 마을 모두에게 고마움이 담긴 편지를 전해주었어요."
  },
  {
    id: "c4",
    author: "도윤",
    title: "Rabbit Clock",
    emoji: "⏰",
    text: "Alice and the rabbit stopped time to finish their tea party.",
    koText: "앨리스와 토끼는 티파티를 끝까지 즐기기 위해 시간을 잠시 멈추었어요."
  }
];

function communityKoreanText(story) {
  if (!story) return "";
  return String(story.koText || story.translation || story.ko || "").trim();
}

function normalizeCommunityStory(item) {
  if (!item || !item.id) return null;
  const defaultsById = DEFAULT_COMMUNITY.reduce((acc, story) => {
    acc[story.id] = story;
    return acc;
  }, {});
  const fallback = defaultsById[item.id] || null;
  const text = String(item.text || (fallback && fallback.text) || "").trim();
  const koText = String(
    item.koText || item.translation || item.ko || (fallback && fallback.koText) || ""
  ).trim();
  return {
    id: String(item.id),
    author: String(item.author || (fallback && fallback.author) || "친구"),
    title: String(item.title || (fallback && fallback.title) || "Untitled Story"),
    emoji: item.emoji || (fallback && fallback.emoji) || "📖",
    text: text,
    koText: koText,
    translation: koText
  };
}

function loadCommunityFromStorage() {
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!raw) return DEFAULT_COMMUNITY.map(normalizeCommunityStory).filter(Boolean);
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : (parsed && parsed.stories);
    const normalized = (Array.isArray(list) ? list : []).map(normalizeCommunityStory).filter(Boolean);
    return normalized.length ? normalized : DEFAULT_COMMUNITY.map(normalizeCommunityStory).filter(Boolean);
  } catch (err) {
    return DEFAULT_COMMUNITY.map(normalizeCommunityStory).filter(Boolean);
  }
}

function persistCommunity() {
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify({
      version: 2,
      stories: (state.community || []).map(normalizeCommunityStory).filter(Boolean)
    }));
  } catch (err) { /* ignore */ }
}

function renderCommunityStoryBodyHtml(story, mode) {
  const en = String((story && story.text) || "").trim();
  const ko = communityKoreanText(story);
  const enClass = mode === "card" ? "community-card-en" : "relay-story-en";
  const koClass = mode === "card" ? "community-card-ko" : "relay-story-ko";
  return (
    '<p class="' + enClass + '">' + esc(en || "아직 이야기가 없어요.") + "</p>" +
    (ko ? '<p class="' + koClass + '">' + esc(ko) + "</p>" : "")
  );
}

function renderRelayStory(story) {
  const box = $("relayStory");
  if (!box) return;
  box.innerHTML = renderCommunityStoryBodyHtml(story, "relay");
}

function renderCommunity() {
  $("communityGrid").innerHTML = state.community.map((story) => (
    '<article class="rounded-3xl border border-violet-100 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800">' +
      '<div class="text-4xl">' + story.emoji + "</div>" +
      '<h3 class="mt-2 text-lg font-black text-slate-900 dark:text-white">' + esc(story.title) + "</h3>" +
      '<p class="text-xs font-extrabold text-violet-500 dark:text-gray-200">' + esc(story.author) + "의 이야기</p>" +
      '<div class="mt-2">' + renderCommunityStoryBodyHtml(story, "card") + "</div>" +
      '<button type="button" data-action="open-relay" data-id="' + esc(story.id) + '" class="mt-3 rounded-2xl bg-violet-500 px-3 py-2 text-sm font-extrabold text-white">이어서 쓰기</button>' +
    "</article>"
  )).join("");
}

function containsHangul(text) {
  return /[가-힣]/.test(String(text || ""));
}

function looksMostlyEnglish(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  if (containsHangul(value)) return false;
  return /[A-Za-z]/.test(value);
}

function ensureEnglishSentenceEnding(text) {
  let value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) return "";
  if (!/[.!?]$/.test(value)) value += ".";
  return value;
}

function ensureKoreanSentenceEnding(text) {
  let value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) return "";
  if (!/[.!?…다요네까]$/.test(value)) value += ".";
  return value;
}

function relayFallbackEnglish(koreanLine, story) {
  const idea = String(koreanLine || "").trim();
  const title = story && story.title ? story.title : "the story";
  if (/문|door/i.test(idea)) return "Then a soft glowing door appeared and invited everyone closer.";
  if (/별|star/i.test(idea)) return "Then a shy little star floated down to join the friends.";
  if (/지도|map/i.test(idea)) return "Then a mysterious map unfolded and pointed to a gentle path.";
  return "Then something kind and magical happened next in " + title + ".";
}

function relayFallbackKorean(englishLine, story) {
  const idea = String(englishLine || "").trim();
  const title = story && story.title ? story.title : "이야기";
  if (/door/i.test(idea)) return "그러자 부드러운 빛이 나는 문이 나타나 모두를 가까이 불렀어요.";
  if (/star/i.test(idea)) return "그러자 수줍은 작은 별이 내려와 친구들 곁에 함께했어요.";
  if (/map/i.test(idea)) return "그러자 신비한 지도가 펼쳐지며 따뜻한 길을 가리켰어요.";
  return "그러자 " + title + " 속에 다정하고 마법 같은 다음 장면이 이어졌어요.";
}

async function translateRelayLineToEnglish(koreanLine, story) {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error("GROQ_API_KEY가 없습니다.");
  const level = LEVELS[state.level] || LEVELS.beginner;
  const systemPrompt = "You are a children's fairy-tale translation API that MUST respond ONLY with a valid JSON object.\nReturn JSON with key english (one natural English fairy-tale sentence that continues the story).\nMatch the learner level: " + level.label + " — " + level.help + ".\nKeep the sentence warm, simple enough for elementary readers when beginner/intermediate, richer when advanced.\nNever include Korean. No markdown. No extra keys.";
  const userMessage = [
    "Story title: " + (story.title || ""),
    "Story so far (English): " + (story.text || ""),
    "Story so far (Korean): " + communityKoreanText(story),
    "Korean idea to continue with: " + koreanLine,
    "Write ONE English sentence that continues this fairy tale."
  ].join("\n");
  let lastError = null;
  for (let i = 0; i < RELAY_GROQ_MODELS.length; i++) {
    try {
      const data = await callGroqChatJson(apiKey, RELAY_GROQ_MODELS[i], systemPrompt, userMessage, 0.4);
      const english = ensureEnglishSentenceEnding(
        String((data && (data.english || data.sentence || data.translation || data.text)) || "").trim()
      );
      if (!english || containsHangul(english)) throw new Error("empty or hangul english");
      return english;
    } catch (err) {
      lastError = err;
      console.warn("[StoryLoom] 커뮤니티 릴레이 한→영 실패:", RELAY_GROQ_MODELS[i], err && err.message);
    }
  }
  throw lastError || new Error("번역 실패");
}

async function translateRelayLineToKorean(englishLine, story) {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error("GROQ_API_KEY가 없습니다.");
  const systemPrompt = "You are a children's fairy-tale translation API that MUST respond ONLY with a valid JSON object.\nReturn JSON with key korean (one natural Korean fairy-tale sentence, warm spoken style ending with ~어요/~했어요).\nTranslate the English continuation faithfully and sweetly for elementary readers.\nNever include English words. No markdown. No extra keys.";
  const userMessage = [
    "Story title: " + (story.title || ""),
    "Story so far (English): " + (story.text || ""),
    "Story so far (Korean): " + communityKoreanText(story),
    "English sentence to translate: " + englishLine,
    "Write ONE Korean fairy-tale sentence."
  ].join("\n");
  let lastError = null;
  for (let i = 0; i < RELAY_GROQ_MODELS.length; i++) {
    try {
      const data = await callGroqChatJson(apiKey, RELAY_GROQ_MODELS[i], systemPrompt, userMessage, 0.35);
      const korean = ensureKoreanSentenceEnding(
        String((data && (data.korean || data.translation || data.ko || data.text)) || "").trim()
      );
      if (!korean || !containsHangul(korean)) throw new Error("empty or non-hangul korean");
      return korean;
    } catch (err) {
      lastError = err;
      console.warn("[StoryLoom] 커뮤니티 릴레이 영→한 실패:", RELAY_GROQ_MODELS[i], err && err.message);
    }
  }
  throw lastError || new Error("번역 실패");
}

function appendCommunityRelaySentence(story, englishSentence, koreanSentence) {
  const nextEn = ensureEnglishSentenceEnding(englishSentence);
  const nextKo = ensureKoreanSentenceEnding(koreanSentence);
  if (!story || !nextEn) return { english: "", korean: "" };
  story.text = String(story.text || "").replace(/\s+$/g, "");
  story.text += (story.text ? " " : "") + nextEn;
  story.koText = String(communityKoreanText(story) || "").replace(/\s+$/g, "");
  if (nextKo) {
    story.koText += (story.koText ? " " : "") + nextKo;
  }
  story.translation = story.koText;
  persistCommunity();
  return { english: nextEn, korean: nextKo };
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
  if (tab === "library") {
    state.books = loadBooksFromStorage();
    shelfBooks();
  }
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

function getActiveReaderBook() {
  if (state.sharedStory && state.sampleBookId === "shared-story") {
    return state.sharedStory;
  }
  return ensurePages(findBook(state.sampleBookId || state.publishId || FRIENDS_OMNIBUS_ID));
}

function pageEnglishText(page) {
  if (!page) return "";
  if (page.text_en) return String(page.text_en);
  if (Array.isArray(page.en)) return plainLine(page.en);
  return String(page.en || page.english || "");
}

function pageKoreanText(page) {
  if (!page) return "";
  return String(page.text_ko || page.kr || page.korean || "");
}

function collectBookStoryPages(book) {
  const source = book && Array.isArray(book.pages) ? book.pages
    : (book && Array.isArray(book.scenes) ? book.scenes : []);
  return source.map((page, index) => ({
    scene: (page && page.scene) || (index + 1),
    text_en: pageEnglishText(page),
    text_ko: pageKoreanText(page),
    image: (page && page.image) || ""
  })).filter((page) => page.text_en || page.text_ko);
}

function ensurePages(book) {
  if (!book) return book;
  if (book.id === FRIENDS_OMNIBUS_ID) {
    book.pages = makeOmnibusPages();
    book.coverStyle = "friends-quilt";
    book.cover = "friends-quilt";
    return book;
  }
  if (Array.isArray(book.pages) && book.pages.length) return book;
  if (Array.isArray(book.scenes) && book.scenes.length) {
    book.pages = cloneStoryPagesForLibrary(book.scenes);
    return book;
  }
  // 사용자 창작본은 더미 템플릿으로 덮지 않음
  if (book.userCreated || /^(user-|made-|gemini-)/.test(String(book.id || ""))) {
    book.pages = Array.isArray(book.pages) ? book.pages : [];
    return book;
  }
  const key = (book.templateKey && STORIES[book.templateKey])
    ? book.templateKey
    : (book.art && STORIES[book.art] ? book.art : "pigs");
  book.pages = clonePages(key, state.level);
  return book;
}

function openPublish(id) {
  // 사용자 책은 페이지 넘김 뷰어로 연다
  openLibraryReader(id);
}

function closePublish() {
  $("modalPublish").classList.add("hidden");
  $("modalPublish").classList.remove("flex");
}

function sampleFriendLabel(index) {
  return ["바나비 🐰", "마일로 🐱", "다이노 🦕", "퐁이 🦊"][index] || "동화 친구";
}

function isOmnibusReaderBook(book) {
  return !!(book && (book.id === FRIENDS_OMNIBUS_ID || book.coverStyle === "friends-quilt"));
}

function setLibraryActionsVisible(show) {
  const panel = $("libraryReaderActions");
  if (!panel) return;
  panel.classList.toggle("hidden", !show);
}

function renderSampleReader() {
  const book = getActiveReaderBook();
  if (!book) return;
  const pages = collectBookStoryPages(book);
  const total = pages.length || 1;
  if (state.samplePage < 0) state.samplePage = 0;
  if (state.samplePage > total - 1) state.samplePage = total - 1;
  const page = pages[state.samplePage] || { text_en: "", text_ko: "" };
  const en = page.text_en || "";
  const ko = page.text_ko || "";
  const omnibus = isOmnibusReaderBook(book);
  const coverEl = $("sampleCover");

  if (omnibus) {
    $("sampleEyebrow").textContent = "친구들의 선물";
    $("sampleTitle").textContent = book.title;
    $("sampleSubtitle").textContent = book.kr || "동화 친구들의 비밀 이야기";
    $("sampleGuide").textContent = "동화 친구들이 준비한 첫 번째 선물 이야기예요!";
    $("sampleFriend").textContent = sampleFriendLabel(state.samplePage) + "의 이야기";
    coverEl.className = "sample-cover-shell mx-auto mt-4 h-36 w-36 overflow-hidden rounded-2xl shadow-soft";
    coverEl.style.background = "";
    coverEl.innerHTML = friendsQuiltCoverHtml("is-sample");
    setLibraryActionsVisible(false);
  } else {
    const author = book.author || state.nickname || "꼬마 작가님";
    $("sampleEyebrow").textContent = "내 동화 서재";
    $("sampleTitle").textContent = book.title || "내 동화책";
    $("sampleSubtitle").textContent = (book.kr || "내가 만든 동화") + " · 저자 " + author;
    $("sampleGuide").textContent = "장면을 넘겨 가며 나만의 영어 동화를 읽어 보세요.";
    $("sampleFriend").textContent = "Scene " + ((page.scene) || (state.samplePage + 1));
    coverEl.className = "sample-cover-shell is-library-cover mx-auto mt-4 h-36 w-36 overflow-hidden rounded-2xl shadow-soft";
    coverEl.style.background = book.cover || "linear-gradient(160deg,#c4b5fd,#f9a8d4)";
    coverEl.innerHTML = bookCoverHtml(book, "shelf");
    const onLastPage = state.samplePage >= total - 1;
    setLibraryActionsVisible(onLastPage);
    const continueWrap = $("libraryContinueWrap");
    if (continueWrap) continueWrap.classList.remove("hidden");
  }

  if (omnibus) {
    const continueWrap = $("libraryContinueWrap");
    if (continueWrap) continueWrap.classList.add("hidden");
  }

  $("sampleEnglish").textContent = en || "(이 장면의 영어 문장이 아직 없어요)";
  $("sampleKorean").textContent = ko || "";
  $("samplePageLabel").textContent = (state.samplePage + 1) + " / " + total;
  $("samplePrev").disabled = state.samplePage === 0;
  $("sampleNext").disabled = state.samplePage >= total - 1;
}

function openSampleReader(id) {
  const book = ensurePages(findBook(id || FRIENDS_OMNIBUS_ID));
  if (!book) return;
  state.sharedStory = null;
  state.sampleBookId = book.id;
  state.publishId = book.id;
  state.samplePage = 0;
  renderSampleReader();
  $("modalSample").classList.remove("hidden");
  $("modalSample").classList.add("flex");
}

function openLibraryReader(id) {
  if (id === FRIENDS_OMNIBUS_ID) {
    openSampleReader(id);
    return;
  }
  const book = ensurePages(findBook(id));
  if (!book) {
    toast("서재에서 동화를 찾지 못했어요.");
    return;
  }
  if (isOmnibusReaderBook(book)) {
    openSampleReader(book.id);
    return;
  }
  const pages = collectBookStoryPages(book);
  if (!pages.length) {
    toast("읽을 장면이 아직 없어요. 자유 창작에서 장면을 더 이어 써 보세요.");
    return;
  }
  state.sharedStory = null;
  state.sampleBookId = book.id;
  state.publishId = book.id;
  state.samplePage = 0;
  renderSampleReader();
  $("modalSample").classList.remove("hidden");
  $("modalSample").classList.add("flex");
}

function openSharedStoryReader(payload) {
  if (!payload || !payload.title) return;
  const pages = Array.isArray(payload.pages) ? payload.pages.map((page, index) => ({
    scene: index + 1,
    text_en: pageEnglishText(page),
    text_ko: pageKoreanText(page),
    en: pageEnglishText(page),
    kr: pageKoreanText(page),
    image: page.image || ""
  })) : [];
  if (!pages.length) {
    toast("공유된 동화 내용을 읽지 못했어요.");
    return;
  }
  state.sharedStory = {
    id: "shared-story",
    title: payload.title,
    kr: payload.kr || "",
    author: payload.author || "꼬마 작가님",
    emoji: payload.emoji || "📖",
    cover: payload.cover || "linear-gradient(160deg,#c4b5fd,#f9a8d4)",
    coverImage: payload.coverImage || "",
    pages: pages,
    published: false,
    userCreated: true
  };
  state.sampleBookId = "shared-story";
  state.publishId = null;
  state.samplePage = 0;
  setTab("library");
  renderSampleReader();
  $("modalSample").classList.remove("hidden");
  $("modalSample").classList.add("flex");
}

function closeSampleReader() {
  $("modalSample").classList.add("hidden");
  $("modalSample").classList.remove("flex");
  setLibraryActionsVisible(false);
  const continueWrap = $("libraryContinueWrap");
  if (continueWrap) continueWrap.classList.add("hidden");
}

function turnSamplePage(dir) {
  const book = getActiveReaderBook();
  const pages = collectBookStoryPages(book);
  if (!pages.length) return;
  state.samplePage = Math.max(0, Math.min(pages.length - 1, (state.samplePage || 0) + dir));
  renderSampleReader();
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  if (!words.length) return lines;
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const trial = current + " " + words[i];
    if (ctx.measureText(trial).width <= maxWidth) {
      current = trial;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  // 한글처럼 공백이 거의 없는 긴 줄 보정
  const refined = [];
  lines.forEach((line) => {
    if (ctx.measureText(line).width <= maxWidth) {
      refined.push(line);
      return;
    }
    let chunk = "";
    for (let i = 0; i < line.length; i++) {
      const next = chunk + line[i];
      if (chunk && ctx.measureText(next).width > maxWidth) {
        refined.push(chunk);
        chunk = line[i];
      } else {
        chunk = next;
      }
    }
    if (chunk) refined.push(chunk);
  });
  return refined;
}

function drawStoryPdfPage(book, page, pageIndex, totalPages, author) {
  const width = 1240;
  const height = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fffaf7";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ede9fe";
  ctx.fillRect(0, 0, width, 160);
  ctx.fillStyle = "#6d5ef5";
  ctx.font = "bold 36px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  ctx.fillText("StoryLoom", 72, 70);
  ctx.fillStyle = "#312e81";
  ctx.font = "bold 48px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  const titleLines = wrapCanvasText(ctx, book.title || "My Story", width - 144);
  titleLines.slice(0, 2).forEach((line, i) => ctx.fillText(line, 72, 130 + i * 54));
  ctx.fillStyle = "#7c3aed";
  ctx.font = "bold 28px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  ctx.fillText("Author: " + (author || "꼬마 작가님"), 72, 230);
  ctx.fillText("Page " + (pageIndex + 1) + " / " + totalPages, 72, 270);

  let y = 360;
  ctx.fillStyle = "#1e1b4b";
  ctx.font = "bold 40px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  ctx.fillText("Scene " + (page.scene || (pageIndex + 1)), 72, y);
  y += 70;
  ctx.fillStyle = "#312e81";
  ctx.font = "bold 38px 'Malgun Gothic', 'Apple SD Gothic Neo', Georgia, serif";
  wrapCanvasText(ctx, page.text_en || "", width - 144).forEach((line) => {
    ctx.fillText(line, 72, y);
    y += 52;
  });
  y += 36;
  ctx.fillStyle = "#475569";
  ctx.font = "bold 34px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  wrapCanvasText(ctx, page.text_ko || "", width - 144).forEach((line) => {
    ctx.fillText(line, 72, y);
    y += 48;
  });
  ctx.fillStyle = "#a78bfa";
  ctx.font = "bold 24px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  ctx.fillText("Made with StoryLoom", 72, height - 60);
  return canvas;
}

function dataUrlToPdfBytes(dataUrl) {
  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function buildImagePdf(jpegBytesList) {
  const pageWidth = 612;
  const pageHeight = 792;
  const objects = [];
  const kids = [];
  let objNum = 3; // 1=catalog, 2=pages

  jpegBytesList.forEach((jpegBytes, index) => {
    const imageObj = objNum++;
    const contentObj = objNum++;
    const pageObj = objNum++;
    kids.push(pageObj + " 0 R");
    const content = "q\n" + pageWidth + " 0 0 " + pageHeight + " 0 0 cm\n/Im" + index + " Do\nQ\n";
    objects.push({
      num: imageObj,
      body: "<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpegBytes.length + " >>\nstream\n"
    });
    objects[objects.length - 1].binary = jpegBytes;
    objects.push({
      num: contentObj,
      body: "<< /Length " + content.length + " >>\nstream\n" + content + "endstream\n"
    });
    objects.push({
      num: pageObj,
      body: "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageWidth + " " + pageHeight + "] /Contents " + contentObj + " 0 R /Resources << /XObject << /Im" + index + " " + imageObj + " 0 R >> >> >>\n"
    });
  });

  const encoder = new TextEncoder();
  const chunks = [];
  const pushText = (text) => chunks.push(encoder.encode(text));
  const pushBytes = (bytes) => chunks.push(bytes);
  pushText("%PDF-1.4\n");
  const offsets = { 1: 0, 2: 0 };
  const totalObjects = objNum - 1;

  const writeObject = (num, body, binary) => {
    offsets[num] = chunks.reduce((sum, part) => sum + part.length, 0);
    pushText(num + " 0 obj\n" + body);
    if (binary) {
      pushBytes(binary);
      pushText("\nendstream\nendobj\n");
    } else {
      pushText("endobj\n");
    }
  };

  writeObject(1, "<< /Type /Catalog /Pages 2 0 R >>\n");
  writeObject(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + kids.length + " >>\n");
  objects.forEach((obj) => writeObject(obj.num, obj.body, obj.binary || null));

  const xrefStart = chunks.reduce((sum, part) => sum + part.length, 0);
  let xref = "xref\n0 " + (totalObjects + 1) + "\n0000000000 65535 f \n";
  for (let i = 1; i <= totalObjects; i++) {
    xref += String(offsets[i] || 0).padStart(10, "0") + " 00000 n \n";
  }
  pushText(xref);
  pushText("trailer << /Size " + (totalObjects + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefStart + "\n%%EOF");

  let totalLength = 0;
  chunks.forEach((part) => { totalLength += part.length; });
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((part) => {
    merged.set(part, offset);
    offset += part.length;
  });
  return merged;
}

function downloadPdf(book) {
  const target = ensurePages(book) || book;
  if (!target) {
    toast("PDF로 만들 동화를 찾지 못했어요.");
    return;
  }
  const pages = collectBookStoryPages(target);
  if (!pages.length) {
    toast("PDF에 넣을 장면이 없어요.");
    return;
  }
  const author = target.author || state.nickname || "꼬마 작가님";
  const jpegBytesList = pages.map((page, index) => {
    const canvas = drawStoryPdfPage(target, page, index, pages.length, author);
    return dataUrlToPdfBytes(canvas.toDataURL("image/jpeg", 0.92));
  });
  const pdfBytes = buildImagePdf(jpegBytesList);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = String(target.title || "storyloom").replace(/\s+/g, "-") + ".pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}

function encodeSharePayload(payload) {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeSharePayload(encoded) {
  try {
    const padded = String(encoded || "").replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const json = decodeURIComponent(escape(atob(padded + pad)));
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

function buildShareLinkForBook(book) {
  const pages = collectBookStoryPages(book);
  const payload = {
    v: 1,
    id: book.id || "",
    title: book.title || "My Story",
    kr: book.kr || "",
    author: book.author || state.nickname || "꼬마 작가님",
    emoji: book.emoji || "📖",
    cover: book.cover || "",
    coverImage: book.coverImage || "",
    pages: pages.map((page) => ({
      en: page.text_en,
      ko: page.text_ko,
      text_en: page.text_en,
      text_ko: page.text_ko,
      image: page.image || ""
    }))
  };
  const url = new URL(window.location.href);
  url.searchParams.delete("book");
  url.searchParams.set("story", encodeSharePayload(payload));
  if (book.id && book.id !== "shared-story") {
    url.searchParams.set("book", book.id);
  }
  return url.toString();
}

async function shareCurrentLibraryBook() {
  const book = getActiveReaderBook();
  if (!book || isOmnibusReaderBook(book)) {
    toast("공유할 내 동화를 먼저 열어 주세요.");
    return;
  }
  const pages = collectBookStoryPages(book);
  if (!pages.length) {
    toast("공유할 장면이 없어요.");
    return;
  }
  const link = buildShareLinkForBook(book);
  try {
    await navigator.clipboard.writeText(link);
    toast("공유 링크가 복사되었어요! 친구에게 붙여넣기 해 보세요 🔗");
  } catch (err) {
    window.prompt("공유 링크를 복사해 주세요:", link);
    toast("공유 링크가 복사되었어요! 친구에게 붙여넣기 해 보세요 🔗");
  }
}

function publishCurrentLibraryBook() {
  const book = findBook(state.publishId || state.sampleBookId);
  if (!book || isOmnibusReaderBook(book)) {
    toast("출판할 내 동화를 찾지 못했어요.");
    return;
  }
  const wasPublished = !!book.published;
  book.published = true;
  book.note = "출판 완료";
  if (!wasPublished) recordLearningActivity("publish");
  persistBooks();
  burst();
  renderParents();
  shelfBooks();
  renderSampleReader();
  toast("와! 나만의 영어 동화책이 출판됐어요. (+5점)");
}

function consumeShareLinkFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("book");
    const storyParam = params.get("story");
    if (bookId && findBook(bookId)) {
      setTimeout(() => openLibraryReader(bookId), 120);
      return true;
    }
    if (storyParam) {
      const payload = decodeSharePayload(storyParam);
      if (payload) {
        setTimeout(() => openSharedStoryReader(payload), 120);
        return true;
      }
    }
  } catch (err) { /* ignore */ }
  return false;
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
  persistVocab();
  bumpWeekVocabCount();
  recordLearningActivity("vocab");
  renderVocab();
  renderParents();
  toast("“" + data.word + "”를 단어장에 저장했어요.");
}

function openRelay(id) {
  const story = state.community.find((item) => item.id === id);
  if (!story) return;
  state.relayId = id;
  $("relayTitle").textContent = story.title;
  $("relayAuthor").textContent = story.author + "가 시작한 이야기";
  renderRelayStory(story);
  $("relayMore").value = "";
  const btn = $("relaySubmit");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "이 문장으로 이어 쓰기";
  }
  $("modalRelay").classList.remove("hidden");
  $("modalRelay").classList.add("flex");
}

function closeRelay() {
  $("modalRelay").classList.add("hidden");
  $("modalRelay").classList.remove("flex");
  const btn = $("relaySubmit");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "이 문장으로 이어 쓰기";
  }
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

document.addEventListener("mouseup", (event) => {
  if (event.target && event.target.closest && event.target.closest("#interpretChip")) return;
  clearTimeout(interpretChipTimer);
  interpretChipTimer = setTimeout(() => maybeShowInterpretChip(event), 10);
});

document.addEventListener("touchend", (event) => {
  const touch = event.changedTouches && event.changedTouches[0];
  const fakeEvent = touch ? { clientX: touch.clientX, clientY: touch.clientY, target: event.target } : event;
  clearTimeout(interpretChipTimer);
  interpretChipTimer = setTimeout(() => maybeShowInterpretChip(fakeEvent), 30);
}, { passive: true });

document.body.addEventListener("dblclick", (event) => {
  const word = event.target.closest("[data-action='word']");
  if (!word) return;
  if (state.showTranslation) return;
  event.preventDefault();
  event.stopPropagation();
  clearTimeout(wordClickTimer);
  hideInterpretChip();
  showTooltip(word, true);
});

document.body.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) {
    if (!event.target.closest("#tooltip") && !event.target.closest("#interpretChip")) {
      hideTooltip();
      hideInterpretChip();
    }
    return;
  }
  const action = el.dataset.action;
  if (action === "close-tip") {
    event.stopPropagation();
    hideTooltip();
    return;
  }
  if (action === "interpret-selection") {
    event.stopPropagation();
    runInterpretSelection();
    return;
  }
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
    const tplKey = el.dataset.tpl;
    clearActiveDraft();
    state.activeBookId = null;
    state.usedSuggestions = [];
    state.lastSuggestions = [];
    state.relayMadlib = null;
    state.relayMadlibKo = null;
    state.suggestionPoolCursor = 0;
    state.template = tplKey;
    renderComposer();
    resetStoryBook(tplKey);
    syncTemplateCardHighlight(tplKey);
    console.log("[StoryLoom] 템플릿 Scene 1 로드:", tplKey, storyPages[0] && storyPages[0].text_en);
  }
  if (action === "choice") {
    fillRelayInputWithChoice(el.dataset.choice || el.textContent || "");
  }
  if (action === "scroll-create") $("composer").scrollIntoView({ behavior: "smooth", block: "center" });
  if (action === "word") {
    event.stopPropagation();
    hideInterpretChip();
    clearTimeout(wordClickTimer);
    wordClickTimer = setTimeout(() => showTooltip(el, false), 220);
  }
  if (action === "sentence-tip") {
    event.stopPropagation();
    hideInterpretChip();
    showSentenceTooltip(el);
  }
  if (action === "sentence-body") {
    // 단어/문장해석 버튼 클릭이 아닐 때만 문장 전체 팝업
    if (event.target.closest("[data-action='word']") || event.target.closest("[data-action='sentence-tip']")) return;
    event.stopPropagation();
    hideInterpretChip();
    showSentenceTooltip(el);
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
  if (action === "complete-vocab" || action === "delete-vocab") {
    event.stopPropagation();
    const card = el.closest(".vocab-card");
    removeVocabWord(el.dataset.word, card);
  }
  if (action === "publish" || action === "read-library") openLibraryReader(el.dataset.id);
  if (action === "read-sample") openSampleReader(el.dataset.id || FRIENDS_OMNIBUS_ID);
  if (action === "close-publish") closePublish();
  if (action === "close-sample") closeSampleReader();
  if (action === "sample-prev") turnSamplePage(-1);
  if (action === "sample-next") turnSamplePage(1);
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
  let cleaned = String(raw || "");
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
  cleaned = cleaned.replace(/^\uFEFF/, "");
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end < start) throw new Error("JSON 없음");
    let slice = cleaned.slice(start, end + 1);
    slice = slice.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(slice);
    } catch (err2) {
      const eng = slice.match(/"english"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const kor = slice.match(/"korean"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const eng2 = slice.match(/"story_en"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const kor2 = slice.match(/"story_ko"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const english = eng ? eng[1] : (eng2 ? eng2[1] : "");
      const korean = kor ? kor[1] : (kor2 ? kor2[1] : "");
      if (english && korean) {
        let suggestions = [];
        const sugMatch = slice.match(/"suggestions"\s*:\s*\[((?:.|\n|\r)*?)\]/i);
        if (sugMatch) {
          suggestions = extractSuggestionsList(
            sugMatch[1].split(",").map((part) => part.replace(/^[\s"]+|[\s"]+$/g, "").trim())
          );
        }
        return {
          english: english.replace(/\\"/g, '"').replace(/\\n/g, " "),
          korean: korean.replace(/\\"/g, '"').replace(/\\n/g, " "),
          suggestions: suggestions
        };
      }
      throw err2;
    }
  }
}

function extractStoryFromLooseText(raw) {
  const text = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  if (!text) return null;
  try {
    return normalizeGeminiPayload(parseGeminiJson(text));
  } catch (err) { /* 아래에서 느슨하게 추출 */ }
  const engMatch = text.match(/"english"\s*:\s*"((?:\\.|[^"\\])*)"/i) || text.match(/english\s*[:=]\s*["']?([^\n"']+)/i);
  const korMatch = text.match(/"korean"\s*:\s*"((?:\\.|[^"\\])*)"/i) || text.match(/korean\s*[:=]\s*["']?([^\n"']+)/i);
  let english = engMatch ? String(engMatch[1] || "").replace(/\\"/g, '"').trim() : "";
  let korean = korMatch ? String(korMatch[1] || "").replace(/\\"/g, '"').trim() : "";
  if (!english || !korean) {
    const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const enLine = lines.find((line) => /^[A-Za-z]/.test(line) && !/korean|english|words/i.test(line));
    const koLine = lines.find((line) => /[가-힣]/.test(line) && !/korean|english|words/i.test(line));
    if (!english && enLine) english = enLine.replace(/^["']|["']$/g, "");
    if (!korean && koLine) korean = koLine.replace(/^["']|["']$/g, "");
  }
  if (!english || !korean) return null;
  return normalizeGeminiPayload({ english: english, korean: korean, words: [] });
}

function keywordTokens(userInput) {
  return String(userInput || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !/^(the|and|for|with|from|into|that|this|was|were|are)$/.test(token));
}

function storyIgnoresUserKeyword(userInput, english) {
  const input = String(userInput || "").trim();
  if (!input || /[가-힣]/.test(input)) return false;
  const tokens = keywordTokens(input);
  if (!tokens.length) return false;
  const en = String(english || "").toLowerCase();
  return !tokens.every((token) => en.includes(token));
}

function softFallbackSuggestions(key, input, english) {
  const lower = String(input || "").toLowerCase();
  if (/map of stars|별.?지도/.test(lower)) {
    return filterSuggestionsAgainstFullStory(["follow the stars", "a glowing path", "a friendly owl"], english, input);
  }
  if (/cloud house|구름.?집/.test(lower)) {
    return filterSuggestionsAgainstFullStory(["a windy climb", "a floating ladder", "a cotton ladder"], english, input);
  }
  if (/candy house|과자.?집/.test(lower)) {
    return filterSuggestionsAgainstFullStory(["a chocolate door", "sticky frosting", "a sugar bridge"], english, input);
  }
  if (/잡아먹|gobble|devour|ate/.test(lower)) {
    return filterSuggestionsAgainstFullStory(["a brave rescue", "a loud shout", "a clever trick"], english, input);
  }
  if (/늑대|wolf/.test(lower)) {
    return filterSuggestionsAgainstFullStory(["a loud huff", "a locked door", "a brave shout"], english, input);
  }
  return filterSuggestionsAgainstFullStory(
    ["a hidden trail", "a mysterious box", "a friendly bird"],
    english,
    input
  );
}

function softFallbackStory() {
  // 고정 문장 틀에 입력을 끼워 넣는 합성은 사용하지 않습니다. API 응답만 화면에 표시합니다.
  throw new Error("Groq API 장면을 받지 못했습니다. 잠시 후 다시 시도해 주세요.");
}

const SYSTEM_PROMPT = "You are a story generation API that MUST respond ONLY with a valid JSON object.\nYou are a creative children's fairy tale author.\n\n[STRICT NARRATIVE RULES]\n1. Universal Override: Break the original fairy tale plot immediately. The user's input strictly dictates the next event.\n1-1. User Keyword Priority: The user's exact input word/phrase (e.g., \"mysterious map\") MUST appear as a core story object or action in the next english scene. Do NOT ignore it, replace it with a vague synonym-only detour, or drift into an unrelated plot.\n1-2. Arrival & Entry Process: If the user names a new place (e.g., a cottage) or asks to move there, NEVER teleport characters instantly inside. First vividly describe discovering it, walking closer, and then opening the door / stepping in as a natural arrival-and-entry beat within the scene.\n1-3. Intelligent Narrative Conversion (No Meta Speech): If the user input contains instruction-like meta phrasing (e.g., \"~라고 했다\", \"~해 줘\", \"said that\", \"tell them to\"), DO NOT paste that meta wording into the story. Convert it into the character's or object's real spoken dialogue in quotation marks and/or vivid action. Example: user says \"장신구가 도망치라고 했다\" -> write that the charm glows warmly and speaks, \"It's dangerous here—run away now!\" (or equivalent natural fairy-tale action/dialogue).\n2. Negative Statements: Pay extreme attention to negative words ('not', 'didn't', '않았다', '없다'). If the user says an event did NOT happen, NEVER let it happen.\n3. No Repetition: DO NOT repeat previous scenes or sentences. Always progress the story forward to a NEW event.\n4. Exact Action Focus: Focus on specific actions from the user's input.\n4-1. Goose Movement Tone: When describing a goose, NEVER use awkward wording like \"waddle/waddling\". Prefer warm, cute, fairy-tale friendly movement (e.g., softly paddled, gently hopped beside him, nestled close, walked proudly with tiny steps).\n4-2. Squirrel & Map Continuity: If a squirrel appeared in previous scenes and the user input is about a map (e.g., \"mysterious map\"), continue naturally: the squirrel hops over, greets the boy warmly, then takes a mysterious map / parchment from its pouch and places it in the boy's hands to guide the way.\n5. Perfect Translation: The korean field MUST be a 1:1 accurate, intuitive translation of the generated english sentence word by word in meaning (e.g., mysterious box -> 신비한 상자, strange noise -> 이상한 소리). NEVER use a fixed Korean template that does not match the English. Never leave raw English words in the Korean text.\n5-1. Korean Spoken Tone (해요체): The korean text MUST use warm, friendly spoken Korean ending style (해요체) with endings like \"~어요\", \"~했어요\", \"~답니다\", \"~거든요\". NEVER use stiff written/literary endings (문어체). Examples: \"~지었다\" -> \"~지었어요\"; \"~느꼈다\" -> \"~느꼈답니다\"; \"~흩어졌다\" -> \"~흩어졌어요\".\n5-2. Fairy-tale Kinship Terms: When translating kinship/cottage words, use warm fairy-tale Korean, NOT stiff literal phrasing. Examples: elder / grandmother / grandma -> \"할머니\"; elder's cottage / grandmother's cottage -> \"할머니의 오두막\". NEVER translate as awkward formal phrases like \"연세가 많은 분\". For \"mysterious map\" prefer \"신비로운 지도\" or \"비밀 지도(양피지)\".\n5-3. Age Vocabulary Consistency (youngest): When the English contains \"youngest\", the Korean MUST translate it as \"가장 어린\" or, in warm sibling/fairy-tale context, \"막내\". NEVER mistranslate \"youngest\" as \"가장 작은\" (that is for size, not age). Keep the same choice consistently within a scene (word gloss, sentence gloss, and full korean field must agree).\n6. Unique Sentence Frames: NEVER use repeating sentence frames like 'Then X discovered Y and Z'. Every new scene MUST use a unique sentence structure and fresh vocabulary. Invent a brand-new English sentence from scratch each time — do not fill blanks in a fixed template.\n\n[STRICT SUGGESTIONS RULES (RECOMMENDED WORDS)]\n- Purpose: Suggestions MUST be 3 FORWARD-LOOKING plot hooks for the NEXT upcoming scene.\n- NO REPETITION: NEVER use words, nouns, or adjectives that appeared in past scenes (e.g., if 'brick', 'house', 'built' were used, NEVER include them in suggestions).\n- COMPLETE PHRASES ONLY: Every suggestion MUST be a natural 2-4 word English phrase (e.g., 'a strange noise', 'open a secret door', 'a helpful friendly bird'). NEVER output broken fragments like 'a built', 'a strong', or single incomplete words.\n- 3 DIVERSE PATHS: Give 3 completely different options for where the story could go next.\n\n[OUTPUT FORMAT]\nReturn ONLY a valid JSON object:\n{\n  \"english\": \"1-2 English sentences for the next scene\",\n  \"korean\": \"자연스러운 한국어 번역\",\n  \"suggestions\": [\"phrase 1\", \"phrase 2\", \"phrase 3\"]\n}";

async function callGroqChatJson(apiKey, model, systemPrompt, userMessage, temperature) {
  const trimmedKey = String(apiKey || "").trim();
  if (!trimmedKey || trimmedKey.indexOf("gsk_") !== 0) {
    console.error("API Key null/undefined");
    throw new Error("GROQ_API_KEY가 유효하지 않습니다.");
  }
  console.log("[StoryLoom] Groq 모델 요청:", model);
  let response;
  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + trimmedKey
      },
      body: JSON.stringify({
        model: model,
        temperature: typeof temperature === "number" ? temperature : 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });
  } catch (networkErr) {
    console.error("[StoryLoom Fetch Error] 상세 원인:", networkErr && networkErr.message, networkErr && networkErr.name, networkErr);
    throw new Error(networkErr && networkErr.message ? networkErr.message : "네트워크 오류");
  }
  if (!response.ok) {
    let errText = "";
    try {
      errText = await response.text();
    } catch (readErr) {
      errText = "HTTP " + response.status;
    }
    console.error("Groq Raw Error Response:", errText);
    throw new Error("HTTP " + response.status + ": " + String(errText).slice(0, 400));
  }
  const data = await response.json();
  const rawContent = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : "";
  if (!rawContent || !String(rawContent).trim()) {
    throw new Error("Groq 응답 텍스트가 비어 있습니다.");
  }
  const cleanJsonString = String(rawContent).replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleanJsonString);
  } catch (parseErr) {
    try {
      return parseGeminiJson(cleanJsonString);
    } catch (parseErr2) {
      throw new Error("JSON 파싱 실패: " + (parseErr && parseErr.message ? parseErr.message : "unknown"));
    }
  }
}

async function callGroqOnce(apiKey, model, userMessage) {
  const trimmedKey = String(apiKey || "").trim();
  if (!trimmedKey || trimmedKey.indexOf("gsk_") !== 0) {
    console.error("API Key null/undefined");
    alert("API 키 설정 확인 필요");
    throw new Error("GROQ_API_KEY가 유효하지 않습니다.");
  }
  let parsedData;
  try {
    parsedData = await callGroqChatJson(trimmedKey, model, SYSTEM_PROMPT + RELAY_PROMPT_ADDENDUM, userMessage, 0.8);
  } catch (networkErr) {
    if (networkErr && String(networkErr.message || "").indexOf("Failed to fetch") !== -1) {
      alert("네트워크 연결 문제 또는 CORS 에러가 발생했습니다. 콘솔을 확인해 주세요.");
    }
    throw networkErr;
  }
  if (parsedData && parsedData.english && parsedData.korean) {
    // ok
  } else {
    const loose = extractStoryFromLooseText(JSON.stringify(parsedData || {}));
    if (loose && loose.english && loose.korean) {
      parsedData = loose;
    }
  }
  console.log("Groq Response Suggestions:", parsedData && parsedData.suggestions);
  console.log("Groq Response english/korean:", parsedData && parsedData.english, parsedData && parsedData.korean);
  const rawSuggestions = extractSuggestionsList(
    parsedData && parsedData.suggestions != null ? parsedData.suggestions
      : (parsedData && parsedData.keywords != null ? parsedData.keywords
        : (parsedData && parsedData.next_suggestions != null ? parsedData.next_suggestions : null))
  );
  const normalized = normalizeGeminiPayload(parsedData);
  normalized.suggestions = normalizeSuggestions(rawSuggestions, normalized.english, "");
  normalized._apiSuggestions = rawSuggestions.slice();
  if (parsedData && (parsedData.relay_prompt || parsedData.relayPrompt)) {
    normalized.relay_prompt = String(parsedData.relay_prompt || parsedData.relayPrompt || "").trim();
  }
  if (parsedData && (parsedData.relay_prompt_ko || parsedData.relayPromptKo)) {
    normalized.relay_prompt_ko = String(parsedData.relay_prompt_ko || parsedData.relayPromptKo || "").trim();
  }
  return normalized;
}

function collectFullStoryEnglish() {
  return storyPages.map((page, i) => {
    const en = String(page.text_en || plainLine(page.en || []) || "").trim();
    if (!en) return "";
    return "Scene " + (page.scene || i + 1) + ": " + en;
  }).filter(Boolean);
}

function previousStoryContext() {
  const scenes = collectFullStoryEnglish();
  if (!scenes.length) {
    return "FULL STORY CONTEXT (Scene 1 to now):\n(No previous scenes yet. Write the next scene as a fresh continuation of this fairy tale.)";
  }
  return [
    "FULL STORY CONTEXT (ALL previous English scenes from Scene 1 to now — you MUST remember every line below):",
    scenes.join("\n"),
    "Do NOT repeat or lightly rephrase any of the scenes above. Advance to a NEW event."
  ].join("\n");
}

function enforceYoungestGlossary(english, korean) {
  const en = String(english || "");
  let ko = String(korean || "");
  if (!/\byoungest\b/i.test(en) || !ko) return ko;
  // 나이(youngest)를 크기(가장 작은)로 옮긴 오역만 교정
  ko = ko.replace(/가장 작은/g, "가장 어린");
  return ko;
}

function normalizeGeminiPayload(payload) {
  const raw = payload || {};
  const english = String(raw.english || raw.story_en || raw.en || "").trim();
  const korean = enforceYoungestGlossary(
    english,
    String(raw.korean || raw.story_ko || raw.ko || "").trim()
  );
  // Groq chat 응답의 choices 와 혼동하지 않도록 suggestions/keywords 만 사용
  const suggestionSource = raw.suggestions != null ? raw.suggestions
    : (raw.keywords != null ? raw.keywords
      : (raw.next_suggestions != null ? raw.next_suggestions : null));
  const relayPrompt = String(
    raw.relay_prompt || raw.relayPrompt || raw.next_madlib || raw.madlib || ""
  ).trim();
  const relayPromptKo = String(
    raw.relay_prompt_ko || raw.relayPromptKo || raw.next_madlib_ko || raw.madlib_ko || raw.madlibKo || ""
  ).trim();
  const out = {
    english: english,
    korean: korean,
    story_en: english,
    story_ko: korean,
    suggestions: normalizeSuggestions(suggestionSource, english, ""),
    words: Array.isArray(raw.words) ? raw.words : [],
    image: raw.image,
    relay_prompt: relayPrompt,
    relay_prompt_ko: relayPromptKo,
    relayPrompt: relayPrompt,
    relayPromptKo: relayPromptKo
  };
  if (Array.isArray(raw._apiSuggestions)) out._apiSuggestions = raw._apiSuggestions.slice();
  return out;
}

function hasMetaLanguage(text) {
  return /child'?s idea|adventure changed|new event|user (chose|input|said)|story changed|faced a new|the process|keyword|meta/i.test(String(text || ""));
}

function koreanHasEnglishLeak(korean) {
  return /[A-Za-z]{2,}/.test(String(korean || ""));
}

function isNearDuplicateScene(english) {
  const next = String(english || "").toLowerCase().replace(/[^a-z0-9가-힣\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!next) return false;
  const nextWords = next.split(" ").filter((w) => w.length > 3);
  if (!nextWords.length) return false;
  return collectFullStoryEnglish().some((line) => {
    const prev = String(line || "").toLowerCase().replace(/[^a-z0-9가-힣\s]/g, " ").replace(/\s+/g, " ").trim();
    const body = prev.replace(/^scene\s+\d+\s*:\s*/, "");
    if (!body) return false;
    if (body === next) return true;
    const prevSet = new Set(body.split(" ").filter((w) => w.length > 3));
    const hits = nextWords.filter((w) => prevSet.has(w)).length;
    return hits / nextWords.length >= 0.8;
  });
}

function buildFullStoryText() {
  const selected = CLASSIC_STORIES[state.template] || CLASSIC_STORIES.pigs;
  const tpl = TEMPLATES[state.template] || TEMPLATES.pigs;
  const scenes = collectFullStoryEnglish();
  const body = scenes.length ? scenes.join("\n") : "(No previous scenes yet.)";
  return "Fairy tale: " + selected.title + " (" + tpl.en + ")\n" + body;
}

function buildUserStoryMessage(userInput) {
  const fullStory = buildFullStoryText();
  const input = String(userInput || "").trim();
  return "Story History: " + fullStory + "\nUser Input: " + input;
}

async function requestGroqStory(idea) {
  const userInput = String(idea || "").trim();
  if (!userInput) throw new Error("입력값이 비어 있습니다.");
  console.log("[StoryLoom] Groq 전달 입력값:", userInput);
  console.log("[StoryLoom] Full Story Context:\n" + previousStoryContext());
  const userMessage = buildUserStoryMessage(userInput);
  const apiKey = String(requireGroqApiKey() || "").trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY가 비어 있습니다. config.js를 확인해 주세요.");
  }
  const models = ["qwen/qwen3-32b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
  let lastError = "Groq 연결 실패";
  let sawModelNotFound = false;
  function isModelNotFoundError(error) {
    const msg = String((error && error.message) || error || "");
    return msg.indexOf("404") !== -1 || /model_not_found/i.test(msg) || /model not found/i.test(msg);
  }
  try {
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      try {
        const normalized = await callGroqOnce(apiKey, model, userMessage);
        if (!normalized.english || !normalized.korean) {
          throw new Error("영어/한글 문장이 비어 있습니다.");
        }
        // 과도한 거부로 성공 응답이 버려지지 않도록 경고만 남기고 통과
        if (hasMetaLanguage(normalized.english) || hasMetaLanguage(normalized.korean)) {
          console.warn("[StoryLoom] 메타 문장 의심 (경고만):", normalized.english, normalized.korean);
        }
        if (koreanHasEnglishLeak(normalized.korean)) {
          console.warn("[StoryLoom] 한글 속 영문 잔여 (경고만):", normalized.korean);
        }
        if (isNearDuplicateScene(normalized.english)) {
          console.warn("[StoryLoom] 이전 장면과 유사 (경고만):", normalized.english);
        }
        if (storyIgnoresUserKeyword(userInput, normalized.english)) {
          console.warn("[StoryLoom] 입력 키워드 미포함 의심 (경고만):", userInput, normalized.english);
        }
        console.log("[StoryLoom] Groq 성공 모델:", model);
        return normalized;
      } catch (error) {
        lastError = error && error.message ? error.message : String(error);
        console.error("[StoryLoom Fetch Error] 상세 원인:", error && error.message, error && error.name, error);
        console.error("Groq 시도 실패 " + model + ":", lastError);
        if (isModelNotFoundError(error)) {
          sawModelNotFound = true;
        }
        if (error && String(error.message || "").indexOf("Failed to fetch") !== -1) {
          alert("네트워크 연결 문제 또는 CORS 에러가 발생했습니다. 콘솔을 확인해 주세요.");
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("[StoryLoom Fetch Error] 상세 원인:", error && error.message, error && error.name, error);
    if (isModelNotFoundError(error)) {
      alert("Groq 계정 권한 제한 상태입니다. Groq 홈페이지에서 계정 상태(전화번호 인증 등)를 확인해 주세요.");
    } else if (error && String(error.message || "").indexOf("Failed to fetch") !== -1) {
      alert("네트워크 연결 문제 또는 CORS 에러가 발생했습니다. 콘솔을 확인해 주세요.");
    }
    throw error;
  }
  if (sawModelNotFound) {
    alert("Groq 계정 권한 제한 상태입니다. Groq 홈페이지에서 계정 상태(전화번호 인증 등)를 확인해 주세요.");
  }
  console.warn("Groq 최종 실패:", lastError, "입력값:", userInput);
  throw new Error(lastError || "Groq API 장면을 받지 못했습니다.");
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
  const normalized = normalizeGeminiPayload(payload);
  const english = normalized.english.split(/\n+/).filter(Boolean).slice(0, 2).join(" ");
  const korean = normalized.korean;
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
    pages: [{ en: sentenceToTokens(english, glossesFrom(normalized)), kr: korean }],
    published: false,
    level: state.level
  };
}

$("generateBtn").addEventListener("click", async () => {
  const button = $("generateBtn");
  if (button.disabled) return;
  if (!requireGroqApiKey()) {
    toast("GROQ_API_KEY가 비어 있습니다. .env와 config.js를 확인해 주세요.");
    return;
  }
  const inputEl = $("relayInput") || $("user-input");
  const userInput = inputEl ? String(inputEl.value || "").trim() : "";
  if (!userInput) {
    toast("이어 쓸 단어나 문장을 먼저 입력해 주세요.");
    if (inputEl) inputEl.focus();
    return;
  }
  if (!CLASSIC_STORIES[state.template]) {
    toast("먼저 명작 동화 템플릿을 골라 주세요.");
    return;
  }
  const selected = CLASSIC_STORIES[state.template];
  ensureClassicOpeningPage();
  currentTemplateImage = selected.image;
  state.templateImage = selected.image;
  button.disabled = true;
  showStoryLoading();
  try {
    const payload = normalizeGeminiPayload(await requestGroqStory(userInput));
    const textEn = String(payload.english || "").trim();
    const textKo = String(payload.korean || "").trim();
    if (!textEn || !textKo) throw new Error("API 응답에 english/korean이 없습니다.");
    const story = storyFromGemini(payload, selected.image);
    const page = story.pages[0];
    // 사용자 입력으로 만든 장면은 Scene 2부터 추가 (Scene 1 오프닝 보존)
    appendStoryPage({
      scene: storyPages.length + 1,
      text_en: textEn,
      text_ko: textKo,
      image: selected.image,
      en: page.en,
      kr: textKo
    });
    markSuggestionUsed(userInput);
    updateSuggestionButtonsFromApi(Object.assign({}, payload || {}, {
      english: textEn,
      suggestions: (payload && payload._apiSuggestions && payload._apiSuggestions.length)
        ? payload._apiSuggestions
        : (payload && payload.suggestions)
    }), textEn, userInput);
    recordLearningActivity("story");
    toast("다음 장면이 만들어졌어요. 책장을 넘겨 보세요.");
  } catch (error) {
    console.error("동화 생성 처리 오류:", error);
    updateUI();
    toast("동화를 만들지 못했어요. 잠시 후 다시 시도해 주세요.");
  } finally {
    if (inputEl) inputEl.value = "";
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
  if (state.story && (state.story.id === FRIENDS_OMNIBUS_ID || state.story.libraryId === FRIENDS_OMNIBUS_ID)) {
    toast("기본 통합본은 이미 서재에 있어요.");
    return;
  }
  if (!storyPages.length) {
    toast("먼저 동화 장면을 만들어 주세요.");
    return;
  }
  const result = syncActiveStoryToLibrary({ silent: true, createIfMissing: true });
  if (!result || !result.ok) {
    toast("서재에 넣을 동화 내용이 없어요.");
    return;
  }
  if (result.updated) {
    toast("서재의 책 내용을 최신 이야기로 업데이트했어요! ✨");
  } else {
    toast("서재 책장에 올려 두었어요.");
  }
});

function resetCurrentCreationDraftOnly() {
  const ok = window.confirm("현재 쓰던 동화 화면을 비우고 새 이야기를 시작할까요? (서재에 저장된 책은 유지돼요)");
  if (!ok) return;
  clearActiveDraft();
  state.activeBookId = null;
  state.usedSuggestions = [];
  state.lastSuggestions = [];
  state.relayMadlib = null;
  state.relayMadlibKo = null;
  state.suggestionPoolCursor = 0;
  if (state.story) {
    state.story.libraryId = null;
    state.story.activeBookId = null;
    state.story.id = null;
  }
  const inputEl = $("relayInput") || $("user-input");
  if (inputEl) inputEl.value = "";
  const tplKey = CLASSIC_STORIES[state.template] ? state.template : "pigs";
  resetStoryBook(tplKey);
  syncTemplateCardHighlight(tplKey);
  toast("새 동화를 시작할 준비됐어요.");
}

function wipeAllStoryLoomLocalData() {
  const ok = window.confirm("모든 창작 도서, 단어장, 학습 포인트, 커뮤니티 기록을 초기 상태로 되돌릴까요?");
  if (!ok) return;
  try {
    const extraKeys = [
      "customProfileImage",
      "customProfileStyle",
      "storyloom-nickname",
      "storyloom-theme",
      "storyloom-character",
      VOCAB_STORAGE_KEY,
      BOOKS_STORAGE_KEY,
      ACTIVE_DRAFT_KEY,
      COMMUNITY_STORAGE_KEY,
      WEEK_VOCAB_COUNT_KEY
    ];
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (
        key.indexOf("storyloom") === 0 ||
        key.indexOf(WEEK_ACTIVITY_KEY) === 0 ||
        extraKeys.indexOf(key) >= 0
      ) {
        toRemove.push(key);
      }
    }
    extraKeys.forEach((key) => {
      if (toRemove.indexOf(key) < 0) toRemove.push(key);
    });
    toRemove.forEach((key) => localStorage.removeItem(key));
    // 단어장은 키를 비워 두어 기본 샘플 4개가 다시 채워지지 않게 함
    localStorage.setItem(VOCAB_STORAGE_KEY, "[]");
  } catch (err) {
    console.warn("[StoryLoom] 전체 초기화 실패:", err && err.message);
  }
  window.location.reload();
}

const newStoryBtn = $("newStoryBtn");
if (newStoryBtn) newStoryBtn.addEventListener("click", resetCurrentCreationDraftOnly);
const wipeAllDataBtn = $("wipeAllDataBtn");
if (wipeAllDataBtn) wipeAllDataBtn.addEventListener("click", wipeAllStoryLoomLocalData);
function handlePdfDownloadClick() {
  const book = getActiveReaderBook() || ensurePages(findBook(state.publishId));
  downloadPdf(book);
  toast("영어 동화 PDF를 내려받았어요.");
}

$("downloadBtn").addEventListener("click", handlePdfDownloadClick);
$("shareBtn").addEventListener("click", () => { shareCurrentLibraryBook(); });
$("cheerBtn").addEventListener("click", () => { publishCurrentLibraryBook(); });

const libraryDownloadBtn = $("libraryDownloadBtn");
const libraryShareBtn = $("libraryShareBtn");
const libraryCheerBtn = $("libraryCheerBtn");
const libraryContinueBtn = $("libraryContinueBtn");
if (libraryDownloadBtn) libraryDownloadBtn.addEventListener("click", handlePdfDownloadClick);
if (libraryShareBtn) libraryShareBtn.addEventListener("click", () => { shareCurrentLibraryBook(); });
if (libraryCheerBtn) libraryCheerBtn.addEventListener("click", () => { publishCurrentLibraryBook(); });
if (libraryContinueBtn) {
  libraryContinueBtn.addEventListener("click", () => {
    const bookId = state.publishId || state.sampleBookId;
    loadBookIntoCreateWorkspace(bookId);
  });
}
$("relaySubmit").addEventListener("click", async () => {
  const button = $("relaySubmit");
  if (button && button.disabled) return;
  const line = String($("relayMore").value || "").trim();
  if (!line) {
    toast("이어 쓸 문장을 한 줄 적어 주세요.");
    return;
  }
  const story = state.community.find((item) => item.id === state.relayId);
  if (!story) {
    toast("이어 쓸 이야기를 찾지 못했어요.");
    return;
  }

  const originalLabel = "이 문장으로 이어 쓰기";
  let englishLine = "";
  let koreanLine = "";
  let usedFallback = false;
  const inputIsKorean = containsHangul(line);
  const inputIsEnglish = looksMostlyEnglish(line);

  try {
    if (button) {
      button.disabled = true;
      button.textContent = inputIsKorean ? "영어 문장으로 바꾸는 중... ✨" : "한국어 해석을 만드는 중... ✨";
    }

    if (inputIsKorean) {
      // 한국어 입력 → 해석에 원문 누적, 영어는 Groq 번역
      koreanLine = ensureKoreanSentenceEnding(line);
      try {
        englishLine = await translateRelayLineToEnglish(line, story);
      } catch (err) {
        console.warn("[StoryLoom] 릴레이 한→영 폴백:", err && err.message);
        englishLine = relayFallbackEnglish(line, story);
        usedFallback = true;
      }
    } else if (inputIsEnglish) {
      // 영어 입력 → 본문에 원문 누적, 한국어는 Groq 번역
      englishLine = ensureEnglishSentenceEnding(line);
      try {
        koreanLine = await translateRelayLineToKorean(englishLine, story);
      } catch (err) {
        console.warn("[StoryLoom] 릴레이 영→한 폴백:", err && err.message);
        koreanLine = relayFallbackKorean(englishLine, story);
        usedFallback = true;
      }
    } else {
      // 애매한 입력은 영어로 취급하되 한국어 해석도 시도
      englishLine = ensureEnglishSentenceEnding(line);
      try {
        koreanLine = await translateRelayLineToKorean(englishLine, story);
      } catch (err) {
        koreanLine = relayFallbackKorean(englishLine, story);
        usedFallback = true;
      }
    }

    appendCommunityRelaySentence(story, englishLine, koreanLine);
    recordLearningActivity("community");
    renderCommunity();
    if (state.tab === "parents" || state.parentUnlocked) renderParents();
    renderRelayStory(story);
    $("relayMore").value = "";
    if (usedFallback) {
      toast(
        getGroqApiKey()
          ? "번역이 잠시 안 되어 비슷한 문장으로 이어 썼어요. (커뮤니티 +1점)"
          : "API 키가 없어 기본 문장으로 이어 썼어요. config.js를 확인해 주세요. (커뮤니티 +1점)"
      );
    } else if (inputIsKorean) {
      toast("한국어 아이디어를 영어 본문과 함께 이어 붙였어요. (커뮤니티 +1점)");
    } else {
      toast("영어 문장과 한국어 해석을 함께 이어 붙였어요. (커뮤니티 +1점)");
    }
  } catch (err) {
    console.error("[StoryLoom] 릴레이 이어쓰기 오류:", err);
    toast("이어 쓰기에 실패했어요. 잠시 후 다시 시도해 주세요.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
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

state.vocab = loadVocabFromStorage();
persistVocab();
state.books = loadBooksFromStorage();
persistBooks();
state.community = loadCommunityFromStorage();
persistCommunity();
syncWeekVocabCountFromStorage();
persistWeekVocabCount();
syncWeekActivityFromStorage(state.level);
persistWeekActivity(state.level);

const draftRestored = restoreActiveDraft();
if (draftRestored) {
  console.log("[StoryLoom] 자유 창작 draft 복원:", storyPages.length + "장면", (currentPage + 1) + "/" + storyPages.length);
}

renderCharacter();
renderLevel();
renderComposer();
updateUI();
renderVocab();
shelfBooks();
renderParents();
renderCommunity();
consumeShareLinkFromUrl();
