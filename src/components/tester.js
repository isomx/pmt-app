console.clear();
var log = console.log.bind(console);

var kappa = 0.551915024494;

var cardNum = 1; //Change number to switch cards (1 or 2)

var cardContainer = document.querySelector(".card" + cardNum);
var circleContainer = document.querySelector(".circle-container");
var rippleContainer = cardContainer.querySelector(".ripple-container");
var circle = document.querySelector(".circle");
var circleIcon = circle.querySelector("i");
var ripple = cardContainer.querySelector(".ripple");
var card = cardContainer.querySelector(".card");
var closeButton = cardContainer.querySelector(".close-button");
var root = document.documentElement;
var body = document.body;

var cardStyle = {
  background: '#1167A0',
  boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
};

var p0 = { x: 0, y: 0 };
var p1 = { x: 0, y: 0 };
var p2 = { x: 0, y: 0 };
var p3 = { x: 0, y: 0 };

var bezier = { values: [p0, p1, p2, p3], type: "cubic" };
var cursor = { x: 0, y: 0 };

var circleBounds = getBounds(circleContainer);
var rippleBounds = getBounds(cardContainer);

var radius = circleBounds.w2;
var padding = -radius;
var duration = 0.5;
var requestId = null;

var standardCurve = new CustomEase("standardCurve", "0.4, 0.0, 0.2, 1");
TweenLite.defaultEase = standardCurve;

TweenLite.set([circle, ripple], { xPercent: -50, yPercent: -50 });

var tl = new TimelineMax({ reversed: true });

update();

circle.addEventListener("click", toggleAnimation);
closeButton.addEventListener("click", toggleAnimation);
window.addEventListener("resize", requestUpdate);

TweenLite.set("main", { autoAlpha: 1 });

function toggleAnimation() {
  tl.reversed(!tl.reversed());
}

function update() {

  var progress = tl.progress() || 0;
  var reversed = tl.reversed() || false;

  tl.progress(0).clear();

  circleBounds = getBounds(circleContainer);
  rippleBounds = getBounds(cardContainer);

  updateBezier();

  var delay = getDelay();

  console.log(delay);

  var dt = duration - delay;
  var dx = rippleBounds.w2;
  var dy = rippleBounds.h2;
  var tx = dx - radius - p3.x;
  var ty = dy - radius - p3.y;

  var size = Math.sqrt(dx * dx + dy * dy) * 2;

  TweenLite.set(rippleContainer, { x: tx, y: ty });

  tl.set(card, { visibility: 'hidden' })
    .set(ripple, {visibility: 'visible'})
    .to([circle, ripple], duration, { bezier }, 0)
    .to(circleIcon, duration, { autoAlpha: 0 }, 0)
    .to(ripple, dt, { width: size, height: size, onComplete: () => {
      tl.set(cardContainer, { borderWidth: 0, background: cardStyle.background, boxShadow: cardStyle.boxShadow })
        .set(ripple, { autoAlpha: 0, scale: 0 })
        .set(card, { autoAlpha: 1 })
    } }, delay)
    .to(circle, dt, { autoAlpha: 0, scale: 0 }, delay)
    .progress(progress)
    .reversed(reversed);

  requestId = null;
}

function updateBezier() {

  p3.x = rippleBounds.cx - circleBounds.cx;
  p3.y = rippleBounds.cy - circleBounds.cy;

  var dx = p3.x - p0.x;
  var dy = p3.y - p0.y;

  if (p3.y > p0.y) {

    p1.x = p0.x;
    p1.y = p0.y + (dy * kappa);
    p2.x = p3.x - (dx * kappa);
    p2.y = p3.y;

  } else {

    p1.x = p0.x + (dx * kappa);
    p1.y = p0.y;
    p2.x = p3.x;
    p2.y = p3.y - (dy * kappa);
  }
}

function getDelay() {

  cursor.x = p0.x;
  cursor.y = p0.y;

  var k = 0.0001;
  /**
  var cx = circleBounds.cx;
  var cy = circleBounds.cy;

  var rx = rippleBounds.x + padding;
  var ry = rippleBounds.x + padding;
  var rw = rippleBounds.w - padding * 2;
  var rh = rippleBounds.h - padding * 2;
   **/
  var fromX = circleBounds.cx;
  var fromY = circleBounds.cy;

  var toX = rippleBounds.x + (-circleBounds.w2);
  var toY = rippleBounds.x + padding;
  var toWidth = rippleBounds.w - padding * 2;
  var toHeight = rippleBounds.h - padding * 2;
  var delay = 0;

  var tween = TweenLite.to(cursor, duration, { bezier, paused: true });

  for (var i = 0; i <= 1; i += k) {

    tween.progress(i);

    var x = cx + cursor.x;
    var y = cy + cursor.y;

    if (pointInRect(x, y, rx, ry, rw, rh)) {
      delay = tween.time();
      break;
    }
  }

  return delay;
}

function getBounds(element) {

  var rect = element.getBoundingClientRect();

  var scrollTop  = window.pageYOffset || root.scrollTop  || body.scrollTop  || 0;
  var scrollLeft = window.pageXOffset || root.scrollLeft || body.scrollLeft || 0;

  var clientTop  = root.clientTop  || body.clientTop  || 0;
  var clientLeft = root.clientLeft || body.clientLeft || 0;

  var x = Math.round(rect.left + scrollLeft - clientLeft);
  var y = Math.round(rect.top  + scrollTop  - clientTop);

  var w = rect.width;
  var h = rect.height;
  var w2 = w / 2;
  var h2 = h / 2;
  var cx = x + w2;
  var cy = y + h2;

  return { x, y, w, h, w2, h2, cx, cy };
}

function requestUpdate() {
  if (!requestId) {
    requestId = requestAnimationFrame(update);
  }
}

function pointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && py >= ry && px <= rx + rw && py <= ry + rh;
}