const uploadimage = document.querySelector('.upload-image');
const inputFile = document.getElementById('imageFile');
const canvas = document.querySelector('.canvas');
const imgContainer = document.getElementById('imgContainer');
const palette = document.getElementById('palette');
const container1 = document.querySelector('.container1');

uploadimage.addEventListener('click', function () {
	inputFile.click();
})

const eyedropper = document.getElementById('eyedropper');
var popup = document.getElementById("popup");
var popupimg = document.getElementById("popup-img");
var close = document.getElementsByClassName("close")[0];

close.onclick = function() { 
  popup.style.display = "none";
  palette.style.display = "flex";
}

inputFile.addEventListener('change', function () {
  const image = new Image();
  const reader = new FileReader();
  const file = inputFile.files[0];
  reader.onload = ()=> {
    image.src = reader.result;
    const allimg = imgContainer.querySelectorAll('div');
    allimg.forEach(item=>item.remove());
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.onclick = function(){
        popup.style.display = "flex";
        palette.style.display = "none";
        popupimg.src = image.src;
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgbArray = buildRgb(imageData.data);
      const quantColors = quantization(rgbArray, 0);
      buildPalette(quantColors);
    }
  }
  reader.readAsDataURL(file);
})

container1.addEventListener(
  "dragenter",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container1.classList.add("active");
  },
  false
);

container1.addEventListener(
  "dragleave",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container1.classList.remove("active");
  },
  false
);

container1.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container1.classList.add("active");
  },
  false
);

container1.addEventListener(
  "drop",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container1.classList.remove("active");
    let draggedData = e.dataTransfer;
    let file = draggedData.files;
    Array.from(file).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const image = new Image();
      reader.onload = ()=> {
    image.src = reader.result;
    const allimg = imgContainer.querySelectorAll('div');
    allimg.forEach(item=>item.remove());
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.onclick = function(){
        popup.style.display = "flex";
        palette.style.display = "none";
        popupimg.src = image.src;
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgbArray = buildRgb(imageData.data);
      const quantColors = quantization(rgbArray, 0);
      buildPalette(quantColors);
    }
  }
    });
  },
  false
);

const colorinput = document.getElementById('colorinput');
const colorcontainer = document.getElementById('colorcontainer');
const hexvalue = document.getElementById('hexvalue');
const colorname = document.getElementById('colorname');
const redvalue = document.getElementById('redvalue');
const greenvalue = document.getElementById('greenvalue');
const bluevalue = document.getElementById('bluevalue');
const huevalue = document.getElementById('huevalue');
const satvalue = document.getElementById('satvalue');
const lightvalue = document.getElementById('lightvalue');
const cyanvalue = document.getElementById('cyanvalue');
const magentavalue = document.getElementById('magentavalue');
const yellowvalue = document.getElementById('yellowvalue');
const blackvalue = document.getElementById('blackvalue');

eyedropper.onclick = function() {
  if (!window.EyeDropper) {
    resultElement.textContent =
      "Your browser does not support the EyeDropper API";
    return;
  }
  const eyeDropper = new window.EyeDropper();
  eyeDropper.open().then((result) => {
    let color = result.sRGBHex;
    let rgbvalue = hexToRgb(color);
    redvalue.innerHTML = rgbvalue.r;
    greenvalue.innerHTML = rgbvalue.g;
    bluevalue.innerHTML = rgbvalue.b;
	  let hslnum = HEXtoHSL(color)
	  huevalue.innerHTML = hslnum.h;
	  satvalue.innerHTML = hslnum.s + "%";
	  lightvalue.innerHTML = hslnum.l + "%";
    colorcontainer.style.background = color;
    hexvalue.innerHTML = color.toUpperCase();
    colorname.innerHTML = ntc.name(color)[1];
    let cmyk = hexToCMYK(color);
    cyanvalue.innerHTML = cmyk.c + "%"; 
    magentavalue.innerHTML = cmyk.m + "%";
    yellowvalue.innerHTML = cmyk.y + "%";
    blackvalue.innerHTML = cmyk.k + "%";
  })
}

colorinput.addEventListener('input', function () {
	let color = colorinput.value;
	let rgbvalue = hexToRgb(color);
  redvalue.innerHTML = rgbvalue.r;
  greenvalue.innerHTML = rgbvalue.g;
  bluevalue.innerHTML = rgbvalue.b;
	let result = HEXtoHSL(color)
	huevalue.innerHTML = result.h;
	satvalue.innerHTML = result.s + "%";
	lightvalue.innerHTML = result.l + "%";
  colorcontainer.style.background = color;
  hexvalue.innerHTML = color.toUpperCase();
  colorname.innerHTML = ntc.name(color)[1];
  let cmyk = hexToCMYK(color);
  cyanvalue.innerHTML = cmyk.c + "%"; 
  magentavalue.innerHTML = cmyk.m + "%";
  yellowvalue.innerHTML = cmyk.y + "%";
  blackvalue.innerHTML = cmyk.k + "%";
});
  
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}

function HEXtoHSL(hex) {
    hex = hex.replace(/#/g, '');
    if (hex.length === 3) {
        hex = hex.split('').map(function (hex) {
            return hex + hex;
        }).join('');
    }
    var r =hexToRgb(hex).r;
    var g = hexToRgb(hex).g;
    var b = hexToRgb(hex).b;
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return {
        h: h,
        s: s,
        l: l
    };
}

function buildPalette(colorsList) {
  const paletteContainer = document.getElementById("palette");
  paletteContainer.innerHTML = "";

  const orderedByColor = orderByLuminance(colorsList);

  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);
    const textColor = getContrastYIQ(hexColor);

    if (i > 0) {
      const difference = calculateColorDifference(
        orderedByColor[i],
        orderedByColor[i - 1]
      );

      if (difference < 120) {
        continue;
      }
    }
    const colorElement = document.createElement("div");
    colorElement.style.backgroundColor = hexColor;
    colorElement.style.color = textColor;
    colorElement.appendChild(document.createTextNode(hexColor));
    paletteContainer.appendChild(colorElement);
  }
}

function rgbToHex(pixel) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return (
    "#" +
    componentToHex(pixel.r) +
    componentToHex(pixel.g) +
    componentToHex(pixel.b)
  ).toUpperCase();
}

function orderByLuminance(rgbValues) {
  const calculateLuminance = (p) => {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
  };

  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1);
  });
}

function buildRgb(imageData) {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };

    rgbValues.push(rgb);
  }

  return rgbValues;
}

function calculateColorDifference(color1, color2) {
  const rDifference = Math.pow(color2.r - color1.r, 2);
  const gDifference = Math.pow(color2.g - color1.g, 2);
  const bDifference = Math.pow(color2.b - color1.b, 2);

  return rDifference + gDifference + bDifference;
}

function findBiggestColorRange(rgbValues) {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
}

function quantization(rgbValues, depth) {
  const MAX_DEPTH = 4;

  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;

        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );

    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);

    return [color];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid + 1), depth + 1),
  ];
}

function getContrastYIQ(hexcolor){
  var r = parseInt(hexcolor.substring(1,3),16);
  var g = parseInt(hexcolor.substring(3,5),16);
  var b = parseInt(hexcolor.substring(5,7),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

function hexToCMYK (hex) {
 var computedC = 0;
 var computedM = 0;
 var computedY = 0;
 var computedK = 0;

 hex = (hex.charAt(0)=="#") ? hex.substring(1,7) : hex;

 if (hex.length != 6) {
  alert ('Invalid length of the input hex value!');   
  return; 
 }
 if (/[0-9a-f]{6}/i.test(hex) != true) {
  alert ('Invalid digits in the input hex value!');
  return; 
 }

 var r = parseInt(hex.substring(0,2),16); 
 var g = parseInt(hex.substring(2,4),16); 
 var b = parseInt(hex.substring(4,6),16); 

 computedC = 1 - (r/255);
 computedM = 1 - (g/255);
 computedY = 1 - (b/255);

 var minCMY = Math.min(computedC,Math.min(computedM,computedY));

 computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
 computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
 computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
 computedK = Math.round(minCMY * 100);

 if (r==0 && g==0 && b==0) {
  return {c: 0, m: 0, y: 0, k: 100};
 }

 return {c: computedC,m: computedM,y: computedY,k: computedK};
}