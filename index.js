'use strict';
class Board {
  constructor(board) {
    this.board = board;
  }

  static makeBoard() {
    const b = [];
    for (var i = 0; i < 8; i++) {
      const row = []
      for (var j = 0; j < 8; j++) {
        if (i == 3 && j == 3 || i == 4 && j == 4) {
          row.push(1)
        } else if (i == 3 && j == 4 || i == 4 && j == 3) {
          row.push(0)
        } else {
          row.push(2);
        }
      }
      b.push(row);
    }
    return new Board(b);
  }

  getNum(n) {
    const arr = [];
    this.board.forEach(e1 => {e1.forEach(e2 => {if(e2 == n){arr.push(n)}})});
    return arr.length
  }

  isAvailable(point) {
    if (0 <= point.y && point.y <= this.board.length - 1 && 0 <= point.x && point.x <= this.board[point.y].length - 1) {
      return true
    } else {
      return false
    }
  }

  getPoint(point) {
    return this.board[point.y][point.x]
  }

  update(point, to) {
    this.board[point.y][point.x] = to;
  }
}
class Point {
  constructor(y, x)  {
    this.y = y;
    this.x = x;
  }

  static makePoint(obj) {
    const p = [];
    obj.attr("id").split(",").forEach(e => { p.push(parseInt(e)) });
    return new Point(p[0], p[1])
  }

  static _(y, x) {
    return new Point(y, x)
  }

  plus(y, x) {
    return new Point(this.y + y, this.x + x)
  }
}

const board = Board.makeBoard();
$(() => {

  $("#black").on("click", function() {
    $("#phase").text("black");
    putStone(0);
  });
  $("#white").on("click", function() {
    $("#phase").text("white");
    putStone(1);
  });

})

// phase: Int
function putStone(phase) {
  $("img[name='square']").on("click", function() {
    const select = Point.makePoint($(this));
    const [canPut, wrp] = searchToMyColor(select, phase);
    if(canPut) {
      board.update(select, phase);
      if(phase == 0 ) {
        $(this).attr("src", "images/black.png")
        wrp.forEach(e => {
          const id = '#' + e.y + '\\,' + e.x;
          $(id).attr("src", "images/black.png")
          board.update(e, phase)
        })
        $("#blackresult").text(`${board.getNum(0)}`);
        $("#whiteresult").text(`${board.getNum(1)}`);
        $("#pass").off("click");
        $("img").off("click");
      } else {
        $(this).attr("src", "images/white.png")
        wrp.forEach(e => {
          const id = '#' + e.y + '\\,' + e.x;
          $(id).attr("src", "images/white.png")
          board.update(e, phase)
        })
        $("#blackresult").text(`${board.getNum(0)}`);
        $("#whiteresult").text(`${board.getNum(1)}`);
        $("#pass").off("click");
        $("img").off("click");
      }
    }
  })
}

// s: Point, p: Int
/*
  返り値で欲しいのはPointに置けるかのBoolean,
  Pointにおける場合の裏返す間のPoint
*/
function searchToMyColor(s, p) {
  const arrs = [false, []];
  if(board.getPoint(s) == 2) {
    for(var y = -1; y <=1; y++) {
      for(var x = -1; x <=1; x++) {
        if(y == 0 && x == 0) {
          continue
        }
        searchReversePoint(0, p, arrs, Point._(y, x), s.plus(y, x));
      }
    }
    return arrs
  }
  return arrs
}

function searchReversePoint(index, phase, arr, p, nPoint) {
  if(!board.isAvailable(nPoint)) { return; } else {
    const n = board.getPoint(nPoint);
    if(index >= 1 && n == phase) {
      arr[0] = true;
      addReverses(index, arr, nPoint.plus(-p.y, -p.x), p)
    } else if (n == ((phase + 1) % 2)) {
      searchReversePoint(index+1, phase, arr, p ,nPoint.plus(p.y, p.x))
    } else if(!arr[0]) {
      arr[1].length = 0;
    }
  }
}

function addReverses(index, arr, np, p) {
  if(index > 0) {
    arr[1].push(np);
    console.log("index: " + index   +", p:" +p)
    addReverses(index -1, arr, np.plus(-p.y, -p.x), Point._(p.y, p.x))
  }
}
