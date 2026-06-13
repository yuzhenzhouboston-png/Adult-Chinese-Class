const defaults = {
  matchPairs: [
    { zh: "你好", py: "nǐ hǎo", en: "hello" },
    { zh: "名字", py: "míng zi", en: "name" },
    { zh: "我叫", py: "wǒ jiào", en: "my name is" },
    { zh: "认识", py: "rèn shi", en: "to meet / to know" },
    { zh: "来自", py: "lái zì", en: "to come from" },
    { zh: "很高兴", py: "hěn gāo xìng", en: "very happy / nice to" }
  ],
  sentence: {
    target: "我叫安娜，很高兴认识你。",
    translation: "My name is Anna. Nice to meet you."
  },
  listening: [
    { q: "说话的人在哪里？", a: "餐厅" },
    { q: "顾客想要什么？", a: "茶" },
    { q: "他们提到了什么时间？", a: "三点" }
  ],
  scenarios: [
    { name: "在餐厅点餐", goal: "练习点菜、询问推荐、表达冷热和打包。" },
    { name: "打电话预约", goal: "练习说明时间、姓名、原因和确认信息。" },
    { name: "在商店买东西", goal: "练习询问价格、颜色、尺寸和付款方式。" }
  ],
  homeworkVideo: {
    name: "Chinese Conversation for Beginners: Self Introduction",
    url: "https://youtu.be/r9XWsyYWT3w?si=CBcQ0uTMNUO316aS"
  },
  readingDialogue: [
    { role: "A", zh: "你好，请问你叫什么名字？", py: "Nǐ hǎo, qǐng wèn nǐ jiào shén me míng zi?", en: "Hello, what is your name?" },
    { role: "B", zh: "我叫安娜。很高兴认识你。", py: "Wǒ jiào Ān nà. Hěn gāo xìng rèn shi nǐ.", en: "My name is Anna. Nice to meet you." },
    { role: "A", zh: "我也很高兴认识你。", py: "Wǒ yě hěn gāo xìng rèn shi nǐ.", en: "Nice to meet you too." }
  ],
  slides: [],
  video: null,
  accessCode: "",
  showTeacherTools: true
};

const state = loadState();
let selectedZh = null;
let selectedEn = null;
let sentenceAnswer = [];
let dbPromise = null;

const $ = (selector) => document.querySelector(selector);

const translations = {
  zh: {
    accessKicker: "Class Access",
    siteTitle: "成人中文班复习中心",
    accessLabel: "请输入课堂访问码",
    accessButton: "进入学习",
    accessWrong: "访问码不正确，请再试一次。",
    heroKicker: "Adult Chinese Review Studio",
    heroSubtitle: "课堂练习、家庭作业、学习资源和场景对话练习都放在一个地方。",
    tabSlides: "课堂练习",
    tabHomework: "作业",
    tabListening: "学习资源",
    tabDialogue: "对话",
    tabTeacher: "老师设置",
    slidesKicker: "Review",
    slidesTitle: "课堂练习",
    localUpload: "本机临时上传",
    homeworkKicker: "Homework",
    homeworkTitle: "家庭作业",
    resetPractice: "重新练习",
    matchTitle: "游戏：中英文配对",
    chineseLabel: "中文",
    englishLabel: "英文",
    sentenceTitle: "组成句子",
    check: "检查",
    clear: "清空",
    homeworkVideoKicker: "Video",
    homeworkVideoEmpty: "老师可以在这里放 YouTube 视频，学生看完后完成下面的作业。",
    readingTitle: "朗读中英文对话",
    listeningKicker: "Resources",
    listeningTitle: "学习资源",
    videoEmpty: "老师可以放一段餐厅、商店、看医生等场景视频，或其他学习资源。",
    listeningQuestionsTitle: "资源问题",
    checkListening: "检查听力答案",
    speakingKicker: "Speaking",
    dialogueTitle: "场景对话练习",
    newDialogue: "换一个开头",
    scenarioLabel: "场景",
    studentRoleLabel: "学生角色",
    aiRoleLabel: "AI 角色",
    practiceGoal: "练习目标",
    chatPlaceholder: "用中文回复，例如：我想点一杯热茶。",
    send: "发送",
    teacherKicker: "Teacher",
    teacherTitle: "老师设置",
    saveSettings: "保存设置",
    onlineSlidesTitle: "线上课件链接",
    onlineSlidesHelp: "每行一个：课件名称 = Google Drive、Dropbox、OneDrive 或网盘链接",
    onlineVideoTitle: "线上视频链接",
    videoTitlePlaceholder: "视频标题",
    videoUrlPlaceholder: "YouTube unlisted、Google Drive 或 mp4 链接",
    onlineVideoHelp: "发布给学生时，推荐使用 unlisted YouTube 或共享视频链接。",
    homeworkVideoEditorTitle: "作业 YouTube 视频",
    homeworkVideoUrlPlaceholder: "YouTube 视频链接",
    homeworkVideoEditorHelp: "学生会先看这个视频，再完成作业。",
    matchEditorTitle: "匹配题",
    matchEditorHelp: "每行一组：中文 = English",
    sentenceEditorTitle: "组句题",
    sentenceEditorHelp: "第一行写中文正确答案，第二行写英文提示。",
    listeningEditorTitle: "听力问题",
    listeningEditorHelp: "每行一题：问题 = 答案关键词",
    readingEditorTitle: "朗读对话",
    readingEditorHelp: "每行一句：角色 = 中文 | English",
    scenarioEditorTitle: "对话场景",
    scenarioEditorHelp: "每行一个场景：场景名 = 练习目标",
    saveTooLarge: "浏览器无法保存这么大的文件。请用 Chrome 或 Edge 打开本页面，或改用较小的视频文件。",
    sentenceCorrect: "很好！这句话顺序正确。",
    sentenceWrong: "再试一次。正确答案是：",
    listeningScore: (correct, total) => `你答对了 ${correct} / ${total} 题。`,
    saved: "已保存。学生页面已经更新。",
    noSlidesTitle: "还没有课件",
    noSlidesBody: "在老师设置里添加线上课件链接，学生就能在这里打开复习。",
    openReview: "打开复习",
    downloadReview: "下载复习",
    deleteSlide: "删除",
    matchCorrect: "配对正确。",
    matchWrong: "这两个不是一组，再选一次。",
    sentenceEmpty: "点击上面的词语，组成中文句子。",
    openVideo: "打开场景视频",
    listeningPlaceholder: "写下你听到的关键词",
    openingRestaurant: "您好，欢迎光临。请问您想喝点什么？",
    openingAppointment: "您好，请问您想预约哪一天、几点？",
    openingStore: "您好，需要帮您找什么吗？",
    openingDefault: "你好，我们开始练习吧。你可以先说一句。",
    aiDefault: "我明白了。请你再说一句更完整的话，可以加上时间、数量或原因。",
    aiRestaurantGood: "好的。您要热的还是冰的？需要打包吗？",
    aiRestaurantHint: "在餐厅里，你可以说：我想要一杯热茶。",
    aiAppointmentGood: "好的，我帮您确认一下。请问您的姓名和电话是多少？",
    aiAppointmentHint: "预约的时候，记得说清楚日期和时间。",
    aiStoreGood: "这个是二十五美元。您想刷卡还是付现金？",
    aiStoreHint: "你可以问：这个多少钱？有没有大一点的？"
  },
  en: {
    accessKicker: "Class Access",
    siteTitle: "Adult Chinese Review Center",
    accessLabel: "Enter the class access code",
    accessButton: "Enter",
    accessWrong: "That access code is not correct. Please try again.",
    heroKicker: "Adult Chinese Review Studio",
    heroSubtitle: "Class work, homework, learning resources, and scenario dialogue practice in one place.",
    tabSlides: "Class Work / Ketang lianxi",
    tabHomework: "Homework",
    tabListening: "Learning Resources",
    tabDialogue: "Dialogue",
    tabTeacher: "Teacher",
    slidesKicker: "Review",
    slidesTitle: "Class Work / Ketang lianxi",
    localUpload: "Local upload",
    homeworkKicker: "Homework",
    homeworkTitle: "Homework",
    resetPractice: "Practice Again",
    matchTitle: "Game: Match Chinese and English Words",
    chineseLabel: "Chinese",
    englishLabel: "English",
    sentenceTitle: "Build Sentences",
    check: "Check",
    clear: "Clear",
    homeworkVideoKicker: "Video",
    homeworkVideoEmpty: "The teacher can add a YouTube video here. Watch it first, then complete the homework below.",
    readingTitle: "Read a Chinese-English Dialogue",
    listeningKicker: "Resources",
    listeningTitle: "Learning Resources",
    videoEmpty: "The teacher can add a scenario video or other learning resource here.",
    listeningQuestionsTitle: "Resource Questions",
    checkListening: "Check Answers",
    speakingKicker: "Speaking",
    dialogueTitle: "Scenario Dialogue Practice",
    newDialogue: "New Opening",
    scenarioLabel: "Scenario",
    studentRoleLabel: "Student role",
    aiRoleLabel: "AI role",
    practiceGoal: "Practice goal",
    chatPlaceholder: "Reply in Chinese, for example: 我想点一杯热茶。",
    send: "Send",
    teacherKicker: "Teacher",
    teacherTitle: "Teacher Settings",
    saveSettings: "Save Settings",
    onlineSlidesTitle: "Online Slide Links",
    onlineSlidesHelp: "One per line: Slide title = Google Drive, Dropbox, OneDrive, or file link",
    onlineVideoTitle: "Online Video Link",
    videoTitlePlaceholder: "Video title",
    videoUrlPlaceholder: "YouTube unlisted, Google Drive, or mp4 link",
    onlineVideoHelp: "For students, use an unlisted YouTube video or a shared video link.",
    homeworkVideoEditorTitle: "Homework YouTube Video",
    homeworkVideoUrlPlaceholder: "YouTube video link",
    homeworkVideoEditorHelp: "Students watch this video first, then complete the homework.",
    matchEditorTitle: "Matching",
    matchEditorHelp: "One pair per line: 中文 = English",
    sentenceEditorTitle: "Sentence Builder",
    sentenceEditorHelp: "First field: correct Chinese sentence. Second field: English prompt.",
    listeningEditorTitle: "Listening Questions",
    listeningEditorHelp: "One question per line: Question = answer keyword",
    readingEditorTitle: "Reading Dialogue",
    readingEditorHelp: "One line each: Role = Chinese | English",
    scenarioEditorTitle: "Dialogue Scenarios",
    scenarioEditorHelp: "One scenario per line: Scenario name = practice goal",
    saveTooLarge: "The browser cannot save a file this large. Please use Chrome or Edge, or use a smaller video file.",
    sentenceCorrect: "Nice! The sentence order is correct.",
    sentenceWrong: "Try again. The correct answer is: ",
    listeningScore: (correct, total) => `You got ${correct} / ${total} correct.`,
    saved: "Saved. The student page has been updated.",
    noSlidesTitle: "No slides yet",
    noSlidesBody: "Add online slide links in Teacher Settings so students can open them here.",
    openReview: "Open Review",
    downloadReview: "Download",
    deleteSlide: "Delete",
    matchCorrect: "Correct match.",
    matchWrong: "Those two do not match. Try again.",
    sentenceEmpty: "Click the words above to build the Chinese sentence.",
    openVideo: "Open Scenario Video",
    listeningPlaceholder: "Write the keyword you heard",
    openingRestaurant: "Hello, welcome. What would you like to drink?",
    openingAppointment: "Hello, what day and time would you like to make an appointment for?",
    openingStore: "Hello, what can I help you find?",
    openingDefault: "Hello, let's begin. You can say one sentence first.",
    aiDefault: "I understand. Please say a more complete sentence, adding time, quantity, or reason if you can.",
    aiRestaurantGood: "Great. Would you like it hot or iced? Do you need it to go?",
    aiRestaurantHint: "In a restaurant, you can say: 我想要一杯热茶。",
    aiAppointmentGood: "Great, I will confirm that for you. What is your name and phone number?",
    aiAppointmentHint: "When making an appointment, remember to say the date and time clearly.",
    aiStoreGood: "This is twenty-five dollars. Would you like to pay by card or cash?",
    aiStoreHint: "You can ask: 这个多少钱？有没有大一点的？"
  }
};

const pinyinLabels = {
  siteTitle: "chéng rén zhōng wén bān fù xí zhōng xīn",
  accessLabel: "qǐng shū rù kè táng fǎng wèn mǎ",
  accessButton: "jìn rù xué xí",
  accessWrong: "fǎng wèn mǎ bù zhèng què, qǐng zài shì yí cì",
  heroSubtitle: "kè táng liàn xí, jiā tíng zuò yè, xué xí zī yuán hé chǎng jǐng duì huà liàn xí dōu fàng zài yí gè dì fāng",
  tabSlides: "kè táng liàn xí",
  tabHomework: "zuò yè",
  tabListening: "xué xí zī yuán",
  tabDialogue: "duì huà",
  tabTeacher: "lǎo shī shè zhì",
  slidesTitle: "kè táng liàn xí",
  localUpload: "běn jī lín shí shàng chuán",
  homeworkTitle: "jiā tíng zuò yè",
  resetPractice: "chóng xīn liàn xí",
  matchTitle: "yóu xì: zhōng yīng wén pèi duì",
  chineseLabel: "zhōng wén",
  englishLabel: "yīng wén",
  sentenceTitle: "zǔ chéng jù zi",
  check: "jiǎn chá",
  clear: "qīng kōng",
  homeworkVideoEmpty: "lǎo shī kě yǐ zài zhè lǐ fàng YouTube shì pín, xué shēng kàn wán hòu wán chéng xià miàn de zuò yè",
  readingTitle: "lǎng dú zhōng yīng wén duì huà",
  listeningTitle: "xué xí zī yuán",
  videoEmpty: "lǎo shī kě yǐ fàng yí duàn chǎng jǐng shì pín, huò qí tā xué xí zī yuán",
  listeningQuestionsTitle: "zī yuán wèn tí",
  checkListening: "jiǎn chá dá àn",
  dialogueTitle: "chǎng jǐng duì huà liàn xí",
  newDialogue: "huàn yí gè kāi tóu",
  scenarioLabel: "chǎng jǐng",
  studentRoleLabel: "xué shēng jué sè",
  aiRoleLabel: "AI jué sè",
  practiceGoal: "liàn xí mù biāo",
  chatPlaceholder: "yòng zhōng wén huí fù, lì rú: wǒ xiǎng diǎn yì bēi rè chá",
  send: "fā sòng",
  saveSettings: "bǎo cún shè zhì",
  onlineSlidesTitle: "xiàn shàng kè jiàn liàn jiē",
  onlineVideoTitle: "xiàn shàng shì pín liàn jiē",
  homeworkVideoEditorTitle: "zuò yè YouTube shì pín",
  matchEditorTitle: "pèi duì tí",
  sentenceEditorTitle: "zǔ jù tí",
  listeningEditorTitle: "zī yuán wèn tí",
  readingEditorTitle: "lǎng dú duì huà",
  scenarioEditorTitle: "duì huà chǎng jǐng",
  sentenceCorrect: "hěn hǎo! zhè jù huà shùn xù zhèng què",
  sentenceWrong: "zài shì yí cì. zhèng què dá àn shì",
  saved: "yǐ bǎo cún. xué shēng yè miàn yǐ jīng gēng xīn",
  noSlidesTitle: "hái méi yǒu kè táng liàn xí",
  noSlidesBody: "zài lǎo shī shè zhì lǐ tiān jiā xiàn shàng kè táng liàn xí liàn jiē, xué shēng jiù néng zài zhè lǐ dǎ kāi fù xí",
  openReview: "dǎ kāi fù xí",
  downloadReview: "xià zǎi fù xí",
  deleteSlide: "shān chú",
  matchCorrect: "pèi duì zhèng què",
  matchWrong: "zhè liǎng gè bú shì yì zǔ, zài xuǎn yí cì",
  sentenceEmpty: "diǎn jī shàng miàn de cí yǔ, zǔ chéng zhōng wén jù zi",
  openVideo: "dǎ kāi chǎng jǐng shì pín",
  listeningPlaceholder: "xiě xià nǐ tīng dào de guān jiàn cí"
};

function t(key, ...args) {
  const zhValue = translations.zh[key] ?? key;
  const enValue = translations.en[key] ?? zhValue;
  const zhText = typeof zhValue === "function" ? zhValue(...args) : zhValue;
  const enText = typeof enValue === "function" ? enValue(...args) : enValue;
  const py = pinyinLabels[key];
  const zhWithPinyin = py ? `${zhText} (${py})` : zhText;
  return zhText === enText ? zhWithPinyin : `${zhWithPinyin} / ${enText}`;
}

function applyLanguage() {
  document.documentElement.lang = "zh-Hans";
  document.title = t("siteTitle");
  document.querySelectorAll("[data-i18n]").forEach((item) => {
    item.textContent = t(item.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((item) => {
    item.placeholder = t(item.dataset.i18nPlaceholder);
  });
}

function loadState() {
  const siteConfig = window.CLASS_SITE_CONFIG || {};
  const base = {
    ...structuredClone(defaults),
    ...siteConfig,
    matchPairs: siteConfig.matchPairs || defaults.matchPairs,
    sentence: siteConfig.sentence || defaults.sentence,
    listening: siteConfig.listening || defaults.listening,
    scenarios: siteConfig.scenarios || defaults.scenarios,
    homeworkVideo: siteConfig.homeworkVideo || defaults.homeworkVideo,
    readingDialogue: siteConfig.readingDialogue || defaults.readingDialogue,
    slides: (siteConfig.slides || defaults.slides).filter((slide) => slide.url || slide.dataUrl || slide.id),
    video: siteConfig.video?.url ? siteConfig.video : defaults.video
  };
  const saved = localStorage.getItem("adultChineseClassData");
  if (!saved) return base;
  try {
    return { ...base, ...JSON.parse(saved) };
  } catch {
    return base;
  }
}

function saveState() {
  try {
    localStorage.setItem("adultChineseClassData", JSON.stringify(state));
  } catch {
    alert(t("saveTooLarge"));
  }
}

function openFileDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = indexedDB.open("adultChineseClassFiles", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("files");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function storeUploadedFile(file) {
  try {
    const id = crypto.randomUUID();
    await putFile(id, file);
    return { id };
  } catch {
    return { dataUrl: await fileToDataUrl(file) };
  }
}

async function putFile(id, file) {
  const db = await openFileDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("files", "readwrite");
    transaction.objectStore("files").put(file, id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getFile(id) {
  if (!id) return null;
  const db = await openFileDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("files", "readonly");
    const request = transaction.objectStore("files").get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFile(id) {
  if (!id) return;
  const db = await openFileDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("files", "readwrite");
    transaction.objectStore("files").delete(id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

const wordPinyin = {
  "我叫": "wǒ jiào",
  "安娜": "Ān nà",
  "很高兴": "hěn gāo xìng",
  "认识": "rèn shi",
  "你": "nǐ",
  "，": "",
  "。": ""
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-active"));
    tab.classList.add("is-active");
    $(`#${tab.dataset.view}`).classList.add("is-active");
  });
});

$("#accessForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const expected = state.accessCode || "";
  const entered = $("#accessCodeInput").value.trim();
  if (!expected || entered === expected) {
    localStorage.setItem("adultChineseClassAccess", expected || "open");
    unlockSite();
  } else {
    $("#accessFeedback").textContent = t("accessWrong");
  }
});

$("#slideUpload").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const stored = await storeUploadedFile(file);
  state.slides.unshift({
    ...stored,
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toLocaleDateString()
  });
  saveState();
  renderSlides();
  event.target.value = "";
});

$("#videoUpload").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const stored = await storeUploadedFile(file);
  if (state.video?.id) await deleteFile(state.video.id).catch(() => {});
  state.video = {
    ...stored,
    name: file.name,
    type: file.type
  };
  saveState();
  renderVideo();
  event.target.value = "";
});

$("#resetPractice").addEventListener("click", () => {
  selectedZh = null;
  selectedEn = null;
  sentenceAnswer = [];
  renderHomework();
});

$("#checkSentence").addEventListener("click", () => {
  const answer = sentenceAnswer.join("");
  const target = state.sentence.target.replaceAll(" ", "");
  const feedback = $("#sentenceFeedback");
  if (answer === target) {
    feedback.textContent = t("sentenceCorrect");
    feedback.classList.remove("is-wrong");
  } else {
    feedback.textContent = `${t("sentenceWrong")}${state.sentence.target}`;
    feedback.classList.add("is-wrong");
  }
});

$("#clearSentence").addEventListener("click", () => {
  sentenceAnswer = [];
  renderSentence();
});

$("#checkListening").addEventListener("click", () => {
  let correct = 0;
  state.listening.forEach((item, index) => {
    const value = $(`#listen-${index}`).value.trim();
    if (value.includes(item.a)) correct += 1;
  });
  const feedback = $("#listeningFeedback");
  feedback.textContent = t("listeningScore", correct, state.listening.length);
  feedback.classList.toggle("is-wrong", correct < state.listening.length);
});

$("#saveTeacherData").addEventListener("click", () => {
  state.slides = parseLinkedResources($("#slideLinkEditor").value);
  const videoUrl = $("#videoUrl").value.trim();
  state.video = videoUrl
    ? {
        name: $("#videoTitle").value.trim() || "场景视频",
        url: videoUrl
      }
    : null;
  const homeworkVideoUrl = $("#homeworkVideoUrlEditor").value.trim();
  state.homeworkVideo = {
    name: $("#homeworkVideoTitleEditor").value.trim() || "作业视频",
    url: homeworkVideoUrl
  };

  state.matchPairs = $("#matchEditor").value
    .split("\n")
    .map((line) => line.split("="))
    .filter((parts) => parts.length === 2 && parts[0].trim() && parts[1].trim())
    .map(([zh, en]) => ({ zh: zh.trim(), en: en.trim() }));

  state.sentence = {
    target: $("#sentenceTarget").value.trim() || defaults.sentence.target,
    translation: $("#sentenceTranslation").value.trim() || defaults.sentence.translation
  };

  state.listening = $("#listeningEditor").value
    .split("\n")
    .map((line) => line.split("="))
    .filter((parts) => parts.length === 2 && parts[0].trim() && parts[1].trim())
    .map(([q, a]) => ({ q: q.trim(), a: a.trim() }));

  state.readingDialogue = $("#readingEditor").value
    .split("\n")
    .map((line) => line.split("="))
    .filter((parts) => parts.length >= 2 && parts[0].trim() && parts.slice(1).join("=").trim())
    .map(([role, ...rest]) => {
      const [zh = "", en = ""] = rest.join("=").split("|");
      return { role: role.trim(), zh: zh.trim(), en: en.trim() };
    })
    .filter((line) => line.zh || line.en);

  state.scenarios = $("#scenarioEditor").value
    .split("\n")
    .map((line) => line.split("="))
    .filter((parts) => parts.length === 2 && parts[0].trim() && parts[1].trim())
    .map(([name, goal]) => ({ name: name.trim(), goal: goal.trim() }));

  saveState();
  selectedZh = null;
  selectedEn = null;
  sentenceAnswer = [];
  renderAll();
  $("#saveFeedback").textContent = t("saved");
});

$("#scenarioSelect").addEventListener("change", startDialogue);
$("#newDialogue").addEventListener("click", startDialogue);

$("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage("student", $("#studentRole").value || "学生", text);
  input.value = "";
  setTimeout(() => addAiReply(text), 250);
});

async function renderSlides() {
  const list = $("#slideList");
  list.innerHTML = "";
  if (!state.slides.length) {
    list.innerHTML = `<article class="resource-card"><div><h3>${t("noSlidesTitle")}</h3><p>${t("noSlidesBody")}</p></div></article>`;
    return;
  }

  for (const [index, slide] of state.slides.entries()) {
    const file = slide.id ? await getFile(slide.id).catch(() => null) : null;
    const url = slide.url || (file ? URL.createObjectURL(file) : slide.dataUrl);
    const card = document.createElement("article");
    card.className = "resource-card";
    const sizeText = slide.size ? ` · ${Math.max(1, Math.round(slide.size / 1024))} KB` : "";
    const dateText = slide.uploadedAt || "线上材料";
    const isOnline = Boolean(slide.url);
    card.innerHTML = `
      <div>
        <h3>${slide.name}</h3>
        <p>${dateText}${sizeText}</p>
      </div>
      <div class="inline-actions">
        <a class="download-link" ${isOnline ? 'target="_blank" rel="noopener"' : `download="${slide.name}"`} href="${url || "#"}">${isOnline ? t("openReview") : t("downloadReview")}</a>
        <button class="secondary-button" data-delete-slide="${index}">${t("deleteSlide")}</button>
      </div>
    `;
    list.appendChild(card);
  }

  document.querySelectorAll("[data-delete-slide]").forEach((button) => {
    button.addEventListener("click", async () => {
      const [removed] = state.slides.splice(Number(button.dataset.deleteSlide), 1);
      if (removed?.id) await deleteFile(removed.id).catch(() => {});
      saveState();
      renderSlides();
    });
  });
}

function renderHomework() {
  renderHomeworkVideo();
  renderMatch();
  renderSentence();
  renderReadingDialogue();
}

function renderHomeworkVideo() {
  const title = $("#homeworkVideoTitle");
  const embed = $("#homeworkVideoEmbed");
  const empty = $("#homeworkVideoEmpty");
  title.textContent = state.homeworkVideo?.name || t("homeworkVideoKicker");
  if (!state.homeworkVideo?.url) {
    embed.style.display = "none";
    embed.removeAttribute("src");
    empty.style.display = "block";
    empty.textContent = t("homeworkVideoEmpty");
    return;
  }
  const embedUrl = getEmbeddableVideoUrl(state.homeworkVideo.url);
  if (embedUrl) {
    embed.src = embedUrl;
    embed.style.display = "block";
    empty.style.display = "none";
  } else {
    embed.style.display = "none";
    embed.removeAttribute("src");
    empty.innerHTML = `<a class="download-link" target="_blank" rel="noopener" href="${state.homeworkVideo.url}">${t("openVideo")}</a>`;
    empty.style.display = "block";
  }
}

function renderMatch() {
  const zhBox = $("#chineseTerms");
  const enBox = $("#englishTerms");
  zhBox.innerHTML = "";
  enBox.innerHTML = "";

  shuffle(state.matchPairs).forEach((pair) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = formatChineseTerm(pair.zh, pair.py);
    button.addEventListener("click", () => chooseMatch("zh", pair, button));
    zhBox.appendChild(button);
  });

  shuffle(state.matchPairs).forEach((pair) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = pair.en;
    button.addEventListener("click", () => chooseMatch("en", pair, button));
    enBox.appendChild(button);
  });
}

function formatChineseTerm(zh, py) {
  const pinyin = py ? `<small>${escapeHtml(py)}</small>` : "";
  return `<span>${escapeHtml(zh)}</span>${pinyin}`;
}

function chooseMatch(type, pair, button) {
  const selector = type === "zh" ? "#chineseTerms .choice" : "#englishTerms .choice";
  document.querySelectorAll(selector).forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
  if (type === "zh") selectedZh = { pair, button };
  if (type === "en") selectedEn = { pair, button };

  if (!selectedZh || !selectedEn) return;
  const feedback = $("#matchFeedback");
  if (selectedZh.pair.zh === selectedEn.pair.zh) {
    selectedZh.button.classList.add("is-correct");
    selectedEn.button.classList.add("is-correct");
    selectedZh.button.disabled = true;
    selectedEn.button.disabled = true;
    feedback.textContent = t("matchCorrect");
    feedback.classList.remove("is-wrong");
  } else {
    feedback.textContent = t("matchWrong");
    feedback.classList.add("is-wrong");
  }
  selectedZh = null;
  selectedEn = null;
}

function renderSentence() {
  $("#sentencePrompt").textContent = state.sentence.translation;
  const bank = $("#wordBank");
  const answer = $("#sentenceAnswer");
  bank.innerHTML = "";
  answer.innerHTML = "";
  const chunks = splitChineseSentence(state.sentence.target);
  const used = new Set(sentenceAnswer.map((_, index) => index));

  shuffle(chunks).forEach((word) => {
    const selectedCount = sentenceAnswer.filter((item) => item === word).length;
    const totalCount = chunks.filter((item) => item === word).length;
    if (selectedCount >= totalCount) return;
    const chip = document.createElement("button");
    chip.className = "word-chip";
    chip.innerHTML = formatChineseTerm(word, wordPinyin[word]);
    chip.addEventListener("click", () => {
      sentenceAnswer.push(word);
      renderSentence();
    });
    bank.appendChild(chip);
  });

  sentenceAnswer.forEach((word, index) => {
    const chip = document.createElement("button");
    chip.className = "word-chip";
    chip.innerHTML = formatChineseTerm(word, wordPinyin[word]);
    chip.addEventListener("click", () => {
      sentenceAnswer.splice(index, 1);
      renderSentence();
    });
    answer.appendChild(chip);
  });

  if (!sentenceAnswer.length) {
    answer.innerHTML = `<span class="helper">${t("sentenceEmpty")}</span>`;
  }
}

function renderReadingDialogue() {
  const box = $("#readingDialogue");
  box.innerHTML = "";
  state.readingDialogue.forEach((line) => {
    const row = document.createElement("div");
    row.className = "reading-line";
    row.innerHTML = `
      <span class="reading-role">${escapeHtml(line.role)}</span>
      <div>
        <strong>${escapeHtml(line.zh)}</strong>
        ${line.py ? `<em>${escapeHtml(line.py)}</em>` : ""}
        <p>${escapeHtml(line.en)}</p>
      </div>
    `;
    box.appendChild(row);
  });
}

function splitChineseSentence(sentence) {
  const punctuation = sentence.match(/[。！？!?]$/)?.[0] || "";
  const clean = sentence.replace(/[。！？!?]$/, "");
  if (clean.includes(" ")) {
    return clean.split(/\s+/).filter(Boolean).concat(punctuation ? [punctuation] : []);
  }
  const knownWords = ["明天下午", "三点", "预约", "我想", "一杯", "热茶", "打包", "请问", "多少钱", "可以"];
  const chunks = [];
  let index = 0;
  while (index < clean.length) {
    const word = knownWords.find((candidate) => clean.startsWith(candidate, index));
    if (word) {
      chunks.push(word);
      index += word.length;
    } else {
      chunks.push(clean[index]);
      index += 1;
    }
  }
  if (punctuation) chunks.push(punctuation);
  return chunks.length > 1 ? chunks : clean.split("").concat(punctuation ? [punctuation] : []);
}

async function renderVideo() {
  const video = $("#sceneVideo");
  const embed = $("#videoEmbed");
  const empty = $("#videoEmpty");
  if (!state.video) {
    video.style.display = "none";
    embed.style.display = "none";
    empty.style.display = "block";
    video.removeAttribute("src");
    embed.removeAttribute("src");
    return;
  }
  if (state.video.url) {
    const embedUrl = getEmbeddableVideoUrl(state.video.url);
    video.style.display = "none";
    video.removeAttribute("src");
    if (embedUrl) {
      embed.src = embedUrl;
      embed.style.display = "block";
      empty.style.display = "none";
    } else {
      embed.style.display = "none";
      empty.innerHTML = `<a class="download-link" target="_blank" rel="noopener" href="${state.video.url}">${t("openVideo")}</a>`;
      empty.style.display = "block";
    }
    return;
  }
  const file = state.video.id ? await getFile(state.video.id).catch(() => null) : null;
  video.src = file ? URL.createObjectURL(file) : state.video.dataUrl;
  video.style.display = "block";
  embed.style.display = "none";
  empty.style.display = "none";
}

function renderListening() {
  const box = $("#listeningQuestions");
  box.innerHTML = "";
  state.listening.forEach((item, index) => {
    const label = document.createElement("label");
    label.innerHTML = `${index + 1}. ${item.q}<input id="listen-${index}" type="text" placeholder="${t("listeningPlaceholder")}">`;
    box.appendChild(label);
  });
}

function renderTeacher() {
  if (!$("#slideLinkEditor")) return;
  $("#slideLinkEditor").value = state.slides
    .filter((item) => item.url)
    .map((item) => `${item.name} = ${item.url}`)
    .join("\n");
  $("#videoTitle").value = state.video?.name || "";
  $("#videoUrl").value = state.video?.url || "";
  $("#homeworkVideoTitleEditor").value = state.homeworkVideo?.name || "";
  $("#homeworkVideoUrlEditor").value = state.homeworkVideo?.url || "";
  $("#matchEditor").value = state.matchPairs.map((item) => `${item.zh} = ${item.en}`).join("\n");
  $("#sentenceTarget").value = state.sentence.target;
  $("#sentenceTranslation").value = state.sentence.translation;
  $("#listeningEditor").value = state.listening.map((item) => `${item.q} = ${item.a}`).join("\n");
  $("#readingEditor").value = state.readingDialogue.map((item) => `${item.role} = ${item.zh} | ${item.en}`).join("\n");
  $("#scenarioEditor").value = state.scenarios.map((item) => `${item.name} = ${item.goal}`).join("\n");
}

function parseLinkedResources(text) {
  return text
    .split("\n")
    .map((line) => line.split("="))
    .filter((parts) => parts.length >= 2 && parts[0].trim() && parts.slice(1).join("=").trim())
    .map(([name, ...urlParts]) => ({
      name: name.trim(),
      url: urlParts.join("=").trim(),
      uploadedAt: "线上材料"
    }));
}

function getEmbeddableVideoUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
    if (parsed.pathname.match(/\.(mp4|webm|ogg)$/i)) return "";
    return url;
  } catch {
    return "";
  }
}

function setupAccessGate() {
  const expected = state.accessCode || "";
  if (!expected) {
    unlockSite();
    return;
  }
  const saved = localStorage.getItem("adultChineseClassAccess");
  if (saved === expected) {
    unlockSite();
    return;
  }
  document.body.classList.add("is-locked");
  $("#accessScreen").hidden = false;
}

function unlockSite() {
  document.body.classList.remove("is-locked");
  $("#accessScreen").hidden = true;
}

function renderScenarios() {
  const select = $("#scenarioSelect");
  select.innerHTML = "";
  state.scenarios.forEach((scenario, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = scenario.name;
    select.appendChild(option);
  });
  startDialogue();
}

function startDialogue() {
  const scenario = currentScenario();
  $("#dialogueGoal").textContent = scenario.goal;
  $("#chatLog").innerHTML = "";
  const aiRole = $("#aiRole").value || "AI";
  addMessage("ai", aiRole, openingLine(scenario.name));
}

function currentScenario() {
  return state.scenarios[Number($("#scenarioSelect").value)] || state.scenarios[0] || defaults.scenarios[0];
}

function openingLine(name) {
  if (name.includes("餐厅")) return t("openingRestaurant");
  if (name.includes("预约")) return t("openingAppointment");
  if (name.includes("商店")) return t("openingStore");
  return t("openingDefault");
}

function addAiReply(studentText) {
  const scenario = currentScenario();
  let reply = t("aiDefault");
  if (scenario.name.includes("餐厅")) {
    reply = studentText.includes("请") || studentText.includes("想")
      ? t("aiRestaurantGood")
      : t("aiRestaurantHint");
  } else if (scenario.name.includes("预约")) {
    reply = /\d|一|二|三|四|五|六|七|八|九|十|明天|今天/.test(studentText)
      ? t("aiAppointmentGood")
      : t("aiAppointmentHint");
  } else if (scenario.name.includes("商店")) {
    reply = studentText.includes("多少钱") || studentText.includes("价格")
      ? t("aiStoreGood")
      : t("aiStoreHint");
  }
  addMessage("ai", $("#aiRole").value || "AI", reply);
}

function addMessage(type, speaker, text) {
  const log = $("#chatLog");
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = `<small>${speaker}</small>${text}`;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

function renderAll() {
  setupTeacherTools();
  renderSlides();
  renderHomework();
  renderVideo();
  renderListening();
  renderTeacher();
  renderScenarios();
}

function setupTeacherTools() {
  if (state.showTeacherTools) {
    document.querySelectorAll(".teacher-only").forEach((item) => {
      item.hidden = false;
    });
    return;
  }
  document.querySelector('[data-view="teacher"]')?.remove();
  $("#teacher")?.remove();
}

applyLanguage();
setupAccessGate();
renderAll();
