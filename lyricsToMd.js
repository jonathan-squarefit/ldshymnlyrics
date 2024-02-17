fs = require('fs');
lyricsFile = process.argv[2];
var mdTitle = lyricsFile.replace("\ ", " ").split(".")[0].replace("childrenssongbook/","").replace("_", " ");
console.log(mdTitle)
var splitLines = false;
if(process.argv[3]?.startsWith("t") ) {
    splitLines = true
}
console.log("Split Lines: " + splitLines);
var duplicateLines = true;
fs.readFile(lyricsFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    data = santize(data);
    let lyrics = data.split('\n');
    let lyricsMd = '';
    for (let i = 0; i < lyrics.length; i++) {
        lyricsMd += (splitLines ? splitLongLine(lyrics[i]) : lyrics[i]) + "\n"
    }

    var output = duplicate(lyricsMd, mdTitle);
    fs.mkdir('./output', { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile("./output/" + mdTitle + ".md", output, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Success - wrote to output folder");
        });
      });
});
function duplicate(formatted, hymnTitle) {
    lines = formatted.split("\n");
    var readyForSlides = "";
    for(var i = 0; i < lines.length; i+=2) {
        var slideTitle = "\n## " + hymnTitle + " (" + i/2 + ")\n"
        var first = lines[i];
        var second = lines[i+1];
        if(!first || !second) {
            continue;
        }
        var twoLines = "- " + first + "\n- " + second + "\n";
        var nextTwoLines = " - " + first + "\n - " + second + "\n";
        
        readyForSlides += slideTitle + twoLines;
        if(duplicateLines) {
            readyForSlides += nextTwoLines;
        
        }
    }
    return readyForSlides;
}

function splitLongLine(s) {
    var middle = Math.floor(s.length / 2);
    var before = s.lastIndexOf(' ', middle);
    var after = s.indexOf(' ', middle + 1);

    if (middle - before < after - middle) {
        middle = before;
    } else {
        middle = after;
    }
    var s1 = s.substr(0, middle);
    var s2 = s.substr(middle + 1);
    return s1 + "\n" + s2;
}

function santize(line) {
    return line.replace(/###/g, '');
}