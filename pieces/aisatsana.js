// TODO replace this with a real implementation...

const makePiece = ({
  destination,
  audioContext,
  preferredFormat,
  sampleSource = {},
}) =>
  fetchSpecFile(sampleSource.baseUrl, sampleSource.specFilename)
    .then(samplesSpec => {
      if (audioContext !== Tone.context) {
        Tone.setContext(audioContext);
      }
      return getPiano(samplesSpec, preferredFormat);
    })
    .then(piano => {
      piano.connect(destination);
      const schedule = () => {
        const phrase = chain.walk();
        phrase.forEach(str => {
          const [t, ...names] = str.split(DELIMITER);
          const parsedT = Number.parseInt(t, 10);
          names.forEach(name => {
            const waitTime = parsedT * EIGHTH_NOTE_INTERVAL_S;
            piano.triggerAttack(name, `+${waitTime + 1}`);
          });
        });
      };
      Tone.Transport.scheduleRepeat(
        schedule,
        phraseLength * EIGHTH_NOTE_INTERVAL_S
      );
      return () => {
        piano.dispose();
      };
    });

export default makePiece;