// components/starCard/starCard.js
Component({
  properties: {
    name: { type: String, value: '' },
    mbti: { type: String, value: '' },
    title: { type: String, value: '' },
    country: { type: String, value: '' },
    description: { type: String, value: '' },
    traits: { type: Array, value: [] },
    quote: { type: String, value: '' },
    matchRate: { type: Number, value: 0 },
    emoji: { type: String, value: '⚽' },
    flipped: { type: Boolean, value: false }
  },

  methods: {
    toggleFlip() {
      this.setData({ flipped: !this.data.flipped })
    }
  }
})
