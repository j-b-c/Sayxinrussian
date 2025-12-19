// Cyrillic to Latin transliteration map
const transliterationMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
    'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
    'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

// Cyrillic to phonetic map (approximate English pronunciation)
const phoneticMap = {
    'а': 'ah', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'yeh', 'ё': 'yoh', 'ж': 'zh', 'з': 'z', 'и': 'ee',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'oh', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'oo', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'ih', 'ь': '',
    'э': 'eh', 'ю': 'yoo', 'я': 'yah',
    'А': 'AH', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Е': 'YEH', 'Ё': 'YOH', 'Ж': 'ZH', 'З': 'Z', 'И': 'EE',
    'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'О': 'OH', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'OO', 'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH',
    'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '', 'Ы': 'IH', 'Ь': '',
    'Э': 'EH', 'Ю': 'YOO', 'Я': 'YAH'
};

// DOM elements
const englishInput = document.getElementById('englishInput');
const translateBtn = document.getElementById('translateBtn');
const listenBtn = document.getElementById('listenBtn');
const cyrillicOutput = document.getElementById('cyrillicOutput');
const transliterationOutput = document.getElementById('transliterationOutput');
const phoneticOutput = document.getElementById('phoneticOutput');
const exampleButtons = document.querySelectorAll('.example-btn');
const historyList = document.getElementById('historyList');
const showMoreBtn = document.getElementById('showMoreHistory');
const expressionsList = document.getElementById('expressionsList');

// Speech synthesis variables
let currentRussianText = '';
let milenaVoice = null;

// History settings
const MAX_HISTORY = 50;
const DEFAULT_VISIBLE = 8;
let showAllHistory = false;
let translationHistory = [];

// Initialize speech synthesis
function initializeSpeech() {
    if ('speechSynthesis' in window) {
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
}

function loadVoices() {
    const voices = speechSynthesis.getVoices();
    milenaVoice = voices.find(v => v.name.toLowerCase().includes('milena'));
}

// Transliterate Cyrillic to Latin
function transliterate(text) {
    return text.split('').map(char => transliterationMap[char] || char).join('');
}

// Convert to phonetic spelling
function toPhonetic(text) {
    return text.split('').map(char => phoneticMap[char] || char).join('');
}

// Translate English to Russian using MyMemory API
async function translateText(text) {
    try {
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|ru`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 || data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

// Speak Russian text using Milena voice
function speakText(text) {
    if ('speechSynthesis' in window && text) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        if (milenaVoice) {
            utterance.voice = milenaVoice;
        }
        utterance.lang = 'ru-RU';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
            listenBtn.textContent = 'Speaking...';
            listenBtn.disabled = true;
        };

        utterance.onend = () => {
            listenBtn.textContent = 'Listen';
            listenBtn.disabled = false;
        };

        utterance.onerror = () => {
            listenBtn.textContent = 'Listen';
            listenBtn.disabled = false;
        };

        speechSynthesis.speak(utterance);
    }
}

// History management
function loadHistory() {
    try {
        const saved = localStorage.getItem('translationHistory');
        if (saved) {
            translationHistory = JSON.parse(saved);
        }
    } catch (e) {
        translationHistory = [];
    }
    renderHistory();
}

function saveHistory() {
    try {
        localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    } catch (e) {
        // Storage full or unavailable
    }
}

function addToHistory(text) {
    // Remove if already exists (to move to top)
    translationHistory = translationHistory.filter(item => item !== text);

    // Add to beginning
    translationHistory.unshift(text);

    // Limit to max
    if (translationHistory.length > MAX_HISTORY) {
        translationHistory = translationHistory.slice(0, MAX_HISTORY);
    }

    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';

    const itemsToShow = showAllHistory ? translationHistory : translationHistory.slice(0, DEFAULT_VISIBLE);

    itemsToShow.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        li.setAttribute('data-text', text);
        historyList.appendChild(li);
    });

    // Show/hide "Show more" button
    if (translationHistory.length > DEFAULT_VISIBLE) {
        showMoreBtn.style.display = 'block';
        showMoreBtn.textContent = showAllHistory ? 'Show less' : `Show more (${translationHistory.length - DEFAULT_VISIBLE})`;
    } else {
        showMoreBtn.style.display = 'none';
    }
}

// Handle translation
async function handleTranslation() {
    const text = englishInput.value.trim();

    if (!text) {
        return;
    }

    translateBtn.disabled = true;
    translateBtn.innerHTML = '<span class="loading"></span>';
    listenBtn.disabled = true;

    // Clear previous results
    cyrillicOutput.textContent = '';
    transliterationOutput.textContent = '';
    phoneticOutput.textContent = '';

    // Translate to Russian
    const russianText = await translateText(text);

    if (russianText) {
        currentRussianText = russianText;

        // Display Cyrillic
        cyrillicOutput.textContent = russianText;

        // Generate and display transliteration
        transliterationOutput.textContent = transliterate(russianText);

        // Generate and display phonetic
        phoneticOutput.textContent = toPhonetic(russianText);

        // Enable listen button
        listenBtn.disabled = false;

        // Add to history
        addToHistory(text);
    } else {
        cyrillicOutput.textContent = 'Translation error';
    }

    translateBtn.disabled = false;
    translateBtn.textContent = 'Translate';
}

// Paste text into input
function pasteToInput(text) {
    englishInput.value = text;
    englishInput.focus();
}

// Event listeners
translateBtn.addEventListener('click', handleTranslation);

englishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleTranslation();
    }
});

listenBtn.addEventListener('click', () => {
    if (currentRussianText) {
        speakText(currentRussianText);
    }
});

// Example buttons
exampleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const exampleText = button.getAttribute('data-text');
        englishInput.value = exampleText;
        handleTranslation();
    });
});

// History list click handler
historyList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const text = e.target.getAttribute('data-text');
        pasteToInput(text);
    }
});

// Show more/less button
showMoreBtn.addEventListener('click', () => {
    showAllHistory = !showAllHistory;
    renderHistory();
});

// Expressions list click handler
expressionsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const text = e.target.getAttribute('data-text');
        pasteToInput(text);
    }
});

// Initialize on page load
initializeSpeech();
loadHistory();
