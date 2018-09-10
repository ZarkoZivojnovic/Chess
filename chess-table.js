let pieces = {
        pawn: {black: '♟', white: '♙'},
        rook: {black: '♜', white: '♖'},
        knight: {black: '♞', white: '♘'},
        bishop: {black: '♝', white: '♗'},
        king: {black: '♛', white: '♕'},
        queen: {black: '♚', white: '♔'}
    },
    table = fenToPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
    //table = fenToPosition('bnbqkbnr/pppppppp/pppppppp/8/8/8/8/RNBQKBNR w KQkq - 0 1'),
    selected = {from: -1, to: -1},
    moves = [],
    eatenPieces = {white: [], black: []};

let enPassant=false,
    kingAndRookMove ={
        black:{
            king:false,
            rookLeft:false,
            rookRight:false
        },
        white:{
            king:false,
            rookLeft:false,
            rookRight:false
        }
    };

function fenToPosition(fen) {
    let tmp = [];
    fen = fen.replace(/\//g, '').split(' ')[0].split('');
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] > 0) {
            for (let j = 0; j < fen[i]; j++) {
                tmp.push({});
            }
        } else {
            let pairs = {p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king'};
            let color = /[A-Z]/.test(fen[i]) ? 'white' : 'black';
            let piece = '';
            for (let p in pairs) {
                if (fen[i].toLowerCase() === p) {
                    piece = fen[i].replace(fen[i], pairs[p]);
                }
            }
            tmp.push({color, piece})
        }
    }
    return tmp;
}
