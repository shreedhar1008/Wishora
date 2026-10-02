export interface GenerateWishParams {
  recipientName: string;
  senderName?: string;
  occasion?: string;
  relationship?: string;
  tone?: 'heartfelt' | 'funny' | 'poetic' | 'short' | 'romantic' | 'inspirational';
  customDetails?: string;
}

const TEMPLATE_MESSAGES: Record<string, Record<string, string[]>> = {
  birthday: {
    heartfelt: [
      "Happy Birthday, {recipient}! 🎂 May your day be filled with all the warmth, laughter, and joy that you bring into everyone else's lives. You deserve the very best this year and always.",
      "To the most wonderful {relationship}, {recipient}: Happy Birthday! ✨ Thank you for being such an extraordinary presence in my life. Wishing you endless happiness, health, and adventure in this new chapter.",
      "Happy Birthday, {recipient}! 🎉 Every year with you is a blessing. Here's to celebrating who you are today and all the incredible memories waiting ahead of you.",
    ],
    funny: [
      "Happy Birthday, {recipient}! 🎈 You're not getting older, you're just leveling up! (Though your knees might disagree). Have the best day ever!",
      "Happy Birthday to someone who is smart, funny, and attractive... from someone who is clearly all three! Enjoy your special day, {recipient}! 🍰",
      "Another year older, {recipient}, but let's be honest — you still don't look a day over fabulous! Cheers to another year of great stories and bad decisions together! 🥂",
    ],
    poetic: [
      "Like stars that brighten the midnight sky, your presence turns moments into poetry. Happy Birthday, {recipient}. May every path you tread bloom with golden light and serene joy. ✨🌙",
      "Another spin around the sun, another chapter beautifully spun. Happy Birthday, {recipient}. May the horizon bring you peace, wonder, and dreams fulfilled. 🌸",
    ],
    short: [
      "Happy Birthday, {recipient}! Wishing you an unforgettable day packed with joy and laughter! 🎂✨",
      "Cheers to another fantastic year, {recipient}! Have the happiest of birthdays! 🥳🎉",
    ],
    romantic: [
      "Happy Birthday to my favorite human in the whole universe. Every day with you is my greatest gift, {recipient}. Here's to celebrating you today and loving you forever. 💕🎂",
      "To the one who holds my heart: Happy Birthday, {recipient}. May this year be as radiant, gentle, and wonderful as you are to me. 💖",
    ],
    inspirational: [
      "Happy Birthday, {recipient}! 🌟 Keep shining your light, chasing your dreams, and inspiring everyone around you. The world is better because you're in it. Go conquer this year!",
      "May this year unlock doors you never knew existed and fulfill dreams you've kept close to your heart. Happy Birthday, {recipient}! 🚀✨",
    ],
  },
  anniversary: {
    heartfelt: [
      "Happy Anniversary, {recipient}! 💕 Every single day by your side is a reminder of how lucky I am. Thank you for the endless love, laughter, and support.",
      "Happy Anniversary! Looking back at all our adventures together, I wouldn't change a single moment. Here's to our story and the many chapters still to be written. 🥂",
    ],
    funny: [
      "Happy Anniversary, {recipient}! I love you more than pizza, and that is saying a lot. Thanks for putting up with me for another year! 🍕💑",
      "Happy Anniversary! Let's continue being each other's favorite reason to stay up late and smile at our phones. 😄❤️",
    ],
    poetic: [
      "Two souls entwined like melodies in the breeze. With every heartbeat, my love for you deepens into timeless grace. Happy Anniversary, {recipient}. 🌹✨",
    ],
    short: [
      "Happy Anniversary, {recipient}! Cheers to us and the beautiful journey we share! 🥂💕",
    ],
    romantic: [
      "Happy Anniversary to the love of my life. From our first hello to this very moment, loving you has been the easiest, sweetest thing I have ever done. Forever yours, {recipient}. 💍❤️",
    ],
    inspirational: [
      "Happy Anniversary! True love isn't just about gazing at each other, but moving forward together in the same direction. Wishing you both many more years of shared triumphs and joy. 🌟",
    ],
  },
  wedding: {
    heartfelt: [
      "Congratulations, {recipient}! 💒 Wishing you both a lifetime of shared laughter, deep trust, and boundless love as you start this wonderful journey together.",
    ],
    romantic: [
      "May your marriage be a sanctuary of peace, kindness, and eternal romance. Congratulations on finding your forever, {recipient}! 💍✨",
    ],
  },
  love: {
    romantic: [
      "Dear {recipient}, you bring sunshine to my darkest days and warmth to every moment. I just wanted to remind you how deeply and truly you are loved. 💕",
    ],
    heartfelt: [
      "No occasion needed to tell you how grateful I am for you, {recipient}. You are my anchor and my joy. ❤️",
    ],
  },
  congratulations: {
    heartfelt: [
      "Congratulations, {recipient}! 🏆 Seeing your hard work pay off brings so much pride and joy. This is only the beginning of amazing things for you!",
    ],
    funny: [
      "Look at you doing big things! 🎉 Huge congratulations, {recipient} — you proved that hard work (and maybe a lot of coffee) really does pay off!",
    ],
    inspirational: [
      "You dared to dream, you put in the hours, and now you stand triumphant. Keep rising, {recipient}! The sky is only the starting point. 🚀✨",
    ],
  },
  'thank-you': {
    heartfelt: [
      "Thank you so much, {recipient}! 🙏 Your kindness, guidance, and generous spirit mean more to me than words can say. Truly appreciate everything you do.",
    ],
  },
  friendship: {
    heartfelt: [
      "To my dearest friend, {recipient}: 🤝 Thank you for always having my back, through every high and low. True friends like you are rare treasures.",
    ],
  },
  festival: {
    heartfelt: [
      "Wishing you and your loved ones a sparkling, joyous festive season, {recipient}! 🎊 May peace, prosperity, and radiant happiness fill your home.",
    ],
  },
};

export class AiService {
  static generateWish(params: GenerateWishParams) {
    const recipient = params.recipientName?.trim() || 'Friend';
    const occasion = params.occasion?.toLowerCase() || 'birthday';
    const tone = params.tone || 'heartfelt';
    const relationship = params.relationship || 'special person';
    const customDetails = params.customDetails?.trim() || '';

    const occasionGroup = TEMPLATE_MESSAGES[occasion] || TEMPLATE_MESSAGES.birthday;
    const toneMessages = occasionGroup[tone] || occasionGroup.heartfelt || Object.values(occasionGroup)[0];

    const suggestions = toneMessages.map((msg) => {
      let formatted = msg
        .replace(/{recipient}/g, recipient)
        .replace(/{relationship}/g, relationship);

      if (customDetails) {
        formatted += ` Remember: ${customDetails}!`;
      }
      return formatted;
    });

    return {
      success: true,
      suggestions,
      primaryMessage: suggestions[0],
    };
  }
}
