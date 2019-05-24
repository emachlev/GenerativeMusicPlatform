BPM = 204;  // The original song is at 102 BPM, but some notes are played on a half-beat interval, which is why we double it and count half-beats as regular beats
SECONDS_PER_MINUTE = 60;
NOTES_IN_BEAT = 2;
NOTE_INTERVAL_SECONDS = SECONDS_PER_MINUTE / (NOTES_IN_BEAT * BPM);  // Defines how long a single note should be played
SONG_LENGTH = 301;  // Used to iterate the MIDI JSON


$.getJSON('/static/midi/aisatsana.json', function (data) {

    notes = data.tracks[1].notes.slice(0);  // The entire track
    pressedNotes = [];  // Notes that are pressed at each beat

    for (time = 0; time <= SONG_LENGTH; time += NOTE_INTERVAL_SECONDS) {  // Filling the list
        pressedNotesInCurrentBeat = notes.filter(note =>
            time <= note.time && note.time < time + NOTE_INTERVAL_SECONDS
        ).map(({name}) => name).sort();
        pressedNotes.push(pressedNotesInCurrentBeat.join(','));
    }

    verses = [];  // List of verses
    verseLengthBeats = 32;  // Every verse is 16 beats
    pressedNotesCopy = pressedNotes.slice(0);
    while (pressedNotesCopy.length > 0) {  // Divide pressed notes to verses
        verses.push(pressedNotesCopy.splice(0, verseLengthBeats));
    }

    versesWithIndex = verses.map(verse =>
        verse.map((names, i) =>
            names.length === 0 ? `${i}` : `${i}${','}${names}`
        )
    );

    chain = new Chain(versesWithIndex);
    console.log(verses);


    Tone.Transport.scheduleRepeat(
        schedule,
        verseLengthBeats * NOTE_INTERVAL_SECONDS
    );
});


schedule = () => {  // For each generated verse (runs indefinitely)
    verse = [];
    while (verse.filter(ve=> ve.includes(',')).length < 5) {  // To make the verses longer and avoid empty verses
        verse = chain.walk()  // Walk the markov chain and get a verse
    }
    verse.forEach(str => {  // For each beat in the verse
        [t, ...names] = str.split(',');  // returns [index, note1, note2...] or just [index] if current beat is a rest
        parsedT = Number.parseInt(t, 10);  // Get the current beat's delay in the verse
        names.forEach(name => {  // Play every beat in the specified delay (index*duration_of_note)
            waitTime = parsedT * NOTE_INTERVAL_SECONDS;
            piano.triggerAttack(name, `+${waitTime + 1}`);
        });
    });
};


