let schedule = null;  // The schedule of the currently playing piece
let playingCaller = null;  // The Play button that was pressed to play the currently playing piece

function playPiece(file, caller) {
    if (Tone.context.state !== "running") {
        Tone.context.resume();
    }
    let tempPlayingCaller = playingCaller;
    if (schedule) {
        stopPiece(playingCaller)
    }
    if (caller !== tempPlayingCaller) {
        $.getScript(file);
        $(caller).html('<i class="fas fa-stop mr-2 piece-play-icon"></i> Stop');
        $(caller).removeClass('btn-outline-primary');
        $(caller).addClass('btn-primary');
        playingCaller = caller;
    }
}

function stopPiece(caller) {
    Tone.Transport.cancel();
    schedule = null;
    $(caller).html('<i class="fas fa-infinity mr-2 piece-play-icon"></i> Play');
    $(caller).removeClass('btn-primary');
    $(caller).addClass('btn-outline-primary');
    playingCaller = null;
}

toastr.info('Loading samples. Please wait...');

let piano = SampleLibrary.load({
    instruments: "piano"
});

Tone.Buffer.on('load', function () {
    $('.piece-play-btn').removeAttr('disabled');
    toastr.success('All samples loaded successfully!');
    piano.toMaster();
    Tone.Transport.start();
});