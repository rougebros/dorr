import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

let isProcessing = false; // Track whether a request is in progress

// Synchronous function to process user input with OpenAI
function processUserInputSync(inputText) {
  console.log("Attempting to process user input...");

  // Prevent multiple requests if one is already in progress
  if (isProcessing) {
    console.warn("OpenAI request already in progress, skipping additional call.");
    return null;
  }

  console.log("Processing user input...");
  isProcessing = true; // Set flag before making the request

  let result = null;
  try {
    const response = openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Translate response based on user locale: en.' },
        { role: 'user', content: inputText },
      ],
      temperature: 0.7,
    });

    result = response.choices[0].message.content;
    console.log("Response from OpenAI:", result);

  } catch (error) {
    console.error("Error with OpenAI API call:", error);
    result = null;

  } finally {
    isProcessing = false; // Reset the flag after request completes
  }

  return result;
}

// Function to fetch and update JSON template synchronously
export function fetchAndUpdateTemplateSync(inputText) {
  console.log("Fetching JSON template...");
  const BASE_URL = 'https://raw.githubusercontent.com/rougebros/dorr/refs/heads/main/public/files/json/dorr_template.json';

  let template = null;
  let updatedTemplate = null;

  try {
    // Fetch template synchronously
    const xhr = new XMLHttpRequest();
    xhr.open("GET", BASE_URL, false);
    xhr.send(null);

    if (xhr.status === 200) {
      template = JSON.parse(xhr.responseText);
      console.log("Fetched template:", template);
    } else {
      console.error("Error fetching template:", xhr.status);
      return null;
    }

    const processedData = processUserInputSync(inputText);
    if (!processedData) {
      console.warn("Processed data is null, skipping template update.");
      return null;
    }

    // Merge template with processed data
    updatedTemplate = { ...template, ...JSON.parse(processedData) };
    console.log("Updated Template:", updatedTemplate);

  } catch (error) {
    console.error("Error fetching or updating template:", error);
    updatedTemplate = null;

  } finally {
    isProcessing = false; // Ensure flag is reset in case of any errors
  }

  return updatedTemplate;
}
