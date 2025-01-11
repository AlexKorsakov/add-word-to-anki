try {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'addWordToAnki',
      title: 'Add to Anki',
      contexts: ['selection'],
      documentUrlPatterns: ['<all_urls>']
    });

    initializeCache();

      setInterval(async () => {
          await fetchAndStoreDecks();
          await fetchAndStoreModels();
      }, 60 * 60 * 1000); // Every hour
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addWordToAnki') {
      const selectedWord = info.selectionText;

      chrome.storage.local.get(['selectedDeck', 'selectedModel'], async function (result) { //TODO: extract logic
        if (result.selectedDeck && result.selectedModel) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getTranslation,
            args: [selectedWord, result.selectedDeck, result.selectedModel]
          });
        } else {
            console.error("No deck or model selected.");
        }
      });
    }
  });

  // Listen for messages from the popup to manually refresh the cache
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'refreshCache') {
        initializeCache().then(() => {
            sendResponse({ success: true });
        }).catch(() => {
            sendResponse({ success: false });
        });
        return true; // Keep the message channel open for async response
    }
  });

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'addToAnki') {
        try {
            const result = await addToAnki(message.word, message.translation, message.selectedDeck, message.selectedModel);
            sendResponse({ success: true, result });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        return true; // Keep the message channel open for async response
      }
  });

  const ankiUrl = 'http://localhost:8765';
  async function addToAnki(word, translation, selectedDeck, selectedModel) {
    const payload = {
      action: 'addNote',
      version: 6,
      params: {
        note: {
          deckName: selectedDeck,
          modelName: selectedModel,
          fields: {
            Front: word,
            Back: translation
          },
          options: {
            allowDuplicate: false,
            duplicateScope: 'deck'
          },
          tags: ['english-helper']
        }
      }
    };

    const response = await fetch(ankiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Added to Anki:', result);
    return result;
  }

  // Function to initialize or refresh the cache
  async function initializeCache() {
    await fetchAndStoreDecks();
    await fetchAndStoreModels();
  }

  // Function to fetch the list of decks and store them in local storage
  async function fetchAndStoreDecks() {
    const payload = {
        action: 'deckNames',
        version: 6
    };

    const response = await fetch(ankiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    chrome.storage.local.set({ decks: result.result }, () => {
        console.log('Decks updated and stored.');
    });
  }

  // Function to fetch the list of models and store them in local storage
  async function fetchAndStoreModels() {
    const payload = {
        action: 'modelNames',
        version: 6
    };

    const response = await fetch(ankiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    chrome.storage.local.set({ models: result.result }, () => {
        console.log('Models updated and stored.');
    });
  }
  

  async function getTranslation(word, selectedDeck, selectedModel) {
    const sourceLang = 'en';
    const targetLang = 'ru';
    console.log(`Selected word: ${word}`);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data.responseData.translatedText;

    console.log(`Translated word: '${translatedText}'; Currents: '${selectedDeck}' and '${selectedModel}'`);
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: 'addToAnki',
            word: word,
            translation: translatedText,
            selectedDeck: selectedDeck,
            selectedModel: selectedModel
          }, (response) => {
              if (response.success) {
                  resolve(response.result);
              } else {
                  reject(new Error(response.error));
              }
          });
      });
      console.log('Added to Anki:', result);
    } catch (error) {
        console.error('Error adding to Anki:', error);
    }
  }
} catch (err) { console.error(err) };