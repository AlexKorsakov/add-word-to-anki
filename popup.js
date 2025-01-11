try {
  document.addEventListener('DOMContentLoaded', async () => {
    const deckSelect = document.getElementById('deckSelect');
    const modelSelect = document.getElementById('modelSelect');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const refreshButton = document.getElementById('refreshButton');
    const addWordButton = document.getElementById('addWordButton');

    // Load saved settings and populate dropdowns with cached data
    chrome.storage.local.get(['decks', 'models', 'selectedDeck', 'selectedModel'], async function(result) {
        const decks = result.decks || await fetchAndStoreDecks();
        const models = result.models || await fetchAndStoreModels();

        // Populate the deck dropdown
        decks.forEach(deck => {
            const option = document.createElement('option');
            option.value = deck;
            option.textContent = deck;
            deckSelect.appendChild(option);
        });

        // Populate the model dropdown
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });

        // Set selected values based on saved settings
        if (result.selectedDeck && decks.includes(result.selectedDeck)) {
            deckSelect.value = result.selectedDeck;
        }
        if (result.selectedModel && models.includes(result.selectedModel)) {
            modelSelect.value = result.selectedModel;
        }
    });

    saveSettingsButton.addEventListener('click', () => {
        const selectedDeck = deckSelect.value;
        const selectedModel = modelSelect.value;

        chrome.storage.local.set({ selectedDeck, selectedModel }, function() {
            console.log('Settings saved:', { selectedDeck, selectedModel });
        });
    });


    refreshButton.addEventListener('click', async () => {
      try {
          const response = await chrome.runtime.sendMessage({ action: 'refreshCache' });
          if (response.success) {
              console.log('Cache refreshed successfully.');
              // Reload the popup to reflect the updated data
              window.location.reload();
          } else {
              console.error('Failed to refresh cache.');
          }
      } catch (error) {
          console.error('Error refreshing cache:', error);
      }
  });

    addWordButton.addEventListener('click', () => {
        const selectedDeck = deckSelect.value;
        const selectedModel = modelSelect.value;

        // For demonstration, let's assume we have a word and translation
        const word = prompt('Enter the word:');
        const translation = prompt('Enter the translation:');

        if (word && translation) {
            addToAnki(word, translation, selectedDeck, selectedModel);
        }
    });
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
} catch (err) { console.error(err) };