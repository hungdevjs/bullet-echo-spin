export function createSpinnerAudio() {
  let context
  let volume
  let enabled = true

  function tone(frequency, start, duration, type, strength, endFrequency = frequency) {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
    envelope.gain.setValueAtTime(0, start)
    envelope.gain.linearRampToValueAtTime(strength, start + 0.005)
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration)
    oscillator.connect(envelope)
    envelope.connect(volume)
    oscillator.onended = () => {
      oscillator.disconnect()
      envelope.disconnect()
    }
    oscillator.start(start)
    oscillator.stop(start + duration)
  }

  return {
    async unlock() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return
        if (!context) {
          context = new AudioContext()
          volume = context.createGain()
          volume.gain.value = enabled ? 0.6 : 0
          volume.connect(context.destination)
        }
        if (context.state === 'suspended') await context.resume()
      } catch {
        return
      }
    },
    setEnabled(value) {
      enabled = value
      if (volume) volume.gain.setTargetAtTime(enabled ? 0.6 : 0, context.currentTime, 0.01)
    },
    spin(duration = 1.35) {
      if (!enabled || context?.state !== 'running') return
      const start = context.currentTime
      tone(90, start, duration, 'triangle', 0.09, 35)
      for (let time = 0; time < duration - 0.05;) {
        const progress = time / duration
        tone(1100 - progress * 550, start + time, 0.035, 'square', 0.045, 180)
        time += 0.04 + progress ** 2 * 0.19
      }
    },
    result() {
      if (!enabled || context?.state !== 'running') return
      const start = context.currentTime
      tone(160, start, 0.08, 'triangle', 0.18, 60)
      const notes = [523.25, 659.25, 783.99]
      notes.forEach((frequency, index) => {
        tone(frequency, start + index * 0.07, 0.24, 'sine', 0.14)
      })
    },
    dispose() {
      if (context && context.state !== 'closed') void context.close().catch(() => {})
    }
  }
}
