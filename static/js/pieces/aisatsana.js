schedule = () => {
    piano.triggerAttack('G3');
};

Tone.Transport.scheduleRepeat(
    schedule,
    '2s'
);