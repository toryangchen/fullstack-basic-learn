import Koa from 'koa';
import consola from 'consola';
import {
	Nuxt,
	Builder
} from "nuxt";

import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import Redis from 'koa-redis';
import json from 'koa-json';
import dbConfig from './dbs/config';
import passport from './interface/utils/passport';

import users from "./interface/users";
import geo from "./interface/geo";
import cart from "./interface/cart";
import categroy from "./interface/categroy";
import search from "./interface/search";

const app = new Koa();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({
	key: 'mt',
	prefix: 'mt:uid',
	store: new Redis()
}));
app.use(bodyParser({
	extendTypes: ['json', 'form', 'text']
}));
app.use(json());

mongoose.connect(dbConfig.dbs, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
app.use(passport.initialize());
app.use(passport.session());

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = !(app.env === "production");

async function start() {

	// Instantiate nuxt.js
	const nuxt = new Nuxt(config);

	// Build in development
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}

	app.use(users.routes()).use(users.allowedMethods());
	app.use(geo.routes()).use(geo.allowedMethods());
	app.use(cart.routes()).use(cart.allowedMethods());
	app.use(categroy.routes()).use(categroy.allowedMethods());
	app.use(search.routes()).use(search.allowedMethods());

	app.use(ctx => {
		ctx.status = 200;
		ctx.respond = false; // Mark request as handled for Koa
		ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
		nuxt.render(ctx.req, ctx.res);
	});

	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}

start();