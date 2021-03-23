import {assert} from "./util.js"

function v2(x,y) { return {x:x, y:y}; }

const pattern = [[0],[0]];

const form = document.querySelector("form");
const fake = document.querySelector(".fake");

form.cols.addEventListener("input", function(e){
  if(form.cols.value < 1)
    form.cols.value = 1
  updateDim(form.cols.value, form.rows.value);
});

form.rows.addEventListener("input", function(e){
  //if(!/^[01]*$/.test(form.yPatternInput.value)){
  if(form.rows.value < 1)
    form.rows.value = 1
  updateDim(form.cols.value, form.rows.value);
});

function updateDim(cols, rows){
  resize(pattern[0], cols);
  resize(pattern[1], rows);

  function resize(arr, newSize) {
    while(newSize > arr.length)
        arr.push((arr[arr.length-1]+1)%2);
    arr.length = newSize;
  }

  renderPattern(pattern);
}

function renderPattern(pattern){
  document.querySelector(".container").innerHTML = "";
  
  const dim = 50;
  const offset = v2(dim, dim);

  const cols = pattern[0].length;
  const rows = pattern[1].length;

  const stitches = makePattern(pattern);
  for(const stitch of stitches){
    const translation = translate(stitch, dim, offset);
    drawStitch(translation, stitch.color);
  }
  
  for(let y = 0; y < 3; y++){
    for(let x = 0; x < 6; x++){
      if(x === 1 && y === 1) continue;

      for(const stitch of stitches){
        const translation = translate(stitch, dim, {
          x:offset.x-(dim * cols) + (dim * cols)*x,
          y:offset.y-(dim * rows) + (dim * rows)*y,
        });
        drawStitch(translation, "grey");
      }
    }
  }
}

function translate(stitch, scale, offset){
  const copy = Object.assign({}, stitch);
  copy.a = v2(
    stitch.a.x*scale + offset.x,
    stitch.a.y*scale + offset.y
  );
  copy.b = v2(
    stitch.b.x*scale + offset.x,
    stitch.b.y*scale + offset.y
  );
  return copy;
}

function makePattern(pattern){
  const stitches = [];

  const cols = pattern[0].length;
  const colWidth = 1;

  const rows = pattern[1].length;
  const rowHeight = 1;

  const offsetFactor = 0.1;

  for(let y = 0; y < rows; y++){
    let pairity = pattern[1][y];
    for(let x = 0; x < cols; x++){
        let a = {
            x: (x+offsetFactor)*colWidth,
            y: y*rowHeight,
        };
        let b = {
            x: (x-offsetFactor+1.0)*colWidth,
            y: y*rowHeight,
        };

        if((x+1) % 2 === pairity) {
          stitches.push({
            a: a,
            b: b,
            color: "#E9967A",
            row: y,
          });
        }
    }
  }
  
  for(let x = 0; x < cols; x++){
    let pairity = pattern[0][x];
    for(let y = 0; y < rows; y++){
        let a = {
            x: x*colWidth,
            y: (y+offsetFactor)*rowHeight,
        };
        let b = {
            x: x*colWidth,
            y: (y-offsetFactor+1.0)*rowHeight,
        };

        if((y+1) % 2 === pairity) {
          stitches.push({
            a: a,
            b: b,
            color: "#008B8B",
            col: x,
          });
        }
    }
  }

  return stitches;
}

function drawStitch(stitch, col){
  const line = document.createElement("div");

  line.classList.add("line");

  line.style.borderColor = col;
  line.style.left = stitch.a.x + "px";
  line.style.top = stitch.a.y + "px";
  //line.style.right = stitch.b.x + "px";
  //line.style.bottom = stitch.b.y + "px";
  line.style.width = (stitch.b.x - stitch.a.x) + "px";
  line.style.height = (stitch.b.y - stitch.a.y) + "px";

  if(stitch.col !== undefined)
    line.onclick = (e) => changePattern(0, stitch.col);
  else
    line.onclick = (e) => changePattern(1, stitch.row);

  function changePattern(patternIndex, lineIndex){
    pattern[patternIndex][lineIndex] += 1;
    pattern[patternIndex][lineIndex] %= 2;
    renderPattern(pattern);
  }

  document.querySelector(".container").append(line);
}

// Default
form.cols.value = "6";
form.rows.value = "6";
form.cols.dispatchEvent(new Event('input'));
form.rows.dispatchEvent(new Event('input'));