var navigate = (function() {
  $('.dd').toggle();
  $('.dd_btn').click(function() {
    var dataName = $(this).attr('data-name');
    $('.dd').hide();
    $('.' + dataName).toggle();
  });
})();

let holes = Array.from(document.getElementsByClassName("hole"));
let gophers = Array.from(document.getElementsByClassName("gopher"));
let gopherFace = Array.from(document.getElementsByClassName("gopher-face"));
let gopherBody = Array.from(document.getElementsByClassName("gopher-body"));
let wrong = Array.from(document.getElementsByClassName("wrong"));
let play = document.getElementById("play");
let showScore = document.getElementById("score");

const popupDuration = .25;
const popupDelay = popupDuration * 2;

let round = 1;
let score = 0;
let gopherNumber = 3;
let gopherArray = [];
let guess = false;
let gameover = false;
let gopherCounter = 0;

TweenMax.set(gophers, {
  visibility: "visible",
  y: 110
});

play.addEventListener('click', () => {
  if (!gameover) {
    start();
  } else {
    restart();
  }
});

holes.forEach((hole, i) => {
  hole.addEventListener('click', () => {
    if (guess) {
      if (i == gopherArray[0]) {
        foundGopher(i);
        gopherArray.shift();
        score++;
        showScore.textContent = score;
        if (gopherArray.length == 0) {
          guess = false;
          start();
        }
      } else {
        guess = false;
        gameover = true;
        play.textContent = "Restart";
        play.style.display = "block";
        TweenMax.from(wrong[i], .5, {
          autoAlpha: 0,
          opacity: 0,
          scale: .8,
          transformOrigin: "center center",
          ease: Elastic.easeOut.config(1, 0.3)
        });
        TweenMax.to(wrong[i], .3, {
          opacity: 0,
          scale: .8,
          transformOrigin: "center center",
          delay: 1
        });
        TweenMax.to(wrong[i], .5, {
          visibility: "hidden",
          opacity: 1,
          scale: 1,
          delay: 1.8
        });
        TweenMax.to(gophers[gopherArray[0]], popupDuration, {
          y: 0,
          ease: Circ.easeOut
        });
        TweenMax.to(gopherBody, .24, {
          y: 2,
          repeat: -1,
          yoyo: true
        }, 'chuckle');
        TweenMax.to(gopherFace, .12, {
          y: -5,
          repeat: -1,
          yoyo: true
        }, 'chuckle');
      }
    }
  });
});

function foundGopher(i) {
  let gopher = gophers[i];
  let tl = new TimelineMax();
  tl.add(TweenMax.to(gopher, popupDuration, {
    y: 0,
    ease: Circ.easeOut
  })).
  add(TweenMax.to(gopher, popupDuration, {
    y: 110,
    ease: Circ.easeIn
  }));
  tl.seek(0);
  tl.play();
}

function setGopherArray() {
  gopherArray = Array.from({
    length: gopherNumber
  }, () => Math.floor(Math.random() * 9));
  if (round % 3 == 0) {
    gopherNumber++;
  }
  round++;
}

function showGopherOrder() {
  gopherArray.forEach((location, i) => {
    gopherCounter++;
    let gopher = gophers[location];
    let tl = new TimelineMax();
    tl.add(TweenMax.to(gopher, popupDuration, {
      y: 0,
      ease: Circ.easeOut,
      delay: i * popupDelay
    })).
    add(TweenMax.to(gopher, popupDuration, {
      y: 110,
      ease: Circ.easeIn
    }));

    if (gopherCounter == gopherArray.length) {
      tl.play().
      call(() => {
        guess = true;
      });
    } else {
      tl.play();
    }
  });
}

function start() {
  guess = false;
  gopherCounter = 0;
  play.style.display = "none";
  setGopherArray();
  setTimeout(showGopherOrder, 1000);
}

function restart() {
  round = 1;
  score = 0;
  gopherNumber = 3;
  gopherArray = [];
  guess = false;
  showScore.textContent = score;
  TweenMax.to(gophers, popupDuration, {
    y: 110,
    ease: Circ.easeOut
  });
  TweenMax.to(gopherBody, .28, {
    y: 0
  });
  TweenMax.to(gopherFace, .12, {
    y: 0
  });
  start();
}
