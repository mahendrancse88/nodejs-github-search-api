var eventsRouter = require('express').Router();
var eventsData = require('../data/events-data');
var _ = require('lodash');
var request = require('request'); 
var bodyParser = require('body-parser');
var events = eventsData;
var id = 12;

var updateId = function (req, res, next) {
    console.log(req.body);
    if (!req.body.id) {
        id++;
        req.body.id = id + '';
    }
    next();
};

eventsRouter.param('id', function (req, res, next, id) {
    var event = _.find(events, {id: id});
    if (event) {
        req.event = event;
        next();
    } else {
        res.json({"error": "Id not found"});
    }
});

eventsRouter.get('/', function (req, res) {
        
        let search = req.query.s;
        let page = req.query.page;
        // process the body
        //if(b) {
         // jb = JSON.parse(b)
   
          // configure request to fetch user information
          options_user = {
            method:'GET',
            url: "https://api.github.com/search/repositories?q=topic:"+`${search}`+"&&per_page=50&page="+`${page}`,
            headers: {
              'accept': 'application/json',
              'User-Agent': 'custom'
            }
          }
          request(options_user , function(ee,rr,bb){
            // process the body
            //console.log(bb)
            if(bb) {
                var info = JSON.parse(bb)
                return res.send(info);
              
            }
            else {
              console.log(er)
              return res.json(er)
            }
          });
       // }
    

    //res.json(events);
});

eventsRouter.get('/:id', function (req, res) {
    
    res.json(event || {});
});

eventsRouter.post('/', updateId, function (req, res) {
    var event = req.body;

    events.push(event);
    res.status(201).json(event || {});
});

eventsRouter.put('/:id', function (req, res) {
    var update = req.body;

    if (update.id) {
        delete update.id;
    }

    var event = _.findIndex(events, {id: req.params.id});

    if (!events[event]) {
        res.send();
    } else {
        var updatedEvent = _.assign(events[event], update);
        res.json(updatedEvent);
    }
});

eventsRouter.delete('/:id', function (req, res) {
    var event = _.findIndex(events, {id: req.params.id});
    events.splice(event, 1);

    res.json(req.event);
});

// Error handler
eventsRouter.use(function (err, req, res, next) {

    if (err) {
        res.status(500).send(err);
    }

});

module.exports = eventsRouter;