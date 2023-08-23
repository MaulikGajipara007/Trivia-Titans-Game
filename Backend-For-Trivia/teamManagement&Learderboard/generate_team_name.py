import axios from"axios";
const API_KEY = "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";
export const handler = async (event) => {
    // TODO implement
    try {
    console.log(event)
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        max_tokens: 2000,
        messages: [
          { role: 'user', content: 'Create unique team name for Quiz.' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(response.data.choices[0].message.content);
    return {
      status: true,
      team_name: response.data.choices[0].message.content
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }

};
