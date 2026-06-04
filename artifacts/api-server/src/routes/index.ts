import { Router, type IRouter } from "express";
import healthRouter from "./health";
import searchOpportunitiesRouter from "./search-opportunities";

const router: IRouter = Router();

router.use(healthRouter);
router.use(searchOpportunitiesRouter);

export default router;
