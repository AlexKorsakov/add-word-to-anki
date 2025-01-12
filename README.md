# add-word-to-anki
##Overview
Chrome extension allows users to easily add selected English words with their translations to their Anki decks. The extension integrates with AnkiConnect, a plugin for Anki, to automate the process of adding new flashcards.

### Features

- **Right-click Context Menu**: Add any selected word to your Anki deck with just a few clicks.
- **Automatic Translation**: Automatically translates the selected word using the MyMemory translation API.
- **Persistent Settings**: Saves your preferred Anki deck and model settings locally so you don't need to select them every time.
- **Background Updates**: Periodically updates the list of available decks and models in the background to ensure they are up-to-date.
- **Manual Refresh**: Provides a manual refresh button to update the list of decks and models on demand.

## Installation

### Prerequisites

1. **Anki**: Ensure you have [Anki](https://apps.ankiweb.net/) installed on your computer.
2. **AnkiConnect Plugin**: Install the [AnkiConnect](https://ankiweb.net/shared/info/2055492159) plugin in Anki.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AlexKorsakov/add-word-to-anki
   cd add-word-to-anki
   ```

2. **Load the Extension into Chrome**

   1. Open Chrome and navigate to `chrome://extensions/`.
   2. Enable **Developer mode** by toggling the switch in the top right corner.
   3. Click on **Load unpacked** and select the directory where you cloned the repository.

3. **Configure Settings**

   - Right-click on any webpage and select "Add to Anki" from the context menu.
   - A popup will appear allowing you to select your preferred Anki deck and model.
   - Save your settings for future use.

## Usage

### Adding a Word to Anki

1. **Select a Word**: Highlight any English word on a webpage.
2. **Right-click and Select**: Right-click on the highlighted word and choose "Add to Anki" from the context menu.
3. **Translation and Addition**: The extension will automatically translate the word and add it to your selected Anki deck.

### Managing Settings

- **Popup UI**: Open the extension popup to view and manage your settings.
- **Save Settings**: Choose your preferred Anki deck and model, then click "Save Settings".
- **Refresh Decks/Models**: Click the "Refresh" button to manually update the list of available decks and models.

## Troubleshooting

### Common Issues

- **No Deck or Model Selected**
  - Make sure you have saved your preferred Anki deck and model settings via the popup UI.
  - If no settings are saved, the extension will prompt an error message.

- **AnkiConnect Not Responding**
  - Ensure that Anki and the AnkiConnect plugin are running.
  - Check that AnkiConnect is configured to listen on `http://localhost:8765`.

### Debugging

- **Chrome DevTools**: Use Chrome DevTools (`F12`) to inspect network requests and console logs for debugging purposes.
- **Logs**: Check the console logs for detailed error messages and stack traces.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---