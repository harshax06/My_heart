// Central config — edit all text content here
type Note = { front: string; back: string; image?: string }
type Gift = { label: string; message: string; from: string; image?: string }

export const config = {
  names: {
    her: 'Siva',
    nickname: 'Bangaram',
    him: 'Harshaa',
  },

  hero: {
    line1: 'Hey Bangaram... ❤️',
    line2: 'Today is yours — so I built you a whole little world.',
    line3: 'Walk through it with me... it ends somewhere I hope you love.',
    cta: 'Start Our Story ↓',
  },

  birthday: {
    heading: 'Happy Birthday,',
    name: 'Bangaram ❤️',
    age: 20,
    subtext: [
      'Another year of you.',
      'Another year I\'m lucky to know you.',
      'And another chapter of us.',
    ],
  },

  loveMessage: {
    lines: [
      "You're not just someone I love.",
      "You're someone I choose.",
      'Again.',
      'And again.',
      'And again.',
    ],
    footer: 'Happy 20th Birthday, Bangaram ❤️',
  },

  quotes: [
    {
      text: "You are not just a part of my world \u2014 you are my world.\nI have you, and I want you to know that I'm not going anywhere.",
      author: '\u2764\ufe0f',
    },
    {
      text: "No matter how badly life tests us, no matter how hard things get,\nI don't want to lose you.\nWhen things turn wrong, I don't want to walk away \u2014\nI want us to stay, talk, understand, and fix it together.",
      author: '\u2764\ufe0f',
    },
    {
      text: "Trust me, I'll choose you even on the days when everything feels broken.\nBecause even a broken heart knows how to beat for you.",
      author: '\u2764\ufe0f',
    },
    {
      text: "There is no more 'me' without 'you' \u2014\nbecause somewhere along the way, you became a part of everything I am.",
      author: '\u2764\ufe0f',
    },
  ],

  particleSection: {
    quote: 'My Full Heart ❤️\nEvery inch of it belongs to you',
    attribution: '❤️',
  },

  loveCards: [
    "You're my favorite notification.",
    "You're the person I want to tell everything to.",
    "You're the smile I don't want to lose.",
    "You're the person I want beside me when life gets difficult.",
    "You're my Bangaram. ❤️",
  ],

  memoryWall: ([
    {
      front: 'Your smile ❤️',
      back: 'The way it lights up the room without even trying.',
      image: 'garden',
    },
    {
      front: 'The way you make ordinary moments special.',
      back: 'Even the smallest things feel meaningful with you.',
    },
    {
      front: 'The way you care.',
      back: 'Your heart is the warmest place I know.',
    },
    {
      front: 'Your little expressions.',
      back: 'Every raised eyebrow, every laugh — I notice them all.',
      image: 'choker',
    },
    {
      front: 'Just... you.',
      back: 'You, simply being you, is more than enough for me.',
      image: 'waves',
    },
    {
      front: 'Your voice.',
      back: "It's the sound that makes everything feel okay.",
    },
    {
      front: 'Us.',
      back: 'My favorite kind of night is any night with you in it.',
      image: 'couple',
    },
  ] as Note[]),

  gifts: ([
    {
      label: 'Open Me 🎁',
      message:
        'You have no idea how often I think about you and just smile to myself. This one is a reminder — you are loved far more than you let yourself believe.',
      from: '',
      image: 'memory2',
    },
    {
      label: 'One More Surprise 🎁',
      message:
        'Every place I still want to take you. Every quiet evening we have not had yet. I am saving all of them for us.',
      from: '',
      image: 'memory6',
    },
    {
      label: 'Last One... ❤️',
      message: 'This one I could not wrap. Keep going — it is waiting a little further down.',
      from: '↓',
    },
  ] as Gift[]),

  finalProposal: {
    instruction: 'Untie the ribbon... ❤️',
    lines: [
      'Happy 20th Birthday, Bangaram ❤️',
      "I don't know what every tomorrow will look like...",
      "I don't know how many storms we'll have to face...",
      'But I know one thing.',
      'I want to keep choosing you.',
    ],
    question: 'Will you choose me too? ❤️',
    buttons: ['YES ❤️', 'Always ❤️'],
    celebration: "Then let's write the rest of our story together. ❤️",
    from: '— Harshaa',
  },
}
