var piano = SampleLibrary.load({
    instruments: "piano"
});

Tone.Buffer.on('load', function() {
    $('.piece-play-btn').removeAttr('disabled');
    toastr.success('All samples loaded successfully!')
});