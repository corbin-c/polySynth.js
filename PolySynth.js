class Adsr {
  constructor(envelope_object) {
    for (let i in envelope_object) {
      this[i] = envelope_object[i];
    }
    this.ramp = (this.linear)
    ? "linearRampToValueAtTime"
    : "exponentialRampToValueAtTime";
  }
  async attack(gainNode,context) {
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain[this.ramp](this.attackLevel,
      context.currentTime + this.attackTime);
    gainNode.gain.setValueAtTime(this.attackLevel, context.currentTime + this.attackTime);
    gainNode.gain[this.ramp](this.decayLevel,
      context.currentTime + this.decayTime);
  }
  async release(gainNode,context) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, context.currentTime);
    gainNode.gain[this.ramp](0.0001, context.currentTime + this.releaseTime);
    gainNode.gain.setValueAtTime(0, context.currentTime + this.releaseTime);
  }
}

class polyphonicSynth {
  constructor(ctx,waveForm,output,env) {
    this.voices = [];
    this.wave = waveForm;
    this.out = output;
    this.id = 0;
    this.envelope = new Adsr(env);
    this.context = ctx;
  }
  midiToFreq(midi_note) { return Math.pow(2,(midi_note-69)/12)*440 }
  getId() {
    this.id++;
    return this.id;
  }
  noteOn(midi_note) {
    let voice = this.voices.find(e => e.envelopeGain.gain.value == 0);
    if (!voice) {
      let voice_id = this.getId();
      let envelopeGain = this.context.createGain();
      let osc = this.context.createOscillator();
      envelopeGain.connect(this.out);
      this.voices.push({osc,id:voice_id,active:true,envelopeGain:envelopeGain});
      voice = this.voices.find(e => (e.id == voice_id));
      osc.setPeriodicWave(this.wave);
      envelopeGain.connect(this.out);
      osc.connect(envelopeGain);
      osc.start();
    }
    voice.osc.frequency.setValueAtTime(
      this.midiToFreq(midi_note),
      this.context.currentTime
    );
    this.envelope.attack(voice.envelopeGain,this.context);
    return voice.id;
  }
  noteOff(voice) {
    voice = this.voices.find(e => (e.id == voice));
    this.envelope.release(voice.envelopeGain,this.context);
  }
}

export { polyphonicSynth };
