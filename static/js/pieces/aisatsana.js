BPM = 204;  // The original song is at 102 BPM, but some notes are played on a half-beat interval, which is why we double it and count half-beats as regular beats
SECONDS_PER_MINUTE = 60;
EIGHTH_NOTES_IN_BEAT = 2;
EIGHTH_NOTE_INTERVAL_SECONDS = SECONDS_PER_MINUTE / (EIGHTH_NOTES_IN_BEAT * BPM);  // Defines how long a single note should be played
SONG_LENGTH = 301;  // Used to iterate the MIDI JSON


$.getJSON('/static/midi/aisatsana.json', function (data) {

    notes = data.tracks[1].notes.slice(0);
    eigthNotes = [];

    for (time = 0; time <= SONG_LENGTH; time += EIGHTH_NOTE_INTERVAL_SECONDS) {
        pressedNoteNames = notes.filter(note =>
            time <= note.time && note.time < time + EIGHTH_NOTE_INTERVAL_SECONDS
        ).map(({name}) => name).sort();
        eigthNotes.push(pressedNoteNames.join(','));
    }

    phrases = [];
    phraseLengthBeats = 32;
    eigthNotesCopy = eigthNotes.slice(0);
    while (eigthNotesCopy.length > 0) {
        phrases.push(eigthNotesCopy.splice(0, phraseLengthBeats));
    }

    phrasesWithIndex = phrases.map(phrase =>
        phrase.map((names, i) =>
            names.length === 0 ? `${i}` : `${i}${','}${names}`
        )
    );

    chain = new Chain(phrasesWithIndex);


    Tone.Transport.scheduleRepeat(
        schedule,
        phraseLengthBeats * EIGHTH_NOTE_INTERVAL_SECONDS
    );
});


schedule = () => {
    phrase = chain.walk();
    console.log(phrase);
    phrase.forEach(str => {
        [t, ...names] = str.split(',');
        parsedT = Number.parseInt(t, 10);
        names.forEach(name => {
            waitTime = parsedT * EIGHTH_NOTE_INTERVAL_SECONDS;
            piano.triggerAttack(name, `+${waitTime + 1}`);
        });
    });
};


