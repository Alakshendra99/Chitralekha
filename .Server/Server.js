import Express from "express";
import HTTP from 'http';

const URL = "127.0.0.1";
const PORT = 4000;
console.log("\nChitralekha Server\nStarted\n");
/*- ==================================================================================================== -*/


// Server Configuration
/*- ==================================================================================================== -*/
const App = Express();

App.set ('views', './Views');
App.set ( 'view engine', 'ejs' );
App.set ('trust proxy', true);

App.use('/BIT/EEE', (Request, Response) => {
  const Options = {
    hostname: '127.0.0.1',
    port: 4020,
    path: Request.originalUrl,
    method: Request.method,
    headers: {
      ...Request.headers,
      host: '127.0.0.1:4020'
    }
  };
  const ForwardReq = HTTP.request(Options, (ForwardRes) => {
    Response.writeHead(ForwardRes.statusCode, ForwardRes.headers);
    ForwardRes.pipe(Response, { end: true });
  });
  Request.pipe(ForwardReq, { end: true });
  ForwardReq.on('error', (Error) => {
    console.error("Forward Error:", Error.message);
    if (!Response.headersSent) {
      Response.status(500).send("Internal Forward Error");
    }
  });
});

App.use ( Express.static('Public') );
App.use ( Express.json () );
App.use ( Express.urlencoded ({ extended: true }) );
App.use ( async function ( Request, Response, next ) {
  Response.setHeader('Connection', 'close');
  next();
});
App.disable ('x-powered-by');
App.disable ('etag');
/*- ==================================================================================================== -*/


// Server Routes
/*- ==================================================================================================== -*/

App.get('/', async function (Request, Response) {
  Response.render('Landing');
});

App.get('/About-Us/Company', async function (Request, Response) {
  Response.render('Company');
});
App.get('/About-Us/Newsletters', async function (Request, Response) {
  Response.render('Newsletters');
});

App.get('/Products/Smartdome', async function (Request, Response) {
  Response.render('Smartdome');
});
App.get('/Products/Smart-Micro-Grid', async function (Request, Response) {
  Response.render('Smart-Micro-Grid');
});
App.get('/Products/Automotive', async function (Request, Response) {
  Response.render('Automotive');
});
App.get('/Products/Upcoming-Products', async function (Request, Response) {
  Response.render('Upcoming-Products');
});

App.get('/Solutions/Custom-Power-Converters', async function (Request, Response) {
  Response.render('Custom-Power-Converters');
});
App.get('/Solutions/Industrial-IoT', async function (Request, Response) {
  Response.render('Industrial-IoT');
});

App.get('/Contact-Us/Contact-Us', async function (Request, Response) {
  Response.render('Contact-Us');
});

App.get('/404', async function (Request, Response) {
  Response.status(404).render('404');
});

/*- ==================================================================================================== -*/

App.use((Request, Response) => {
  Response.status(404).render('404');
});

// Server Started
/*- ==================================================================================================== -*/
const Server = App.listen ( PORT, URL, function () {
  console.log(`Server Started At http://${URL}:${PORT}`);
});
/*- ==================================================================================================== -*/


// Server Exit
/*- ==================================================================================================== -*/
async function Exit ( ) {
  console.warn("Server Closing . . .");
  const Delay = MS => new Promise(Resolve => setTimeout(Resolve, MS));
  await Delay(500);
  await new Promise ( (Resolve) => Server.close (Resolve) );
  console.log("Server Closed");
  process.exit(0);
};
process.on ('SIGINT', async function () {
  console.warn("Detected: CONTROL + C");
  Exit();
});
process.on ('SIGTERM', async function () {
  console.warn("Detected: System Stop");
  Exit();
});
process.on ('uncaughtException', async function (Reason) {
  console.warn(`Detected: System Stop with Reason - ${Reason}`);
  Exit();
});
process.on ('unhandledRejection', async function (Reason) {
  console.warn(`Detected: System Stop with Reason - ${Reason}`);
  Exit();
});
/*- ==================================================================================================== -*/