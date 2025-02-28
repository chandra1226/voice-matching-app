async function extractKeywords(text) {
    const response = await openai.embeddings.create({
      input: text,
      model: 'text-embedding-ada-002',
    });
  
    // Use the embedding to find similar keywords (this is a simplified example)
    return response.data[0].embedding.slice(0, 5); // Return the first 5 embeddings as keywords
  }