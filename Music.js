class Solfeggio {
  constructor(height=5) {
    this.setHeight(height);
    this.MAJOR = [2,2,1,2,2,2,1];
    this.SOLMISATION = this.defaultScale();
    this.MINOR = this.modeShift(this.MAJOR,5);
    this.MODES_NAMES = [
      "IONIAN",
      "DORIAN",
      "PHRIGIAN",
      "LYDIAN",
      "MIXOLYDIAN",
      "AEOLIAN",
      "LOCRIAN"
    ];
    this.MODES = {};
    this.MODES_NAMES.map((e,i) => {
      this.MODES[e] = this.makeMode(i);
    })
  }
  setHeight(octaves) {
    this.HEIGHT = 12*octaves;
  }
  makeNote(note,absolute=true) {
    note = (isNaN(parseInt(note)))
      ? this.noteNameToMidi(note,absolute)
      : parseInt(note);
    return note;
  }
  makeMode(note,reference=this.MAJOR) {
    note = (isNaN(parseInt(note)))
      ? this.SOLMISATION.indexOf(note)
      : parseInt(note);
    note  = note % 12;
    return this.modeShift(reference,note);
  }
  defaultScale() {
    let scale = [];
    scale.length = 7;
    scale.fill(0);
    scale = scale.map((e,i) => {
      return String.fromCharCode(65+i); //65 is keycode for A
    });
    return this.modeShift(scale,2); //scale is shifted to C
  }
  generateScale(tonic,mode) {
    let scale = [tonic];
    for (let i in mode) {
      scale.push(scale[i]+mode[i]);
    }
    return scale;
  }
  modeShift(reference,shifting) {
    let out_mode = [];
    reference.map((e,i,a) => {
      out_mode[i] = a[(i+shifting)%a.length];
    });
    return out_mode;
  }
  cumulativeSumToIndex(array,max_index) {
    return array.reduce((accumulator,element,index) => {
      if (index > max_index) {
        return accumulator;
      } else {
        return accumulator+element;
      }
    });
  }
  noteNameToMidi(human_note,absolute=true) {
    let note = this.cumulativeSumToIndex(
      [0,...this.MAJOR],
      this.SOLMISATION.indexOf(human_note[0])
    );
    let sharps = {"#":1,"b":-1};
    if (typeof sharps[human_note[1]] !== "undefined") {
      note = note+sharps[human_note[1]];
    }
    note = (absolute) ? (this.HEIGHT+note):note;
    return note;
  }
  makeChord(chord_object) {
    chord_object.position = (typeof chord_object.position === "undefined")
      ? 0
      : chord_object.position;
    chord_object.tonic = this.makeNote(chord_object.tonic);
    chord_object.mode = (Array.isArray(chord_object.mode))
      ? chord_object.mode
      : this.makeMode(chord_object.mode);
    chord_object.tonic = chord_object.tonic+this.cumulativeSumToIndex(
      [0,...chord_object.mode],
      chord_object.degree-1
    );
    let chord = [chord_object.tonic];
    let degree_mode = this.modeShift(chord_object.mode,chord_object.degree-1);
    [3,5,7].map(e => 
      chord.push(chord_object.tonic+this.cumulativeSumToIndex(
        [0,...degree_mode],
        e-1
      ))
    );
    chord = this.modeShift(chord,chord_object.position);
    for (let i in chord) {
      while ((i > 0) && (chord[i] < chord[i-1])) {
        chord[i] = chord[i]+12
      }
    };
    return chord;
  }
}
let Music = new Solfeggio();
export { Music };
