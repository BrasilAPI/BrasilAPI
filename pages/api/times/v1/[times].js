import app from "@/app";
import BaseError from "@/errors/BaseError";
import InternalError from "@/errors/InternalError";
import { getTeamsBySeries } from "@/services/times-brasileirao";

const action = async (request, response) => {
  try {
    const teams = await getTeamsBySeries(request.query.times);

    response.status(200).json(teams);
  } catch (error) {
    if(error instanceof BaseError){
      throw error;
    }
  }
};

export default app().get(action);


