// This file maps exercise names to their corresponding image assets.
// This is necessary because React Native's Metro bundler requires image paths to be static.

export const exerciseImages = {
  'Incline Hammer Curls': require('../../assets/images/incline-hammer-curls.gif'),
  'Wide-grip barbell curl': require('../../assets/images/wide-grip-barbell-curl.gif'),
  'EZ-bar spider curl': require('../../assets/images/ez-bar-spider-curl.gif'),
  'Hammer Curls': require('../../assets/images/hammer-curls.gif'),
  'EZ-Bar Curl': require('../../assets/images/ez-bar-curl.gif'),
  'Zottman Curl': require('../../assets/images/zottman-curl.gif'),
  'Biceps curl to shoulder press': require('../../assets/images/biceps-curl-to-shoulder-press.gif'),
  'Barbell Curl': require('../../assets/images/barbell-curl.gif'),
  'Concentration curl': require('../../assets/images/concentration-curl.gif'),
  'Flexor Incline Dumbbell Curls': require('../../assets/images/flexor-incline-dumbbell-curls.gif'),
};

// A fallback image for exercises that don't have a specific demo yet.
// You can create more GIFs and add them to the map above.
export const placeholderImage = require('../../assets/images/placeholder.gif');