const form = document.querySelector("form");

let previousXPattern = "";
form.xPatternInput.addEventListener("input", function(e){
  if(!/^[01]*$/.test(form.xPatternInput.value)){
    form.xPatternInput.value = previousXPattern;
  }else{
    previousXPattern = form.xPatternInput.value;

    if(form.repeatPatternCheckBox.checked){
      form.yPatternInput.value = form.xPatternInput.value;
    }

    renderPattern(form.xPatternInput.value, form.yPatternInput.value);
  }
});

let previousYPattern = "";
form.yPatternInput.addEventListener("input", function(e){
  if(!/^[01]*$/.test(form.yPatternInput.value)){
    form.yPatternInput.value = previousYPattern;
  }else{
    previousYPattern = form.yPatternInput.value;

    renderPattern(form.xPatternInput.value, form.yPatternInput.value);
  }
});

form.repeatPatternCheckBox.addEventListener("change", function(e){
  form.yPatternInput.disabled = form.repeatPatternCheckBox.checked;
  if(form.repeatPatternCheckBox.checked){
    previousYPattern = form.yPatternInput.value;
    form.yPatternInput.value = form.xPatternInput.value;
  }else{
    if(previousYPattern !== ""){
      form.yPatternInput.value = previousYPattern;
    }
  }

  renderPattern(form.xPatternInput.value, form.yPatternInput.value);
});

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width  = canvas.width  + "px";
canvas.style.height = canvas.height + "px";
const ctx = canvas.getContext("2d");

function renderPattern(formatA, formatB){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const patternA = formatA.split("").map(n => Number(n));
  const patternB = formatB.split("").map(n => Number(n));

  const offset = {x:40, y:40};

  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(offset.x - 10, offset.y - 10, 410, 410);

  const stitches = makePattern(patternA, patternB);
  for(const stitch of stitches){
    const translation = translate(stitch, 400, offset);
    drawStitch(ctx, translation, stitch.color);
  }
  
  for(let y = 0; y < 3; y++){
    for(let x = 0; x < 6; x++){
      if(x === 1 && y === 1) continue;

      for(const stitch of stitches){
        const translation = translate(stitch, 400, {
          x:offset.x-400 + 400*x,
          y:offset.y-400 + 400*y,
        });
        drawStitch(ctx, translation, "grey");
      }
    }
  }
}

function translate(stitch, scale, offset){
  return {
    a: {
      x: stitch.a.x*scale + offset.x,
      y: stitch.a.y*scale + offset.y,
    },
    b: {
      x: stitch.b.x*scale + offset.x,
      y: stitch.b.y*scale + offset.y,
    },
  }
}

function makePattern(patternA, patternB){
  const stitches = [];

  const cols = patternA.length;
  const colWidth = 1 / cols;

  const rows = patternB.length;
  const rowHeight = 1 / rows;

  const offsetFactor = 0.1;

  for(let y = 0; y < rows; y++){
    let pairity = patternA[y];
    for(let x = 0; x < cols; x++){
        let a = {
            x: (x+offsetFactor)*colWidth,
            y: y*rowHeight,
        };
        let b = {
            x: (x-offsetFactor+1.0)*colWidth,
            y: y*rowHeight,
        };

        if((x+(cols%2)) % 2 === pairity) {
          stitches.push({
            a: a,
            b: b,
            color: "#E9967A",
          });
        }
    }
  }
  
  for(let x = 0; x < cols; x++){
    let pairity = patternB[x];
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
          });
        }
    }
  }

  return stitches;
}

function drawStitch(ctx, stitch, col){
  ctx.lineWidth = 2;
  ctx.strokeStyle = col;

  ctx.beginPath();

  ctx.moveTo(stitch.a.x, stitch.a.y);
  ctx.lineTo(stitch.b.x, stitch.b.y);

  ctx.stroke();
}

// Default
form.xPatternInput.value = "1011010110";
form.xPatternInput.dispatchEvent(new Event('input'));