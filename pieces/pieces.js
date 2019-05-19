const pieces = [
    assemblePiece('Aisatsana', 'Aphex Twin', '‘aisatsana [102]’ is the closing track from Aphex Twin • Syro’ released 22 September 2014', 'aisatsana.js', 'aisatsana.jpg'),
];

function assemblePiece(name, by, description, file, image='') {
    return {'name': name, 'by': by, 'description': description, 'file': file, 'image': image}
}

module.exports = pieces;