renderTable(table);

document.getElementById('table').addEventListener('click', clickOnTable);
document.getElementById("btns").addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
        const shortOrLong = event.target.id.split("_")[0],
            color = event.target.id.split("_")[2];

        if (!myTurn(color)) {
            errorLog("not your turn!!");
            return;
        }
        if (shortOrLong === "short") {
            console.log(isShortCastlingAllowed(color));
            if (isShortCastlingAllowed(color)) {
                if (color === "black") {
                    table[4] = {};
                    table[5] = {color, piece: "rook"};
                    table[6] = {color, piece: "king"};
                    table[7] = {};
                } else if (color === "white") {
                    table[60] = {};
                    table[61] = {color, piece: "rook"};
                    table[62] = {color, piece: "king"};
                    table[63] = {};
                }
            }else {
                return;
            }
        } else {
            if (isLongCastlingAllowed(color)) {
                if (color === "black") {
                    table[0] = {};
                    table[2] = {color, piece: "king"};
                    table[3] = {color, piece: "rook"};
                    table[4] = {};
                } else if (color === "white") {
                    table[56] = {};
                    table[58] = {color, piece: "king"};
                    table[59] = {color, piece: "rook"};
                    table[60] = {};
                }
            }else {
                return;
            }
        }
        moves.push({color: color, piece: event.target.id});
        renderTable(table);
    }
});

function clickOnTable(event) {
    if (event.target.tagName === 'TD') {
        errorLog('');
        let id = parseInt(event.target.id.split('_')[1]);
        if (selected.from === -1 && !table[id].piece) {
            return;
        }
        if (selected.from === -1) {
            if (!myTurn(table[id].color)) {
                errorLog("It's not your turn!");
                return;
            }
            selected.from = id;
            event.target.classList.add('selected');
        } else {
            event.target.classList.remove('selected');
            if (selected.from === id) {
                selected.from = -1;// 2x isto polje
            } else {
                selected.to = id;
                movePiece(selected);
                document.getElementById('field_' + selected.from).classList.remove('selected');
                selected = {from: -1, to: -1}
            }
        }
    }
}


function convertField(id) {
    return [Math.floor(id / 8), id % 8]
}

function legalMove(piece, from, to) {
    const arrFrom = convertField(from),
        arrTo = convertField(to),
        dif0 = arrFrom[0] - arrTo[0],
        dif1 = arrFrom[1] - arrTo[1];
    if (piece.color === table[to].color) {
        return false;
    }
    if (piece.piece === 'pawn') {
        return checkThePawn(piece, arrFrom, arrTo, to)
    } else if (piece.piece === 'knight') {
        return legalMoveKnight(dif0, dif1);
    } else if (piece.piece === 'king') {
        return checkTheKing(dif0, dif1);
    } else if (piece.piece === 'bishop') {
        return checkTheBishop(from, to)
    } else if (piece.piece === "queen") {
        return checkTheQueen(arrFrom, arrTo, to, from);
    } else if (piece.piece === 'rook') {
        return checkTheRook(from, to);
    }
}

function checkTheKing(dif0, dif1) {
    let diffs = '' + Math.abs(dif0) + Math.abs(dif1);
    return diffs === "11" || diffs === "01" || diffs === "10";
}

function checkTheBishop(from, to) {
    return ((from - to) % 7 === 0 || (from - to) % 9 === 0) && isThePathFreeDiagonally(from, to);
}

function legalMoveKnight(dif0, dif1) {
    return 2 === Math.abs(dif0) && 1 === Math.abs(dif1) ||
        1 === Math.abs(dif0) && 2 === Math.abs(dif1);
}

function checkTheQueen(arrFrom, arrTo, to, from) {
    if (arrFrom[0] === arrTo[0] || arrFrom[1] === arrTo[1]) {
        return checkTheRook(from, to);
    }
    return checkTheBishop(from, to);
}

function checkThePawn(piece, arrFrom, arrTo, to) {
    let jedanIliDva = 1;
    if (piece.color === 'white') {
        if (arrFrom[0] === 6) {
            jedanIliDva = 2;
        }
        if (arrTo[0] === (arrFrom[0] - jedanIliDva) || arrTo[0] === (arrFrom[0] - 1)) {
            if (table[to] && table[to].piece) {
                return arrTo[1] === (arrFrom[1] + 1) || (arrTo[1] === (arrFrom[1] - 1));
            } else {
                if (arrTo[1] >= (arrFrom[1] + 1) || (arrTo[1] <= (arrFrom[1] - 1))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    if (arrFrom[0] === 1) {
        jedanIliDva = 2;
    }
    if (arrTo[0] === (arrFrom[0] + jedanIliDva) || arrTo[0] === (arrFrom[0] + 1)) {
        if (table[to] && table[to].piece) {
            return arrTo[1] === (arrFrom[1] + 1) || (arrTo[1] === (arrFrom[1] - 1));
        } else {
            if (arrTo[1] >= (arrFrom[1] + 1) || (arrTo[1] <= (arrFrom[1] - 1))) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function checkTheRook(from, to) {
    let [arrFrom, arrTo] = [convertField(from), convertField(to)];
    if (arrTo[0] === arrFrom[0] || arrTo[1] === arrFrom[1]) {
        if (arrFrom[1] === arrTo[1]) {
            for (let i = from - 8; i > to; i -= 8) {
                if (table[i].piece) {
                    return false;
                }
            }
            for (let i = from + 8; i < to; i += 8) {
                if (table[i].piece) {
                    return false;
                }
            }
        }
        if (arrFrom[0] === arrTo[0]) {
            for (let i = from + 1; i < to; i++) {
                if (table[i].piece) {
                    return false;
                }
            }
            for (let i = from - 1; i > to; i--) {
                if (table[i].piece) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

function movePiece(selected) {
    if (legalMove(table[selected.from], selected.from, selected.to)) {
        let color = table[selected.from].color,
            piece = table[selected.from].piece;
        if (piece === "pawn") {
            ifPawnIsOnOppositeSide(selected, color)
        }
        if (piece === "king") {
            kingAndRookMove[color].king = true;
        }
        if (piece === "rook") {
            if (selected.from === 0 || selected.from === 56) kingAndRookMove[color].rookLeft = true;
            if (selected.from === 7 || selected.from === 63) kingAndRookMove[color].rookRight = true;
        }
        moves.push({color: color, piece: piece, ...selected});
        if (typeof table[selected.to].color !== "undefined") {
            eatenPieces[table[selected.to].color].push(table[selected.to].piece)
        }
        if (selected) {
            table[selected.to] = table[selected.from];
            table[selected.from] = {};
            renderTable(table);
            let check = isKingInCheck();
            document.getElementById("alert").innerHTML = "<h3>Check:</h3> white king: " + check.white + "<br> black king: " + check.black;
        }
    } else {
        errorLog("Illegal move");
    }
}

function isShortCastlingAllowed(color) {
    if (isKingInCheck()[color]) return false;
    if (color === "black") {
        if (!(typeof table[5].piece === "undefined" && typeof table[6].piece === "undefined")) {
            return false;
        }
    } else if (color === "white") {
        if (!(typeof table[61].piece === "undefined" && typeof table[62].piece === "undefined")) {
            return false;
        }
    }
    return !kingAndRookMove[color].king && !kingAndRookMove[color].rookRight;
}

function isLongCastlingAllowed(color) {
    if (isKingInCheck()[color]) return false;
    if (color === "black") {
        if (!(typeof table[1].piece === "undefined" && typeof table[2].piece === "undefined" && typeof table[3].piece === "undefined")) {
            return false;
        }
    } else if (color === "white") {
        if (!(typeof table[57].piece === "undefined" && typeof table[58].piece === "undefined" && typeof table[59].piece === "undefined")) {
            return false;
        }
    }
    return !kingAndRookMove[color].king && !kingAndRookMove[color].rookLeft;
}

function ifPawnIsOnOppositeSide(selected, color) {
    if (color === "white" && convertField(selected.to)[0] === 0) {
        replacePawn("white", selected.to);
    } else if (color === "black" && convertField(selected.to)[0] === 7) {
        replacePawn("black", selected.to);
    }
}

function isKingInCheck() {
    const [blackKing, whiteKing] = [getKingPostions().blackKing, getKingPostions().whiteKing];
    let white = false,
        black = false;
    for (let piece in table) {
        if (table[piece].color === "white") {
            if (legalMove(table[piece], piece, blackKing)) black = true;
        } else {
            if (legalMove(table[piece], piece, whiteKing)) white = true;
        }
    }
    return {white, black};
}

function getKingPostions() {
    let whiteKing, blackKing;
    for (let i in table) {
        if (table[i].piece === "king") {
            if (table[i].color === "white") {
                whiteKing = i;
            } else {
                blackKing = i;
            }
        }
    }
    return {whiteKing, blackKing};
}

function replacePawn(color, toField) {
    const div = document.getElementById("replaceSelect");
    let eaten = eatenPieces[color],
        print = "";
    for (let piece of eaten) {
        print += `<h1 id=${piece}_${color}>${pieces[piece][color]}</h1>`
    }
    div.innerHTML = print;
    div.addEventListener("click", function replaceSelect(e) {
        if (e.target.tagName === "H1") {
            const piece = e.target.id.split("_")[0];
            table[toField] = {color: color, piece: piece};
            eatenPieces[color].splice(eatenPieces[color].indexOf(piece), 1);
            eatenPieces[color].push("pawn");
            renderTable(table);
            div.innerHTML = "";
            div.removeEventListener("click", replaceSelect);
        }
    })
}

function isThePathFreeDiagonally(from, to) {
    let increment = 0;
    if ((from - to) % 7 === 0) {
        increment = 7;
    } else if ((from - to) % 9 === 0) {
        increment = 9;
    }
    if (from === 0 && to === 63) {
        return true
    }
    if (from === 63 && to === 0) {
        return true
    }
    if (increment) for (let i = Math.min(from, to) + increment; i < Math.max(from, to); i += increment) {
        if (table[i].piece) {
            return false;
        }
    }
    return true;
}

function renderTable(table) {
    let html = '<table><tr><th>&nbsp;</th>';
    for (let i = 0; i < 8; i++) {
        html += `<th>${String.fromCharCode(i + 65)}</th>`
    }
    html += '</tr>';
    let row = 0;
    for (let i = 0; i < table.length; i++) {
        let klasa = 'white';

        if (i % 8 === 0) {
            html += `<tr><th>${8 - Math.ceil(i / 8)}</th>`;
            row++;
        }
        if (i % 2 === row % 2 ? 1 : 0) klasa = 'black';

        let piece = '';
        if (table[i].piece) {
            piece = pieces[table[i].piece][table[i].color]
        }
        html += `<td id="field_${i}" class="${klasa}"><span style="font-size:10px">${i}</span> ${piece}</td>`;
        if (i % 8 === 7) html += '</tr>';
    }
    document.getElementById('table').innerHTML = html;
}

function errorLog(error) {
    document.getElementById('errors').innerHTML = error;
}

function myTurn(color) {
    if (moves.length === 0) return color === 'white';// prvi igra beli
    return moves[moves.length - 1].color !== color;
}