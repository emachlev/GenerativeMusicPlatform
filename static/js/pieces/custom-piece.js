BPM = parseInt($('#bpm').val());
SECONDS_PER_MINUTE = 60;
NOTES_IN_BEAT = parseInt($('#notes_in_beat').val());
NOTE_INTERVAL_SECONDS = SECONDS_PER_MINUTE / (NOTES_IN_BEAT * BPM);
SONG_LENGTH = parseInt($('#piece_length').val());

try {
    data = JSON.parse($('#jsontxt').val());
} catch (e) {
    stopPiece(playingCaller);
    toastr.error('Not a valid JSON');
    throw new Error("Not a valid JSON");
}

notes = data.tracks[parseInt($('#track_index').val())].notes.slice(0);
pressedNotes = [];

for (time = 0; time <= SONG_LENGTH; time += NOTE_INTERVAL_SECONDS) {
    pressedNotesInCurrentBeat = notes.filter(note =>
        time <= note.time && note.time < time + NOTE_INTERVAL_SECONDS
    ).map(({name}) => name).sort();
    pressedNotes.push(pressedNotesInCurrentBeat.join(','));
}

verses = [];
verseLengthBeats = parseInt($('#verse_length').val());
pressedNotesCopy = pressedNotes.slice(0);
while (pressedNotesCopy.length > 0) {
    verses.push(pressedNotesCopy.splice(0, verseLengthBeats));
}

versesWithIndex = verses.map(verse =>
    verse.map((names, i) =>
        names.length === 0 ? `${i}` : `${i}${','}${names}`
    )
);

chain = new Chain(versesWithIndex);


schedule = () => {
    verse = [];
    while (verse.filter(ve => ve.includes(',')).length < 5) {
        verse = chain.walk();
    }
    verse.forEach(str => {
        [t, ...names] = str.split(',');
        parsedT = Number.parseInt(t, 10);
        names.forEach(name => {
            waitTime = parsedT * NOTE_INTERVAL_SECONDS;
            piano.triggerAttack(name, `+${waitTime + 1}`);
        });
    });
};

Tone.Transport.scheduleRepeat(
    schedule,
    verseLengthBeats * NOTE_INTERVAL_SECONDS
);