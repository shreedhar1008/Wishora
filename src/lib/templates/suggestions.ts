export interface MessageSuggestion {
  id: string;
  occasion: string;
  tone: 'warm' | 'funny' | 'emotional' | 'formal';
  text: string;
}

export const SUGGESTIONS: MessageSuggestion[] = [
  // Birthday - Warm
  { id: 's1', occasion: 'birthday', tone: 'warm', text: 'Wishing you a beautiful day with good health and happiness forever. Happy birthday!' },
  { id: 's2', occasion: 'birthday', tone: 'warm', text: 'Hope your special day brings you all that your heart desires! Happy Birthday!' },
  // Birthday - Funny
  { id: 's3', occasion: 'birthday', tone: 'funny', text: 'Happy Birthday! You do not look a day older than the age you claim to be.' },
  { id: 's4', occasion: 'birthday', tone: 'funny', text: 'Congratulations on surviving another year of my nonsense. Happy birthday!' },
  // Birthday - Emotional
  { id: 's5', occasion: 'birthday', tone: 'emotional', text: 'I am so grateful to have you in my life. You bring so much light into the world. Happy Birthday.' },
  // Birthday - Formal
  { id: 's6', occasion: 'birthday', tone: 'formal', text: 'Wishing you a very Happy Birthday and a prosperous year ahead.' },

  // Anniversary - Warm
  { id: 's7', occasion: 'anniversary', tone: 'warm', text: 'Happy Anniversary! Here is to another year of love, laughter, and putting up with each other.' },
  { id: 's8', occasion: 'anniversary', tone: 'warm', text: 'Wishing a perfect pair a perfectly happy anniversary.' },
  // Anniversary - Emotional
  { id: 's9', occasion: 'anniversary', tone: 'emotional', text: 'Every day I discover a new reason to love you. Happy Anniversary to my whole world.' },
  { id: 's10', occasion: 'anniversary', tone: 'emotional', text: 'Thank you for being my anchor in the storms of life. I love you more than words can say.' },
  // Anniversary - Funny
  { id: 's11', occasion: 'anniversary', tone: 'funny', text: 'I love you more than carbs, and that is saying a lot. Happy Anniversary!' },

  // Celebration - Warm
  { id: 's12', occasion: 'celebration', tone: 'warm', text: 'So proud of you and all that you have accomplished. Congratulations!' },
  { id: 's13', occasion: 'celebration', tone: 'warm', text: 'This calls for a celebration! So happy for your fantastic news.' },
  // Celebration - Formal
  { id: 's14', occasion: 'celebration', tone: 'formal', text: 'Please accept my warmest congratulations on your remarkable achievement.' },
  // Celebration - Funny
  { id: 's15', occasion: 'celebration', tone: 'funny', text: 'You did it! Now, when are we going out to celebrate (and you are buying)?' },

  // Festivals - Warm
  { id: 's16', occasion: 'festival', tone: 'warm', text: 'May the magic of this festival fill your life with joy, peace, and prosperity.' },
  { id: 's17', occasion: 'festival', tone: 'warm', text: 'Wishing you and your family a beautiful season filled with wonderful memories.' },
  // Festivals - Formal
  { id: 's18', occasion: 'festival', tone: 'formal', text: 'Sending you my best wishes for a joyous festive season and a prosperous year ahead.' },

  // Family - Warm
  { id: 's19', occasion: 'family', tone: 'warm', text: 'Thank you for the countless ways you show you care. I am so lucky to be family.' },
  { id: 's20', occasion: 'family', tone: 'warm', text: 'Home is wherever I am with you all. Sending so much love today!' },
  // Family - Emotional
  { id: 's21', occasion: 'family', tone: 'emotional', text: 'I would not be who I am today without your unconditional love and support. Thank you for everything.' },
  // Family - Funny
  { id: 's22', occasion: 'family', tone: 'funny', text: 'We may be a crazy family, but we are my favorite crazy family. Love you guys!' },

  // Thank You - Warm
  { id: 's23', occasion: 'thank-you', tone: 'warm', text: 'Just a little note to say a big thank you for all that you do.' },
  { id: 's24', occasion: 'thank-you', tone: 'warm', text: 'Your kindness really made my day. Thank you so much!' },
  // Thank You - Formal
  { id: 's25', occasion: 'thank-you', tone: 'formal', text: 'I am writing to express my sincere appreciation for your invaluable assistance.' },

  // New Baby - Warm
  { id: 's26', occasion: 'celebration', tone: 'warm', text: 'Welcome to the world! So thrilled for your growing family.' },
  { id: 's27', occasion: 'celebration', tone: 'emotional', text: 'A new little miracle to love. Enjoy every precious, fleeting moment.' },

  // Wedding - Warm
  { id: 's28', occasion: 'wedding', tone: 'warm', text: 'Here is to a long and happy marriage. So glad to celebrate this day with you both.' },
  { id: 's29', occasion: 'wedding', tone: 'formal', text: 'Wishing you joy, love and happiness on your wedding day and as you begin your new life together.' },

  // Romance - Funny
  { id: 's30', occasion: 'romance', tone: 'funny', text: 'I love you even when I am hungry. That is true romance.' }
];
