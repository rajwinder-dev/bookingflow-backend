import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { EventService } from "./event.service";
import { CreateEventInput } from "./event.zod";

export class EventController {
  static createEvent = catchAsync(async(req,res,_next) => {
    const input = req.body as CreateEventInput;
    const data = await EventService.createEvent(input);
    response(res, data, 201);
  });
  static udpateEvent = catchAsync(async(req,res,_next) => {
    const { id } = req.params;
    const input = req.body as CreateEventInput;
    const data = await EventService.updateEvent(id, input);
    response(res, data, 200);
  });
  static getEvents = catchAsync(async(_req,res,_next) => {
    const data = await EventService.getEvents();
    response(res, data, 200);
  });
  static getEventDetails = catchAsync(async(req,res,_next) => {
    const { id } = req.params;
    const data = await EventService.getEventDetails(id);
    response(res, data, 200);
  });
}
