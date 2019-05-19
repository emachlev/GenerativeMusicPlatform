BPM = 204;  // The original song is at 102 BPM, but some notes are played on a half-beat interval, which is why we double it and count half-beats as regular beats
SECONDS_PER_MINUTE = 60;
EIGHTH_NOTES_IN_BEAT = 2;
EIGHTH_NOTE_INTERVAL_SECONDS = SECONDS_PER_MINUTE / (EIGHTH_NOTES_IN_BEAT * BPM);  // Defines how long a single note should be played
SONG_LENGTH = 301;  // Used to iterate the MIDI JSON


$.getJSON('/static/midi/aisatsana.json', function (data) {

    notes = data.tracks[1].notes.slice(0);  // The entire track
    eigthNotes = [];  // Eigth notes that are pressed at each beat

    for (time = 0; time <= SONG_LENGTH; time += EIGHTH_NOTE_INTERVAL_SECONDS) {  // Filling the list
        pressedNoteNames = notes.filter(note =>
            time <= note.time && note.time < time + EIGHTH_NOTE_INTERVAL_SECONDS
        ).map(({name}) => name).sort();
        eigthNotes.push(pressedNoteNames.join(','));
    }

    phrases = [];  // List of phrases
    phraseLengthBeats = 32;  // Every phrase is 16 beats
    eigthNotesCopy = eigthNotes.slice(0);
    while (eigthNotesCopy.length > 0) {  // Divide pressed eigth notes to phrases
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


schedule = () => {  // For each generated phrase (runs indefinitely)
    phrase = []
    while (phrase.filter(Boolean).length < 5) {  // To make the phrases longer and avoid empty phrases
        phrase = chain.walk()  // Walk the markov chain and get a phrase
    }
    console.log(phrase);
    phrase.forEach(str => {  // For each beat in the phrase
        [t, ...names] = str.split(',');  // returns [index, note1, note2...] or just [index] if current beat is a rest
        parsedT = Number.parseInt(t, 10);  // Get the current beat's delay in the phrase
        names.forEach(name => {  // Play every beat in the specified delay (index*duration_of_eigth_note)
            waitTime = parsedT * EIGHTH_NOTE_INTERVAL_SECONDS;
            piano.triggerAttack(name, `+${waitTime + 1}`);
        });
    });
};


