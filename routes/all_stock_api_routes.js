const db = require("../models");
const unirest = require('unirest');
const passport = require('../config/passport');
const
{response} = require("express");
const watchlist = require("../models/watchlist");


// // Routes
// // =============================================================
module.exports = function (app)
{

// app.get("/api/all_stock", function(req, res) {
// var query = {};
// if (req.query.users_id) {
//     query.usersId = req.query.users_id;
// }
// db.all_stock.findAll({
//     where: query,
//     include: [db.users]
// }).then(function(dball_stock) {
//     res.json(dball_stock);
// });
// });


    var req = unirest("GET", "https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/TSLA,AAPL,AMZN,MSFT,GOOG,WMT,BEST,INTC,NFLX,XOM,NVDA,BAC,CVX,WFC,BA,VZ,JNJ,BABA,HD,ABBV,DIS,CSCO,ORCL,AAL,QQQ,AMGN,NKLA,FANG,BBBY,BUD,JPM,KIRK,VSLR,DKNG,LVGO,FVRR,ZM,PTON,PLUG,APPS,DOCU,RDFN,Z,LAC,PACB,FBIO,NVDA,TTD,DRD,PLMR");

    req.headers(
        {"x-rapidapi-host": "yahoo-finance15.p.rapidapi.com", "x-rapidapi-key": "c19e0e157amsh230c2f6a8d7bf80p132affjsn40ac5c914de6", "useQueryString": true}
    );


    req.end(function (res)
    {
        if (res.error)
        {
            throw new Error(res.error);
        }

        const names = [];

        for (let i = 0; i < res.body.length; i = i + 1)
        {

            names.push(res.body[i].shortName);

            db.All_stock.create(
                {

                    short_name: res.body[i].shortName,
                    stock_symbol: res.body[i].symbol,
                    stock_current_price: res.body[i].ask,
                    stock_daily_high: res.body[i].regularMarketDayHigh,
                    stock_daily_low: res.body[i].regularMarketDayLow,
                    stock_year_high: res.body[i].fiftyTwoWeekHigh,
                    stock_year_low: res.body[i].fiftyTwoWeekLow
                }
            )

        };

    });





    app.get("/api/All_stock/:id", function (req, res)
    {

        db.All_stock.findOne(
            {
                where: {
                    id: req.params.id
                }

            }
        ).then(function (dball_stock)
        {
            res.json(dball_stock);
        });
    });

    app.get("/api/watchlist/:id", function (req, res)
    {

        db.watchlist.findOne(
          
            {
  
                where: {
                    id: req.params.id,
                    // name: req.params.shortName
                },
                // include: [db.All_stock]

            },
           
        ).then(function (dbwatchlist)
        {
            res.render('watchlist', { data: dbwatchlist })

        });

    });


    // POST route for saving a new post
    // app.post("/api/watchlist", function (req, res)
    // {
    //     console.log('post watchlist: ', req.body);
    //     db.watchlist.create(req.body).then(function (dbwatchlist)
    //     {
    //         console.log(dbwatchlist, "My Data response 3");
            
    //         res.render('watchlist', { short_names: stock, stock_symbols: stock, stock_current_prices: stock, stock_daily_highs: stock, stock_daily_lows: stock, stock_year_highs: stock, stock_year_lows: stock  })
            
    //       }).catch(err => console.log("create err:", err))
          
    // }); 
};
