var FeedParser = require('feedparser')
  , request = require('request')
  , clc = require('cli-color')
  , i = 0;

var req = request('http://www.safran.io/feed.rss')
  , feedparser = new FeedParser();

req.on('response', function (res) {
  var stream = this;
  if (res.statusCode != 200) {
    return this.emit('error', new Error('Bad status code'));
  }

  stream.pipe(feedparser);
});


feedparser.on('error', function(error) {
  // always handle errors
});
feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this
    , meta = this.meta
    , item;

  while (item = stream.read()) {
    i++;
    if (i > 10) break;
    console.log(clc.yellow('- ') + clc.green(item.title));
    console.log(clc.underline.blue(item['rss:link']['#']));
    console.log("\n");
  }
});

