# polySynth.js
module to handle a polyphonic synth in JS

Module can be imported with

`import { polyphonicSynth } from "./PolySynth.js";`

It can be used by creating a new instance of the synth:
`let synth = new polyphonicSynth(audioCtx,waveForm,output,envelope);`

`waveForm` can be created with `audioCtx.createPeriodicWave()`, `output` is
typically a master gain or a dynamic compressor and `envelope` is an object,
which controls an ADSR envelope. It is defined as follows:
```
let envelope = {
  attackTime:[seconds],
  attackLevel:[0-1 range],
  decayTime:[seconds],
  decayLevel:[0-1 range],
  releaseTime:[seconds],
  linear:[boolean]
};
```

The synth can be used to play notes with:

`synth.noteOn(midi_note)`

and

`synth.noteOff(midi_note)`

A solfeggio-helper module is also provided, so one doesn't have to handle MIDI
but human notation:

`import { Music } from "./Music.js";`

This solfeggio helper provides various functions :

`Music.noteNameToMidi(human_note,absolute)` is used to performed conversion from note
name (eg. C#) to MIDI (eg. 1). The facultative `absolute` flag, true by default,
transposes the output note to medium registry (C# would output 61 instead of 1).

The base octave toggled by this flag can be set with `Music.setHeight(octaves)`.
Default value for octaves argument is 5.

Scales can be generated with `Music.generateScale(tonic,mode)`, where tonic can
be a MIDI value or a note. Mode is an array consisting of a series of intervals,
in semitones (eg. for major/ionian mode : `[2,2,1,2,2,2,1]`). Note names in
their usual order (eg. a C major Scale) is already built-in in
`Music.SOLMISATION`.

The modules also comes with built-in classical modes: Major and minor modes
can be accessed through `Music.MAJOR` & `Music.MINOR`. Jazz/Medieval modes can
be found inside the `Music.MODES` object. For example `Music.MODES.AEOLIAN` is
equivalent to `Music.MINOR`. Modes names in their usual order is stored in the
`Music.MODE_NAMES` array.

Alternatively, any mode can be created by the
`Music.makeMode(reference_note,reference_mode)` method:
`Music.makeMode("A",Music.MAJOR)` would generate the equivalent of
`Music.MODES.AEOLIAN` (or `Music.MINOR`). One could generate a minor
pentatonic by doing `Music.makeMode(2,[2,2,3,2])`.

`Music.makeChord(chord_object)` is used to generate chords. To `chord_object` is
defined by four parameters: its tonic, its mode, its degree and position.

```
let chord = {
  tonic:"C#",
  degree:2,
  mode:"D",
  position:1
};
```

The tonic parameter is pretty self-explanatory. It can be either a note or a
MIDI number. The mode parameter can be an array, as seen above, or a shifting
note to generate a mode (in the example, generated mode will be dorian). The
degree is the desired position of the chord within the defined scale, as usually
written in roman numeration. Here we have a IInd degree of the C# scale in dorian
mode, hence a D# minor. The position is the inversion of the chord. 0 means no
inversion, 1 would mean the third of the chord is used as bass, and so on.
