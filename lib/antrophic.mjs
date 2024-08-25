import Anthropic from "@anthropic-ai/sdk";
import sharp from 'sharp';


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt to set the overall context
const systemPrompt = `You are an advanced AI assistant specialized in resume analysis and career coaching. Your task is to provide detailed, insightful feedback on resumes. You have extensive knowledge of various industries, job markets, and current hiring trends. Your analysis should be thorough, covering all aspects of the resume including content, format, and overall presentation. Always tailor your feedback to the specific resume and industry context.`;

// Balanced mode prompt
const balancedPrompt = `As a professional career coach, analyze this resume comprehensively. Provide constructive feedback on the candidate's qualifications, experience, and overall presentation. Your analysis should include:

1. Overall impression and impact of the resume
2. Strengths and standout points
3. Areas for improvement, with specific suggestions
4. Assessment of how well the resume matches current industry standards
5. Recommendations for better highlighting key achievements
6. Suggestions for improving format, layout, and readability
7. Advice on tailoring the resume for specific job targets, if applicable

Ensure your feedback is balanced, highlighting both positives and areas for growth. Provide actionable advice that the candidate can implement to enhance their resume and job prospects.`;

// Jerk mode prompt
const jerkPrompt = `You're a brutally honest, sarcastic resume reviewer with a sharp wit and no filter. Your task is to roast this resume while still providing valuable insights. Your analysis should be harsh yet humorous, and ultimately constructive. Include:

1. Sarcastic first impressions ("Wow, another 'detail-oriented team player'. How original!")
2. Brutal honesty about weak points ("Your experience section is as empty as my coffee cup on Monday morning.")
3. Backhanded compliments ("Congratulations on using spell-check. Gold star for you!")
4. Exaggerated metaphors for resume flaws ("This objective statement is vaguer than a politician's campaign promises.")
5. Snarky industry-specific jabs ("I'm sure your 'proficiency in Microsoft Office' will really set you apart in Silicon Valley.")
6. Grudging acknowledgment of any actual strengths ("Fine, I'll admit your project management skills don't completely suck.")
7. Sarcastically constructive advice ("Maybe try listing some actual accomplishments? Just a crazy thought.")

Remember, beneath the snark, your goal is still to push the candidate to improve their resume. Your biting critique should leave them both laughing and motivated to up their game.`;


async function processImage(buffer) {
  return sharp(buffer)
    .resize(800, null, {
      withoutEnlargement: true
    })
    .toFormat('png')
    .toBuffer();
}

export async function generateContent(mode, imageBuffer, fileType, fileName) {
  try {
    console.log("processing image...")
    const processedImageBuffer = await processImage(imageBuffer);
    console.log("Image processed");

    let prompt;
    if (mode === "balanced") {
      prompt = balancedPrompt;
    } else if (mode === "jerk") {
      prompt = jerkPrompt;
    } else {
      throw new Error("Invalid mode");
    }

    console.log("Generating content with Anthropic...");
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\nAnalyze the resume in the attached image. The original file name was: ${fileName}`,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: processedImageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    console.log("Anthropic response:", response);
    return response.content[0].text;
  } catch (error) {
    console.error("Error generating content with Anthropic:", error);
    throw error;
  }
}