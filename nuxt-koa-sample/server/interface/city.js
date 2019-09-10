import Router from "koa-router";

const router = new Router({
  prefix: "/city"
});

router.get("/list", async ctx => {
  ctx.body = {
    lists: ["深圳", "重庆"]
  };
});

export default router;
