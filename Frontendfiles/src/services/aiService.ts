import OpenAI from 'openai';

// Configuration for AI backend
const AI_BACKEND = import.meta.env.VITE_AI_BACKEND || 'ollama'; // 'ollama' or 'openai'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'meditron:7b'; // Default medical model
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

export interface AIRecommendation {
  diagnosis: string;
  confidence: number;
  reasoning: string;
  prognosis: string;
  recommendations: string[];
  differentialDiagnosis: string[];
}

export interface PatientMedicalData {
  demographics: {
    age?: number;
    gender?: string;
    bloodType?: string;
    allergies?: string[];
  };
  currentSymptoms?: string;
  medicalHistory: {
    diagnoses: string[];
    medications: string[];
    procedures: string[];
    labResults: Record<string, string>[];
    imagingFindings: string[];
  };
  vitals?: {
    bloodPressure?: string;
    temperature?: number;
    heartRate?: number;
    weight?: number;
  };
}

export async function getMedicalRecommendations(
  patientData: PatientMedicalData,
  currentSymptoms?: string
): Promise<AIRecommendation> {
  const prompt = buildMedicalPrompt(patientData, currentSymptoms);

  try {
    if (AI_BACKEND === 'ollama') {
      return await getOllamaRecommendations(prompt);
    } else {
      return await getOpenAIRecommendations(prompt);
    }
  } catch (error) {
    console.error('AI Recommendation Error:', error);

    // Fallback to mock response for testing when AI services are unavailable
    if (import.meta.env.VITE_USE_MOCK_AI === 'true') {
      console.log('Using mock AI response for testing');
      return getMockAIResponse();
    }

    throw new Error('Failed to get AI recommendations. Please try again.');
  }
}

async function getOpenAIRecommendations(prompt: string): Promise<AIRecommendation> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Using cost-effective model suitable for medical analysis
    messages: [
      {
        role: "system",
        content: `You are an AI medical assistant helping healthcare providers with diagnostic suggestions.
        IMPORTANT: You are NOT replacing clinical judgment. Always emphasize that AI recommendations are supplementary tools.
        Provide analysis based on presented symptoms and medical history.
        Include confidence levels and clear disclaimers about the limitations of AI in medical diagnosis.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1500,
    temperature: 0.3, // Lower temperature for more consistent medical recommendations
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('No response from OpenAI service');
  }

  return parseAIResponse(response);
}

async function getOllamaRecommendations(prompt: string): Promise<AIRecommendation> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an AI medical assistant helping healthcare providers with diagnostic suggestions.
            IMPORTANT: You are NOT replacing clinical judgment. Always emphasize that AI recommendations are supplementary tools.
            Provide analysis based on presented symptoms and medical history.
            Include confidence levels and clear disclaimers about the limitations of AI in medical diagnosis.
            Respond in a structured format with clear sections for diagnosis, confidence, reasoning, prognosis, recommendations, and differential diagnosis.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        options: {
          temperature: 0.3, // Lower temperature for consistent medical recommendations
          num_predict: 1500, // Limit response length
        },
        stream: false // Get complete response, not streaming
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.message?.content) {
      throw new Error('No response content from Ollama service');
    }

    // Clean the response: trim lines and normalize headers
    const content = data.message.content
      .split('\n')
      .map((line: string) => line.trim())
      .join('\n')
      .replace(/(\*\*.*?\*\*)\n/g, '$1 ');

    console.log("Cleaned Content", content)

    return parseAIResponse(content);
  } catch (error) {
    console.error('Ollama Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to Ollama at ${OLLAMA_BASE_URL}. Please ensure Ollama is running and accessible.`);
    }
    throw new Error(`Ollama service unavailable. Please ensure Ollama is running and the model "${OLLAMA_MODEL}" is installed.`);
  }
}

function getMockAIResponse(): AIRecommendation {
  return {
    diagnosis: "Mock diagnosis for testing (AI service unavailable)",
    confidence: 75,
    reasoning: "This is a mock response generated for testing purposes when AI services are unavailable. In a real scenario, this would contain actual medical analysis based on patient data.",
    prognosis: "Mock prognosis - requires clinical evaluation",
    recommendations: [
      "Consult with supervising physician",
      "Consider additional testing",
      "Monitor patient symptoms closely"
    ],
    differentialDiagnosis: [
      "Multiple possibilities require further evaluation",
      "Additional diagnostic testing recommended"
    ]
  };
}

function buildMedicalPrompt(patientData: PatientMedicalData, currentSymptoms?: string): string {
  const { demographics, medicalHistory, vitals } = patientData;

  const prompt = `Patient Demographics:
- Age: ${demographics.age || 'Unknown'}
- Gender: ${demographics.gender || 'Unknown'}
- Blood Type: ${demographics.bloodType || 'Unknown'}
- Allergies: ${demographics.allergies?.join(', ') || 'None reported'}

Medical History:
- Previous Diagnoses: ${medicalHistory.diagnoses.join(', ') || 'None'}
- Current Medications: ${medicalHistory.medications.join(', ') || 'None'}
- Previous Procedures: ${medicalHistory.procedures.join(', ') || 'None'}

Recent Lab Results:
${medicalHistory.labResults.map((result, index) =>
  `Result ${index + 1}: ${Object.entries(result).map(([key, value]) => `${key}: ${value}`).join(', ')}`
).join('\n') || 'No recent lab results'}

Imaging Findings:
${medicalHistory.imagingFindings.join('; ') || 'No recent imaging'}

Current Vitals:
${vitals ? Object.entries(vitals).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'No current vitals recorded'}

${currentSymptoms ? `Current Symptoms/Concerns: ${currentSymptoms}` : 'No specific current symptoms reported'}

Please provide:
1. Primary diagnosis suggestion with confidence level (0-100%)
2. Clinical reasoning based on the data provided
3. Prognosis assessment
4. Recommended next steps or tests
5. Differential diagnosis considerations

Remember: This is AI-assisted analysis and should not replace clinical judgment.`;

  return prompt;
}

function parseAIResponse(response: string): AIRecommendation {
  // Clean response: remove markdown and normalize
  const cleanResponse = response.replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n').trim();

  // Define section headers (with or without colon)
  const sectionHeaders = [
    'Primary Diagnosis Suggestion',
    'Clinical Reasoning',
    'Prognosis Assessment',
    'Recommended Next Steps or Tests',
    'Differential Diagnosis Considerations'
  ];

  // Create regex patterns for headers (case insensitive, with optional colon)
  const headerPatterns = sectionHeaders.map(header => new RegExp(`^${header}(:)?$`, 'im'));

  // Split into lines for line-by-line processing
  const lines = cleanResponse.split('\n');

  // Find sections
  const sections: { header: string; content: string[] }[] = [];
  let currentSection: { header: string; content: string[] } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if line matches any header
    const matchedHeader = headerPatterns.find(pattern => pattern.test(trimmedLine));
    if (matchedHeader) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      // Start new section
      const headerName = sectionHeaders.find(h => trimmedLine.toLowerCase().startsWith(h.toLowerCase())) || trimmedLine.replace(/:$/, '');
      currentSection = { header: headerName, content: [] };
    } else if (currentSection) {
      // Add to current section content
      currentSection.content.push(line);
    }
  }

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }


  // Parse each section
  let diagnosis = 'Unable to determine primary diagnosis';
  let confidence = 50;
  let reasoning = 'AI analysis inconclusive';
  let prognosis = 'Prognosis unclear';
  let recommendations: string[] = [];
  let differentialDiagnosis: string[] = [];

  for (const section of sections) {
    const content = section.content.join('\n').trim();
    console.log(`Section ${section.header}:`, content);

    switch (section.header) {
      case 'Primary Diagnosis Suggestion': {
        const diagMatch = content.match(/diagnosis of (.+?),/i);
        if (diagMatch) {
          diagnosis = diagMatch[1].trim();
        }
        const confMatch = content.match(/confidence level of (\d+)%/i);
        if (confMatch) {
          confidence = parseInt(confMatch[1]);
        }
        if (!diagMatch) {
          diagnosis = content;
          const fallbackConf = diagnosis.match(/(\d+)%/);
          if (fallbackConf) confidence = parseInt(fallbackConf[1]);
          diagnosis = diagnosis.replace(/\s*\([^)]*\)/, '').trim();
        }
        break;
      }

      case 'Clinical Reasoning':
        reasoning = content;
        break;

      case 'Prognosis Assessment':
        prognosis = content;
        break;

      case 'Recommended Next Steps or Tests': {
        // Parse numbered or bulleted lists
        const recItems = content.split(/\d+\.\s+|-\s+|\*\s+/).filter(item => item.trim());
        recommendations = recItems.map(item => item.trim().replace(/^[*-\s]*/, ''));
        break;
      }

      case 'Differential Diagnosis Considerations': {
        // Parse numbered or bulleted lists
        const diffItems = content.split(/\d+\.\s+|-\s+|\*\s+/).filter(item => item.trim());
        differentialDiagnosis = diffItems.map(item => item.trim().replace(/^[*-\s]*/, ''));
        break;
      }
    }
  }

  return {
    diagnosis,
    confidence: Math.min(100, Math.max(0, confidence)),
    reasoning,
    prognosis,
    recommendations: recommendations.length > 0 ? recommendations : ['Consult with supervising physician', 'Consider additional testing'],
    differentialDiagnosis: differentialDiagnosis.length > 0 ? differentialDiagnosis : ['Multiple possibilities - further evaluation needed']
  };
}