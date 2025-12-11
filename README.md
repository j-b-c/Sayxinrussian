# Russian to English Translator

A web application for translating Russian text to English with comprehensive linguistic support including transliteration, phonetic spelling, and text-to-speech capabilities.

## Features

- **Russian to English Translation**: Real-time translation using the MyMemory Translation API
- **Cyrillic Display**: Shows the original Russian text in Cyrillic script
- **Transliteration**: Converts Cyrillic text to Latin alphabet (Western text)
- **Phonetic Spelling**: Provides pronunciation guide in English phonetics
- **Text-to-Speech**: Listen to Russian text with selectable male or female voices
- **Example Phrases**: Quick-start examples to try the translator
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Use

### Basic Usage

1. Open `index.html` in a modern web browser
2. Enter Russian text in the input field (or click an example button)
3. Click the "Translate" button (or press Ctrl+Enter)
4. View the results:
   - **Cyrillic**: Original Russian text
   - **Transliteration**: Latin alphabet representation
   - **Phonetic Spelling**: English pronunciation guide
   - **English Translation**: Translated text

### Text-to-Speech

1. After translating, select your preferred voice (Male or Female)
2. Click the "Listen to Russian Text" button
3. The browser will speak the Russian text using the selected voice

## Technical Details

### Technologies Used

- **HTML5**: Structure and layout
- **CSS3**: Modern, responsive styling with gradients and animations
- **JavaScript (ES6+)**: Core functionality
- **Web Speech API**: Text-to-speech functionality
- **MyMemory Translation API**: Free translation service

### Browser Compatibility

The application requires a modern web browser with support for:
- ES6 JavaScript
- Web Speech API (for text-to-speech)
- Fetch API (for translation)

Recommended browsers:
- Google Chrome (latest)
- Microsoft Edge (latest)
- Firefox (latest)
- Safari (latest)

### API Information

The app uses the **MyMemory Translation API** which:
- Is free to use
- Has a daily limit of 1000 words per IP address
- Requires no API key for basic usage
- May show "Translated by MyMemory" attribution

For production use with higher limits, consider:
- Getting a free API key from MyMemory
- Using Google Translate API (requires API key)
- Using LibreTranslate (self-hosted or cloud)

## File Structure

```
Sayxinrussian/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Features Explained

### Transliteration System

The app uses the scientific transliteration system for Russian Cyrillic:
- а→a, б→b, в→v, г→g, д→d
- е→e, ё→yo, ж→zh, з→z, и→i
- й→y, к→k, л→l, м→m, н→n
- о→o, п→p, р→r, с→s, т→t
- у→u, ф→f, х→kh, ц→ts, ч→ch
- ш→sh, щ→shch, ы→y, э→e
- ю→yu, я→ya

### Phonetic System

The phonetic spelling provides an approximate English pronunciation:
- а→ah, е→yeh, и→ee, о→oh, у→oo
- ж→zheh, ш→shah, щ→shchah
- And more...

### Voice Selection

The app attempts to use Russian voices from your browser's speech synthesis:
- **Male**: Looks for male Russian voices (Yuri, Dmitry, Maxim, Pavel)
- **Female**: Looks for female Russian voices (Anna, Elena, Irina, Tatiana)
- Falls back to any available Russian voice if gender-specific voices aren't found

## Examples

Try these Russian phrases:
- **Привет** (Privet) - Hello
- **Спасибо** (Spasibo) - Thank you
- **Как дела?** (Kak dela?) - How are you?
- **Добрый день** (Dobryy den') - Good day
- **До свидания** (Do svidaniya) - Goodbye
- **Я люблю тебя** (Ya lyublyu tebya) - I love you

## Customization

### Changing the Translation API

To use a different translation service, modify the `translateText()` function in `script.js`:

```javascript
async function translateText(text) {
    // Replace with your preferred API
    const url = `YOUR_API_ENDPOINT`;
    // ... rest of the code
}
```

### Styling

Customize the appearance by editing `styles.css`. The app uses:
- CSS Grid for layout
- CSS Gradients for visual appeal
- CSS Variables can be added for easier theming

## Limitations

- Translation quality depends on the MyMemory API
- Text-to-speech quality varies by browser and available voices
- Some browsers may not have Russian voices installed
- Daily translation limit of 1000 words per IP (MyMemory API)

## Future Enhancements

Potential features to add:
- Offline translation support
- Save translation history
- Export translations to file
- Additional language pairs
- Voice recording and comparison
- Grammar explanations
- Word-by-word breakdown

## License

This project is open source and available for educational and personal use.

## Support

If you encounter issues:
1. Ensure you're using a modern browser
2. Check your internet connection (required for translation API)
3. Try refreshing the page
4. Check browser console for errors

## Credits

- Translation powered by MyMemory Translation API
- Text-to-speech powered by Web Speech API
- Interface designed with modern CSS3
