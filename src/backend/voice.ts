/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

/**
 * Generates Base64 audio stream using Gemini 3.1 Flash Text-to-Speech preview
 */
export async function synthesizeSpeech(text: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('OFFLINE_VOICE_REQUIRED');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Clean output text for TTS engine (strip some Markdown symbols for better speech pronunciation)
  const cleanSpeechText = text
    .replace(/[*_`#~\[\]\(\)]/g, ' ')
    .replace(/[-+]/g, ', ')
    .substring(0, 300); // Keep it crisp for fast performance

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Diga com entonação de uma IA cibernética prestativa e amigável: ${cleanSpeechText}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Options: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('NO_AUDIO_RETURNED');
    }
    return base64Audio;
  } catch (err) {
    console.error('Gemini TTS failed, reverting to browser voice fallback:', err);
    throw err;
  }
}
