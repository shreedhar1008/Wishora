export interface OccasionInfo {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  exampleMessages: string[];
  seoTitle: string;
  seoDescription: string;
}

export const OCCASIONS: OccasionInfo[] = [
  {
    slug: 'birthday',
    title: 'Birthday',
    description: 'Celebrate another trip around the sun with joyful and fun wishes.',
    emoji: '🎂',
    color: '#FF4B4B',
    exampleMessages: [
      'Wishing you a day filled with happiness and a year filled with joy.',
      'Happy Birthday! May your day be more beautiful than a unicorn farting rainbows.',
      'Another year older, wiser, and more wonderful. Have an incredible birthday!'
    ],
    seoTitle: 'Create Interactive Birthday Wishes Online',
    seoDescription: 'Design personalized and interactive birthday greetings for your loved ones.'
  },
  {
    slug: 'anniversary',
    title: 'Anniversary',
    description: 'Honor milestones of love and partnership with romantic messages.',
    emoji: '💍',
    color: '#E91E63',
    exampleMessages: [
      'Happy Anniversary! Every day with you is a gift I cherish.',
      'To another year of sharing sunsets, dreams, and endless love.',
      'You are my today and all of my tomorrows. Happy Anniversary!'
    ],
    seoTitle: 'Romantic Anniversary Wishes & Digital Cards',
    seoDescription: 'Send unique, interactive anniversary wishes to your partner.'
  },
  {
    slug: 'celebration',
    title: 'Celebration',
    description: 'For all the big achievements, graduations, and success stories.',
    emoji: '🎉',
    color: '#4CAF50',
    exampleMessages: [
      'Congratulations on your incredible achievement! The sky is the limit.',
      'You worked hard for this, and you deserve every bit of success.',
      'Cheers to your fantastic success and the amazing journey ahead!'
    ],
    seoTitle: 'Digital Congratulations & Celebration Wishes',
    seoDescription: 'Celebrate life\'s big moments with an interactive congratulatory wish.'
  },
  {
    slug: 'wedding',
    title: 'Wedding',
    description: 'Elegant greetings for the happy couple tying the knot.',
    emoji: '💒',
    color: '#607D8B',
    exampleMessages: [
      'May your joining together bring you more joy than you can imagine.',
      'Wishing you a lifetime of love, laughter, and a happy ever after.',
      'Congratulations on finding your forever person. Best wishes on this wonderful journey.'
    ],
    seoTitle: 'Elegant Digital Wedding Wishes',
    seoDescription: 'Create beautiful, heartfelt digital greetings for newlyweds.'
  },
  {
    slug: 'family',
    title: 'Family',
    description: 'Show appreciation for parents, siblings, and relatives.',
    emoji: '👨‍👩‍👧‍👦',
    color: '#AB47BC',
    exampleMessages: [
      'Thank you for always being my safe haven and my biggest supporter.',
      'Family is not an important thing. It is everything. Love you all!',
      'Grateful every day for the love and laughter we share as a family.'
    ],
    seoTitle: 'Heartfelt Family Wishes and Digital Greetings',
    seoDescription: 'Send touching interactive messages to your parents and family members.'
  },
  {
    slug: 'festival',
    title: 'Festivals',
    description: 'Send bright and festive wishes for holidays around the world.',
    emoji: '🎆',
    color: '#FF9800',
    exampleMessages: [
      'May this festival bring immense joy and prosperity to your life.',
      'Wishing you a season of gladness, a season of cheer, and to top it all off - a wonderful year!',
      'Let the spirit of the festival fill your heart with peace and happiness.'
    ],
    seoTitle: 'Interactive Festive Greetings & Holiday Wishes',
    seoDescription: 'Celebrate holidays and festivals with stunning interactive digital cards.'
  },
  {
    slug: 'diwali',
    title: 'Diwali',
    description: 'Celebrate the festival of lights with brilliant digital greetings.',
    emoji: '🪔',
    color: '#FF5722',
    exampleMessages: [
      'May the supreme light illumine your mind, enlighten your heart, and strengthen the human bonds in your homes and communities.',
      'Wishing you a sparkling Diwali filled with joy and prosperity!',
      'Let the light of diyas guide you towards success and happiness.'
    ],
    seoTitle: 'Interactive Digital Diwali Wishes',
    seoDescription: 'Send glowing, animated Diwali wishes to friends and family.'
  },
  {
    slug: 'christmas',
    title: 'Christmas',
    description: 'Spread the holiday cheer with snowy, festive templates.',
    emoji: '🎄',
    color: '#C62828',
    exampleMessages: [
      'Merry Christmas! May your days be merry and bright.',
      'Sending you warm bear hugs, loving kisses, and earnest wishes for the wonderful occasion of Christmas.',
      'May the magic of Christmas fill every corner of your heart and home.'
    ],
    seoTitle: 'Animated Christmas Digital Greetings',
    seoDescription: 'Create beautiful, interactive Christmas cards and wishes.'
  },
  {
    slug: 'new-year',
    title: 'New Year',
    description: 'Ring in the new year with spectacular countdowns and wishes.',
    emoji: '🍾',
    color: '#1A237E',
    exampleMessages: [
      'Out with the old, in with the new: may you be happy the whole year through.',
      'Happy New Year! Here is to 365 new chances and endless possibilities.',
      'Wishing you a brilliant New Year filled with massive success and boundless joy.'
    ],
    seoTitle: 'Interactive New Year Wishes',
    seoDescription: 'Send exciting digital New Year greetings with confetti and fireworks.'
  },
  {
    slug: 'romance',
    title: 'Romance',
    description: 'Just because messages, proposals, and declarations of love.',
    emoji: '❤️',
    color: '#D32F2F',
    exampleMessages: [
      'Just a quick note to say I am thinking of you and I love you.',
      'You are the peanut butter to my jelly, the spark to my flame.',
      'Every time I see you, I fall in love all over again.'
    ],
    seoTitle: 'Romantic Digital Messages & Love Notes',
    seoDescription: 'Surprise your loved one with an interactive romantic message.'
  },
  {
    slug: 'fun',
    title: 'Fun & Games',
    description: 'Interactive quizzes, polls, and playful messages.',
    emoji: '🎮',
    color: '#00BCD4',
    exampleMessages: [
      'I was going to get you a real gift, but I thought this interactive card was way cooler.',
      'You passed the vibe check! Hope your day is as awesome as you are.',
      'Here is a fun little surprise to brighten up your Tuesday.'
    ],
    seoTitle: 'Fun & Interactive Digital Greetings',
    seoDescription: 'Send games, quizzes, and playful digital wishes to your friends.'
  },
  {
    slug: 'thank-you',
    title: 'Thank You',
    description: 'Express your gratitude with style and sincerity.',
    emoji: '🙏',
    color: '#8D6E63',
    exampleMessages: [
      'I cannot thank you enough for your kindness and support.',
      'Your generosity means the world to me. Thank you from the bottom of my heart.',
      'Just wanted to send a little appreciation your way. You are a lifesaver!'
    ],
    seoTitle: 'Interactive Digital Thank You Cards',
    seoDescription: 'Show your gratitude with beautiful, custom digital thank you messages.'
  },
  {
    slug: 'love',
    title: 'Love',
    description: 'Heartfelt declarations of love, romantic letters, and sweet surprises.',
    emoji: '💕',
    color: '#E91E63',
    exampleMessages: [
      'Every moment with you feels like magic. I love you more each day.',
      'You are my favorite person, my heart, and my home.',
      'Just a little reminder that you are deeply loved today and always.'
    ],
    seoTitle: 'Create Romantic Love Wishes & Digital Love Letters',
    seoDescription: 'Send personalized, interactive love letters and romantic surprises online.'
  },
  {
    slug: 'congratulations',
    title: 'Congratulations',
    description: 'Celebrate achievements, promotions, graduations, and success milestones.',
    emoji: '🎉',
    color: '#4CAF50',
    exampleMessages: [
      'Huge congratulations on your big achievement! You earned every bit of this.',
      'So proud of you and all your hard work! The future is yours.',
      'Cheers to your fantastic success and what lies ahead!'
    ],
    seoTitle: 'Interactive Congratulations Wishes & Digital Cards',
    seoDescription: 'Celebrate milestones with vibrant animated congratulations greetings.'
  },
  {
    slug: 'friendship',
    title: 'Friendship',
    description: 'Celebrate the besties, pals, and ride-or-die friends who light up life.',
    emoji: '🤝',
    color: '#FF7043',
    exampleMessages: [
      'To my favorite human — thank you for being the truest friend.',
      'Grateful for all the laughs, adventures, and late night talks.',
      'Cheers to a friendship that only gets stronger with time!'
    ],
    seoTitle: 'Heartfelt Friendship Wishes & Digital Cards',
    seoDescription: 'Send interactive greetings celebrating true friendship.'
  },
  {
    slug: 'mothers-day',
    title: "Mother's Day",
    description: 'Special tributes honoring mom and maternal figures.',
    emoji: '👩',
    color: '#AB47BC',
    exampleMessages: [
      'Happy Mother\'s Day to the most loving, selfless woman in the world.',
      'Thank you for your warmth, guidance, and endless love.',
      'To the world you are a mother, but to our family you are the world.'
    ],
    seoTitle: "Interactive Mother's Day Wishes & Cards",
    seoDescription: "Celebrate mom with a personalized, animated Mother's Day surprise."
  },
  {
    slug: 'fathers-day',
    title: "Father's Day",
    description: 'Warm appreciation and celebrations for dad and father figures.',
    emoji: '👨',
    color: '#1565C0',
    exampleMessages: [
      'Happy Father\'s Day to my hero, mentor, and biggest supporter.',
      'Thank you for always having my back and teaching me what matters most.',
      'Wishing the best dad the greatest day ever!'
    ],
    seoTitle: "Interactive Father's Day Wishes & Cards",
    seoDescription: "Send dad a personalized, interactive Father's Day greeting."
  },
  {
    slug: 'get-well-soon',
    title: 'Get Well Soon',
    description: 'Send healing vibes, warm hugs, and comforting thoughts.',
    emoji: '🌻',
    color: '#43A047',
    exampleMessages: [
      'Sending you healing sunshine and big hugs. Rest up and feel better soon!',
      'Thinking of you and wishing you a speedy and smooth recovery.',
      'Can not wait to see your bright smile again soon. Take good care!'
    ],
    seoTitle: 'Get Well Soon Wishes & Comfort Greetings Online',
    seoDescription: 'Brighten someone\'s recovery with warm, uplifting digital wishes.'
  }
];
