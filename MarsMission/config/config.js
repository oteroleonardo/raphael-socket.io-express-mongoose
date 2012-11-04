module.exports = {
    development: {
      db: 'mongodb://localhost:27017/mars_mission_dev'
//      facebook: {
//          clientID: "APP_ID"
//        , clientSecret: "APP_SECRET"
//        , callbackURL: "http://localhost:3000/auth/facebook/callback"
//      },
//      twitter: {
//          clientID: "CONSUMER_KEY"
//        , clientSecret: "CONSUMER_SECRET"
//        , callbackURL: "http://localhost:3000/auth/twitter/callback"
//      },
//      github: {
//          clientID: 'APP_ID'
//        , clientSecret: 'APP_SECRET'
//        , callbackURL: 'http://localhost:3000/auth/github/callback'
//      },
//      google: {
//          clientID: "APP_ID"
//        , clientSecret: "APP_SECRET"
//        , callbackURL: "http://localhost:3000/auth/google/callback"
//      }
    }
  , test: {
      db: 'mongodb://localhost/mars_mission_test'
    }
  , production: {
      db: 'mongodb://localhost/mars_mission_prod'
    }
}