"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_scheduler_1 = require("@aws-sdk/client-scheduler");
const AwsConfig_1 = require("./AwsConfig");
const schedulerClient = new client_scheduler_1.SchedulerClient(AwsConfig_1.awsConfig);
const awsDetails = {
    scheduleName: "test-scheduler-sdk-onetime",
    eventBridgeRole: "arn:aws:iam::542420031244:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_0ba81b0fa7",
    schedule: "at(2024-02-15T09:25:00)",
    targetLambda: "arn:aws:lambda:us-west-2:542420031244:function:test-logger"
};
const payload = {
    key1: "value1-sdk- ok-wew",
    key2: "value2-sdk-ok-wew",
    key3: "value3-sdk-ok-wew"
};
// const scheduleDetails = {
//     Name: awsDetails.scheduleName,
//     ScheduleExpression: awsDetails.schedule,
//     ScheduleExpressionTimezone: "Asia/Manila",
//     FlexibleTimeWindow: {
//         Mode: FlexibleTimeWindowMode.OFF
//     },
//     State: ScheduleState.ENABLED,
//     RoleArn: awsDetails.eventBridgeRole,
//     Target: {
//             Id: "test-lambda-id",
//             Arn: awsDetails.targetLambda,
//             RoleArn: awsDetails.eventBridgeRole,
//             Input: JSON.stringify(payload)
//     }
// }
const scheduleDetails = {
    Name: awsDetails.scheduleName,
    ScheduleExpression: awsDetails.schedule,
    ActionAfterCompletion: client_scheduler_1.ActionAfterCompletion.DELETE,
    ScheduleExpressionTimezone: "Asia/Manila",
    FlexibleTimeWindow: {
        Mode: client_scheduler_1.FlexibleTimeWindowMode.OFF
    },
    State: client_scheduler_1.ScheduleState.ENABLED,
    Target: {
        Arn: awsDetails.targetLambda,
        RoleArn: awsDetails.eventBridgeRole,
        Input: JSON.stringify(payload)
    }
};
var createScheduleCommand = new client_scheduler_1.CreateScheduleCommand(scheduleDetails);
function createScheduler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Creating Scheduler");
            const scheduleCreated = yield schedulerClient.send(createScheduleCommand);
            console.log(scheduleCreated);
        }
        catch (error) {
            console.error(error);
        }
    });
}
createScheduler().then(r => console.log("OK"));
