const fs = require('fs');
const rita = require('rita');
const random = require('random-number-generator');
const convertMd = require("convert-md");

const markov = new rita.RiMarkov(3);

fs.readFile('sourcetext.txt', 'utf8', function(err, contents) {
    markov.loadText(contents);
    var text = generateTitlePage(markov.generateSentences(1));
    var numChapters = random(100, 250); 
    for(var c = 0; c <= numChapters; c++) {
      var chapterText = "";
      var numParagraphs = random(10, 30); 
      for(var p = 0; p <= numParagraphs; p++) {
       chapterText += markov.generateSentences(random(20, 100)).join(" ") + "\n\n"; 
      }
      var title = markov.generateSentences(1).shift();
      text += generateChapter(title, chapterText) + "\n\n\n";
    }
      const fileOut = fs.createWriteStream('./nano.html', { flags : 'w' });
    convertMd(text, {type: "html"}).then(stream => {
      stream.pipe(fileOut); 
      }).catch(err => {console.error(err);});

    
    });

function generateChapter(title, sentences) {
  return "## " + title + "\n\n" + sentences;
}

function generateTitlePage(title) {
  return "# " + title + "\n\n\n\n\n\n\n";
}

