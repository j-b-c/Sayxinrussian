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
    'а': 'ah', 'б': 'beh', 'в': 'veh', 'г': 'geh', 'д': 'deh',
    'е': 'yeh', 'ё': 'yoh', 'ж': 'zheh', 'з': 'zeh', 'и': 'ee',
    'й': 'y', 'к': 'kah', 'л': 'el', 'м': 'em', 'н': 'en',
    'о': 'oh', 'п': 'peh', 'р': 'air', 'с': 'es', 'т': 'teh',
    'у': 'oo', 'ф': 'ef', 'х': 'khah', 'ц': 'tseh', 'ч': 'cheh',
    'ш': 'shah', 'щ': 'shchah', 'ъ': '', 'ы': 'ih', 'ь': '',
    'э': 'eh', 'ю': 'yoo', 'я': 'yah',
    'А': 'AH', 'Б': 'BEH', 'В': 'VEH', 'Г': 'GEH', 'Д': 'DEH',
    'Е': 'YEH', 'Ё': 'YOH', 'Ж': 'ZHEH', 'З': 'ZEH', 'И': 'EE',
    'Й': 'Y', 'К': 'KAH', 'Л': 'EL', 'М': 'EM', 'Н': 'EN',
    'О': 'OH', 'П': 'PEH', 'Р': 'AIR', 'С': 'ES', 'Т': 'TEH',
    'У': 'OO', 'Ф': 'EF', 'Х': 'KHAH', 'Ц': 'TSEH', 'Ч': 'CHEH',
    'Ш': 'SHAH', 'Щ': 'SHCHAH', 'Ъ': '', 'Ы': 'IH', 'Ь': '',
    'Э': 'EH', 'Ю': 'YOO', 'Я': 'YAH'
};

// DOM elements
const russianInput = document.getElementById('russianInput');
const translateBtn = document.getElementById('translateBtn');
const listenBtn = document.getElementById('listenBtn');
const cyrillicOutput = document.getElementById('cyrillicOutput');
const transliterationOutput = document.getElementById('transliterationOutput');
const phoneticOutput = document.getElementById('phoneticOutput');
const englishOutput = document.getElementById('englishOutput');
const exampleButtons = document.querySelectorAll('.example-btn');

// Speech synthesis variables
let currentVoice = 'male';
let russianVoices = [];

// Initialize speech synthesis
function initializeSpeech() {
    if ('speechSynthesis' in window) {
        // Load voices
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
}

function loadVoices() {
    const voices = speechSynthesis.getVoices();
    russianVoices = voices.filter(voice => voice.lang.startsWith('ru'));

    // If no Russian voices available, use any available voices
    if (russianVoices.length === 0) {
        russianVoices = voices;
    }
}

// Get selected voice based on gender preference
function getVoice() {
    if (russianVoices.length === 0) {
        return null;
    }

    const selectedGender = document.querySelector('input[name="voice"]:checked').value;

    // Try to find a voice matching the gender preference
    let voice = russianVoices.find(v => {
        const nameLower = v.name.toLowerCase();
        if (selectedGender === 'female') {
            return nameLower.includes('female') || nameLower.includes('woman') ||
                   nameLower.includes('anna') || nameLower.includes('elena') ||
                   nameLower.includes('irina') || nameLower.includes('tatiana');
        } else {
            return nameLower.includes('male') || nameLower.includes('man') ||
                   nameLower.includes('yuri') || nameLower.includes('dmitry') ||
                   nameLower.includes('maxim') || nameLower.includes('pavel');
        }
    });

    // If no gender-specific voice found, use the first available Russian voice
    if (!voice) {
        voice = russianVoices.find(v => v.lang.startsWith('ru'));
    }

    // If still no voice, use the first available voice
    return voice || russianVoices[0];
}

// Transliterate Cyrillic to Latin
function transliterate(text) {
    return text.split('').map(char => transliterationMap[char] || char).join('');
}

// Convert to phonetic spelling
function toPhonetic(text) {
    return text.split('').map(char => phoneticMap[char] || char).join('');
}

// Translate Russian to English using MyMemory API
async function translateText(text) {
    try {
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=ru|en`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 || data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation error. Please try again.';
    }
}

// Speak Russian text
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        const voice = getVoice();
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => {
            listenBtn.textContent = '🔊 Speaking...';
            listenBtn.disabled = true;
        };

        utterance.onend = () => {
            listenBtn.textContent = '🔊 Listen to Russian Text';
            listenBtn.disabled = false;
        };

        utterance.onerror = () => {
            listenBtn.textContent = '🔊 Listen to Russian Text';
            listenBtn.disabled = false;
        };

        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
}

// Handle translation
async function handleTranslation() {
    const text = russianInput.value.trim();

    if (!text) {
        alert('Please enter some Russian text to translate.');
        return;
    }

    // Disable button and show loading state
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<span class="loading"></span> Translating...';

    // Display Cyrillic (original)
    cyrillicOutput.textContent = text;

    // Generate and display transliteration
    const transliterated = transliterate(text);
    transliterationOutput.textContent = transliterated;

    // Generate and display phonetic
    const phonetic = toPhonetic(text);
    phoneticOutput.textContent = phonetic;

    // Translate to English
    const translation = await translateText(text);
    englishOutput.textContent = translation;

    // Enable listen button
    listenBtn.disabled = false;

    // Re-enable translate button
    translateBtn.disabled = false;
    translateBtn.textContent = 'Translate';
}

// Event listeners
translateBtn.addEventListener('click', handleTranslation);

russianInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleTranslation();
    }
});

listenBtn.addEventListener('click', () => {
    const text = russianInput.value.trim();
    if (text) {
        speakText(text);
    }
});

// Example buttons
exampleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const exampleText = button.getAttribute('data-text');
        russianInput.value = exampleText;
        handleTranslation();
    });
});

// Voice selection change
document.querySelectorAll('input[name="voice"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentVoice = e.target.value;
    });
});

// Initialize on page load
initializeSpeech();
